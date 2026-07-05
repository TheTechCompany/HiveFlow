# Compliance

Regulation management with AI-powered analysis, ISO clause mapping, versioning, and a proof-of-compliance audit trail.

---

## Data model

### Regulation

| Field            | Type      | Purpose |
|------------------|-----------|---------|
| `id`             | String    | Nano ID |
| `title`          | String    | Regulation title |
| `description`    | String?   | Free-text description |
| `type`           | String    | Regulation type (e.g. "legislation", "standard") |
| `source`         | String    | Source identifier (URL or reference) |
| `category`       | String?   | Category grouping |
| `isoClause`      | String?   | Mapped ISO clause (e.g. "8.3", "10.2") |
| `status`         | String    | Default: `"draft"` |
| `linkStatus`     | String    | Default: `"unchecked"` — link health check status |
| `storedHash`     | String?   | SHA hash of the imported PDF for deduplication |
| `storedPdf`      | String?   | Reference to stored PDF |
| `storedMarkdown` | String?   | Extracted markdown content for AI analysis |
| `lastVerifiedAt` | DateTime? | Last link-validity check |
| `currentVersion` | Int       | Auto-incremented version counter (default: 1) |
| `versions`       | Relation  | One-to-many → RegulationVersion |
| `breakouts`      | Relation  | One-to-many → BreakoutPoint |
| `proofs`         | Relation  | One-to-many → ProofEntry |

### RegulationVersion

| Field          | Type    | Purpose |
|----------------|---------|---------|
| `id`           | String  | Nano ID |
| `regulationId` | String  | FK → Regulation |
| `version`      | Int     | Version number |
| `changes`      | String? | Description of changes |
| `file`         | String? | Reference to the versioned file |

### BreakoutPoint

Individual legislative provisions or requirements extracted from a regulation.

| Field            | Type    | Purpose |
|------------------|---------|---------|
| `id`             | String  | Nano ID |
| `regulationId`   | String  | FK → Regulation |
| `sectionRef`     | String  | Section reference (e.g. "§ 5.2") |
| `title`          | String  | Breakout point title |
| `summary`        | String? | AI-generated summary |
| `pageRef`        | Int?    | Page reference in source PDF |
| `markdownSnippet`| String? | Source text snippet |
| `understanding`  | String  | Default: `"pending"` — review status |
| `reviewedBy`     | String? | User ID who reviewed |
| `reviewedAt`     | DateTime?| When reviewed |

### ProofEntry

Audit trail record — written every time a user views, acknowledges, or reviews a regulation.

| Field          | Type     | Purpose |
|----------------|----------|---------|
| `id`           | String   | Nano ID |
| `regulationId` | String   | FK → Regulation |
| `userName`     | String   | User who took the action |
| `action`       | String   | Action type (view, acknowledge, review, etc.) |
| `timestamp`    | DateTime | Auto-set |

---

## How compliance works

### PDF import

1. A regulation PDF is uploaded and hashed (`storedHash`).
2. The hash is checked against existing regulations to **deduplicate** — if the same PDF was already imported, it is rejected.
3. The PDF content is converted to markdown (`storedMarkdown`) for AI processing.

### AI-powered breakout (OpenRouter / DeepSeek)

The compliance module calls OpenRouter with DeepSeek models in a **two-phase pipeline**:

1. **Identify phase**: The AI scans the full regulation text and identifies candidate legislative provisions — returning section references, titles, and page numbers.
2. **Extract phase**: For each identified provision, the AI extracts the precise text snippet and generates a plain-English summary.

The models are prompted to prefer **XML-structured output** for richer context. The backend includes robust JSON parsing with truncation repair to handle malformed AI responses.

### Breakout point workflow

1. AI analysis populates `BreakoutPoint` records with `understanding: "pending"`.
2. A human reviewer verifies each point, marks it as reviewed, and optionally maps it to an **ISO clause** on the parent Regulation.
3. The `understanding` field tracks review status through its lifecycle.

### Proof of compliance

Every significant action writes a `ProofEntry`:
- Viewing a regulation
- Acknowledging content
- Reviewing a breakout point
- Updating the regulation

This creates a complete audit trail for ISO certification purposes.

### Versioning

When a regulation is updated (new PDF, text changes), the `currentVersion` counter increments and a new `RegulationVersion` record is created with the change description and file reference.

---

## GraphQL operations

### Queries

| Query | Notes |
|-------|-------|
| `regulations` | List all regulations for the organisation |
| `regulation(id)` | Single regulation with versions, breakouts, proofs |
| `Regulation.breakouts` | Breakout points with review status |
| `Regulation.proofs` | Audit trail entries |

### Mutations

| Mutation | Notes |
|----------|-------|
| `createRegulation` | Creates with type, source, category, isoClause |
| `updateRegulation` | Update metadata, isoClause mapping |
| `deleteRegulation` | Hard delete with cascade |
| `importRegulationPdf` | Upload PDF, hash for dedup, extract markdown |
| `aiExplainRegulation` | AI-powered plain-English summary |
| `aiClassifyRegulation` | AI classification against clause taxonomy |
| `aiBreakoutRegulation` | AI extraction of breakout points |
| `createRegulationVersion` | New version with changes and file |
| `updateBreakoutPoint` | Mark as reviewed, update understanding |
| `bulkImportRegulations` | Batch import |

---

## File index

| Layer    | File | Purpose |
|----------|------|---------|
| Schema   | `packages/app/hiveflow-backend/prisma/schema.prisma` (lines 313–368) | Regulation, RegulationVersion, BreakoutPoint, ProofEntry models |
| Backend  | `packages/app/hiveflow-backend/src/schema/compliance.ts` | Compliance resolvers, AI integration, PDF import |
| Frontend | `packages/app/hiveflow-frontend/src/views/compliance/` | Compliance views |
