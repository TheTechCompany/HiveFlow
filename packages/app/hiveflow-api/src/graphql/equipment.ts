import { gql } from '@apollo/client';

export const GET_EQUIPMENT = gql`
  query GetEquipment {
    equipment {
      id
      displayId
      name
      registration
      status
    }
  }
`;

export const CREATE_EQUIPMENT = gql`
  mutation CreateEquipment($input: EquipmentInput!) {
    createEquipment(input: $input) {
      id
    }
  }
`;

export const UPDATE_EQUIPMENT = gql`
  mutation UpdateEquipment($id: ID!, $input: EquipmentInput!) {
    updateEquipment(id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_EQUIPMENT = gql`
  mutation DeleteEquipment($id: ID!) {
    deleteEquipment(id: $id) {
      id
    }
  }
`;
