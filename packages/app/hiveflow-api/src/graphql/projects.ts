import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      displayId
      name
      status
      description
      startDate
      endDate
    }
    users(active: true) {
      id
      name
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: String) {
    users(active: true) {
      id
      name
    }
    skills {
      skill
    }
    projects(where: { displayId: $id }) {
      id
      displayId
      name
      startDate
      endDate
      tasks {
        id
        title
        description
        startDate
        endDate
        status
        timelineRank
        columnRank
        members {
          id
          name
        }
        requiredSkills
        lastUpdated
        dependencyOn {
          id
          title
          status
          endDate
        }
        dependencyOf {
          id
          title
          status
          endDate
        }
        children {
          id
          title
          status
        }
        parent {
          id
          title
          status
        }
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: ProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;

export const UPDATE_PROJECT_TASK = gql`
  mutation UpdateProjectTask($id: ID!, $input: ProjectTaskInput!) {
    updateProjectTask(id: $id, input: $input) {
      id
    }
  }
`;

export const CREATE_PROJECT_TASK = gql`
  mutation CreateProjectTask($input: ProjectTaskInput!) {
    createProjectTask(input: $input) {
      id
      title
    }
  }
`;

export const DELETE_PROJECT_TASK = gql`
  mutation DeleteProjectTask($id: ID!) {
    deleteProjectTask(id: $id) {
      id
    }
  }
`;

export const CREATE_PROJECT_TASK_DEPENDENCY = gql`
  mutation CreateProjectTaskDependency($project: ID, $source: ID, $target: ID) {
    createProjectTaskDependency(project: $project, source: $source, target: $target) {
      id
    }
  }
`;

export const DELETE_PROJECT_TASK_DEPENDENCY = gql`
  mutation DeleteProjectTaskDependency($project: ID, $source: ID, $target: ID) {
    deleteProjectTaskDependency(project: $project, source: $source, target: $target) {
      id
    }
  }
`;

export const UPDATE_PROJECT_TASK_TIMELINE_ORDER = gql`
  mutation UpdateTimelineOrder($id: ID, $above: String, $below: String) {
    updateProjectTaskTimelineOrder(id: $id, above: $above, below: $below) {
      id
    }
  }
`;
