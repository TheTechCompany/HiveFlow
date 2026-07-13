import { gql } from '@apollo/client';

export const GET_PROJECT_FILES = gql`
  query GetProjectFiles($id: String, $path: String) {
    projects(where: { displayId: $id }) {
      files(path: $path) {
        id
        name
        url
        directory
        size
        lastUpdated: createdAt
      }
    }
  }
`;

export const CREATE_PROJECT_FOLDER = gql`
  mutation CreateProjectFolder($project: ID!, $path: String!) {
    createProjectFolder(project: $project, path: $path) {
      id
    }
  }
`;

export const MOVE_PROJECT_FILE = gql`
  mutation MoveProjectFile($project: ID!, $path: String!, $newPath: String!) {
    moveProjectFile(project: $project, path: $path, newPath: $newPath) {
      id
    }
  }
`;

export const DELETE_PROJECT_FILE = gql`
  mutation DeleteProjectFile($project: ID!, $path: String!) {
    deleteProjectFile(project: $project, path: $path) {
      id
    }
  }
`;

export const RENAME_PROJECT_FILE = gql`
  mutation RenameProjectFile($project: ID!, $path: String!, $newPath: String!) {
    renameProjectFile(project: $project, path: $path, newPath: $newPath) {
      id
    }
  }
`;

export const UPLOAD_PROJECT_FILES = gql`
  mutation UploadFile($project: ID!, $path: String, $files: [Upload]) {
    uploadProjectFiles(project: $project, path: $path, files: $files) {
      id
      name
    }
  }
`;
