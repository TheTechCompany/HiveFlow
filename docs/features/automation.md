# Automation Engine

A standalone, stateless, event-sourced workflow engine for executing multi-step business processes — with a visual ReactFlow-based editor, default node types, and an ISO 9001 template pack.

---

## Package structure

```
packages/automation/
├── types/              # Shared TypeScript interfaces
├── engine/             # Core execution engine (v1 + v2)
├── nodes-default/      # Default node implementations
├── editor-react/       # Visual workflow editor (ReactFlow)
└── templates-iso/      # ISO 9001 process templates
```

---

## Engine architecture (v2)

The v2 engine is fundamentally different from v1 — it is **stateless, event-sourced, and crash-recoverable**.

### Design principles

| Principle | How |
|-----------|-----|
| **Stateless** | No in-memory execution map. The engine is a pure function: `reduce(state, workflow) → Command[]`. |
| **Event-sourced** | Every node execution appends a checkpoint event to an append-only `EventLog`. |
| **Pluggable storage** | Three adapters: `StateStore` (durable snapshot), `EventLog` (checkpoint journal), `TaskQueue` (external delayed delivery). In-memory implementations included; can swap for Redis/Postgres/BullMQ. |
| **No in-process waiting** | When a node needs to wait (e.g. Await), the engine schedules a `resume` task on the `TaskQueue` with a `delayUntil` timestamp and exits. |
| **Idempotent** | Execution can safely replay from any checkpoint. Node inputs are resolved before execution (template expressions like `{{ $json.data.ncTitle }}` are expanded). |
| **Crash recovery** | A reconciler loop heals orphaned executions stuck in `running` with no in-flight nodes. |

### Execution flow

```
1. Read ExecutionState from StateStore
2. reduce(state, workflow) → Command[]  (pure function, no I/O)
3. Execute commands in topological order
4. After each node: append checkpoint to EventLog
5. On node output: resolve template expressions, pass to downstream nodes
6. On _await: schedule resume task on TaskQueue with delayUntil
7. On failure: retry with exponential backoff + jitter (up to maxAttempts)
```

### Replay & recovery

Because every step is a deterministic `EventLog` entry, the engine can:
- **Replay** from any checkpoint for debugging
- **Recover** from crashes by re-reading the `StateStore` and continuing from the last checkpoint
- **Reconcile** orphaned executions via a periodic background loop

---

## Default node types

Nodes are categorized and registered in a `NodeRegistry`.

### Triggers

| Type | Description |
|------|-------------|
| `form-trigger` | Triggered when a form is submitted. Exposes dynamic JSON schema as output. |
| `scheduled-trigger` | Triggered on a cron schedule or interval. |
| `entity-event-trigger` | Triggered on entity lifecycle events (create/update/delete). |

### Actions

| Type | Description |
|------|-------------|
| `create-project` / `update-project` / `delete-project` | Project CRUD |
| `create-estimate` / `update-estimate` / `delete-estimate` | Estimate CRUD |
| `create-ticket` / `update-ticket` / `delete-ticket` | Ticket CRUD |
| `create-equipment` / `update-equipment` / `delete-equipment` | Equipment CRUD |
| `create-record` / `update-record` / `delete-record` | Generic entity CRUD |
| `query-records` | Query generic entity records |
| `assign-people` | Assign people to projects or tasks |

### Control flow

| Type | Description |
|------|-------------|
| `await` | Pause until a condition is met (e.g. ticket status changes to "Resolved") — polls via GraphQL |
| `if` | Evaluate a condition and route to true/false branches |

---

## Visual workflow editor

The editor (`packages/automation/editor-react/`) is a ReactFlow-based DAG canvas:

- **ProcessFlow** — Main canvas component for building workflows.
- **Toolbox** — Draggable node palette with categorized nodes (Triggers, Actions, Control).
- **ProcessNodeComponent** — Renders individual nodes with type-specific icons and colours.
- **NodePropertiesModal** — Side panel for configuring node input values.
  - **FormFieldsBuilder** — Dynamic form generation from node `inputValues` schema.
  - **OutputPanel** — Maps node outputs to downstream connections.
  - **ParameterField** — Template expression editor with autocomplete for `{{ }}` syntax.
- **SmartEdge** — Smart edge routing with pathfinding.
- **TemplateAutocomplete** — Autocomplete for template expressions.

Expressions use the `{{ }}` syntax: `{{ $json.data.fieldName }}`, `{{ $nodeName.outputField }}`, etc.

---

## ISO 9001 template pack

Five pre-built process templates covering core ISO 9001 workflows:

| Template | ISO Reference | Description |
|----------|---------------|-------------|
| `corrective-action` | §10.2 | CAPA process: NC report form → CAPA ticket → RCA task → severity branching → verification |
| `document-control` | §7.5 | Document approval and control process |
| `internal-audit` | §9.2 | Internal audit scheduling and execution |
| `management-review` | §9.3 | Management review meeting workflow |
| `risk-assessment` | §6.1 | Risk identification, analysis, and treatment |

Each template defines `nodes` (with type, position, `inputValues`), `edges`, `variables`, `settings`, and `tags`.

---

## File index

| Package | Key files | Purpose |
|---------|-----------|---------|
| `engine` | `dist/esm/automation-engine-v2.js` | V2 engine: stateless, event-sourced, checkpointing |
| `engine` | `dist/esm/workflow-executor.js` | Pure function reducer: `reduce(state, workflow) → Command[]` |
| `engine` | `dist/esm/interfaces.d.ts` | `StateStore`, `EventLog`, `TaskQueue` interfaces |
| `engine` | `dist/esm/registry.js` | `NodeRegistry` for registering node executors |
| `engine` | `dist/esm/template-resolver.js` | `{{ }}` expression resolver |
| `editor-react` | `components/ProcessFlow/` | ReactFlow canvas |
| `editor-react` | `components/NodePropertiesModal/` | Node configuration panel |
| `editor-react` | `components/Toolbox/` | Draggable node palette |
| `nodes-default` | `dist/esm/index.js` | All default node implementations |
| `templates-iso` | `dist/esm/index.js` | Five ISO 9001 process templates |
