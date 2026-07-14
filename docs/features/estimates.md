# Estimates

The Estimates feature is a quote builder for creating and managing client estimates with line items, status tracking, and conversion to projects.

---

## Data model

### Estimate

| Field         | Type       | Purpose |
|---------------|------------|---------|
| `id`          | String     | Nano ID |
| `displayId`   | String?    | Human-readable short code, unique per organisation |
| `name`        | String?    | Estimate name / title |
| `status`      | String?    | Freeform status |
| `date`        | DateTime?  | Estimate date |
| `expiry`      | DateTime?  | Expiry date |
| `companyName` | String?    | Client company name |
| `terms`       | String?    | Payment/delivery terms |
| `price`       | Float?     | Total price (may be computed or manually set) |
| `lineItems`   | Relation   | One-to-many → EstimateLineItem |
| `tasks`       | Relation   | One-to-many → Task (tasks sourced from this estimate) |
| `timeline`    | Relation   | One-to-many → TimelineItem (Gantt items) |
| `managers`    | String[]   | Array of user IDs |
| `archived`    | Boolean    | Soft delete flag (default: `false`) |
| `createdAt`   | DateTime   | Auto-set on creation |
| `updatedAt`   | DateTime   | Auto-updated |

### EstimateLineItem

| Field         | Type    | Purpose |
|---------------|---------|---------|
| `id`          | String  | Nano ID |
| `estimateId`  | String  | FK → Estimate |
| `order`       | Int?    | Display order |
| `item`        | String? | Line item name |
| `description` | String? | Line item description |
| `quantity`    | Float?  | Quantity |
| `price`       | Float?  | Unit or line price |

---

## How estimates work

### CRUD operations

Estimates follow the same pattern as Projects:
- **Create**: `createEstimate` generates a `displayId` if not provided, defaults `status` and scopes to `organisation`.
- **Update**: `updateEstimate` uses the composite unique key `(displayId, organisation)`.
- **Delete**: `deleteEstimate` sets `archived: true` (soft delete), same as projects.

### Line items

Line items are managed as a nested relation. The `EstimateLineItem` model supports ordered lists of line items with quantity and price. The total `price` field on Estimate can be derived from line item sums or set manually.

### Tasks on estimates

Estimates can have tasks just like projects — the unified `Task` model uses `estimateId` as the source FK. This means you can plan work, assign people, and track progress on an estimate before it becomes a project.

### Timeline integration

Estimates appear in the Timeline Gantt view alongside projects. `TimelineItem` records can link to an estimate via `estimateId`, and bars are rendered with a hatched pattern to visually distinguish estimate items from committed project items.

---

## Conversion to projects

While there is no explicit "convert to project" mutation, estimates share the same `Task` and `TimelineItem` models as projects. The practical conversion path is:
1. Create a project from the estimate details.
2. Re-associate tasks and timeline items by updating their source FK from `estimateId` to `projectId`.
3. Archive the estimate.

---

## GraphQL operations

### Queries

| Query | Notes |
|-------|-------|
| `estimates(ids, where)` | Filters by organisation, status, date range |
| `Estimate.lineItems` | Nested line items |
| `Estimate.tasks` | Tasks sourced from this estimate |

### Mutations

| Mutation | Notes |
|----------|-------|
| `createEstimate` | Auto-generates displayId |
| `updateEstimate` | Partial update via composite key |
| `deleteEstimate` | Soft delete (`archived: true`) |
| `createEstimateLineItem` | Adds a line item |
| `updateEstimateLineItem` | Updates order, item, description, quantity, price |
| `deleteEstimateLineItem` | Removes a line item |

---

## File index

| Layer    | File | Purpose |
|----------|------|---------|
| Schema   | `packages/app/hiveflow-backend/prisma/schema.prisma` (lines 93–123) | Estimate and EstimateLineItem models |
| Backend  | `packages/app/hiveflow-backend/src/schema/estimate.ts` | Estimate resolvers |
| Frontend | `packages/app/hiveflow-frontend/src/views/estimates/` | Estimate views |
