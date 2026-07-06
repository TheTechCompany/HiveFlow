import { gql } from '@apollo/client';

export const GET_TIMELINES = gql`
  query Timelines {
    timelines {
      id
      name
    }
  }
`;

export const GET_TIMELINE_DATA = gql`
  query TimelineData($timeline: String, $startDate: DateTime, $endDate: DateTime) {
    timelineItems(
      where: { timeline: $timeline, startDate_LTE: $endDate, endDate_GTE: $startDate }
    ) {
      id
      blocks {
        id
      }
      rank
      startDate
      endDate
      notes
      timeline
      project {
        id
        displayId
        name
      }
      estimate {
        id
        displayId
        name
      }
      data {
        item
        location
        quantity
      }
    }
  }
`;

export const GET_PROJECT_INFO = gql`
  query ProjectInfo {
    projects {
      id
      displayId
      name
    }
    estimates {
      id
      displayId
      name
      status
      date
      price
    }
  }
`;

export const CREATE_TIMELINE = gql`
  mutation CreateTimeline($input: TimelineInput!) {
    createTimeline(input: $input) {
      id
    }
  }
`;

export const CREATE_TIMELINE_ITEM = gql`
  mutation CreateTimelineItem($prev: ID, $input: TimelineItemInput) {
    createTimelineItem(prev: $prev, input: $input) {
      id
    }
  }
`;

export const DELETE_TIMELINE_ITEM = gql`
  mutation DeleteTimelineItem($id: ID!) {
    deleteTimelineItem(id: $id) {
      id
    }
  }
`;

export const UPDATE_TIMELINE_ITEM = gql`
  mutation UpdateTimelineItem($id: ID!, $input: TimelineItemInput!) {
    updateTimelineItem(id: $id, input: $input) {
      id
    }
  }
`;

export const UPDATE_TIMELINE_ITEM_ORDER = gql`
  mutation UpdateTimelineOrder($item: ID, $prev: ID, $next: ID) {
    updateTimelineItemOrder(id: $item, prev: $prev, next: $next) {
      id
    }
  }
`;

export const CREATE_TIMELINE_ITEM_DEPENDENCY = gql`
  mutation CreateDependency($source: ID, $target: ID) {
    createTimelineItemDependency(source: $source, target: $target) {
      id
    }
  }
`;

export const DELETE_TIMELINE_ITEM_DEPENDENCY = gql`
  mutation DeleteDependency($source: ID, $target: ID) {
    deleteTimelineItemDependency(source: $source, target: $target) {
      id
    }
  }
`;
