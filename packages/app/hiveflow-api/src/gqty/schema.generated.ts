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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
}

export interface EquipmentInput {
  id?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  registration?: InputMaybe<Scalars["String"]>;
}

export interface EstimateInput {
  companyName?: InputMaybe<Scalars["String"]>;
  date?: InputMaybe<Scalars["DateTime"]>;
  id?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  price?: InputMaybe<Scalars["Float"]>;
  status?: InputMaybe<Scalars["String"]>;
}

export interface EstimateWhere {
  date_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_LTE?: InputMaybe<Scalars["DateTime"]>;
  displayId?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
}

export interface ProjectInput {
  endDate?: InputMaybe<Scalars["DateTime"]>;
  id?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  startDate?: InputMaybe<Scalars["DateTime"]>;
  status?: InputMaybe<Scalars["String"]>;
}

export interface ProjectTaskInput {
  description?: InputMaybe<Scalars["String"]>;
  endDate?: InputMaybe<Scalars["DateTime"]>;
  members?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  projectId: Scalars["String"];
  startDate?: InputMaybe<Scalars["DateTime"]>;
  status?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
}

export interface ProjectWhere {
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
  String: true,
  Upload: true,
};
export const generatedSchema = {
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
    id: { __type: "ID!" },
    name: { __type: "String" },
    organisation: { __type: "HiveOrganisation" },
    price: { __type: "Float" },
    status: { __type: "String" },
  },
  EstimateInput: {
    companyName: { __type: "String" },
    date: { __type: "DateTime" },
    id: { __type: "ID" },
    name: { __type: "String" },
    price: { __type: "Float" },
    status: { __type: "String" },
  },
  EstimateWhere: {
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
    createdBy: { __type: "HiveUser" },
    dependencyOf: { __type: "[ProjectTask]" },
    dependencyOn: { __type: "[ProjectTask]" },
    description: { __type: "String" },
    endDate: { __type: "DateTime" },
    id: { __type: "ID!" },
    lastUpdated: { __type: "DateTime" },
    members: { __type: "[HiveUser]" },
    project: { __type: "Project" },
    startDate: { __type: "DateTime" },
    status: { __type: "String" },
    title: { __type: "String" },
  },
  ProjectTaskInput: {
    description: { __type: "String" },
    endDate: { __type: "DateTime" },
    members: { __type: "[String]" },
    projectId: { __type: "String!" },
    startDate: { __type: "DateTime" },
    status: { __type: "String" },
    title: { __type: "String" },
  },
  ProjectWhere: {
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
    data: { __type: "[TimelineItemData]" },
    endDate: { __type: "DateTime" },
    estimate: { __type: "Estimate" },
    id: { __type: "ID" },
    items: { __type: "[TimelineItemItems]" },
    notes: { __type: "String" },
    organisation: { __type: "HiveOrganisation" },
    project: { __type: "Project" },
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
    createEquipment: {
      __type: "Equipment",
      __args: { input: "EquipmentInput" },
    },
    createEstimate: { __type: "Estimate", __args: { input: "EstimateInput" } },
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
      __args: { input: "TimelineItemInput" },
    },
    deleteEquipment: { __type: "Equipment", __args: { id: "ID!" } },
    deleteEstimate: { __type: "Estimate", __args: { id: "ID!" } },
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
    deleteTimeline: { __type: "Timeline", __args: { id: "ID" } },
    deleteTimelineItem: { __type: "TimelineItem", __args: { id: "ID" } },
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
    updateEquipment: {
      __type: "Equipment",
      __args: { id: "ID!", input: "EquipmentInput" },
    },
    updateEstimate: {
      __type: "Estimate",
      __args: { id: "ID!", input: "EstimateInput" },
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
    updateScheduleItem: {
      __type: "ScheduleItem",
      __args: { id: "ID", input: "ScheduleItemInput" },
    },
    updateTimeline: {
      __type: "Timeline",
      __args: { id: "ID", input: "TimelineInput" },
    },
    updateTimelineItem: {
      __type: "TimelineItem",
      __args: { id: "ID", input: "TimelineItemInput" },
    },
    uploadProjectFiles: {
      __type: "[File!]!",
      __args: { files: "[Upload]", path: "String", project: "ID!" },
    },
  },
  query: {
    __typename: { __type: "String!" },
    _sdl: { __type: "String!" },
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
    timelineItems: {
      __type: "[TimelineItem]",
      __args: { where: "TimelineItemWhere" },
    },
  },
  subscription: {},
  [SchemaUnionsKey]: { TimelineProject: ["Estimate", "Project"] },
} as const;

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
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  organisation?: Maybe<HiveOrganisation>;
  price?: Maybe<ScalarsEnums["Float"]>;
  status?: Maybe<ScalarsEnums["String"]>;
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
  createdBy?: Maybe<HiveUser>;
  dependencyOf?: Maybe<Array<Maybe<ProjectTask>>>;
  dependencyOn?: Maybe<Array<Maybe<ProjectTask>>>;
  description?: Maybe<ScalarsEnums["String"]>;
  endDate?: Maybe<ScalarsEnums["DateTime"]>;
  id: ScalarsEnums["ID"];
  lastUpdated?: Maybe<ScalarsEnums["DateTime"]>;
  members?: Maybe<Array<Maybe<HiveUser>>>;
  project?: Maybe<Project>;
  startDate?: Maybe<ScalarsEnums["DateTime"]>;
  status?: Maybe<ScalarsEnums["String"]>;
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

