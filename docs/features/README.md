# HiveFlow Features

Index of detailed feature documentation. Each document covers data models, key behaviors, APIs, and common pitfalls.

## Core operations

| Feature | Summary |
|---------|---------|
| [Schedule & Calendar](schedule.md) | Calendar-based scheduling, people/equipment assignment, ScheduleItem CRUD, permission model |
| [Projects & Tasks](projects-tasks.md) | Project CRUD, kanban task management (Backlog → Finished), subtasks, dependencies, LexoRank ordering, file management |
| [Estimates](estimates.md) | Quote builder with line items, company details, status tracking, project conversion |
| [Timeline](timeline.md) | Gantt-style timelines with dependency links, capacity alerts, people/estimate/project views |

## Resource management

| Feature | Summary |
|---------|---------|
| [Equipment](equipment.md) | Equipment registry, registration numbers, schedule assignment |
| [People & Skills](people.md) | Staff directory, skill assignments, leave management |

## Work management

| Feature | Summary |
|---------|---------|
| [Assigned Tasks](assignments.md) | Unified kanban combining tasks from projects, estimates, and recurring events. Filterable by person and source. |
| [Recurring Events](recurring-events.md) | Recurring schedules that auto-generate tasks on repeating cycles. Exception dates, splits, and task template overrides. |
| [Plan Batches](batches.md) | Group tasks into reviewable batches with draft → review → approved → released workflow |

## Governance

| Feature | Summary |
|---------|---------|
| [Compliance](compliance.md) | Regulation management, AI-powered breakout points, ISO clause mapping, versioning, audit trail |
| [Continuous Improvement](improvement.md) | CI tracking through 5-stage flow with kanban view |

## Automation

| Feature | Summary |
|---------|---------|
| [Automation Engine](automation.md) | Visual workflow builder and event-sourced execution engine. Trigger, action, and control nodes with ISO 9001 template pack. |
