# HiveFlow

Operations management platform for scheduling, project management, estimating, compliance, and workflow automation — built as a [single-spa](https://single-spa.js.org/) microfrontend within the HexHive ecosystem.

---

## Features at a glance

| Feature | Description | Doc |
|---------|-------------|-----|
| **Schedule** | Calendar-based scheduling with drag & drop. Assign people and equipment to projects by date. Clone and permission-gate schedule entries. | [docs/features/schedule.md](docs/features/schedule.md) |
| **Timeline** | Gantt-style project timelines with dependency links, drag-to-reschedule, capacity alerts, and people/estimate/project views. | [docs/features/timeline.md](docs/features/timeline.md) |
| **Estimates** | Quote builder with line items, company details, expiry tracking, and conversion to projects. | [docs/features/estimates.md](docs/features/estimates.md) |
| **Projects** | Project CRUD with kanban task management (Backlog → In Progress → Reviewing → Finished), subtasks, dependencies, file management, and soft-delete archiving. | [docs/features/projects-tasks.md](docs/features/projects-tasks.md) |
| **People** | Staff directory with skill assignments and leave management. | [docs/features/people.md](docs/features/people.md) |
| **Equipment** | Equipment registry with registrations and scheduling to projects. | [docs/features/equipment.md](docs/features/equipment.md) |
| **Assignments** | Unified kanban board showing all tasks across projects, estimates, and recurring schedules — filterable by person and source. | [docs/features/assignments.md](docs/features/assignments.md) |
| **Recurring** | Recurring schedules that auto-generate tasks on daily/weekly/monthly/quarterly/yearly cycles. Exception dates for skipping or rescheduling individual occurrences. | [docs/features/recurring-events.md](docs/features/recurring-events.md) |
| **Compliance** | Regulation management with PDF import, AI-powered breakout points (OpenRouter/DeepSeek), ISO clause mapping, versioning, and proof-of-compliance audit trail. | [docs/features/compliance.md](docs/features/compliance.md) |
| **Continuous Improvement** | CI tracking through a 5-stage flow (identified → in progress → implemented → verified → closed) with kanban view. | [docs/features/improvement.md](docs/features/improvement.md) |
| **Plan Batches** | Group tasks into reviewable batches with draft → review → approved → released workflow, threaded comments, and scheduling estimates. | [docs/features/batches.md](docs/features/batches.md) |
| **Automation Engine** | Visual workflow builder and event-sourced execution engine for automating multi-step business processes. ISO 9001 template pack included. | [docs/features/automation.md](docs/features/automation.md) |

---

## Architecture

```
HiveFlow/                          # Yarn 4 monorepo (Lerna)
├── packages/
│   ├── app/
│   │   ├── hiveflow-api/          # Generated GQty GraphQL client
│   │   ├── hiveflow-backend/      # Express + GraphQL + Prisma (port 9011)
│   │   └── hiveflow-frontend/     # React SPA, single-spa microfrontend (port 8503)
│   ├── automation/
│   │   ├── types/                 # Shared workflow engine types
│   │   ├── engine/                # AutomationEngine v1 + v2 (event-sourced)
│   │   ├── nodes-default/         # Default node types (triggers, actions, CRUD)
│   │   ├── editor-react/          # Visual ReactFlow-based workflow editor
│   │   └── templates-iso/         # ISO 9001 process templates
│   ├── infrastructure/            # Pulumi IaC for AWS EKS + Kubernetes
│   ├── integrations/
│   │   └── data-producer/         # MSSQL → GraphQL sync daemon (CronJob)
│   └── ui/                        # Shared React component library (Storybook)
├── docs/features/                 # Feature documentation
├── scripts/dev.js                 # Development launcher
├── lerna.json
└── package.json
```

### Key architectural patterns

- **Microfrontend**: Mounted as a single-spa parcel under `/dashboard/flow` inside the HexHive shell.
- **GraphQL API**: Domain-separated schema modules (`schedule.ts`, `project.ts`, `estimate.ts`, etc.) merged centrally with `@graphql-tools/merge`.
- **Multi-tenancy**: Every database model carries an `organisation` field. The GraphQL context injects `context.jwt.organisation` from the auth token.
- **LexoRank ordering**: All ordered collections (kanban columns, timeline, recurring event rows) use LexoRank strings for fractional-index reordering — drag-and-drop without rewriting every row.
- **Unified Task model**: A single `Task` table serves projects, estimates, and recurring events via polymorphic nullable FKs.
- **Event-sourced automation**: The v2 engine is a pure-function reducer that checkpoints after every node, with pluggable storage adapters.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 17, single-spa, React Router 6, Apollo Client 3, Material UI 5, styled-components |
| Backend | Node.js, Express, `@hexhive/graphql-server` (HiveGraph), GraphQL, Prisma ORM 6.9 |
| Database | PostgreSQL |
| Automation | TypeScript, custom workflow executor, ReactFlow editor, pluggable adapters |
| Integration | MSSQL CDC sync via `@hexhive/mssql-worker` |
| Infrastructure | Pulumi (AWS EKS), Kubernetes, Docker |
| Dev tooling | Yarn 4 (Berry) workspaces, Lerna, TypeScript, Jest, Playwright, Storybook 8, Webpack 5 |
| AI | OpenRouter API (DeepSeek models) for compliance regulation analysis |

---

## Getting started

### Prerequisites

- Node.js ≥ 18
- Yarn 4 (`corepack enable`)
- PostgreSQL database

### Backend

```bash
cd packages/app/hiveflow-backend

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, HEXHIVE_SECRET, etc.

# Run migrations
yarn prisma migrate dev

# Start development server (port 9011)
yarn dev
```

### Frontend

```bash
cd packages/app/hiveflow-frontend

# Standalone mode (outside single-spa shell)
yarn start:standalone   # → http://localhost:8503

# Or inside the HexHive shell
yarn start              # → http://localhost:8503 (mounted at /dashboard/flow)
```

### Full monorepo

```bash
# Install all dependencies
yarn install

# Launch with the dev script
yarn dev
```

### Database management

```bash
cd packages/app/hiveflow-backend

# Create a named migration
yarn prisma migrate dev --name describe_change

# Never use prisma db push — migrations must stay clean
```

---

## Repository

- **GitHub**: [TheTechCompany/HiveFlow](https://github.com/TheTechCompany/HiveFlow)
- **Package manager**: Yarn 4.9.2 (Berry) with workspaces
- **Monorepo orchestration**: Lerna 7
