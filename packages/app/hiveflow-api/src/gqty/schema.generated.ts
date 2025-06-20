/**
 * GQTY AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import { SchemaUnionsKey } from "gqty";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: string;
  Hash: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
}

export interface AssignedWhere {
  archived?: InputMaybe<Scalars["Boolean"]>;
  displayId?: InputMaybe<Scalars["String"]>;
  end?: InputMaybe<Scalars["DateTime"]>;
  start?: InputMaybe<Scalars["DateTime"]>;
  status?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
}

export interface CalendarItemInput {
  data?: InputMaybe<Scalars["JSON"]>;
  end?: InputMaybe<Scalars["DateTime"]>;
  groupBy?: InputMaybe<Scalars["JSON"]>;
  start?: InputMaybe<Scalars["DateTime"]>;
}

export interface CalendarWhere {
  end_GTE?: InputMaybe<Scalars["DateTime"]>;
  start_LTE?: InputMaybe<Scalars["DateTime"]>;
}

export interface EquipmentInput {
  id?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  registration?: InputMaybe<Scalars["String"]>;
}

export interface EstimateInput {
  companyName?: InputMaybe<Scalars["String"]>;
  date?: InputMaybe<Scalars["DateTime"]>;
  expiry?: InputMaybe<Scalars["DateTime"]>;
  id?: InputMaybe<Scalars["ID"]>;
  lineItems?: InputMaybe<Array<InputMaybe<EstimateLineItemInput>>>;
  name?: InputMaybe<Scalars["String"]>;
  price?: InputMaybe<Scalars["Float"]>;
  status?: InputMaybe<Scalars["String"]>;
}

export interface EstimateLineItemInput {
  description?: InputMaybe<Scalars["String"]>;
  item?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<Scalars["Int"]>;
  price?: InputMaybe<Scalars["Float"]>;
  quantity?: InputMaybe<Scalars["Float"]>;
}

export interface EstimateTaskInput {
  above?: InputMaybe<Scalars["String"]>;
  below?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  endDate?: InputMaybe<Scalars["DateTime"]>;
  estimateId?: InputMaybe<Scalars["String"]>;
  members?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  startDate?: InputMaybe<Scalars["DateTime"]>;
  status?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
}

export interface EstimateWhere {
  archived?: InputMaybe<Scalars["Boolean"]>;
  date_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_LTE?: InputMaybe<Scalars["DateTime"]>;
  displayId?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
}

export interface ProjectInput {
  colour?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  endDate?: InputMaybe<Scalars["DateTime"]>;
  id?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  startDate?: InputMaybe<Scalars["DateTime"]>;
  status?: InputMaybe<Scalars["String"]>;
}

export interface ProjectTaskInput {
  above?: InputMaybe<Scalars["String"]>;
  below?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  endDate?: InputMaybe<Scalars["DateTime"]>;
  members?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  projectId?: InputMaybe<Scalars["String"]>;
  requiredSkills?: InputMaybe<Scalars["JSON"]>;
  startDate?: InputMaybe<Scalars["DateTime"]>;
  status?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
}

export interface ProjectWhere {
  archived?: InputMaybe<Scalars["Boolean"]>;
  displayId?: InputMaybe<Scalars["String"]>;
  end?: InputMaybe<Scalars["DateTime"]>;
  start?: InputMaybe<Scalars["DateTime"]>;
  status?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
}

export interface ScheduleItemInput {
  date?: InputMaybe<Scalars["DateTime"]>;
  equipment?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  managers?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  notes?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  people?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  project?: InputMaybe<Scalars["ID"]>;
}

export interface ScheduleWhere {
  date_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_LTE?: InputMaybe<Scalars["DateTime"]>;
  id?: InputMaybe<Scalars["ID"]>;
  project?: InputMaybe<Scalars["String"]>;
}

export interface TimelineInput {
  name?: InputMaybe<Scalars["String"]>;
}

export interface TimelineItemDataInput {
  item?: InputMaybe<Scalars["String"]>;
  location?: InputMaybe<Scalars["String"]>;
  quantity?: InputMaybe<Scalars["Float"]>;
}

export interface TimelineItemInput {
  data?: InputMaybe<Array<InputMaybe<TimelineItemDataInput>>>;
  endDate?: InputMaybe<Scalars["DateTime"]>;
  estimate?: InputMaybe<Scalars["String"]>;
  notes?: InputMaybe<Scalars["String"]>;
  project?: InputMaybe<Scalars["String"]>;
  startDate?: InputMaybe<Scalars["DateTime"]>;
  timelineId?: InputMaybe<Scalars["String"]>;
}

export interface TimelineItemWhere {
  endDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  id?: InputMaybe<Scalars["ID"]>;
  startDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  timeline?: InputMaybe<Scalars["String"]>;
}

export interface TimelineWhere {
  id?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
}

export const scalarsEnumsHash: import("gqty").ScalarsEnumsHash = {
  Boolean: true,
  Date: true,
  DateTime: true,
  Float: true,
  Hash: true,
  ID: true,
  Int: true,
  JSON: true,
  String: true,
  Upload: true,
};
export const generatedSchema = {
  AssignedTask: {
    __typename: { __type: "String!" },
    $on: { __type: "$AssignedTask!" },
  },
  AssignedWhere: {
    archived: { __type: "Boolean" },
    displayId: { __type: "String" },
    end: { __type: "DateTime" },
    start: { __type: "DateTime" },
    status: { __type: "[String]" },
  },
  CalendarItem: {
    __typename: { __type: "String!" },
    data: { __type: "JSON" },
    end: { __type: "DateTime" },
    groupBy: { __type: "JSON" },
    id: { __type: "ID" },
    start: { __type: "DateTime" },
  },
  CalendarItemInput: {
    data: { __type: "JSON" },
    end: { __type: "DateTime" },
    groupBy: { __type: "JSON" },
    start: { __type: "DateTime" },
  },
  CalendarWhere: {
    end_GTE: { __type: "DateTime" },
    start_LTE: { __type: "DateTime" },
  },
  Equipment: {
    __typename: { __type: "String!" },
    displayId: { __type: "String" },
    id: { __type: "ID!" },
    name: { __type: "String" },
    organisation: { __type: "HiveOrganisation" },
    registration: { __type: "String" },
  },
  EquipmentInput: {
    id: { __type: "ID" },
    name: { __type: "String" },
    registration: { __type: "String" },
  },
  Estimate: {
    __typename: { __type: "String!" },
    companyName: { __type: "String" },
    date: { __type: "DateTime" },
    displayId: { __type: "String" },
    expiry: { __type: "DateTime" },
    id: { __type: "ID!" },
    lineItems: { __type: "[EstimateLineItem]" },
    name: { __type: "String" },
    organisation: { __type: "HiveOrganisation" },
    price: { __type: "Float" },
    status: { __type: "String" },
    tasks: { __type: "[EstimateTask]" },
  },
  EstimateInput: {
    companyName: { __type: "String" },
    date: { __type: "DateTime" },
    expiry: { __type: "DateTime" },
    id: { __type: "ID" },
    lineItems: { __type: "[EstimateLineItemInput]" },
    name: { __type: "String" },
    price: { __type: "Float" },
    status: { __type: "String" },
  },
  EstimateLineItem: {
    __typename: { __type: "String!" },
    amount: { __type: "Float" },
    description: { __type: "String" },
    id: { __type: "ID" },
    item: { __type: "String" },
    order: { __type: "Int" },
    price: { __type: "Float" },
    quantity: { __type: "Float" },
  },
  EstimateLineItemInput: {
    description: { __type: "String" },
    item: { __type: "String" },
    order: { __type: "Int" },
    price: { __type: "Float" },
    quantity: { __type: "Float" },
  },
  EstimateTask: {
    __typename: { __type: "String!" },
    columnRank: { __type: "String" },
    createdBy: { __type: "HiveUser" },
    dependencyOf: { __type: "[EstimateTask]" },
    dependencyOn: { __type: "[EstimateTask]" },
    description: { __type: "String" },
    endDate: { __type: "DateTime" },
    estimate: { __type: "Estimate" },
    id: { __type: "ID!" },
    lastUpdated: { __type: "DateTime" },
    members: { __type: "[HiveUser]" },
    startDate: { __type: "DateTime" },
    status: { __type: "String" },
    timelineRank: { __type: "String" },
    title: { __type: "String" },
  },
  EstimateTaskInput: {
    above: { __type: "String" },
    below: { __type: "String" },
    description: { __type: "String" },
    endDate: { __type: "DateTime" },
    estimateId: { __type: "String" },
    members: { __type: "[String]" },
    startDate: { __type: "DateTime" },
    status: { __type: "String" },
    title: { __type: "String" },
  },
  EstimateWhere: {
    archived: { __type: "Boolean" },
    date_GTE: { __type: "DateTime" },
    date_LTE: { __type: "DateTime" },
    displayId: { __type: "String" },
    id: { __type: "String" },
    name: { __type: "String" },
    status: { __type: "[String]" },
  },
  File: { __typename: { __type: "String!" }, id: { __type: "ID!" } },
  HiveOrganisation: {
    __typename: { __type: "String!" },
    equipment: { __type: "[Equipment!]!" },
    estimates: { __type: "[Estimate!]!" },
    id: { __type: "ID!" },
    people: { __type: "[People!]!" },
    projects: { __type: "[Project!]!" },
    schedule: { __type: "[ScheduleItem!]!" },
    timeline: { __type: "[TimelineItem!]!" },
  },
  HiveUser: { __typename: { __type: "String!" }, id: { __type: "ID!" } },
  People: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    inactive: { __type: "Boolean" },
    name: { __type: "String" },
    organisation: { __type: "HiveOrganisation" },
  },
  Project: {
    __typename: { __type: "String!" },
    colour: { __type: "String" },
    description: { __type: "String" },
    displayId: { __type: "String" },
    endDate: { __type: "DateTime" },
    files: { __type: "[File]", __args: { path: "String" } },
    id: { __type: "ID!" },
    name: { __type: "String" },
    organisation: { __type: "HiveOrganisation" },
    plan: { __type: "[TimelineItem!]!" },
    schedule: { __type: "[ScheduleItem!]!" },
    startDate: { __type: "DateTime" },
    status: { __type: "String" },
    tasks: { __type: "[ProjectTask]" },
  },
  ProjectInput: {
    colour: { __type: "String" },
    description: { __type: "String" },
    endDate: { __type: "DateTime" },
    id: { __type: "ID" },
    name: { __type: "String" },
    startDate: { __type: "DateTime" },
    status: { __type: "String" },
  },
  ProjectResult: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    invoiced: { __type: "Float" },
    organisation: { __type: "HiveOrganisation" },
    quoted: { __type: "Float" },
  },
  ProjectTask: {
    __typename: { __type: "String!" },
    columnRank: { __type: "String" },
    createdBy: { __type: "HiveUser" },
    dependencyOf: { __type: "[ProjectTask]" },
    dependencyOn: { __type: "[ProjectTask]" },
    description: { __type: "String" },
    endDate: { __type: "DateTime" },
    id: { __type: "ID!" },
    lastUpdated: { __type: "DateTime" },
    members: { __type: "[HiveUser]" },
    project: { __type: "Project" },
    requiredSkills: { __type: "JSON" },
    startDate: { __type: "DateTime" },
    status: { __type: "String" },
    timelineRank: { __type: "String" },
    title: { __type: "String" },
  },
  ProjectTaskInput: {
    above: { __type: "String" },
    below: { __type: "String" },
    description: { __type: "String" },
    endDate: { __type: "DateTime" },
    members: { __type: "[String]" },
    projectId: { __type: "String" },
    requiredSkills: { __type: "JSON" },
    startDate: { __type: "DateTime" },
    status: { __type: "String" },
    title: { __type: "String" },
  },
  ProjectWhere: {
    archived: { __type: "Boolean" },
    displayId: { __type: "String" },
    end: { __type: "DateTime" },
    start: { __type: "DateTime" },
    status: { __type: "[String]" },
  },
  Report: { __typename: { __type: "String!" }, id: { __type: "ID" } },
  Schedule: {
    __typename: { __type: "String!" },
    createdBy: { __type: "HiveUser" },
    id: { __type: "ID" },
    name: { __type: "String" },
    organisation: { __type: "HiveOrganisation" },
  },
  ScheduleItem: {
    __typename: { __type: "String!" },
    canEdit: { __type: "Boolean" },
    createdAt: { __type: "DateTime" },
    date: { __type: "DateTime" },
    equipment: { __type: "[Equipment]" },
    id: { __type: "ID" },
    managers: { __type: "[HiveUser]" },
    notes: { __type: "[String]" },
    organisation: { __type: "HiveOrganisation" },
    owner: { __type: "HiveUser" },
    people: { __type: "[HiveUser]" },
    project: { __type: "Project" },
  },
  ScheduleItemInput: {
    date: { __type: "DateTime" },
    equipment: { __type: "[ID]" },
    managers: { __type: "[ID]" },
    notes: { __type: "[String]" },
    people: { __type: "[ID]" },
    project: { __type: "ID" },
  },
  ScheduleWhere: {
    date_GTE: { __type: "DateTime" },
    date_LTE: { __type: "DateTime" },
    id: { __type: "ID" },
    project: { __type: "String" },
  },
  SkillAssignment: {
    __typename: { __type: "String!" },
    id: { __type: "ID" },
    skill: { __type: "String" },
    skillData: { __type: "JSON" },
    user: { __type: "HiveUser" },
  },
  Timeline: {
    __typename: { __type: "String!" },
    id: { __type: "ID" },
    items: { __type: "[TimelineItem]" },
    name: { __type: "String" },
    organisation: { __type: "HiveOrganisation" },
  },
  TimelineInput: { name: { __type: "String" } },
  TimelineItem: {
    __typename: { __type: "String!" },
    blocks: { __type: "[TimelineItem]" },
    data: { __type: "[TimelineItemData]" },
    endDate: { __type: "DateTime" },
    estimate: { __type: "Estimate" },
    id: { __type: "ID" },
    items: { __type: "[TimelineItemItems]" },
    notes: { __type: "String" },
    organisation: { __type: "HiveOrganisation" },
    project: { __type: "Project" },
    rank: { __type: "String" },
    requires: { __type: "[TimelineItem]" },
    startDate: { __type: "DateTime" },
    timeline: { __type: "String" },
  },
  TimelineItemData: {
    __typename: { __type: "String!" },
    item: { __type: "String" },
    location: { __type: "String" },
    quantity: { __type: "Float" },
  },
  TimelineItemDataInput: {
    item: { __type: "String" },
    location: { __type: "String" },
    quantity: { __type: "Float" },
  },
  TimelineItemInput: {
    data: { __type: "[TimelineItemDataInput]" },
    endDate: { __type: "DateTime" },
    estimate: { __type: "String" },
    notes: { __type: "String" },
    project: { __type: "String" },
    startDate: { __type: "DateTime" },
    timelineId: { __type: "String" },
  },
  TimelineItemItems: {
    __typename: { __type: "String!" },
    estimate: { __type: "Float" },
    id: { __type: "ID" },
    item: { __type: "TimelineItem" },
    location: { __type: "String" },
    type: { __type: "String" },
  },
  TimelineItemWhere: {
    endDate_GTE: { __type: "DateTime" },
    id: { __type: "ID" },
    startDate_LTE: { __type: "DateTime" },
    timeline: { __type: "String" },
  },
  TimelineProject: {
    __typename: { __type: "String!" },
    $on: { __type: "$TimelineProject!" },
  },
  TimelineWhere: { id: { __type: "ID" }, name: { __type: "String" } },
  WorkInProgress: {
    __typename: { __type: "String!" },
    end: { __type: "DateTime" },
    invoiced: { __type: "Float" },
    quoted: { __type: "Float" },
    start: { __type: "DateTime" },
  },
  mutation: {
    __typename: { __type: "String!" },
    cloneScheduleItem: {
      __type: "[ScheduleItem]",
      __args: { dates: "[DateTime]", id: "ID" },
    },
    createCalendarItem: {
      __type: "CalendarItem",
      __args: { input: "CalendarItemInput" },
    },
    createEquipment: {
      __type: "Equipment",
      __args: { input: "EquipmentInput" },
    },
    createEstimate: { __type: "Estimate", __args: { input: "EstimateInput" } },
    createEstimateLineItem: {
      __type: "EstimateLineItem",
      __args: { estimate: "ID", input: "EstimateLineItemInput" },
    },
    createEstimateTask: {
      __type: "EstimateTask!",
      __args: { input: "EstimateTaskInput" },
    },
    createEstimateTaskDependency: {
      __type: "EstimateTask!",
      __args: { estimate: "ID", source: "ID", target: "ID" },
    },
    createProject: { __type: "Project!", __args: { input: "ProjectInput" } },
    createProjectFolder: {
      __type: "File",
      __args: { path: "String", project: "ID!" },
    },
    createProjectTask: {
      __type: "ProjectTask!",
      __args: { input: "ProjectTaskInput" },
    },
    createProjectTaskDependency: {
      __type: "ProjectTask!",
      __args: { project: "ID", source: "ID", target: "ID" },
    },
    createScheduleItem: {
      __type: "ScheduleItem",
      __args: { input: "ScheduleItemInput" },
    },
    createTimeline: { __type: "Timeline", __args: { input: "TimelineInput" } },
    createTimelineItem: {
      __type: "TimelineItem",
      __args: { input: "TimelineItemInput", prev: "ID" },
    },
    createTimelineItemDependency: {
      __type: "TimelineItem",
      __args: { source: "ID", target: "ID" },
    },
    deleteCalendarItem: { __type: "CalendarItem", __args: { id: "ID" } },
    deleteEquipment: { __type: "Equipment", __args: { id: "ID!" } },
    deleteEstimate: { __type: "Estimate", __args: { id: "ID!" } },
    deleteEstimateLineItem: {
      __type: "EstimateLineItem",
      __args: { estimate: "ID", id: "ID" },
    },
    deleteEstimateTask: { __type: "EstimateTask!", __args: { id: "ID" } },
    deleteEstimateTaskDependency: {
      __type: "EstimateTask!",
      __args: { estimate: "ID", source: "ID", target: "ID" },
    },
    deleteProject: { __type: "Project!", __args: { id: "ID!" } },
    deleteProjectFile: {
      __type: "File",
      __args: { path: "String", project: "ID!" },
    },
    deleteProjectTask: { __type: "ProjectTask!", __args: { id: "ID" } },
    deleteProjectTaskDependency: {
      __type: "ProjectTask!",
      __args: { project: "ID", source: "ID", target: "ID" },
    },
    deleteScheduleItem: { __type: "ScheduleItem", __args: { id: "ID" } },
    deleteSkillAssignment: { __type: "SkillAssignment", __args: { id: "ID" } },
    deleteTimeline: { __type: "Timeline", __args: { id: "ID" } },
    deleteTimelineItem: { __type: "TimelineItem", __args: { id: "ID" } },
    deleteTimelineItemDependency: {
      __type: "TimelineItem",
      __args: { source: "ID", target: "ID" },
    },
    empty: { __type: "String" },
    joinScheduleItem: { __type: "ScheduleItem", __args: { id: "ID" } },
    leaveScheduleItem: { __type: "ScheduleItem", __args: { id: "ID" } },
    moveProjectFile: {
      __type: "File",
      __args: { newPath: "String", path: "String", project: "ID!" },
    },
    renameProjectFile: {
      __type: "File",
      __args: { newPath: "String", path: "String", project: "ID!" },
    },
    updateCalendarItem: {
      __type: "CalendarItem",
      __args: { id: "ID", input: "CalendarItemInput" },
    },
    updateEquipment: {
      __type: "Equipment",
      __args: { id: "ID!", input: "EquipmentInput" },
    },
    updateEstimate: {
      __type: "Estimate",
      __args: { id: "ID!", input: "EstimateInput" },
    },
    updateEstimateLineItem: {
      __type: "EstimateLineItem",
      __args: { estimate: "ID", id: "ID", input: "EstimateLineItemInput" },
    },
    updateEstimateTask: {
      __type: "EstimateTask!",
      __args: { id: "ID", input: "EstimateTaskInput" },
    },
    updateEstimateTaskTimelineOrder: {
      __type: "EstimateTask!",
      __args: { above: "String", below: "String", id: "ID" },
    },
    updateProject: {
      __type: "Project!",
      __args: { id: "ID!", input: "ProjectInput" },
    },
    updateProjectFolder: {
      __type: "File",
      __args: { path: "String", project: "ID!" },
    },
    updateProjectTask: {
      __type: "ProjectTask!",
      __args: { id: "ID", input: "ProjectTaskInput" },
    },
    updateProjectTaskColumn: {
      __type: "ProjectTask",
      __args: { above: "String", below: "String", id: "ID", status: "String" },
    },
    updateProjectTaskTimelineOrder: {
      __type: "ProjectTask!",
      __args: { above: "String", below: "String", id: "ID" },
    },
    updateScheduleItem: {
      __type: "ScheduleItem",
      __args: { id: "ID", input: "ScheduleItemInput" },
    },
    updateSkillAssignment: {
      __type: "SkillAssignment",
      __args: { skill: "String", skillData: "JSON", user: "String" },
    },
    updateTimeline: {
      __type: "Timeline",
      __args: { id: "ID", input: "TimelineInput" },
    },
    updateTimelineItem: {
      __type: "TimelineItem",
      __args: { id: "ID", input: "TimelineItemInput" },
    },
    updateTimelineItemOrder: {
      __type: "TimelineItem",
      __args: { id: "ID", next: "ID", prev: "ID" },
    },
    uploadProjectFiles: {
      __type: "[File!]!",
      __args: { files: "[Upload]", path: "String", project: "ID!" },
    },
  },
  query: {
    __typename: { __type: "String!" },
    _sdl: { __type: "String!" },
    assignments: {
      __type: "[AssignedTask!]!",
      __args: { ids: "[ID]", where: "AssignedWhere" },
    },
    calendarItems: {
      __type: "[CalendarItem]",
      __args: { where: "CalendarWhere" },
    },
    equipment: { __type: "[Equipment]" },
    estimates: { __type: "[Estimate!]!", __args: { where: "EstimateWhere" } },
    flowWorkInProgress: {
      __type: "WorkInProgress",
      __args: { endDate: "DateTime", startDate: "DateTime" },
    },
    hash: { __type: "Hash", __args: { input: "String!" } },
    organisation: { __type: "HiveOrganisation" },
    projects: {
      __type: "[Project!]!",
      __args: { ids: "[ID]", where: "ProjectWhere" },
    },
    scheduleItems: {
      __type: "[ScheduleItem]",
      __args: { where: "ScheduleWhere" },
    },
    skills: { __type: "[SkillAssignment]", __args: { user: "ID" } },
    timelineItems: {
      __type: "[TimelineItem]",
      __args: { where: "TimelineItemWhere" },
    },
  },
  subscription: {},
  [SchemaUnionsKey]: {
    AssignedTask: ["EstimateTask", "ProjectTask"],
    TimelineProject: ["Estimate", "Project"],
  },
} as const;

export interface AssignedTask {
  __typename?: "EstimateTask" | "ProjectTask";
  $on: $AssignedTask;
}

export interface CalendarItem {
  __typename?: "CalendarItem";
  data?: Maybe<ScalarsEnums["JSON"]>;
  end?: Maybe<ScalarsEnums["DateTime"]>;
  groupBy?: Maybe<ScalarsEnums["JSON"]>;
  id?: Maybe<ScalarsEnums["ID"]>;
  start?: Maybe<ScalarsEnums["DateTime"]>;
}

export interface Equipment {
  __typename?: "Equipment";
  displayId?: Maybe<ScalarsEnums["String"]>;
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  organisation?: Maybe<HiveOrganisation>;
  registration?: Maybe<ScalarsEnums["String"]>;
}

export interface Estimate {
  __typename?: "Estimate";
  companyName?: Maybe<ScalarsEnums["String"]>;
  date?: Maybe<ScalarsEnums["DateTime"]>;
  displayId?: Maybe<ScalarsEnums["String"]>;
  expiry?: Maybe<ScalarsEnums["DateTime"]>;
  id: ScalarsEnums["ID"];
  lineItems?: Maybe<Array<Maybe<EstimateLineItem>>>;
  name?: Maybe<ScalarsEnums["String"]>;
  organisation?: Maybe<HiveOrganisation>;
  price?: Maybe<ScalarsEnums["Float"]>;
  status?: Maybe<ScalarsEnums["String"]>;
  tasks?: Maybe<Array<Maybe<EstimateTask>>>;
}

export interface EstimateLineItem {
  __typename?: "EstimateLineItem";
  amount?: Maybe<ScalarsEnums["Float"]>;
  description?: Maybe<ScalarsEnums["String"]>;
  id?: Maybe<ScalarsEnums["ID"]>;
  item?: Maybe<ScalarsEnums["String"]>;
  order?: Maybe<ScalarsEnums["Int"]>;
  price?: Maybe<ScalarsEnums["Float"]>;
  quantity?: Maybe<ScalarsEnums["Float"]>;
}

export interface EstimateTask {
  __typename?: "EstimateTask";
  columnRank?: Maybe<ScalarsEnums["String"]>;
  createdBy?: Maybe<HiveUser>;
  dependencyOf?: Maybe<Array<Maybe<EstimateTask>>>;
  dependencyOn?: Maybe<Array<Maybe<EstimateTask>>>;
  description?: Maybe<ScalarsEnums["String"]>;
  endDate?: Maybe<ScalarsEnums["DateTime"]>;
  estimate?: Maybe<Estimate>;
  id: ScalarsEnums["ID"];
  lastUpdated?: Maybe<ScalarsEnums["DateTime"]>;
  members?: Maybe<Array<Maybe<HiveUser>>>;
  startDate?: Maybe<ScalarsEnums["DateTime"]>;
  status?: Maybe<ScalarsEnums["String"]>;
  timelineRank?: Maybe<ScalarsEnums["String"]>;
  title?: Maybe<ScalarsEnums["String"]>;
}

export interface File {
  __typename?: "File";
  id: ScalarsEnums["ID"];
}

export interface HiveOrganisation {
  __typename?: "HiveOrganisation";
  equipment: Array<Equipment>;
  estimates: Array<Estimate>;
  id: ScalarsEnums["ID"];
  people: Array<People>;
  projects: Array<Project>;
  schedule: Array<ScheduleItem>;
  timeline: Array<TimelineItem>;
}

export interface HiveUser {
  __typename?: "HiveUser";
  id: ScalarsEnums["ID"];
}

export interface People {
  __typename?: "People";
  id: ScalarsEnums["ID"];
  inactive?: Maybe<ScalarsEnums["Boolean"]>;
  name?: Maybe<ScalarsEnums["String"]>;
  organisation?: Maybe<HiveOrganisation>;
}

export interface Project {
  __typename?: "Project";
  colour?: Maybe<ScalarsEnums["String"]>;
  description?: Maybe<ScalarsEnums["String"]>;
  displayId?: Maybe<ScalarsEnums["String"]>;
  endDate?: Maybe<ScalarsEnums["DateTime"]>;
  files: (args?: {
    path?: Maybe<Scalars["String"]>;
  }) => Maybe<Array<Maybe<File>>>;
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  organisation?: Maybe<HiveOrganisation>;
  plan: Array<TimelineItem>;
  schedule: Array<ScheduleItem>;
  startDate?: Maybe<ScalarsEnums["DateTime"]>;
  status?: Maybe<ScalarsEnums["String"]>;
  tasks?: Maybe<Array<Maybe<ProjectTask>>>;
}

export interface ProjectResult {
  __typename?: "ProjectResult";
  id: ScalarsEnums["ID"];
  invoiced?: Maybe<ScalarsEnums["Float"]>;
  organisation?: Maybe<HiveOrganisation>;
  quoted?: Maybe<ScalarsEnums["Float"]>;
}

export interface ProjectTask {
  __typename?: "ProjectTask";
  columnRank?: Maybe<ScalarsEnums["String"]>;
  createdBy?: Maybe<HiveUser>;
  dependencyOf?: Maybe<Array<Maybe<ProjectTask>>>;
  dependencyOn?: Maybe<Array<Maybe<ProjectTask>>>;
  description?: Maybe<ScalarsEnums["String"]>;
  endDate?: Maybe<ScalarsEnums["DateTime"]>;
  id: ScalarsEnums["ID"];
  lastUpdated?: Maybe<ScalarsEnums["DateTime"]>;
  members?: Maybe<Array<Maybe<HiveUser>>>;
  project?: Maybe<Project>;
  requiredSkills?: Maybe<ScalarsEnums["JSON"]>;
  startDate?: Maybe<ScalarsEnums["DateTime"]>;
  status?: Maybe<ScalarsEnums["String"]>;
  timelineRank?: Maybe<ScalarsEnums["String"]>;
  title?: Maybe<ScalarsEnums["String"]>;
}

export interface Report {
  __typename?: "Report";
  id?: Maybe<ScalarsEnums["ID"]>;
}

export interface Schedule {
  __typename?: "Schedule";
  createdBy?: Maybe<HiveUser>;
  id?: Maybe<ScalarsEnums["ID"]>;
  name?: Maybe<ScalarsEnums["String"]>;
  organisation?: Maybe<HiveOrganisation>;
}

export interface ScheduleItem {
  __typename?: "ScheduleItem";
  canEdit?: Maybe<ScalarsEnums["Boolean"]>;
  createdAt?: Maybe<ScalarsEnums["DateTime"]>;
  date?: Maybe<ScalarsEnums["DateTime"]>;
  equipment?: Maybe<Array<Maybe<Equipment>>>;
  id?: Maybe<ScalarsEnums["ID"]>;
  managers?: Maybe<Array<Maybe<HiveUser>>>;
  notes?: Maybe<Array<Maybe<ScalarsEnums["String"]>>>;
  organisation?: Maybe<HiveOrganisation>;
  owner?: Maybe<HiveUser>;
  people?: Maybe<Array<Maybe<HiveUser>>>;
  project?: Maybe<Project>;
}

export interface SkillAssignment {
  __typename?: "SkillAssignment";
  id?: Maybe<ScalarsEnums["ID"]>;
  skill?: Maybe<ScalarsEnums["String"]>;
  skillData?: Maybe<ScalarsEnums["JSON"]>;
  user?: Maybe<HiveUser>;
}

export interface Timeline {
  __typename?: "Timeline";
  id?: Maybe<ScalarsEnums["ID"]>;
  items?: Maybe<Array<Maybe<TimelineItem>>>;
  name?: Maybe<ScalarsEnums["String"]>;
  organisation?: Maybe<HiveOrganisation>;
}

export interface TimelineItem {
  __typename?: "TimelineItem";
  blocks?: Maybe<Array<Maybe<TimelineItem>>>;
  data?: Maybe<Array<Maybe<TimelineItemData>>>;
  endDate?: Maybe<ScalarsEnums["DateTime"]>;
  estimate?: Maybe<Estimate>;
  id?: Maybe<ScalarsEnums["ID"]>;
  items?: Maybe<Array<Maybe<TimelineItemItems>>>;
  notes?: Maybe<ScalarsEnums["String"]>;
  organisation?: Maybe<HiveOrganisation>;
  project?: Maybe<Project>;
  rank?: Maybe<ScalarsEnums["String"]>;
  requires?: Maybe<Array<Maybe<TimelineItem>>>;
  startDate?: Maybe<ScalarsEnums["DateTime"]>;
  timeline?: Maybe<ScalarsEnums["String"]>;
}

export interface TimelineItemData {
  __typename?: "TimelineItemData";
  item?: Maybe<ScalarsEnums["String"]>;
  location?: Maybe<ScalarsEnums["String"]>;
  quantity?: Maybe<ScalarsEnums["Float"]>;
}

export interface TimelineItemItems {
  __typename?: "TimelineItemItems";
  estimate?: Maybe<ScalarsEnums["Float"]>;
  id?: Maybe<ScalarsEnums["ID"]>;
  item?: Maybe<TimelineItem>;
  location?: Maybe<ScalarsEnums["String"]>;
  type?: Maybe<ScalarsEnums["String"]>;
}

export interface TimelineProject {
  __typename?: "Estimate" | "Project";
  $on: $TimelineProject;
}

export interface WorkInProgress {
  __typename?: "WorkInProgress";
  end?: Maybe<ScalarsEnums["DateTime"]>;
  invoiced?: Maybe<ScalarsEnums["Float"]>;
  quoted?: Maybe<ScalarsEnums["Float"]>;
  start?: Maybe<ScalarsEnums["DateTime"]>;
}

export interface Mutation {
  __typename?: "Mutation";
  cloneScheduleItem: (args?: {
    dates?: Maybe<Array<Maybe<Scalars["DateTime"]>>>;
    id?: Maybe<Scalars["ID"]>;
  }) => Maybe<Array<Maybe<ScheduleItem>>>;
  createCalendarItem: (args?: {
    input?: Maybe<CalendarItemInput>;
  }) => Maybe<CalendarItem>;
  createEquipment: (args?: {
    input?: Maybe<EquipmentInput>;
  }) => Maybe<Equipment>;
  createEstimate: (args?: { input?: Maybe<EstimateInput> }) => Maybe<Estimate>;
  createEstimateLineItem: (args?: {
    estimate?: Maybe<Scalars["ID"]>;
    input?: Maybe<EstimateLineItemInput>;
  }) => Maybe<EstimateLineItem>;
  createEstimateTask: (args?: {
    input?: Maybe<EstimateTaskInput>;
  }) => EstimateTask;
  createEstimateTaskDependency: (args?: {
    estimate?: Maybe<Scalars["ID"]>;
    source?: Maybe<Scalars["ID"]>;
    target?: Maybe<Scalars["ID"]>;
  }) => EstimateTask;
  createProject: (args?: { input?: Maybe<ProjectInput> }) => Project;
  createProjectFolder: (args: {
    path?: Maybe<Scalars["String"]>;
    project: Scalars["ID"];
  }) => Maybe<File>;
  createProjectTask: (args?: {
    input?: Maybe<ProjectTaskInput>;
  }) => ProjectTask;
  createProjectTaskDependency: (args?: {
    project?: Maybe<Scalars["ID"]>;
    source?: Maybe<Scalars["ID"]>;
    target?: Maybe<Scalars["ID"]>;
  }) => ProjectTask;
  createScheduleItem: (args?: {
    input?: Maybe<ScheduleItemInput>;
  }) => Maybe<ScheduleItem>;
  createTimeline: (args?: { input?: Maybe<TimelineInput> }) => Maybe<Timeline>;
  createTimelineItem: (args?: {
    input?: Maybe<TimelineItemInput>;
    prev?: Maybe<Scalars["ID"]>;
  }) => Maybe<TimelineItem>;
  createTimelineItemDependency: (args?: {
    source?: Maybe<Scalars["ID"]>;
    target?: Maybe<Scalars["ID"]>;
  }) => Maybe<TimelineItem>;
  deleteCalendarItem: (args?: {
    id?: Maybe<Scalars["ID"]>;
  }) => Maybe<CalendarItem>;
  deleteEquipment: (args: { id: Scalars["ID"] }) => Maybe<Equipment>;
  deleteEstimate: (args: { id: Scalars["ID"] }) => Maybe<Estimate>;
  deleteEstimateLineItem: (args?: {
    estimate?: Maybe<Scalars["ID"]>;
    id?: Maybe<Scalars["ID"]>;
  }) => Maybe<EstimateLineItem>;
  deleteEstimateTask: (args?: { id?: Maybe<Scalars["ID"]> }) => EstimateTask;
  deleteEstimateTaskDependency: (args?: {
    estimate?: Maybe<Scalars["ID"]>;
    source?: Maybe<Scalars["ID"]>;
    target?: Maybe<Scalars["ID"]>;
  }) => EstimateTask;
  deleteProject: (args: { id: Scalars["ID"] }) => Project;
  deleteProjectFile: (args: {
    path?: Maybe<Scalars["String"]>;
    project: Scalars["ID"];
  }) => Maybe<File>;
  deleteProjectTask: (args?: { id?: Maybe<Scalars["ID"]> }) => ProjectTask;
  deleteProjectTaskDependency: (args?: {
    project?: Maybe<Scalars["ID"]>;
    source?: Maybe<Scalars["ID"]>;
    target?: Maybe<Scalars["ID"]>;
  }) => ProjectTask;
  deleteScheduleItem: (args?: {
    id?: Maybe<Scalars["ID"]>;
  }) => Maybe<ScheduleItem>;
  deleteSkillAssignment: (args?: {
    id?: Maybe<Scalars["ID"]>;
  }) => Maybe<SkillAssignment>;
  deleteTimeline: (args?: { id?: Maybe<Scalars["ID"]> }) => Maybe<Timeline>;
  deleteTimelineItem: (args?: {
    id?: Maybe<Scalars["ID"]>;
  }) => Maybe<TimelineItem>;
  deleteTimelineItemDependency: (args?: {
    source?: Maybe<Scalars["ID"]>;
    target?: Maybe<Scalars["ID"]>;
  }) => Maybe<TimelineItem>;
  empty?: Maybe<ScalarsEnums["String"]>;
  joinScheduleItem: (args?: {
    id?: Maybe<Scalars["ID"]>;
  }) => Maybe<ScheduleItem>;
  leaveScheduleItem: (args?: {
    id?: Maybe<Scalars["ID"]>;
  }) => Maybe<ScheduleItem>;
  moveProjectFile: (args: {
    newPath?: Maybe<Scalars["String"]>;
    path?: Maybe<Scalars["String"]>;
    project: Scalars["ID"];
  }) => Maybe<File>;
  renameProjectFile: (args: {
    newPath?: Maybe<Scalars["String"]>;
    path?: Maybe<Scalars["String"]>;
    project: Scalars["ID"];
  }) => Maybe<File>;
  updateCalendarItem: (args?: {
    id?: Maybe<Scalars["ID"]>;
    input?: Maybe<CalendarItemInput>;
  }) => Maybe<CalendarItem>;
  updateEquipment: (args: {
    id: Scalars["ID"];
    input?: Maybe<EquipmentInput>;
  }) => Maybe<Equipment>;
  updateEstimate: (args: {
    id: Scalars["ID"];
    input?: Maybe<EstimateInput>;
  }) => Maybe<Estimate>;
  updateEstimateLineItem: (args?: {
    estimate?: Maybe<Scalars["ID"]>;
    id?: Maybe<Scalars["ID"]>;
    input?: Maybe<EstimateLineItemInput>;
  }) => Maybe<EstimateLineItem>;
  updateEstimateTask: (args?: {
    id?: Maybe<Scalars["ID"]>;
    input?: Maybe<EstimateTaskInput>;
  }) => EstimateTask;
  updateEstimateTaskTimelineOrder: (args?: {
    above?: Maybe<Scalars["String"]>;
    below?: Maybe<Scalars["String"]>;
    id?: Maybe<Scalars["ID"]>;
  }) => EstimateTask;
  updateProject: (args: {
    id: Scalars["ID"];
    input?: Maybe<ProjectInput>;
  }) => Project;
  updateProjectFolder: (args: {
    path?: Maybe<Scalars["String"]>;
    project: Scalars["ID"];
  }) => Maybe<File>;
  updateProjectTask: (args?: {
    id?: Maybe<Scalars["ID"]>;
    input?: Maybe<ProjectTaskInput>;
  }) => ProjectTask;
  updateProjectTaskColumn: (args?: {
    above?: Maybe<Scalars["String"]>;
    below?: Maybe<Scalars["String"]>;
    id?: Maybe<Scalars["ID"]>;
    status?: Maybe<Scalars["String"]>;
  }) => Maybe<ProjectTask>;
  updateProjectTaskTimelineOrder: (args?: {
    above?: Maybe<Scalars["String"]>;
    below?: Maybe<Scalars["String"]>;
    id?: Maybe<Scalars["ID"]>;
  }) => ProjectTask;
  updateScheduleItem: (args?: {
    id?: Maybe<Scalars["ID"]>;
    input?: Maybe<ScheduleItemInput>;
  }) => Maybe<ScheduleItem>;
  updateSkillAssignment: (args?: {
    skill?: Maybe<Scalars["String"]>;
    skillData?: Maybe<Scalars["JSON"]>;
    user?: Maybe<Scalars["String"]>;
  }) => Maybe<SkillAssignment>;
  updateTimeline: (args?: {
    id?: Maybe<Scalars["ID"]>;
    input?: Maybe<TimelineInput>;
  }) => Maybe<Timeline>;
  updateTimelineItem: (args?: {
    id?: Maybe<Scalars["ID"]>;
    input?: Maybe<TimelineItemInput>;
  }) => Maybe<TimelineItem>;
  updateTimelineItemOrder: (args?: {
    id?: Maybe<Scalars["ID"]>;
    next?: Maybe<Scalars["ID"]>;
    prev?: Maybe<Scalars["ID"]>;
  }) => Maybe<TimelineItem>;
  uploadProjectFiles: (args: {
    files?: Maybe<Array<Maybe<Scalars["Upload"]>>>;
    path?: Maybe<Scalars["String"]>;
    project: Scalars["ID"];
  }) => Array<File>;
}

export interface Query {
  __typename?: "Query";
  _sdl: ScalarsEnums["String"];
  assignments: (args?: {
    ids?: Maybe<Array<Maybe<Scalars["ID"]>>>;
    where?: Maybe<AssignedWhere>;
  }) => Array<AssignedTask>;
  calendarItems: (args?: {
    where?: Maybe<CalendarWhere>;
  }) => Maybe<Array<Maybe<CalendarItem>>>;
  equipment?: Maybe<Array<Maybe<Equipment>>>;
  estimates: (args?: { where?: Maybe<EstimateWhere> }) => Array<Estimate>;
  flowWorkInProgress: (args?: {
    endDate?: Maybe<Scalars["DateTime"]>;
    startDate?: Maybe<Scalars["DateTime"]>;
  }) => Maybe<WorkInProgress>;
  hash: (args: { input: Scalars["String"] }) => Maybe<ScalarsEnums["Hash"]>;
  organisation?: Maybe<HiveOrganisation>;
  projects: (args?: {
    ids?: Maybe<Array<Maybe<Scalars["ID"]>>>;
    where?: Maybe<ProjectWhere>;
  }) => Array<Project>;
  scheduleItems: (args?: {
    where?: Maybe<ScheduleWhere>;
  }) => Maybe<Array<Maybe<ScheduleItem>>>;
  skills: (args?: {
    user?: Maybe<Scalars["ID"]>;
  }) => Maybe<Array<Maybe<SkillAssignment>>>;
  timelineItems: (args?: {
    where?: Maybe<TimelineItemWhere>;
  }) => Maybe<Array<Maybe<TimelineItem>>>;
}

export interface Subscription {
  __typename?: "Subscription";
}

export interface SchemaObjectTypes {
  CalendarItem: CalendarItem;
  Equipment: Equipment;
  Estimate: Estimate;
  EstimateLineItem: EstimateLineItem;
  EstimateTask: EstimateTask;
  File: File;
  HiveOrganisation: HiveOrganisation;
  HiveUser: HiveUser;
  Mutation: Mutation;
  People: People;
  Project: Project;
  ProjectResult: ProjectResult;
  ProjectTask: ProjectTask;
  Query: Query;
  Report: Report;
  Schedule: Schedule;
  ScheduleItem: ScheduleItem;
  SkillAssignment: SkillAssignment;
  Subscription: Subscription;
  Timeline: Timeline;
  TimelineItem: TimelineItem;
  TimelineItemData: TimelineItemData;
  TimelineItemItems: TimelineItemItems;
  WorkInProgress: WorkInProgress;
}
export type SchemaObjectTypesNames =
  | "CalendarItem"
  | "Equipment"
  | "Estimate"
  | "EstimateLineItem"
  | "EstimateTask"
  | "File"
  | "HiveOrganisation"
  | "HiveUser"
  | "Mutation"
  | "People"
  | "Project"
  | "ProjectResult"
  | "ProjectTask"
  | "Query"
  | "Report"
  | "Schedule"
  | "ScheduleItem"
  | "SkillAssignment"
  | "Subscription"
  | "Timeline"
  | "TimelineItem"
  | "TimelineItemData"
  | "TimelineItemItems"
  | "WorkInProgress";

export interface $AssignedTask {
  EstimateTask?: EstimateTask;
  ProjectTask?: ProjectTask;
}

export interface $TimelineProject {
  Estimate?: Estimate;
  Project?: Project;
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}

export type MakeNullable<T> = {
  [K in keyof T]: T[K] | undefined;
};

export interface ScalarsEnums extends MakeNullable<Scalars> {}
