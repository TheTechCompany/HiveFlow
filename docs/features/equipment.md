# Equipment

Equipment registry for tracking physical assets and scheduling them to projects.

---

## Data model

### Equipment

| Field          | Type    | Purpose |
|----------------|---------|---------|
| `id`           | String  | Nano ID |
| `displayId`    | String? | Human-readable short code, unique per organisation |
| `name`         | String? | Equipment name |
| `registration` | String? | Registration number (e.g. vehicle plate, asset tag) |
| `schedule`     | Relation| Many-to-many → ScheduleItem (via `scheduleEquipment`) |

---

## How equipment works

### CRUD

Equipment is a straightforward CRUD resource scoped to an organisation:
- **Create**: `createEquipment` generates a `displayId` as the count of existing equipment + 1, scoped to the organisation.
- **Update**: `updateEquipment` uses the composite unique key `(displayId, organisation)`.
- **Delete**: Hard delete.

### Scheduling

Equipment items are assigned to `ScheduleItem` records through a many-to-many relationship. In the Schedule modal, the Equipment tab presents a two-panel `TransferList` UI — available equipment on the left, selected equipment on the right, keyed by equipment ID.

The `createScheduleItem` and `updateScheduleItem` mutations connect equipment via Prisma's `connect: [{id}]` array.

---

## GraphQL operations

### Queries

| Query | Notes |
|-------|-------|
| `equipment` | List all equipment for the organisation |
| `Equipment.schedule` | Schedule items this equipment is assigned to |

### Mutations

| Mutation | Notes |
|----------|-------|
| `createEquipment` | Auto-generates displayId |
| `updateEquipment` | Partial update via composite key |
| `deleteEquipment` | Hard delete |

---

## File index

| Layer    | File | Purpose |
|----------|------|---------|
| Schema   | `packages/app/hiveflow-backend/prisma/schema.prisma` (lines 125–133) | Equipment model |
| Backend  | `packages/app/hiveflow-backend/src/schema/equipment.ts` | Equipment resolvers |
| Frontend | `packages/app/hiveflow-frontend/src/views/equipment/` | Equipment views |
| Frontend | `packages/app/hiveflow-frontend/src/views/schedule/modals/schedule/equipment-tab.tsx` | Equipment TransferList in schedule modal |
