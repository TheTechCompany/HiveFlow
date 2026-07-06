import { gql } from '@apollo/client';

export const GET_ESTIMATES = gql`
  query GetEstimates {
    estimates {
      id
      displayId
      name
      status
      price
    }
    users(active: true) {
      id
      name
    }
  }
`;

export const GET_ESTIMATE_SINGLE = gql`
  query EstimateSingle($displayId: String) {
    users(active: true) {
      id
      name
    }
    estimates(where: { displayId: $displayId }) {
      id
      displayId
      name
      status
      tasks {
        id
        title
        description
        startDate
        endDate
        status
        timelineRank
        columnRank
        members { id name }
        createdBy { id name }
        lastUpdated
        dependencyOn { id title status endDate }
        dependencyOf { id title status endDate }
        children { id title status }
        parent { id title status }
      }
      lineItems {
        id
        order
        item
        description
        price
        quantity
        amount
      }
    }
  }
`;

export const CREATE_ESTIMATE = gql`
  mutation CreateEstimate($input: EstimateInput!) {
    createEstimate(input: $input) {
      id
    }
  }
`;

export const UPDATE_ESTIMATE = gql`
  mutation UpdateEstimate($id: ID!, $input: EstimateInput!) {
    updateEstimate(id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_ESTIMATE = gql`
  mutation DeleteEstimate($id: ID!) {
    deleteEstimate(id: $id) {
      id
    }
  }
`;

export const UPDATE_ESTIMATE_TASK = gql`
  mutation UpdateEstimateTask($id: ID!, $input: EstimateTaskInput!) {
    updateEstimateTask(id: $id, input: $input) {
      id
    }
  }
`;

export const CREATE_ESTIMATE_TASK = gql`
  mutation CreateEstimateTask($input: EstimateTaskInput!) {
    createEstimateTask(input: $input) {
      id
      title
    }
  }
`;

export const DELETE_ESTIMATE_TASK = gql`
  mutation DeleteEstimateTask($id: ID!) {
    deleteEstimateTask(id: $id) {
      id
    }
  }
`;

export const CREATE_ESTIMATE_TASK_DEPENDENCY = gql`
  mutation CreateEstimateTaskDependency($estimate: ID, $source: ID, $target: ID) {
    createEstimateTaskDependency(estimate: $estimate, source: $source, target: $target) {
      id
    }
  }
`;

export const DELETE_ESTIMATE_TASK_DEPENDENCY = gql`
  mutation DeleteEstimateTaskDependency($estimate: ID, $source: ID, $target: ID) {
    deleteEstimateTaskDependency(estimate: $estimate, source: $source, target: $target) {
      id
    }
  }
`;

export const CREATE_ESTIMATE_LINE_ITEM = gql`
  mutation CreateEstimateLineItem($estimate: ID!, $input: EstimateLineItemInput!) {
    createEstimateLineItem(estimate: $estimate, input: $input) {
      id
    }
  }
`;

export const UPDATE_ESTIMATE_LINE_ITEM = gql`
  mutation UpdateEstimateLineItem($estimate: ID!, $id: ID!, $input: EstimateLineItemInput!) {
    updateEstimateLineItem(estimate: $estimate, id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_ESTIMATE_LINE_ITEM = gql`
  mutation DeleteEstimateLineItem($estimate: ID!, $id: ID!) {
    deleteEstimateLineItem(estimate: $estimate, id: $id) {
      id
    }
  }
`;

export const UPDATE_ESTIMATE_TASK_TIMELINE_ORDER = gql`
  mutation UpdateTimelineOrder($id: ID, $above: String, $below: String) {
    updateEstimateTaskTimelineOrder(id: $id, above: $above, below: $below) {
      id
    }
  }
`;