export interface Timeline {
  __typename?: "Timeline";
  id?: Maybe<ScalarsEnums["ID"]>;
  items?: Maybe<Array<Maybe<TimelineItem>>>;
  name?: Maybe<ScalarsEnums["String"]>;
  organisation?: Maybe<HiveOrganisation>;
}

export interface TimelineItem {
  __typename?: "TimelineItem";
  data?: Maybe<Array<Maybe<TimelineItemData>>>;
  endDate?: Maybe<ScalarsEnums["DateTime"]>;
  estimate?: Maybe<Estimate>;
  id?: Maybe<ScalarsEnums["ID"]>;
  items?: Maybe<Array<Maybe<TimelineItemItems>>>;
  notes?: Maybe<ScalarsEnums["String"]>;
  organisation?: Maybe<HiveOrganisation>;
  project?: Maybe<Project>;
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
  createEquipment: (args?: {
    input?: Maybe<EquipmentInput>;
  }) => Maybe<Equipment>;
  createEstimate: (args?: { input?: Maybe<EstimateInput> }) => Maybe<Estimate>;
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
  }) => Maybe<TimelineItem>;
  deleteEquipment: (args: { id: Scalars["ID"] }) => Maybe<Equipment>;
  deleteEstimate: (args: { id: Scalars["ID"] }) => Maybe<Estimate>;
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
  deleteTimeline: (args?: { id?: Maybe<Scalars["ID"]> }) => Maybe<Timeline>;
  deleteTimelineItem: (args?: {
    id?: Maybe<Scalars["ID"]>;
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
  updateEquipment: (args: {
    id: Scalars["ID"];
    input?: Maybe<EquipmentInput>;
  }) => Maybe<Equipment>;
  updateEstimate: (args: {
    id: Scalars["ID"];
    input?: Maybe<EstimateInput>;
  }) => Maybe<Estimate>;
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
  updateScheduleItem: (args?: {
    id?: Maybe<Scalars["ID"]>;
    input?: Maybe<ScheduleItemInput>;
  }) => Maybe<ScheduleItem>;
  updateTimeline: (args?: {
    id?: Maybe<Scalars["ID"]>;
    input?: Maybe<TimelineInput>;
  }) => Maybe<Timeline>;
  updateTimelineItem: (args?: {
    id?: Maybe<Scalars["ID"]>;
    input?: Maybe<TimelineItemInput>;
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
  timelineItems: (args?: {
    where?: Maybe<TimelineItemWhere>;
  }) => Maybe<Array<Maybe<TimelineItem>>>;
}

export interface Subscription {
  __typename?: "Subscription";
}

export interface SchemaObjectTypes {
  Equipment: Equipment;
  Estimate: Estimate;
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
  Subscription: Subscription;
  Timeline: Timeline;
  TimelineItem: TimelineItem;
  TimelineItemData: TimelineItemData;
  TimelineItemItems: TimelineItemItems;
  WorkInProgress: WorkInProgress;
}
export type SchemaObjectTypesNames =
  | "Equipment"
  | "Estimate"
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
  | "Subscription"
  | "Timeline"
  | "TimelineItem"
  | "TimelineItemData"
  | "TimelineItemItems"
  | "WorkInProgress";

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
