# People & Skills

Staff directory with skill assignments and leave management.

---

## Data model

### SkillAssignment

Tracks which skills a user possesses. Uses a composite unique key to prevent duplicates.

| Field        | Type    | Purpose |
|--------------|---------|---------|
| `id`         | String  | Nano ID |
| `user`       | String  | User ID |
| `skill`      | String  | Skill name (freeform string) |
| `skillData`  | Json?   | Additional skill metadata |
| `organisation`| String? | Tenant scope |

Unique constraint: `(user, skill)` — each user can have a skill only once.

### LeaveAssignment

Records periods of leave/staff absence.

| Field        | Type     | Purpose |
|--------------|----------|---------|
| `id`         | String   | Nano ID |
| `user`       | String   | User ID |
| `start`      | DateTime | Leave start date |
| `end`        | DateTime | Leave end date |
| `createdAt`  | DateTime | Auto-set |
| `createdBy`  | String   | User ID who created the record |
| `organisation`| String? | Tenant scope |

---

## How People & Skills work

### Skills

Skills are freeform strings — there is no master skills table. The backend supports:

- **Adding a skill**: Upsert via the `(user, skill)` composite key — if the user already has that skill, it updates `skillData`; otherwise it creates a new record.
- **Removing a skill**: Delete by `(user, skill)`.
- **Listing skills**: The global skills list for the organisation is derived by deduplicating all `skill` strings across all `SkillAssignment` records.

Skills appear on the Task model via the `requiredSkills` JSON field. The frontend can use this to filter tasks or suggest people with matching skills.

### Leave management

Leave records are simple date ranges:

- **Creating leave**: `createLeaveAssignment(user, start, end)` — defaults `createdBy` to the authenticated user.
- **Viewing leave**: Leave records are returned as part of the people data in the Schedule view, where they are rendered as red blocks on each person's timeline row. A sweep-line algorithm merges overlapping or adjacent leave blocks into contiguous visual bars.

The leave data is consumed by the Schedule Gantt to show when people are unavailable for assignment.

---

## GraphQL operations

### Queries

| Query | Notes |
|-------|-------|
| `users(active: true)` | List active users (from HexHive auth) |
| `skillAssignments` | List all skill assignments for the organisation |
| `leaveAssignments` | List all leave records |

### Mutations

| Mutation | Notes |
|----------|-------|
| `assignSkill(user, skill, skillData)` | Upsert via composite key |
| `removeSkill(user, skill)` | Delete by composite key |
| `createLeaveAssignment(user, start, end)` | Create leave record |
| `deleteLeaveAssignment(id)` | Remove leave record |

---

## File index

| Layer    | File | Purpose |
|----------|------|---------|
| Schema   | `packages/app/hiveflow-backend/prisma/schema.prisma` (lines 205–222) | LeaveAssignment and SkillAssignment models |
| Frontend | `packages/app/hiveflow-frontend/src/views/people/` | People directory views |
| Frontend | `packages/app/hiveflow-frontend/src/views/schedule/index.tsx` | Leave rendering in schedule Gantt |
