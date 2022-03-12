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
  /** A date and time, represented as an ISO-8601 string */
  DateTime: string;
}

export interface EquipmentConnectInput {
  organisation?: InputMaybe<EquipmentOrganisationConnectFieldInput>;
}

export interface EquipmentConnectOrCreateInput {
  organisation?: InputMaybe<EquipmentOrganisationConnectOrCreateFieldInput>;
}

export interface EquipmentConnectOrCreateWhere {
  node: EquipmentUniqueWhere;
}

export interface EquipmentConnectWhere {
  node: EquipmentWhere;
}

export interface EquipmentCreateInput {
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<EquipmentOrganisationFieldInput>;
  registration?: InputMaybe<Scalars["String"]>;
}

export interface EquipmentDeleteInput {
  organisation?: InputMaybe<EquipmentOrganisationDeleteFieldInput>;
}

export interface EquipmentDisconnectInput {
  organisation?: InputMaybe<EquipmentOrganisationDisconnectFieldInput>;
}

export interface EquipmentOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more EquipmentSort objects to sort Equipment by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<EquipmentSort>>>;
}

export interface EquipmentOrganisationAggregateInput {
  AND?: InputMaybe<Array<EquipmentOrganisationAggregateInput>>;
  OR?: InputMaybe<Array<EquipmentOrganisationAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<EquipmentOrganisationNodeAggregationWhereInput>;
}

export interface EquipmentOrganisationConnectFieldInput {
  connect?: InputMaybe<HiveOrganisationConnectInput>;
  where?: InputMaybe<HiveOrganisationConnectWhere>;
}

export interface EquipmentOrganisationConnectOrCreateFieldInput {
  onCreate: EquipmentOrganisationConnectOrCreateFieldInputOnCreate;
  where: HiveOrganisationConnectOrCreateWhere;
}

export interface EquipmentOrganisationConnectOrCreateFieldInputOnCreate {
  node: HiveOrganisationCreateInput;
}

export interface EquipmentOrganisationConnectionSort {
  node?: InputMaybe<HiveOrganisationSort>;
}

export interface EquipmentOrganisationConnectionWhere {
  AND?: InputMaybe<Array<EquipmentOrganisationConnectionWhere>>;
  OR?: InputMaybe<Array<EquipmentOrganisationConnectionWhere>>;
  node?: InputMaybe<HiveOrganisationWhere>;
  node_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface EquipmentOrganisationCreateFieldInput {
  node: HiveOrganisationCreateInput;
}

export interface EquipmentOrganisationDeleteFieldInput {
  delete?: InputMaybe<HiveOrganisationDeleteInput>;
  where?: InputMaybe<EquipmentOrganisationConnectionWhere>;
}

export interface EquipmentOrganisationDisconnectFieldInput {
  disconnect?: InputMaybe<HiveOrganisationDisconnectInput>;
  where?: InputMaybe<EquipmentOrganisationConnectionWhere>;
}

export interface EquipmentOrganisationFieldInput {
  connect?: InputMaybe<EquipmentOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<EquipmentOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<EquipmentOrganisationCreateFieldInput>;
}

export interface EquipmentOrganisationNodeAggregationWhereInput {
  AND?: InputMaybe<Array<EquipmentOrganisationNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<EquipmentOrganisationNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface EquipmentOrganisationUpdateConnectionInput {
  node?: InputMaybe<HiveOrganisationUpdateInput>;
}

export interface EquipmentOrganisationUpdateFieldInput {
  connect?: InputMaybe<EquipmentOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<EquipmentOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<EquipmentOrganisationCreateFieldInput>;
  delete?: InputMaybe<EquipmentOrganisationDeleteFieldInput>;
  disconnect?: InputMaybe<EquipmentOrganisationDisconnectFieldInput>;
  update?: InputMaybe<EquipmentOrganisationUpdateConnectionInput>;
  where?: InputMaybe<EquipmentOrganisationConnectionWhere>;
}

export interface EquipmentRelationInput {
  organisation?: InputMaybe<EquipmentOrganisationCreateFieldInput>;
}

/** Fields to sort Equipment by. The order in which sorts are applied is not guaranteed when specifying many fields in one EquipmentSort object. */
export interface EquipmentSort {
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  registration?: InputMaybe<SortDirection>;
}

export interface EquipmentUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface EquipmentUpdateInput {
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<EquipmentOrganisationUpdateFieldInput>;
  registration?: InputMaybe<Scalars["String"]>;
}

export interface EquipmentWhere {
  AND?: InputMaybe<Array<EquipmentWhere>>;
  OR?: InputMaybe<Array<EquipmentWhere>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveOrganisationWhere>;
  organisationAggregate?: InputMaybe<EquipmentOrganisationAggregateInput>;
  organisationConnection?: InputMaybe<EquipmentOrganisationConnectionWhere>;
  organisationConnection_NOT?: InputMaybe<EquipmentOrganisationConnectionWhere>;
  organisation_NOT?: InputMaybe<HiveOrganisationWhere>;
  registration?: InputMaybe<Scalars["String"]>;
  registration_CONTAINS?: InputMaybe<Scalars["String"]>;
  registration_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  registration_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  registration_NOT?: InputMaybe<Scalars["String"]>;
  registration_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  registration_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  registration_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  registration_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  registration_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

export interface EstimateConnectInput {
  organisation?: InputMaybe<EstimateOrganisationConnectFieldInput>;
}

export interface EstimateConnectOrCreateInput {
  organisation?: InputMaybe<EstimateOrganisationConnectOrCreateFieldInput>;
}

export interface EstimateConnectOrCreateWhere {
  node: EstimateUniqueWhere;
}

export interface EstimateConnectWhere {
  node: EstimateWhere;
}

export interface EstimateCreateInput {
  date?: InputMaybe<Scalars["DateTime"]>;
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<EstimateOrganisationFieldInput>;
  price?: InputMaybe<Scalars["Float"]>;
  status?: InputMaybe<Scalars["String"]>;
}

export interface EstimateDeleteInput {
  organisation?: InputMaybe<EstimateOrganisationDeleteFieldInput>;
}

export interface EstimateDisconnectInput {
  organisation?: InputMaybe<EstimateOrganisationDisconnectFieldInput>;
}

export interface EstimateOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more EstimateSort objects to sort Estimates by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<EstimateSort>>>;
}

export interface EstimateOrganisationAggregateInput {
  AND?: InputMaybe<Array<EstimateOrganisationAggregateInput>>;
  OR?: InputMaybe<Array<EstimateOrganisationAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<EstimateOrganisationNodeAggregationWhereInput>;
}

export interface EstimateOrganisationConnectFieldInput {
  connect?: InputMaybe<HiveOrganisationConnectInput>;
  where?: InputMaybe<HiveOrganisationConnectWhere>;
}

export interface EstimateOrganisationConnectOrCreateFieldInput {
  onCreate: EstimateOrganisationConnectOrCreateFieldInputOnCreate;
  where: HiveOrganisationConnectOrCreateWhere;
}

export interface EstimateOrganisationConnectOrCreateFieldInputOnCreate {
  node: HiveOrganisationCreateInput;
}

export interface EstimateOrganisationConnectionSort {
  node?: InputMaybe<HiveOrganisationSort>;
}

export interface EstimateOrganisationConnectionWhere {
  AND?: InputMaybe<Array<EstimateOrganisationConnectionWhere>>;
  OR?: InputMaybe<Array<EstimateOrganisationConnectionWhere>>;
  node?: InputMaybe<HiveOrganisationWhere>;
  node_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface EstimateOrganisationCreateFieldInput {
  node: HiveOrganisationCreateInput;
}

export interface EstimateOrganisationDeleteFieldInput {
  delete?: InputMaybe<HiveOrganisationDeleteInput>;
  where?: InputMaybe<EstimateOrganisationConnectionWhere>;
}

export interface EstimateOrganisationDisconnectFieldInput {
  disconnect?: InputMaybe<HiveOrganisationDisconnectInput>;
  where?: InputMaybe<EstimateOrganisationConnectionWhere>;
}

export interface EstimateOrganisationFieldInput {
  connect?: InputMaybe<EstimateOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<EstimateOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<EstimateOrganisationCreateFieldInput>;
}

export interface EstimateOrganisationNodeAggregationWhereInput {
  AND?: InputMaybe<Array<EstimateOrganisationNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<EstimateOrganisationNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface EstimateOrganisationUpdateConnectionInput {
  node?: InputMaybe<HiveOrganisationUpdateInput>;
}

export interface EstimateOrganisationUpdateFieldInput {
  connect?: InputMaybe<EstimateOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<EstimateOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<EstimateOrganisationCreateFieldInput>;
  delete?: InputMaybe<EstimateOrganisationDeleteFieldInput>;
  disconnect?: InputMaybe<EstimateOrganisationDisconnectFieldInput>;
  update?: InputMaybe<EstimateOrganisationUpdateConnectionInput>;
  where?: InputMaybe<EstimateOrganisationConnectionWhere>;
}

export interface EstimateRelationInput {
  organisation?: InputMaybe<EstimateOrganisationCreateFieldInput>;
}

/** Fields to sort Estimates by. The order in which sorts are applied is not guaranteed when specifying many fields in one EstimateSort object. */
export interface EstimateSort {
  date?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  price?: InputMaybe<SortDirection>;
  status?: InputMaybe<SortDirection>;
}

export interface EstimateUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface EstimateUpdateInput {
  date?: InputMaybe<Scalars["DateTime"]>;
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<EstimateOrganisationUpdateFieldInput>;
  price?: InputMaybe<Scalars["Float"]>;
  status?: InputMaybe<Scalars["String"]>;
}

export interface EstimateWhere {
  AND?: InputMaybe<Array<EstimateWhere>>;
  OR?: InputMaybe<Array<EstimateWhere>>;
  date?: InputMaybe<Scalars["DateTime"]>;
  date_GT?: InputMaybe<Scalars["DateTime"]>;
  date_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  date_LT?: InputMaybe<Scalars["DateTime"]>;
  date_LTE?: InputMaybe<Scalars["DateTime"]>;
  date_NOT?: InputMaybe<Scalars["DateTime"]>;
  date_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveOrganisationWhere>;
  organisationAggregate?: InputMaybe<EstimateOrganisationAggregateInput>;
  organisationConnection?: InputMaybe<EstimateOrganisationConnectionWhere>;
  organisationConnection_NOT?: InputMaybe<EstimateOrganisationConnectionWhere>;
  organisation_NOT?: InputMaybe<HiveOrganisationWhere>;
  price?: InputMaybe<Scalars["Float"]>;
  price_GT?: InputMaybe<Scalars["Float"]>;
  price_GTE?: InputMaybe<Scalars["Float"]>;
  price_IN?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
  price_LT?: InputMaybe<Scalars["Float"]>;
  price_LTE?: InputMaybe<Scalars["Float"]>;
  price_NOT?: InputMaybe<Scalars["Float"]>;
  price_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
  status?: InputMaybe<Scalars["String"]>;
  status_CONTAINS?: InputMaybe<Scalars["String"]>;
  status_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  status_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  status_NOT?: InputMaybe<Scalars["String"]>;
  status_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  status_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  status_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  status_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  status_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

export interface HiveApplianceConnectInput {
  permissions?: InputMaybe<Array<HiveAppliancePermissionsConnectFieldInput>>;
  services?: InputMaybe<Array<HiveApplianceServicesConnectFieldInput>>;
  types?: InputMaybe<Array<HiveApplianceTypesConnectFieldInput>>;
}

export interface HiveApplianceConnectOrCreateInput {
  permissions?: InputMaybe<
    Array<HiveAppliancePermissionsConnectOrCreateFieldInput>
  >;
  types?: InputMaybe<Array<HiveApplianceTypesConnectOrCreateFieldInput>>;
}

export interface HiveApplianceConnectOrCreateWhere {
  node: HiveApplianceUniqueWhere;
}

export interface HiveApplianceConnectWhere {
  node: HiveApplianceWhere;
}

export interface HiveApplianceCreateInput {
  description?: InputMaybe<Scalars["String"]>;
  label?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
  permissions?: InputMaybe<HiveAppliancePermissionsFieldInput>;
  services?: InputMaybe<HiveApplianceServicesFieldInput>;
  types?: InputMaybe<HiveApplianceTypesFieldInput>;
}

export interface HiveApplianceDeleteInput {
  permissions?: InputMaybe<Array<HiveAppliancePermissionsDeleteFieldInput>>;
  services?: InputMaybe<Array<HiveApplianceServicesDeleteFieldInput>>;
  types?: InputMaybe<Array<HiveApplianceTypesDeleteFieldInput>>;
}

export interface HiveApplianceDisconnectInput {
  permissions?: InputMaybe<Array<HiveAppliancePermissionsDisconnectFieldInput>>;
  services?: InputMaybe<Array<HiveApplianceServicesDisconnectFieldInput>>;
  types?: InputMaybe<Array<HiveApplianceTypesDisconnectFieldInput>>;
}

export interface HiveApplianceOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more HiveApplianceSort objects to sort HiveAppliances by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<HiveApplianceSort>>>;
}

export interface HiveAppliancePermissionsAggregateInput {
  AND?: InputMaybe<Array<HiveAppliancePermissionsAggregateInput>>;
  OR?: InputMaybe<Array<HiveAppliancePermissionsAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveAppliancePermissionsNodeAggregationWhereInput>;
}

export interface HiveAppliancePermissionsConnectFieldInput {
  connect?: InputMaybe<Array<PermissionConnectInput>>;
  where?: InputMaybe<PermissionConnectWhere>;
}

export interface HiveAppliancePermissionsConnectOrCreateFieldInput {
  onCreate: HiveAppliancePermissionsConnectOrCreateFieldInputOnCreate;
  where: PermissionConnectOrCreateWhere;
}

export interface HiveAppliancePermissionsConnectOrCreateFieldInputOnCreate {
  node: PermissionCreateInput;
}

export interface HiveAppliancePermissionsConnectionSort {
  node?: InputMaybe<PermissionSort>;
}

export interface HiveAppliancePermissionsConnectionWhere {
  AND?: InputMaybe<Array<HiveAppliancePermissionsConnectionWhere>>;
  OR?: InputMaybe<Array<HiveAppliancePermissionsConnectionWhere>>;
  node?: InputMaybe<PermissionWhere>;
  node_NOT?: InputMaybe<PermissionWhere>;
}

export interface HiveAppliancePermissionsCreateFieldInput {
  node: PermissionCreateInput;
}

export interface HiveAppliancePermissionsDeleteFieldInput {
  delete?: InputMaybe<PermissionDeleteInput>;
  where?: InputMaybe<HiveAppliancePermissionsConnectionWhere>;
}

export interface HiveAppliancePermissionsDisconnectFieldInput {
  disconnect?: InputMaybe<PermissionDisconnectInput>;
  where?: InputMaybe<HiveAppliancePermissionsConnectionWhere>;
}

export interface HiveAppliancePermissionsFieldInput {
  connect?: InputMaybe<Array<HiveAppliancePermissionsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveAppliancePermissionsConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveAppliancePermissionsCreateFieldInput>>;
}

export interface HiveAppliancePermissionsNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveAppliancePermissionsNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveAppliancePermissionsNodeAggregationWhereInput>>;
  action_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  action_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  action_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  action_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  action_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  action_EQUAL?: InputMaybe<Scalars["String"]>;
  action_GT?: InputMaybe<Scalars["Int"]>;
  action_GTE?: InputMaybe<Scalars["Int"]>;
  action_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  action_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  action_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  action_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  action_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  action_LT?: InputMaybe<Scalars["Int"]>;
  action_LTE?: InputMaybe<Scalars["Int"]>;
  action_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  action_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  action_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  action_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  action_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  scope_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  scope_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  scope_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  scope_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  scope_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  scope_EQUAL?: InputMaybe<Scalars["String"]>;
  scope_GT?: InputMaybe<Scalars["Int"]>;
  scope_GTE?: InputMaybe<Scalars["Int"]>;
  scope_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  scope_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  scope_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  scope_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  scope_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  scope_LT?: InputMaybe<Scalars["Int"]>;
  scope_LTE?: InputMaybe<Scalars["Int"]>;
  scope_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  scope_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  scope_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  scope_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  scope_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveAppliancePermissionsUpdateConnectionInput {
  node?: InputMaybe<PermissionUpdateInput>;
}

export interface HiveAppliancePermissionsUpdateFieldInput {
  connect?: InputMaybe<Array<HiveAppliancePermissionsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveAppliancePermissionsConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveAppliancePermissionsCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveAppliancePermissionsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveAppliancePermissionsDisconnectFieldInput>>;
  update?: InputMaybe<HiveAppliancePermissionsUpdateConnectionInput>;
  where?: InputMaybe<HiveAppliancePermissionsConnectionWhere>;
}

export interface HiveApplianceRelationInput {
  permissions?: InputMaybe<Array<HiveAppliancePermissionsCreateFieldInput>>;
  services?: InputMaybe<Array<HiveApplianceServicesCreateFieldInput>>;
  types?: InputMaybe<Array<HiveApplianceTypesCreateFieldInput>>;
}

export interface HiveApplianceServicesAggregateInput {
  AND?: InputMaybe<Array<HiveApplianceServicesAggregateInput>>;
  OR?: InputMaybe<Array<HiveApplianceServicesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveApplianceServicesNodeAggregationWhereInput>;
}

export interface HiveApplianceServicesConnectFieldInput {
  where?: InputMaybe<HiveServiceConnectWhere>;
}

export interface HiveApplianceServicesConnectionSort {
  node?: InputMaybe<HiveServiceSort>;
}

export interface HiveApplianceServicesConnectionWhere {
  AND?: InputMaybe<Array<HiveApplianceServicesConnectionWhere>>;
  OR?: InputMaybe<Array<HiveApplianceServicesConnectionWhere>>;
  node?: InputMaybe<HiveServiceWhere>;
  node_NOT?: InputMaybe<HiveServiceWhere>;
}

export interface HiveApplianceServicesCreateFieldInput {
  node: HiveServiceCreateInput;
}

export interface HiveApplianceServicesDeleteFieldInput {
  where?: InputMaybe<HiveApplianceServicesConnectionWhere>;
}

export interface HiveApplianceServicesDisconnectFieldInput {
  where?: InputMaybe<HiveApplianceServicesConnectionWhere>;
}

export interface HiveApplianceServicesFieldInput {
  connect?: InputMaybe<Array<HiveApplianceServicesConnectFieldInput>>;
  create?: InputMaybe<Array<HiveApplianceServicesCreateFieldInput>>;
}

export interface HiveApplianceServicesNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveApplianceServicesNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveApplianceServicesNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveApplianceServicesUpdateConnectionInput {
  node?: InputMaybe<HiveServiceUpdateInput>;
}

export interface HiveApplianceServicesUpdateFieldInput {
  connect?: InputMaybe<Array<HiveApplianceServicesConnectFieldInput>>;
  create?: InputMaybe<Array<HiveApplianceServicesCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveApplianceServicesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveApplianceServicesDisconnectFieldInput>>;
  update?: InputMaybe<HiveApplianceServicesUpdateConnectionInput>;
  where?: InputMaybe<HiveApplianceServicesConnectionWhere>;
}

/** Fields to sort HiveAppliances by. The order in which sorts are applied is not guaranteed when specifying many fields in one HiveApplianceSort object. */
export interface HiveApplianceSort {
  description?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  label?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
}

export interface HiveApplianceTypesAggregateInput {
  AND?: InputMaybe<Array<HiveApplianceTypesAggregateInput>>;
  OR?: InputMaybe<Array<HiveApplianceTypesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveApplianceTypesNodeAggregationWhereInput>;
}

export interface HiveApplianceTypesConnectFieldInput {
  connect?: InputMaybe<Array<HiveTypeConnectInput>>;
  where?: InputMaybe<HiveTypeConnectWhere>;
}

export interface HiveApplianceTypesConnectOrCreateFieldInput {
  onCreate: HiveApplianceTypesConnectOrCreateFieldInputOnCreate;
  where: HiveTypeConnectOrCreateWhere;
}

export interface HiveApplianceTypesConnectOrCreateFieldInputOnCreate {
  node: HiveTypeCreateInput;
}

export interface HiveApplianceTypesConnectionSort {
  node?: InputMaybe<HiveTypeSort>;
}

export interface HiveApplianceTypesConnectionWhere {
  AND?: InputMaybe<Array<HiveApplianceTypesConnectionWhere>>;
  OR?: InputMaybe<Array<HiveApplianceTypesConnectionWhere>>;
  node?: InputMaybe<HiveTypeWhere>;
  node_NOT?: InputMaybe<HiveTypeWhere>;
}

export interface HiveApplianceTypesCreateFieldInput {
  node: HiveTypeCreateInput;
}

export interface HiveApplianceTypesDeleteFieldInput {
  delete?: InputMaybe<HiveTypeDeleteInput>;
  where?: InputMaybe<HiveApplianceTypesConnectionWhere>;
}

export interface HiveApplianceTypesDisconnectFieldInput {
  disconnect?: InputMaybe<HiveTypeDisconnectInput>;
  where?: InputMaybe<HiveApplianceTypesConnectionWhere>;
}

export interface HiveApplianceTypesFieldInput {
  connect?: InputMaybe<Array<HiveApplianceTypesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveApplianceTypesConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveApplianceTypesCreateFieldInput>>;
}

export interface HiveApplianceTypesNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveApplianceTypesNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveApplianceTypesNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveApplianceTypesUpdateConnectionInput {
  node?: InputMaybe<HiveTypeUpdateInput>;
}

export interface HiveApplianceTypesUpdateFieldInput {
  connect?: InputMaybe<Array<HiveApplianceTypesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveApplianceTypesConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveApplianceTypesCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveApplianceTypesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveApplianceTypesDisconnectFieldInput>>;
  update?: InputMaybe<HiveApplianceTypesUpdateConnectionInput>;
  where?: InputMaybe<HiveApplianceTypesConnectionWhere>;
}

export interface HiveApplianceUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface HiveApplianceUpdateInput {
  description?: InputMaybe<Scalars["String"]>;
  label?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  permissions?: InputMaybe<Array<HiveAppliancePermissionsUpdateFieldInput>>;
  services?: InputMaybe<Array<HiveApplianceServicesUpdateFieldInput>>;
  types?: InputMaybe<Array<HiveApplianceTypesUpdateFieldInput>>;
}

export interface HiveApplianceWhere {
  AND?: InputMaybe<Array<HiveApplianceWhere>>;
  OR?: InputMaybe<Array<HiveApplianceWhere>>;
  description?: InputMaybe<Scalars["String"]>;
  description_CONTAINS?: InputMaybe<Scalars["String"]>;
  description_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  description_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  description_NOT?: InputMaybe<Scalars["String"]>;
  description_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  description_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  description_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  description_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  description_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  label?: InputMaybe<Scalars["String"]>;
  label_CONTAINS?: InputMaybe<Scalars["String"]>;
  label_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  label_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  label_NOT?: InputMaybe<Scalars["String"]>;
  label_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  label_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  label_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  label_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  label_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  permissions?: InputMaybe<PermissionWhere>;
  permissionsAggregate?: InputMaybe<HiveAppliancePermissionsAggregateInput>;
  permissionsConnection?: InputMaybe<HiveAppliancePermissionsConnectionWhere>;
  permissionsConnection_NOT?: InputMaybe<HiveAppliancePermissionsConnectionWhere>;
  permissions_NOT?: InputMaybe<PermissionWhere>;
  services?: InputMaybe<HiveServiceWhere>;
  servicesAggregate?: InputMaybe<HiveApplianceServicesAggregateInput>;
  servicesConnection?: InputMaybe<HiveApplianceServicesConnectionWhere>;
  servicesConnection_NOT?: InputMaybe<HiveApplianceServicesConnectionWhere>;
  services_NOT?: InputMaybe<HiveServiceWhere>;
  types?: InputMaybe<HiveTypeWhere>;
  typesAggregate?: InputMaybe<HiveApplianceTypesAggregateInput>;
  typesConnection?: InputMaybe<HiveApplianceTypesConnectionWhere>;
  typesConnection_NOT?: InputMaybe<HiveApplianceTypesConnectionWhere>;
  types_NOT?: InputMaybe<HiveTypeWhere>;
}

export interface HiveIntegrationConnectOrCreateWhere {
  node: HiveIntegrationUniqueWhere;
}

export interface HiveIntegrationConnectWhere {
  node: HiveIntegrationWhere;
}

export interface HiveIntegrationCreateInput {
  description?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
}

export interface HiveIntegrationInstanceAppliancesAggregateInput {
  AND?: InputMaybe<Array<HiveIntegrationInstanceAppliancesAggregateInput>>;
  OR?: InputMaybe<Array<HiveIntegrationInstanceAppliancesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveIntegrationInstanceAppliancesNodeAggregationWhereInput>;
}

export interface HiveIntegrationInstanceAppliancesConnectFieldInput {
  connect?: InputMaybe<Array<HiveApplianceConnectInput>>;
  where?: InputMaybe<HiveApplianceConnectWhere>;
}

export interface HiveIntegrationInstanceAppliancesConnectOrCreateFieldInput {
  onCreate: HiveIntegrationInstanceAppliancesConnectOrCreateFieldInputOnCreate;
  where: HiveApplianceConnectOrCreateWhere;
}

export interface HiveIntegrationInstanceAppliancesConnectOrCreateFieldInputOnCreate {
  node: HiveApplianceCreateInput;
}

export interface HiveIntegrationInstanceAppliancesConnectionSort {
  node?: InputMaybe<HiveApplianceSort>;
}

export interface HiveIntegrationInstanceAppliancesConnectionWhere {
  AND?: InputMaybe<Array<HiveIntegrationInstanceAppliancesConnectionWhere>>;
  OR?: InputMaybe<Array<HiveIntegrationInstanceAppliancesConnectionWhere>>;
  node?: InputMaybe<HiveApplianceWhere>;
  node_NOT?: InputMaybe<HiveApplianceWhere>;
}

export interface HiveIntegrationInstanceAppliancesCreateFieldInput {
  node: HiveApplianceCreateInput;
}

export interface HiveIntegrationInstanceAppliancesDeleteFieldInput {
  delete?: InputMaybe<HiveApplianceDeleteInput>;
  where?: InputMaybe<HiveIntegrationInstanceAppliancesConnectionWhere>;
}

export interface HiveIntegrationInstanceAppliancesDisconnectFieldInput {
  disconnect?: InputMaybe<HiveApplianceDisconnectInput>;
  where?: InputMaybe<HiveIntegrationInstanceAppliancesConnectionWhere>;
}

export interface HiveIntegrationInstanceAppliancesFieldInput {
  connect?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesConnectFieldInput>
  >;
  connectOrCreate?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveIntegrationInstanceAppliancesCreateFieldInput>>;
}

export interface HiveIntegrationInstanceAppliancesNodeAggregationWhereInput {
  AND?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesNodeAggregationWhereInput>
  >;
  description_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  description_EQUAL?: InputMaybe<Scalars["String"]>;
  description_GT?: InputMaybe<Scalars["Int"]>;
  description_GTE?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  description_LT?: InputMaybe<Scalars["Int"]>;
  description_LTE?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  label_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  label_EQUAL?: InputMaybe<Scalars["String"]>;
  label_GT?: InputMaybe<Scalars["Int"]>;
  label_GTE?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  label_LT?: InputMaybe<Scalars["Int"]>;
  label_LTE?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveIntegrationInstanceAppliancesUpdateConnectionInput {
  node?: InputMaybe<HiveApplianceUpdateInput>;
}

export interface HiveIntegrationInstanceAppliancesUpdateFieldInput {
  connect?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesConnectFieldInput>
  >;
  connectOrCreate?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveIntegrationInstanceAppliancesCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveIntegrationInstanceAppliancesDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesDisconnectFieldInput>
  >;
  update?: InputMaybe<HiveIntegrationInstanceAppliancesUpdateConnectionInput>;
  where?: InputMaybe<HiveIntegrationInstanceAppliancesConnectionWhere>;
}

export interface HiveIntegrationInstanceConnectInput {
  appliances?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesConnectFieldInput>
  >;
  connections?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsConnectFieldInput>
  >;
  integration?: InputMaybe<HiveIntegrationInstanceIntegrationConnectFieldInput>;
  organisation?: InputMaybe<HiveIntegrationInstanceOrganisationConnectFieldInput>;
}

export interface HiveIntegrationInstanceConnectOrCreateInput {
  appliances?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesConnectOrCreateFieldInput>
  >;
  connections?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsConnectOrCreateFieldInput>
  >;
  integration?: InputMaybe<HiveIntegrationInstanceIntegrationConnectOrCreateFieldInput>;
  organisation?: InputMaybe<HiveIntegrationInstanceOrganisationConnectOrCreateFieldInput>;
}

export interface HiveIntegrationInstanceConnectOrCreateWhere {
  node: HiveIntegrationInstanceUniqueWhere;
}

export interface HiveIntegrationInstanceConnectWhere {
  node: HiveIntegrationInstanceWhere;
}

export interface HiveIntegrationInstanceConnectionsAggregateInput {
  AND?: InputMaybe<Array<HiveIntegrationInstanceConnectionsAggregateInput>>;
  OR?: InputMaybe<Array<HiveIntegrationInstanceConnectionsAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveIntegrationInstanceConnectionsNodeAggregationWhereInput>;
}

export interface HiveIntegrationInstanceConnectionsConnectFieldInput {
  connect?: InputMaybe<Array<HiveIntegrationPathConnectInput>>;
  where?: InputMaybe<HiveIntegrationPathConnectWhere>;
}

export interface HiveIntegrationInstanceConnectionsConnectOrCreateFieldInput {
  onCreate: HiveIntegrationInstanceConnectionsConnectOrCreateFieldInputOnCreate;
  where: HiveIntegrationPathConnectOrCreateWhere;
}

export interface HiveIntegrationInstanceConnectionsConnectOrCreateFieldInputOnCreate {
  node: HiveIntegrationPathCreateInput;
}

export interface HiveIntegrationInstanceConnectionsConnectionSort {
  node?: InputMaybe<HiveIntegrationPathSort>;
}

export interface HiveIntegrationInstanceConnectionsConnectionWhere {
  AND?: InputMaybe<Array<HiveIntegrationInstanceConnectionsConnectionWhere>>;
  OR?: InputMaybe<Array<HiveIntegrationInstanceConnectionsConnectionWhere>>;
  node?: InputMaybe<HiveIntegrationPathWhere>;
  node_NOT?: InputMaybe<HiveIntegrationPathWhere>;
}

export interface HiveIntegrationInstanceConnectionsCreateFieldInput {
  node: HiveIntegrationPathCreateInput;
}

export interface HiveIntegrationInstanceConnectionsDeleteFieldInput {
  delete?: InputMaybe<HiveIntegrationPathDeleteInput>;
  where?: InputMaybe<HiveIntegrationInstanceConnectionsConnectionWhere>;
}

export interface HiveIntegrationInstanceConnectionsDisconnectFieldInput {
  disconnect?: InputMaybe<HiveIntegrationPathDisconnectInput>;
  where?: InputMaybe<HiveIntegrationInstanceConnectionsConnectionWhere>;
}

export interface HiveIntegrationInstanceConnectionsFieldInput {
  connect?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsConnectFieldInput>
  >;
  connectOrCreate?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsCreateFieldInput>
  >;
}

export interface HiveIntegrationInstanceConnectionsNodeAggregationWhereInput {
  AND?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsNodeAggregationWhereInput>
  >;
  connectionBlob_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  connectionBlob_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  connectionBlob_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  connectionBlob_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  connectionBlob_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  connectionBlob_EQUAL?: InputMaybe<Scalars["String"]>;
  connectionBlob_GT?: InputMaybe<Scalars["Int"]>;
  connectionBlob_GTE?: InputMaybe<Scalars["Int"]>;
  connectionBlob_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  connectionBlob_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  connectionBlob_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  connectionBlob_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  connectionBlob_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  connectionBlob_LT?: InputMaybe<Scalars["Int"]>;
  connectionBlob_LTE?: InputMaybe<Scalars["Int"]>;
  connectionBlob_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  connectionBlob_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  connectionBlob_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  connectionBlob_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  connectionBlob_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  type_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  type_EQUAL?: InputMaybe<Scalars["String"]>;
  type_GT?: InputMaybe<Scalars["Int"]>;
  type_GTE?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  type_LT?: InputMaybe<Scalars["Int"]>;
  type_LTE?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveIntegrationInstanceConnectionsUpdateConnectionInput {
  node?: InputMaybe<HiveIntegrationPathUpdateInput>;
}

export interface HiveIntegrationInstanceConnectionsUpdateFieldInput {
  connect?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsConnectFieldInput>
  >;
  connectOrCreate?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsCreateFieldInput>
  >;
  delete?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsDeleteFieldInput>
  >;
  disconnect?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsDisconnectFieldInput>
  >;
  update?: InputMaybe<HiveIntegrationInstanceConnectionsUpdateConnectionInput>;
  where?: InputMaybe<HiveIntegrationInstanceConnectionsConnectionWhere>;
}

export interface HiveIntegrationInstanceCreateInput {
  appliances?: InputMaybe<HiveIntegrationInstanceAppliancesFieldInput>;
  config?: InputMaybe<Scalars["String"]>;
  connections?: InputMaybe<HiveIntegrationInstanceConnectionsFieldInput>;
  integration?: InputMaybe<HiveIntegrationInstanceIntegrationFieldInput>;
  isRunning?: InputMaybe<Scalars["Boolean"]>;
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveIntegrationInstanceOrganisationFieldInput>;
}

export interface HiveIntegrationInstanceDeleteInput {
  appliances?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesDeleteFieldInput>
  >;
  connections?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsDeleteFieldInput>
  >;
  integration?: InputMaybe<HiveIntegrationInstanceIntegrationDeleteFieldInput>;
  organisation?: InputMaybe<HiveIntegrationInstanceOrganisationDeleteFieldInput>;
}

export interface HiveIntegrationInstanceDisconnectInput {
  appliances?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesDisconnectFieldInput>
  >;
  connections?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsDisconnectFieldInput>
  >;
  integration?: InputMaybe<HiveIntegrationInstanceIntegrationDisconnectFieldInput>;
  organisation?: InputMaybe<HiveIntegrationInstanceOrganisationDisconnectFieldInput>;
}

export interface HiveIntegrationInstanceIntegrationAggregateInput {
  AND?: InputMaybe<Array<HiveIntegrationInstanceIntegrationAggregateInput>>;
  OR?: InputMaybe<Array<HiveIntegrationInstanceIntegrationAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveIntegrationInstanceIntegrationNodeAggregationWhereInput>;
}

export interface HiveIntegrationInstanceIntegrationConnectFieldInput {
  where?: InputMaybe<HiveIntegrationConnectWhere>;
}

export interface HiveIntegrationInstanceIntegrationConnectOrCreateFieldInput {
  onCreate: HiveIntegrationInstanceIntegrationConnectOrCreateFieldInputOnCreate;
  where: HiveIntegrationConnectOrCreateWhere;
}

export interface HiveIntegrationInstanceIntegrationConnectOrCreateFieldInputOnCreate {
  node: HiveIntegrationCreateInput;
}

export interface HiveIntegrationInstanceIntegrationConnectionSort {
  node?: InputMaybe<HiveIntegrationSort>;
}

export interface HiveIntegrationInstanceIntegrationConnectionWhere {
  AND?: InputMaybe<Array<HiveIntegrationInstanceIntegrationConnectionWhere>>;
  OR?: InputMaybe<Array<HiveIntegrationInstanceIntegrationConnectionWhere>>;
  node?: InputMaybe<HiveIntegrationWhere>;
  node_NOT?: InputMaybe<HiveIntegrationWhere>;
}

export interface HiveIntegrationInstanceIntegrationCreateFieldInput {
  node: HiveIntegrationCreateInput;
}

export interface HiveIntegrationInstanceIntegrationDeleteFieldInput {
  where?: InputMaybe<HiveIntegrationInstanceIntegrationConnectionWhere>;
}

export interface HiveIntegrationInstanceIntegrationDisconnectFieldInput {
  where?: InputMaybe<HiveIntegrationInstanceIntegrationConnectionWhere>;
}

export interface HiveIntegrationInstanceIntegrationFieldInput {
  connect?: InputMaybe<HiveIntegrationInstanceIntegrationConnectFieldInput>;
  connectOrCreate?: InputMaybe<HiveIntegrationInstanceIntegrationConnectOrCreateFieldInput>;
  create?: InputMaybe<HiveIntegrationInstanceIntegrationCreateFieldInput>;
}

export interface HiveIntegrationInstanceIntegrationNodeAggregationWhereInput {
  AND?: InputMaybe<
    Array<HiveIntegrationInstanceIntegrationNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<
    Array<HiveIntegrationInstanceIntegrationNodeAggregationWhereInput>
  >;
  description_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  description_EQUAL?: InputMaybe<Scalars["String"]>;
  description_GT?: InputMaybe<Scalars["Int"]>;
  description_GTE?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  description_LT?: InputMaybe<Scalars["Int"]>;
  description_LTE?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveIntegrationInstanceIntegrationUpdateConnectionInput {
  node?: InputMaybe<HiveIntegrationUpdateInput>;
}

export interface HiveIntegrationInstanceIntegrationUpdateFieldInput {
  connect?: InputMaybe<HiveIntegrationInstanceIntegrationConnectFieldInput>;
  connectOrCreate?: InputMaybe<HiveIntegrationInstanceIntegrationConnectOrCreateFieldInput>;
  create?: InputMaybe<HiveIntegrationInstanceIntegrationCreateFieldInput>;
  delete?: InputMaybe<HiveIntegrationInstanceIntegrationDeleteFieldInput>;
  disconnect?: InputMaybe<HiveIntegrationInstanceIntegrationDisconnectFieldInput>;
  update?: InputMaybe<HiveIntegrationInstanceIntegrationUpdateConnectionInput>;
  where?: InputMaybe<HiveIntegrationInstanceIntegrationConnectionWhere>;
}

export interface HiveIntegrationInstanceOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more HiveIntegrationInstanceSort objects to sort HiveIntegrationInstances by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<HiveIntegrationInstanceSort>>>;
}

export interface HiveIntegrationInstanceOrganisationAggregateInput {
  AND?: InputMaybe<Array<HiveIntegrationInstanceOrganisationAggregateInput>>;
  OR?: InputMaybe<Array<HiveIntegrationInstanceOrganisationAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveIntegrationInstanceOrganisationNodeAggregationWhereInput>;
}

export interface HiveIntegrationInstanceOrganisationConnectFieldInput {
  connect?: InputMaybe<HiveOrganisationConnectInput>;
  where?: InputMaybe<HiveOrganisationConnectWhere>;
}

export interface HiveIntegrationInstanceOrganisationConnectOrCreateFieldInput {
  onCreate: HiveIntegrationInstanceOrganisationConnectOrCreateFieldInputOnCreate;
  where: HiveOrganisationConnectOrCreateWhere;
}

export interface HiveIntegrationInstanceOrganisationConnectOrCreateFieldInputOnCreate {
  node: HiveOrganisationCreateInput;
}

export interface HiveIntegrationInstanceOrganisationConnectionSort {
  node?: InputMaybe<HiveOrganisationSort>;
}

export interface HiveIntegrationInstanceOrganisationConnectionWhere {
  AND?: InputMaybe<Array<HiveIntegrationInstanceOrganisationConnectionWhere>>;
  OR?: InputMaybe<Array<HiveIntegrationInstanceOrganisationConnectionWhere>>;
  node?: InputMaybe<HiveOrganisationWhere>;
  node_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface HiveIntegrationInstanceOrganisationCreateFieldInput {
  node: HiveOrganisationCreateInput;
}

export interface HiveIntegrationInstanceOrganisationDeleteFieldInput {
  delete?: InputMaybe<HiveOrganisationDeleteInput>;
  where?: InputMaybe<HiveIntegrationInstanceOrganisationConnectionWhere>;
}

export interface HiveIntegrationInstanceOrganisationDisconnectFieldInput {
  disconnect?: InputMaybe<HiveOrganisationDisconnectInput>;
  where?: InputMaybe<HiveIntegrationInstanceOrganisationConnectionWhere>;
}

export interface HiveIntegrationInstanceOrganisationFieldInput {
  connect?: InputMaybe<HiveIntegrationInstanceOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<HiveIntegrationInstanceOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<HiveIntegrationInstanceOrganisationCreateFieldInput>;
}

export interface HiveIntegrationInstanceOrganisationNodeAggregationWhereInput {
  AND?: InputMaybe<
    Array<HiveIntegrationInstanceOrganisationNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<
    Array<HiveIntegrationInstanceOrganisationNodeAggregationWhereInput>
  >;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveIntegrationInstanceOrganisationUpdateConnectionInput {
  node?: InputMaybe<HiveOrganisationUpdateInput>;
}

export interface HiveIntegrationInstanceOrganisationUpdateFieldInput {
  connect?: InputMaybe<HiveIntegrationInstanceOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<HiveIntegrationInstanceOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<HiveIntegrationInstanceOrganisationCreateFieldInput>;
  delete?: InputMaybe<HiveIntegrationInstanceOrganisationDeleteFieldInput>;
  disconnect?: InputMaybe<HiveIntegrationInstanceOrganisationDisconnectFieldInput>;
  update?: InputMaybe<HiveIntegrationInstanceOrganisationUpdateConnectionInput>;
  where?: InputMaybe<HiveIntegrationInstanceOrganisationConnectionWhere>;
}

export interface HiveIntegrationInstanceRelationInput {
  appliances?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesCreateFieldInput>
  >;
  connections?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsCreateFieldInput>
  >;
  integration?: InputMaybe<HiveIntegrationInstanceIntegrationCreateFieldInput>;
  organisation?: InputMaybe<HiveIntegrationInstanceOrganisationCreateFieldInput>;
}

/** Fields to sort HiveIntegrationInstances by. The order in which sorts are applied is not guaranteed when specifying many fields in one HiveIntegrationInstanceSort object. */
export interface HiveIntegrationInstanceSort {
  config?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  isRunning?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
}

export interface HiveIntegrationInstanceUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface HiveIntegrationInstanceUpdateInput {
  appliances?: InputMaybe<
    Array<HiveIntegrationInstanceAppliancesUpdateFieldInput>
  >;
  config?: InputMaybe<Scalars["String"]>;
  connections?: InputMaybe<
    Array<HiveIntegrationInstanceConnectionsUpdateFieldInput>
  >;
  integration?: InputMaybe<HiveIntegrationInstanceIntegrationUpdateFieldInput>;
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveIntegrationInstanceOrganisationUpdateFieldInput>;
}

export interface HiveIntegrationInstanceWhere {
  AND?: InputMaybe<Array<HiveIntegrationInstanceWhere>>;
  OR?: InputMaybe<Array<HiveIntegrationInstanceWhere>>;
  appliances?: InputMaybe<HiveApplianceWhere>;
  appliancesAggregate?: InputMaybe<HiveIntegrationInstanceAppliancesAggregateInput>;
  appliancesConnection?: InputMaybe<HiveIntegrationInstanceAppliancesConnectionWhere>;
  appliancesConnection_NOT?: InputMaybe<HiveIntegrationInstanceAppliancesConnectionWhere>;
  appliances_NOT?: InputMaybe<HiveApplianceWhere>;
  config?: InputMaybe<Scalars["String"]>;
  config_CONTAINS?: InputMaybe<Scalars["String"]>;
  config_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  config_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  config_NOT?: InputMaybe<Scalars["String"]>;
  config_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  config_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  config_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  config_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  config_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  connections?: InputMaybe<HiveIntegrationPathWhere>;
  connectionsAggregate?: InputMaybe<HiveIntegrationInstanceConnectionsAggregateInput>;
  connectionsConnection?: InputMaybe<HiveIntegrationInstanceConnectionsConnectionWhere>;
  connectionsConnection_NOT?: InputMaybe<HiveIntegrationInstanceConnectionsConnectionWhere>;
  connections_NOT?: InputMaybe<HiveIntegrationPathWhere>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  integration?: InputMaybe<HiveIntegrationWhere>;
  integrationAggregate?: InputMaybe<HiveIntegrationInstanceIntegrationAggregateInput>;
  integrationConnection?: InputMaybe<HiveIntegrationInstanceIntegrationConnectionWhere>;
  integrationConnection_NOT?: InputMaybe<HiveIntegrationInstanceIntegrationConnectionWhere>;
  integration_NOT?: InputMaybe<HiveIntegrationWhere>;
  isRunning?: InputMaybe<Scalars["Boolean"]>;
  isRunning_NOT?: InputMaybe<Scalars["Boolean"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveOrganisationWhere>;
  organisationAggregate?: InputMaybe<HiveIntegrationInstanceOrganisationAggregateInput>;
  organisationConnection?: InputMaybe<HiveIntegrationInstanceOrganisationConnectionWhere>;
  organisationConnection_NOT?: InputMaybe<HiveIntegrationInstanceOrganisationConnectionWhere>;
  organisation_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface HiveIntegrationOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more HiveIntegrationSort objects to sort HiveIntegrations by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<HiveIntegrationSort>>>;
}

export interface HiveIntegrationPathCollectionCreateInput {
  name?: InputMaybe<Scalars["String"]>;
}

export interface HiveIntegrationPathCollectionOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more HiveIntegrationPathCollectionSort objects to sort HiveIntegrationPathCollections by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<HiveIntegrationPathCollectionSort>>>;
}

/** Fields to sort HiveIntegrationPathCollections by. The order in which sorts are applied is not guaranteed when specifying many fields in one HiveIntegrationPathCollectionSort object. */
export interface HiveIntegrationPathCollectionSort {
  name?: InputMaybe<SortDirection>;
}

export interface HiveIntegrationPathCollectionUpdateInput {
  name?: InputMaybe<Scalars["String"]>;
}

export interface HiveIntegrationPathCollectionWhere {
  AND?: InputMaybe<Array<HiveIntegrationPathCollectionWhere>>;
  OR?: InputMaybe<Array<HiveIntegrationPathCollectionWhere>>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

export interface HiveIntegrationPathConnectInput {
  instance?: InputMaybe<HiveIntegrationPathInstanceConnectFieldInput>;
}

export interface HiveIntegrationPathConnectOrCreateInput {
  instance?: InputMaybe<HiveIntegrationPathInstanceConnectOrCreateFieldInput>;
}

export interface HiveIntegrationPathConnectOrCreateWhere {
  node: HiveIntegrationPathUniqueWhere;
}

export interface HiveIntegrationPathConnectWhere {
  node: HiveIntegrationPathWhere;
}

export interface HiveIntegrationPathCreateInput {
  connectionBlob?: InputMaybe<Scalars["String"]>;
  instance?: InputMaybe<HiveIntegrationPathInstanceFieldInput>;
  name?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
}

export interface HiveIntegrationPathDeleteInput {
  instance?: InputMaybe<HiveIntegrationPathInstanceDeleteFieldInput>;
}

export interface HiveIntegrationPathDisconnectInput {
  instance?: InputMaybe<HiveIntegrationPathInstanceDisconnectFieldInput>;
}

export interface HiveIntegrationPathInstanceAggregateInput {
  AND?: InputMaybe<Array<HiveIntegrationPathInstanceAggregateInput>>;
  OR?: InputMaybe<Array<HiveIntegrationPathInstanceAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveIntegrationPathInstanceNodeAggregationWhereInput>;
}

export interface HiveIntegrationPathInstanceConnectFieldInput {
  connect?: InputMaybe<HiveIntegrationInstanceConnectInput>;
  where?: InputMaybe<HiveIntegrationInstanceConnectWhere>;
}

export interface HiveIntegrationPathInstanceConnectOrCreateFieldInput {
  onCreate: HiveIntegrationPathInstanceConnectOrCreateFieldInputOnCreate;
  where: HiveIntegrationInstanceConnectOrCreateWhere;
}

export interface HiveIntegrationPathInstanceConnectOrCreateFieldInputOnCreate {
  node: HiveIntegrationInstanceCreateInput;
}

export interface HiveIntegrationPathInstanceConnectionSort {
  node?: InputMaybe<HiveIntegrationInstanceSort>;
}

export interface HiveIntegrationPathInstanceConnectionWhere {
  AND?: InputMaybe<Array<HiveIntegrationPathInstanceConnectionWhere>>;
  OR?: InputMaybe<Array<HiveIntegrationPathInstanceConnectionWhere>>;
  node?: InputMaybe<HiveIntegrationInstanceWhere>;
  node_NOT?: InputMaybe<HiveIntegrationInstanceWhere>;
}

export interface HiveIntegrationPathInstanceCreateFieldInput {
  node: HiveIntegrationInstanceCreateInput;
}

export interface HiveIntegrationPathInstanceDeleteFieldInput {
  delete?: InputMaybe<HiveIntegrationInstanceDeleteInput>;
  where?: InputMaybe<HiveIntegrationPathInstanceConnectionWhere>;
}

export interface HiveIntegrationPathInstanceDisconnectFieldInput {
  disconnect?: InputMaybe<HiveIntegrationInstanceDisconnectInput>;
  where?: InputMaybe<HiveIntegrationPathInstanceConnectionWhere>;
}

export interface HiveIntegrationPathInstanceFieldInput {
  connect?: InputMaybe<HiveIntegrationPathInstanceConnectFieldInput>;
  connectOrCreate?: InputMaybe<HiveIntegrationPathInstanceConnectOrCreateFieldInput>;
  create?: InputMaybe<HiveIntegrationPathInstanceCreateFieldInput>;
}

export interface HiveIntegrationPathInstanceNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveIntegrationPathInstanceNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveIntegrationPathInstanceNodeAggregationWhereInput>>;
  config_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  config_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  config_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  config_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  config_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  config_EQUAL?: InputMaybe<Scalars["String"]>;
  config_GT?: InputMaybe<Scalars["Int"]>;
  config_GTE?: InputMaybe<Scalars["Int"]>;
  config_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  config_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  config_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  config_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  config_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  config_LT?: InputMaybe<Scalars["Int"]>;
  config_LTE?: InputMaybe<Scalars["Int"]>;
  config_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  config_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  config_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  config_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  config_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveIntegrationPathInstanceUpdateConnectionInput {
  node?: InputMaybe<HiveIntegrationInstanceUpdateInput>;
}

export interface HiveIntegrationPathInstanceUpdateFieldInput {
  connect?: InputMaybe<HiveIntegrationPathInstanceConnectFieldInput>;
  connectOrCreate?: InputMaybe<HiveIntegrationPathInstanceConnectOrCreateFieldInput>;
  create?: InputMaybe<HiveIntegrationPathInstanceCreateFieldInput>;
  delete?: InputMaybe<HiveIntegrationPathInstanceDeleteFieldInput>;
  disconnect?: InputMaybe<HiveIntegrationPathInstanceDisconnectFieldInput>;
  update?: InputMaybe<HiveIntegrationPathInstanceUpdateConnectionInput>;
  where?: InputMaybe<HiveIntegrationPathInstanceConnectionWhere>;
}

export interface HiveIntegrationPathOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more HiveIntegrationPathSort objects to sort HiveIntegrationPaths by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<HiveIntegrationPathSort>>>;
}

export interface HiveIntegrationPathRelationInput {
  instance?: InputMaybe<HiveIntegrationPathInstanceCreateFieldInput>;
}

/** Fields to sort HiveIntegrationPaths by. The order in which sorts are applied is not guaranteed when specifying many fields in one HiveIntegrationPathSort object. */
export interface HiveIntegrationPathSort {
  connectionBlob?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  type?: InputMaybe<SortDirection>;
}

export interface HiveIntegrationPathUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface HiveIntegrationPathUpdateInput {
  connectionBlob?: InputMaybe<Scalars["String"]>;
  instance?: InputMaybe<HiveIntegrationPathInstanceUpdateFieldInput>;
  name?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
}

export interface HiveIntegrationPathWhere {
  AND?: InputMaybe<Array<HiveIntegrationPathWhere>>;
  OR?: InputMaybe<Array<HiveIntegrationPathWhere>>;
  connectionBlob?: InputMaybe<Scalars["String"]>;
  connectionBlob_CONTAINS?: InputMaybe<Scalars["String"]>;
  connectionBlob_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  connectionBlob_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  connectionBlob_NOT?: InputMaybe<Scalars["String"]>;
  connectionBlob_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  connectionBlob_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  connectionBlob_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  connectionBlob_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  connectionBlob_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  instance?: InputMaybe<HiveIntegrationInstanceWhere>;
  instanceAggregate?: InputMaybe<HiveIntegrationPathInstanceAggregateInput>;
  instanceConnection?: InputMaybe<HiveIntegrationPathInstanceConnectionWhere>;
  instanceConnection_NOT?: InputMaybe<HiveIntegrationPathInstanceConnectionWhere>;
  instance_NOT?: InputMaybe<HiveIntegrationInstanceWhere>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
  type_CONTAINS?: InputMaybe<Scalars["String"]>;
  type_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  type_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  type_NOT?: InputMaybe<Scalars["String"]>;
  type_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  type_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  type_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  type_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  type_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

/** Fields to sort HiveIntegrations by. The order in which sorts are applied is not guaranteed when specifying many fields in one HiveIntegrationSort object. */
export interface HiveIntegrationSort {
  description?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
}

export interface HiveIntegrationUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface HiveIntegrationUpdateInput {
  description?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
}

export interface HiveIntegrationWhere {
  AND?: InputMaybe<Array<HiveIntegrationWhere>>;
  OR?: InputMaybe<Array<HiveIntegrationWhere>>;
  description?: InputMaybe<Scalars["String"]>;
  description_CONTAINS?: InputMaybe<Scalars["String"]>;
  description_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  description_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  description_NOT?: InputMaybe<Scalars["String"]>;
  description_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  description_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  description_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  description_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  description_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

export interface HiveOrganisationAppliancesAggregateInput {
  AND?: InputMaybe<Array<HiveOrganisationAppliancesAggregateInput>>;
  OR?: InputMaybe<Array<HiveOrganisationAppliancesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveOrganisationAppliancesNodeAggregationWhereInput>;
}

export interface HiveOrganisationAppliancesConnectFieldInput {
  connect?: InputMaybe<Array<HiveApplianceConnectInput>>;
  where?: InputMaybe<HiveApplianceConnectWhere>;
}

export interface HiveOrganisationAppliancesConnectOrCreateFieldInput {
  onCreate: HiveOrganisationAppliancesConnectOrCreateFieldInputOnCreate;
  where: HiveApplianceConnectOrCreateWhere;
}

export interface HiveOrganisationAppliancesConnectOrCreateFieldInputOnCreate {
  node: HiveApplianceCreateInput;
}

export interface HiveOrganisationAppliancesConnectionSort {
  node?: InputMaybe<HiveApplianceSort>;
}

export interface HiveOrganisationAppliancesConnectionWhere {
  AND?: InputMaybe<Array<HiveOrganisationAppliancesConnectionWhere>>;
  OR?: InputMaybe<Array<HiveOrganisationAppliancesConnectionWhere>>;
  node?: InputMaybe<HiveApplianceWhere>;
  node_NOT?: InputMaybe<HiveApplianceWhere>;
}

export interface HiveOrganisationAppliancesCreateFieldInput {
  node: HiveApplianceCreateInput;
}

export interface HiveOrganisationAppliancesDeleteFieldInput {
  delete?: InputMaybe<HiveApplianceDeleteInput>;
  where?: InputMaybe<HiveOrganisationAppliancesConnectionWhere>;
}

export interface HiveOrganisationAppliancesDisconnectFieldInput {
  disconnect?: InputMaybe<HiveApplianceDisconnectInput>;
  where?: InputMaybe<HiveOrganisationAppliancesConnectionWhere>;
}

export interface HiveOrganisationAppliancesFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationAppliancesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationAppliancesConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationAppliancesCreateFieldInput>>;
}

export interface HiveOrganisationAppliancesNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveOrganisationAppliancesNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveOrganisationAppliancesNodeAggregationWhereInput>>;
  description_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  description_EQUAL?: InputMaybe<Scalars["String"]>;
  description_GT?: InputMaybe<Scalars["Int"]>;
  description_GTE?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  description_LT?: InputMaybe<Scalars["Int"]>;
  description_LTE?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  label_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  label_EQUAL?: InputMaybe<Scalars["String"]>;
  label_GT?: InputMaybe<Scalars["Int"]>;
  label_GTE?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  label_LT?: InputMaybe<Scalars["Int"]>;
  label_LTE?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveOrganisationAppliancesUpdateConnectionInput {
  node?: InputMaybe<HiveApplianceUpdateInput>;
}

export interface HiveOrganisationAppliancesUpdateFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationAppliancesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationAppliancesConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationAppliancesCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveOrganisationAppliancesDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<HiveOrganisationAppliancesDisconnectFieldInput>
  >;
  update?: InputMaybe<HiveOrganisationAppliancesUpdateConnectionInput>;
  where?: InputMaybe<HiveOrganisationAppliancesConnectionWhere>;
}

export interface HiveOrganisationConnectInput {
  appliances?: InputMaybe<Array<HiveOrganisationAppliancesConnectFieldInput>>;
  equipment?: InputMaybe<Array<HiveOrganisationEquipmentConnectFieldInput>>;
  estimates?: InputMaybe<Array<HiveOrganisationEstimatesConnectFieldInput>>;
  integrations?: InputMaybe<
    Array<HiveOrganisationIntegrationsConnectFieldInput>
  >;
  members?: InputMaybe<Array<HiveOrganisationMembersConnectFieldInput>>;
  people?: InputMaybe<Array<HiveOrganisationPeopleConnectFieldInput>>;
  projects?: InputMaybe<Array<HiveOrganisationProjectsConnectFieldInput>>;
  roles?: InputMaybe<Array<HiveOrganisationRolesConnectFieldInput>>;
  schedule?: InputMaybe<Array<HiveOrganisationScheduleConnectFieldInput>>;
  timeline?: InputMaybe<Array<HiveOrganisationTimelineConnectFieldInput>>;
}

export interface HiveOrganisationConnectOrCreateInput {
  appliances?: InputMaybe<
    Array<HiveOrganisationAppliancesConnectOrCreateFieldInput>
  >;
  equipment?: InputMaybe<
    Array<HiveOrganisationEquipmentConnectOrCreateFieldInput>
  >;
  estimates?: InputMaybe<
    Array<HiveOrganisationEstimatesConnectOrCreateFieldInput>
  >;
  integrations?: InputMaybe<
    Array<HiveOrganisationIntegrationsConnectOrCreateFieldInput>
  >;
  members?: InputMaybe<Array<HiveOrganisationMembersConnectOrCreateFieldInput>>;
  people?: InputMaybe<Array<HiveOrganisationPeopleConnectOrCreateFieldInput>>;
  projects?: InputMaybe<
    Array<HiveOrganisationProjectsConnectOrCreateFieldInput>
  >;
  roles?: InputMaybe<Array<HiveOrganisationRolesConnectOrCreateFieldInput>>;
  schedule?: InputMaybe<
    Array<HiveOrganisationScheduleConnectOrCreateFieldInput>
  >;
  timeline?: InputMaybe<
    Array<HiveOrganisationTimelineConnectOrCreateFieldInput>
  >;
}

export interface HiveOrganisationConnectOrCreateWhere {
  node: HiveOrganisationUniqueWhere;
}

export interface HiveOrganisationConnectWhere {
  node: HiveOrganisationWhere;
}

export interface HiveOrganisationCreateInput {
  appliances?: InputMaybe<HiveOrganisationAppliancesFieldInput>;
  equipment?: InputMaybe<HiveOrganisationEquipmentFieldInput>;
  estimates?: InputMaybe<HiveOrganisationEstimatesFieldInput>;
  integrations?: InputMaybe<HiveOrganisationIntegrationsFieldInput>;
  members?: InputMaybe<HiveOrganisationMembersFieldInput>;
  name?: InputMaybe<Scalars["String"]>;
  people?: InputMaybe<HiveOrganisationPeopleFieldInput>;
  projects?: InputMaybe<HiveOrganisationProjectsFieldInput>;
  roles?: InputMaybe<HiveOrganisationRolesFieldInput>;
  schedule?: InputMaybe<HiveOrganisationScheduleFieldInput>;
  timeline?: InputMaybe<HiveOrganisationTimelineFieldInput>;
}

export interface HiveOrganisationDeleteInput {
  appliances?: InputMaybe<Array<HiveOrganisationAppliancesDeleteFieldInput>>;
  equipment?: InputMaybe<Array<HiveOrganisationEquipmentDeleteFieldInput>>;
  estimates?: InputMaybe<Array<HiveOrganisationEstimatesDeleteFieldInput>>;
  integrations?: InputMaybe<
    Array<HiveOrganisationIntegrationsDeleteFieldInput>
  >;
  members?: InputMaybe<Array<HiveOrganisationMembersDeleteFieldInput>>;
  people?: InputMaybe<Array<HiveOrganisationPeopleDeleteFieldInput>>;
  projects?: InputMaybe<Array<HiveOrganisationProjectsDeleteFieldInput>>;
  roles?: InputMaybe<Array<HiveOrganisationRolesDeleteFieldInput>>;
  schedule?: InputMaybe<Array<HiveOrganisationScheduleDeleteFieldInput>>;
  timeline?: InputMaybe<Array<HiveOrganisationTimelineDeleteFieldInput>>;
}

export interface HiveOrganisationDisconnectInput {
  appliances?: InputMaybe<
    Array<HiveOrganisationAppliancesDisconnectFieldInput>
  >;
  equipment?: InputMaybe<Array<HiveOrganisationEquipmentDisconnectFieldInput>>;
  estimates?: InputMaybe<Array<HiveOrganisationEstimatesDisconnectFieldInput>>;
  integrations?: InputMaybe<
    Array<HiveOrganisationIntegrationsDisconnectFieldInput>
  >;
  members?: InputMaybe<Array<HiveOrganisationMembersDisconnectFieldInput>>;
  people?: InputMaybe<Array<HiveOrganisationPeopleDisconnectFieldInput>>;
  projects?: InputMaybe<Array<HiveOrganisationProjectsDisconnectFieldInput>>;
  roles?: InputMaybe<Array<HiveOrganisationRolesDisconnectFieldInput>>;
  schedule?: InputMaybe<Array<HiveOrganisationScheduleDisconnectFieldInput>>;
  timeline?: InputMaybe<Array<HiveOrganisationTimelineDisconnectFieldInput>>;
}

export interface HiveOrganisationEquipmentAggregateInput {
  AND?: InputMaybe<Array<HiveOrganisationEquipmentAggregateInput>>;
  OR?: InputMaybe<Array<HiveOrganisationEquipmentAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveOrganisationEquipmentNodeAggregationWhereInput>;
}

export interface HiveOrganisationEquipmentConnectFieldInput {
  connect?: InputMaybe<Array<EquipmentConnectInput>>;
  where?: InputMaybe<EquipmentConnectWhere>;
}

export interface HiveOrganisationEquipmentConnectOrCreateFieldInput {
  onCreate: HiveOrganisationEquipmentConnectOrCreateFieldInputOnCreate;
  where: EquipmentConnectOrCreateWhere;
}

export interface HiveOrganisationEquipmentConnectOrCreateFieldInputOnCreate {
  node: EquipmentCreateInput;
}

export interface HiveOrganisationEquipmentConnectionSort {
  node?: InputMaybe<EquipmentSort>;
}

export interface HiveOrganisationEquipmentConnectionWhere {
  AND?: InputMaybe<Array<HiveOrganisationEquipmentConnectionWhere>>;
  OR?: InputMaybe<Array<HiveOrganisationEquipmentConnectionWhere>>;
  node?: InputMaybe<EquipmentWhere>;
  node_NOT?: InputMaybe<EquipmentWhere>;
}

export interface HiveOrganisationEquipmentCreateFieldInput {
  node: EquipmentCreateInput;
}

export interface HiveOrganisationEquipmentDeleteFieldInput {
  delete?: InputMaybe<EquipmentDeleteInput>;
  where?: InputMaybe<HiveOrganisationEquipmentConnectionWhere>;
}

export interface HiveOrganisationEquipmentDisconnectFieldInput {
  disconnect?: InputMaybe<EquipmentDisconnectInput>;
  where?: InputMaybe<HiveOrganisationEquipmentConnectionWhere>;
}

export interface HiveOrganisationEquipmentFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationEquipmentConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationEquipmentConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationEquipmentCreateFieldInput>>;
}

export interface HiveOrganisationEquipmentNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveOrganisationEquipmentNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveOrganisationEquipmentNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  registration_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  registration_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  registration_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  registration_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  registration_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  registration_EQUAL?: InputMaybe<Scalars["String"]>;
  registration_GT?: InputMaybe<Scalars["Int"]>;
  registration_GTE?: InputMaybe<Scalars["Int"]>;
  registration_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  registration_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  registration_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  registration_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  registration_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  registration_LT?: InputMaybe<Scalars["Int"]>;
  registration_LTE?: InputMaybe<Scalars["Int"]>;
  registration_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  registration_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  registration_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  registration_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  registration_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveOrganisationEquipmentUpdateConnectionInput {
  node?: InputMaybe<EquipmentUpdateInput>;
}

export interface HiveOrganisationEquipmentUpdateFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationEquipmentConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationEquipmentConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationEquipmentCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveOrganisationEquipmentDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveOrganisationEquipmentDisconnectFieldInput>>;
  update?: InputMaybe<HiveOrganisationEquipmentUpdateConnectionInput>;
  where?: InputMaybe<HiveOrganisationEquipmentConnectionWhere>;
}

export interface HiveOrganisationEstimatesAggregateInput {
  AND?: InputMaybe<Array<HiveOrganisationEstimatesAggregateInput>>;
  OR?: InputMaybe<Array<HiveOrganisationEstimatesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveOrganisationEstimatesNodeAggregationWhereInput>;
}

export interface HiveOrganisationEstimatesConnectFieldInput {
  connect?: InputMaybe<Array<EstimateConnectInput>>;
  where?: InputMaybe<EstimateConnectWhere>;
}

export interface HiveOrganisationEstimatesConnectOrCreateFieldInput {
  onCreate: HiveOrganisationEstimatesConnectOrCreateFieldInputOnCreate;
  where: EstimateConnectOrCreateWhere;
}

export interface HiveOrganisationEstimatesConnectOrCreateFieldInputOnCreate {
  node: EstimateCreateInput;
}

export interface HiveOrganisationEstimatesConnectionSort {
  node?: InputMaybe<EstimateSort>;
}

export interface HiveOrganisationEstimatesConnectionWhere {
  AND?: InputMaybe<Array<HiveOrganisationEstimatesConnectionWhere>>;
  OR?: InputMaybe<Array<HiveOrganisationEstimatesConnectionWhere>>;
  node?: InputMaybe<EstimateWhere>;
  node_NOT?: InputMaybe<EstimateWhere>;
}

export interface HiveOrganisationEstimatesCreateFieldInput {
  node: EstimateCreateInput;
}

export interface HiveOrganisationEstimatesDeleteFieldInput {
  delete?: InputMaybe<EstimateDeleteInput>;
  where?: InputMaybe<HiveOrganisationEstimatesConnectionWhere>;
}

export interface HiveOrganisationEstimatesDisconnectFieldInput {
  disconnect?: InputMaybe<EstimateDisconnectInput>;
  where?: InputMaybe<HiveOrganisationEstimatesConnectionWhere>;
}

export interface HiveOrganisationEstimatesFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationEstimatesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationEstimatesConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationEstimatesCreateFieldInput>>;
}

export interface HiveOrganisationEstimatesNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveOrganisationEstimatesNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveOrganisationEstimatesNodeAggregationWhereInput>>;
  date_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  date_GT?: InputMaybe<Scalars["DateTime"]>;
  date_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_LT?: InputMaybe<Scalars["DateTime"]>;
  date_LTE?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  price_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  price_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  price_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  price_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  price_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  price_EQUAL?: InputMaybe<Scalars["Float"]>;
  price_GT?: InputMaybe<Scalars["Float"]>;
  price_GTE?: InputMaybe<Scalars["Float"]>;
  price_LT?: InputMaybe<Scalars["Float"]>;
  price_LTE?: InputMaybe<Scalars["Float"]>;
  price_MAX_EQUAL?: InputMaybe<Scalars["Float"]>;
  price_MAX_GT?: InputMaybe<Scalars["Float"]>;
  price_MAX_GTE?: InputMaybe<Scalars["Float"]>;
  price_MAX_LT?: InputMaybe<Scalars["Float"]>;
  price_MAX_LTE?: InputMaybe<Scalars["Float"]>;
  price_MIN_EQUAL?: InputMaybe<Scalars["Float"]>;
  price_MIN_GT?: InputMaybe<Scalars["Float"]>;
  price_MIN_GTE?: InputMaybe<Scalars["Float"]>;
  price_MIN_LT?: InputMaybe<Scalars["Float"]>;
  price_MIN_LTE?: InputMaybe<Scalars["Float"]>;
  price_SUM_EQUAL?: InputMaybe<Scalars["Float"]>;
  price_SUM_GT?: InputMaybe<Scalars["Float"]>;
  price_SUM_GTE?: InputMaybe<Scalars["Float"]>;
  price_SUM_LT?: InputMaybe<Scalars["Float"]>;
  price_SUM_LTE?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  status_EQUAL?: InputMaybe<Scalars["String"]>;
  status_GT?: InputMaybe<Scalars["Int"]>;
  status_GTE?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  status_LT?: InputMaybe<Scalars["Int"]>;
  status_LTE?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveOrganisationEstimatesUpdateConnectionInput {
  node?: InputMaybe<EstimateUpdateInput>;
}

export interface HiveOrganisationEstimatesUpdateFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationEstimatesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationEstimatesConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationEstimatesCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveOrganisationEstimatesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveOrganisationEstimatesDisconnectFieldInput>>;
  update?: InputMaybe<HiveOrganisationEstimatesUpdateConnectionInput>;
  where?: InputMaybe<HiveOrganisationEstimatesConnectionWhere>;
}

export interface HiveOrganisationIntegrationsAggregateInput {
  AND?: InputMaybe<Array<HiveOrganisationIntegrationsAggregateInput>>;
  OR?: InputMaybe<Array<HiveOrganisationIntegrationsAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveOrganisationIntegrationsNodeAggregationWhereInput>;
}

export interface HiveOrganisationIntegrationsConnectFieldInput {
  connect?: InputMaybe<Array<HiveIntegrationInstanceConnectInput>>;
  where?: InputMaybe<HiveIntegrationInstanceConnectWhere>;
}

export interface HiveOrganisationIntegrationsConnectOrCreateFieldInput {
  onCreate: HiveOrganisationIntegrationsConnectOrCreateFieldInputOnCreate;
  where: HiveIntegrationInstanceConnectOrCreateWhere;
}

export interface HiveOrganisationIntegrationsConnectOrCreateFieldInputOnCreate {
  node: HiveIntegrationInstanceCreateInput;
}

export interface HiveOrganisationIntegrationsConnectionSort {
  node?: InputMaybe<HiveIntegrationInstanceSort>;
}

export interface HiveOrganisationIntegrationsConnectionWhere {
  AND?: InputMaybe<Array<HiveOrganisationIntegrationsConnectionWhere>>;
  OR?: InputMaybe<Array<HiveOrganisationIntegrationsConnectionWhere>>;
  node?: InputMaybe<HiveIntegrationInstanceWhere>;
  node_NOT?: InputMaybe<HiveIntegrationInstanceWhere>;
}

export interface HiveOrganisationIntegrationsCreateFieldInput {
  node: HiveIntegrationInstanceCreateInput;
}

export interface HiveOrganisationIntegrationsDeleteFieldInput {
  delete?: InputMaybe<HiveIntegrationInstanceDeleteInput>;
  where?: InputMaybe<HiveOrganisationIntegrationsConnectionWhere>;
}

export interface HiveOrganisationIntegrationsDisconnectFieldInput {
  disconnect?: InputMaybe<HiveIntegrationInstanceDisconnectInput>;
  where?: InputMaybe<HiveOrganisationIntegrationsConnectionWhere>;
}

export interface HiveOrganisationIntegrationsFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationIntegrationsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationIntegrationsConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationIntegrationsCreateFieldInput>>;
}

export interface HiveOrganisationIntegrationsNodeAggregationWhereInput {
  AND?: InputMaybe<
    Array<HiveOrganisationIntegrationsNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<Array<HiveOrganisationIntegrationsNodeAggregationWhereInput>>;
  config_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  config_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  config_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  config_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  config_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  config_EQUAL?: InputMaybe<Scalars["String"]>;
  config_GT?: InputMaybe<Scalars["Int"]>;
  config_GTE?: InputMaybe<Scalars["Int"]>;
  config_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  config_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  config_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  config_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  config_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  config_LT?: InputMaybe<Scalars["Int"]>;
  config_LTE?: InputMaybe<Scalars["Int"]>;
  config_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  config_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  config_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  config_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  config_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveOrganisationIntegrationsUpdateConnectionInput {
  node?: InputMaybe<HiveIntegrationInstanceUpdateInput>;
}

export interface HiveOrganisationIntegrationsUpdateFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationIntegrationsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationIntegrationsConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationIntegrationsCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveOrganisationIntegrationsDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<HiveOrganisationIntegrationsDisconnectFieldInput>
  >;
  update?: InputMaybe<HiveOrganisationIntegrationsUpdateConnectionInput>;
  where?: InputMaybe<HiveOrganisationIntegrationsConnectionWhere>;
}

export interface HiveOrganisationMembersAggregateInput {
  AND?: InputMaybe<Array<HiveOrganisationMembersAggregateInput>>;
  OR?: InputMaybe<Array<HiveOrganisationMembersAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveOrganisationMembersNodeAggregationWhereInput>;
}

export interface HiveOrganisationMembersConnectFieldInput {
  connect?: InputMaybe<Array<HiveUserConnectInput>>;
  where?: InputMaybe<HiveUserConnectWhere>;
}

export interface HiveOrganisationMembersConnectOrCreateFieldInput {
  onCreate: HiveOrganisationMembersConnectOrCreateFieldInputOnCreate;
  where: HiveUserConnectOrCreateWhere;
}

export interface HiveOrganisationMembersConnectOrCreateFieldInputOnCreate {
  node: HiveUserCreateInput;
}

export interface HiveOrganisationMembersConnectionSort {
  node?: InputMaybe<HiveUserSort>;
}

export interface HiveOrganisationMembersConnectionWhere {
  AND?: InputMaybe<Array<HiveOrganisationMembersConnectionWhere>>;
  OR?: InputMaybe<Array<HiveOrganisationMembersConnectionWhere>>;
  node?: InputMaybe<HiveUserWhere>;
  node_NOT?: InputMaybe<HiveUserWhere>;
}

export interface HiveOrganisationMembersCreateFieldInput {
  node: HiveUserCreateInput;
}

export interface HiveOrganisationMembersDeleteFieldInput {
  delete?: InputMaybe<HiveUserDeleteInput>;
  where?: InputMaybe<HiveOrganisationMembersConnectionWhere>;
}

export interface HiveOrganisationMembersDisconnectFieldInput {
  disconnect?: InputMaybe<HiveUserDisconnectInput>;
  where?: InputMaybe<HiveOrganisationMembersConnectionWhere>;
}

export interface HiveOrganisationMembersFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationMembersConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationMembersConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationMembersCreateFieldInput>>;
}

export interface HiveOrganisationMembersNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveOrganisationMembersNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveOrganisationMembersNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  password_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  password_EQUAL?: InputMaybe<Scalars["String"]>;
  password_GT?: InputMaybe<Scalars["Int"]>;
  password_GTE?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  password_LT?: InputMaybe<Scalars["Int"]>;
  password_LTE?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  username_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  username_EQUAL?: InputMaybe<Scalars["String"]>;
  username_GT?: InputMaybe<Scalars["Int"]>;
  username_GTE?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  username_LT?: InputMaybe<Scalars["Int"]>;
  username_LTE?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveOrganisationMembersUpdateConnectionInput {
  node?: InputMaybe<HiveUserUpdateInput>;
}

export interface HiveOrganisationMembersUpdateFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationMembersConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationMembersConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationMembersCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveOrganisationMembersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveOrganisationMembersDisconnectFieldInput>>;
  update?: InputMaybe<HiveOrganisationMembersUpdateConnectionInput>;
  where?: InputMaybe<HiveOrganisationMembersConnectionWhere>;
}

export interface HiveOrganisationOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more HiveOrganisationSort objects to sort HiveOrganisations by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<HiveOrganisationSort>>>;
}

export interface HiveOrganisationPeopleAggregateInput {
  AND?: InputMaybe<Array<HiveOrganisationPeopleAggregateInput>>;
  OR?: InputMaybe<Array<HiveOrganisationPeopleAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveOrganisationPeopleNodeAggregationWhereInput>;
}

export interface HiveOrganisationPeopleConnectFieldInput {
  connect?: InputMaybe<Array<PeopleConnectInput>>;
  where?: InputMaybe<PeopleConnectWhere>;
}

export interface HiveOrganisationPeopleConnectOrCreateFieldInput {
  onCreate: HiveOrganisationPeopleConnectOrCreateFieldInputOnCreate;
  where: PeopleConnectOrCreateWhere;
}

export interface HiveOrganisationPeopleConnectOrCreateFieldInputOnCreate {
  node: PeopleCreateInput;
}

export interface HiveOrganisationPeopleConnectionSort {
  node?: InputMaybe<PeopleSort>;
}

export interface HiveOrganisationPeopleConnectionWhere {
  AND?: InputMaybe<Array<HiveOrganisationPeopleConnectionWhere>>;
  OR?: InputMaybe<Array<HiveOrganisationPeopleConnectionWhere>>;
  node?: InputMaybe<PeopleWhere>;
  node_NOT?: InputMaybe<PeopleWhere>;
}

export interface HiveOrganisationPeopleCreateFieldInput {
  node: PeopleCreateInput;
}

export interface HiveOrganisationPeopleDeleteFieldInput {
  delete?: InputMaybe<PeopleDeleteInput>;
  where?: InputMaybe<HiveOrganisationPeopleConnectionWhere>;
}

export interface HiveOrganisationPeopleDisconnectFieldInput {
  disconnect?: InputMaybe<PeopleDisconnectInput>;
  where?: InputMaybe<HiveOrganisationPeopleConnectionWhere>;
}

export interface HiveOrganisationPeopleFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationPeopleConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationPeopleConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationPeopleCreateFieldInput>>;
}

export interface HiveOrganisationPeopleNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveOrganisationPeopleNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveOrganisationPeopleNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveOrganisationPeopleUpdateConnectionInput {
  node?: InputMaybe<PeopleUpdateInput>;
}

export interface HiveOrganisationPeopleUpdateFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationPeopleConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationPeopleConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationPeopleCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveOrganisationPeopleDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveOrganisationPeopleDisconnectFieldInput>>;
  update?: InputMaybe<HiveOrganisationPeopleUpdateConnectionInput>;
  where?: InputMaybe<HiveOrganisationPeopleConnectionWhere>;
}

export interface HiveOrganisationProjectsAggregateInput {
  AND?: InputMaybe<Array<HiveOrganisationProjectsAggregateInput>>;
  OR?: InputMaybe<Array<HiveOrganisationProjectsAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveOrganisationProjectsNodeAggregationWhereInput>;
}

export interface HiveOrganisationProjectsConnectFieldInput {
  connect?: InputMaybe<Array<ProjectConnectInput>>;
  where?: InputMaybe<ProjectConnectWhere>;
}

export interface HiveOrganisationProjectsConnectOrCreateFieldInput {
  onCreate: HiveOrganisationProjectsConnectOrCreateFieldInputOnCreate;
  where: ProjectConnectOrCreateWhere;
}

export interface HiveOrganisationProjectsConnectOrCreateFieldInputOnCreate {
  node: ProjectCreateInput;
}

export interface HiveOrganisationProjectsConnectionSort {
  node?: InputMaybe<ProjectSort>;
}

export interface HiveOrganisationProjectsConnectionWhere {
  AND?: InputMaybe<Array<HiveOrganisationProjectsConnectionWhere>>;
  OR?: InputMaybe<Array<HiveOrganisationProjectsConnectionWhere>>;
  node?: InputMaybe<ProjectWhere>;
  node_NOT?: InputMaybe<ProjectWhere>;
}

export interface HiveOrganisationProjectsCreateFieldInput {
  node: ProjectCreateInput;
}

export interface HiveOrganisationProjectsDeleteFieldInput {
  delete?: InputMaybe<ProjectDeleteInput>;
  where?: InputMaybe<HiveOrganisationProjectsConnectionWhere>;
}

export interface HiveOrganisationProjectsDisconnectFieldInput {
  disconnect?: InputMaybe<ProjectDisconnectInput>;
  where?: InputMaybe<HiveOrganisationProjectsConnectionWhere>;
}

export interface HiveOrganisationProjectsFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationProjectsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationProjectsConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationProjectsCreateFieldInput>>;
}

export interface HiveOrganisationProjectsNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveOrganisationProjectsNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveOrganisationProjectsNodeAggregationWhereInput>>;
  endDate_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  startDate_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  status_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  status_EQUAL?: InputMaybe<Scalars["String"]>;
  status_GT?: InputMaybe<Scalars["Int"]>;
  status_GTE?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  status_LT?: InputMaybe<Scalars["Int"]>;
  status_LTE?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveOrganisationProjectsUpdateConnectionInput {
  node?: InputMaybe<ProjectUpdateInput>;
}

export interface HiveOrganisationProjectsUpdateFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationProjectsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationProjectsConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationProjectsCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveOrganisationProjectsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveOrganisationProjectsDisconnectFieldInput>>;
  update?: InputMaybe<HiveOrganisationProjectsUpdateConnectionInput>;
  where?: InputMaybe<HiveOrganisationProjectsConnectionWhere>;
}

export interface HiveOrganisationRelationInput {
  appliances?: InputMaybe<Array<HiveOrganisationAppliancesCreateFieldInput>>;
  equipment?: InputMaybe<Array<HiveOrganisationEquipmentCreateFieldInput>>;
  estimates?: InputMaybe<Array<HiveOrganisationEstimatesCreateFieldInput>>;
  integrations?: InputMaybe<
    Array<HiveOrganisationIntegrationsCreateFieldInput>
  >;
  members?: InputMaybe<Array<HiveOrganisationMembersCreateFieldInput>>;
  people?: InputMaybe<Array<HiveOrganisationPeopleCreateFieldInput>>;
  projects?: InputMaybe<Array<HiveOrganisationProjectsCreateFieldInput>>;
  roles?: InputMaybe<Array<HiveOrganisationRolesCreateFieldInput>>;
  schedule?: InputMaybe<Array<HiveOrganisationScheduleCreateFieldInput>>;
  timeline?: InputMaybe<Array<HiveOrganisationTimelineCreateFieldInput>>;
}

export interface HiveOrganisationRolesAggregateInput {
  AND?: InputMaybe<Array<HiveOrganisationRolesAggregateInput>>;
  OR?: InputMaybe<Array<HiveOrganisationRolesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveOrganisationRolesNodeAggregationWhereInput>;
}

export interface HiveOrganisationRolesConnectFieldInput {
  connect?: InputMaybe<Array<RoleConnectInput>>;
  where?: InputMaybe<RoleConnectWhere>;
}

export interface HiveOrganisationRolesConnectOrCreateFieldInput {
  onCreate: HiveOrganisationRolesConnectOrCreateFieldInputOnCreate;
  where: RoleConnectOrCreateWhere;
}

export interface HiveOrganisationRolesConnectOrCreateFieldInputOnCreate {
  node: RoleCreateInput;
}

export interface HiveOrganisationRolesConnectionSort {
  node?: InputMaybe<RoleSort>;
}

export interface HiveOrganisationRolesConnectionWhere {
  AND?: InputMaybe<Array<HiveOrganisationRolesConnectionWhere>>;
  OR?: InputMaybe<Array<HiveOrganisationRolesConnectionWhere>>;
  node?: InputMaybe<RoleWhere>;
  node_NOT?: InputMaybe<RoleWhere>;
}

export interface HiveOrganisationRolesCreateFieldInput {
  node: RoleCreateInput;
}

export interface HiveOrganisationRolesDeleteFieldInput {
  delete?: InputMaybe<RoleDeleteInput>;
  where?: InputMaybe<HiveOrganisationRolesConnectionWhere>;
}

export interface HiveOrganisationRolesDisconnectFieldInput {
  disconnect?: InputMaybe<RoleDisconnectInput>;
  where?: InputMaybe<HiveOrganisationRolesConnectionWhere>;
}

export interface HiveOrganisationRolesFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationRolesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationRolesConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationRolesCreateFieldInput>>;
}

export interface HiveOrganisationRolesNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveOrganisationRolesNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveOrganisationRolesNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveOrganisationRolesUpdateConnectionInput {
  node?: InputMaybe<RoleUpdateInput>;
}

export interface HiveOrganisationRolesUpdateFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationRolesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationRolesConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationRolesCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveOrganisationRolesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveOrganisationRolesDisconnectFieldInput>>;
  update?: InputMaybe<HiveOrganisationRolesUpdateConnectionInput>;
  where?: InputMaybe<HiveOrganisationRolesConnectionWhere>;
}

export interface HiveOrganisationScheduleAggregateInput {
  AND?: InputMaybe<Array<HiveOrganisationScheduleAggregateInput>>;
  OR?: InputMaybe<Array<HiveOrganisationScheduleAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveOrganisationScheduleNodeAggregationWhereInput>;
}

export interface HiveOrganisationScheduleConnectFieldInput {
  connect?: InputMaybe<Array<ScheduleItemConnectInput>>;
  where?: InputMaybe<ScheduleItemConnectWhere>;
}

export interface HiveOrganisationScheduleConnectOrCreateFieldInput {
  onCreate: HiveOrganisationScheduleConnectOrCreateFieldInputOnCreate;
  where: ScheduleItemConnectOrCreateWhere;
}

export interface HiveOrganisationScheduleConnectOrCreateFieldInputOnCreate {
  node: ScheduleItemCreateInput;
}

export interface HiveOrganisationScheduleConnectionSort {
  node?: InputMaybe<ScheduleItemSort>;
}

export interface HiveOrganisationScheduleConnectionWhere {
  AND?: InputMaybe<Array<HiveOrganisationScheduleConnectionWhere>>;
  OR?: InputMaybe<Array<HiveOrganisationScheduleConnectionWhere>>;
  node?: InputMaybe<ScheduleItemWhere>;
  node_NOT?: InputMaybe<ScheduleItemWhere>;
}

export interface HiveOrganisationScheduleCreateFieldInput {
  node: ScheduleItemCreateInput;
}

export interface HiveOrganisationScheduleDeleteFieldInput {
  delete?: InputMaybe<ScheduleItemDeleteInput>;
  where?: InputMaybe<HiveOrganisationScheduleConnectionWhere>;
}

export interface HiveOrganisationScheduleDisconnectFieldInput {
  disconnect?: InputMaybe<ScheduleItemDisconnectInput>;
  where?: InputMaybe<HiveOrganisationScheduleConnectionWhere>;
}

export interface HiveOrganisationScheduleFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationScheduleConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationScheduleConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationScheduleCreateFieldInput>>;
}

export interface HiveOrganisationScheduleNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveOrganisationScheduleNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveOrganisationScheduleNodeAggregationWhereInput>>;
  date_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  date_GT?: InputMaybe<Scalars["DateTime"]>;
  date_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_LT?: InputMaybe<Scalars["DateTime"]>;
  date_LTE?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
}

export interface HiveOrganisationScheduleUpdateConnectionInput {
  node?: InputMaybe<ScheduleItemUpdateInput>;
}

export interface HiveOrganisationScheduleUpdateFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationScheduleConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationScheduleConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationScheduleCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveOrganisationScheduleDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveOrganisationScheduleDisconnectFieldInput>>;
  update?: InputMaybe<HiveOrganisationScheduleUpdateConnectionInput>;
  where?: InputMaybe<HiveOrganisationScheduleConnectionWhere>;
}

/** Fields to sort HiveOrganisations by. The order in which sorts are applied is not guaranteed when specifying many fields in one HiveOrganisationSort object. */
export interface HiveOrganisationSort {
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
}

export interface HiveOrganisationTimelineAggregateInput {
  AND?: InputMaybe<Array<HiveOrganisationTimelineAggregateInput>>;
  OR?: InputMaybe<Array<HiveOrganisationTimelineAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveOrganisationTimelineNodeAggregationWhereInput>;
}

export interface HiveOrganisationTimelineConnectFieldInput {
  connect?: InputMaybe<Array<TimelineItemConnectInput>>;
  where?: InputMaybe<TimelineItemConnectWhere>;
}

export interface HiveOrganisationTimelineConnectOrCreateFieldInput {
  onCreate: HiveOrganisationTimelineConnectOrCreateFieldInputOnCreate;
  where: TimelineItemConnectOrCreateWhere;
}

export interface HiveOrganisationTimelineConnectOrCreateFieldInputOnCreate {
  node: TimelineItemCreateInput;
}

export interface HiveOrganisationTimelineConnectionSort {
  node?: InputMaybe<TimelineItemSort>;
}

export interface HiveOrganisationTimelineConnectionWhere {
  AND?: InputMaybe<Array<HiveOrganisationTimelineConnectionWhere>>;
  OR?: InputMaybe<Array<HiveOrganisationTimelineConnectionWhere>>;
  node?: InputMaybe<TimelineItemWhere>;
  node_NOT?: InputMaybe<TimelineItemWhere>;
}

export interface HiveOrganisationTimelineCreateFieldInput {
  node: TimelineItemCreateInput;
}

export interface HiveOrganisationTimelineDeleteFieldInput {
  delete?: InputMaybe<TimelineItemDeleteInput>;
  where?: InputMaybe<HiveOrganisationTimelineConnectionWhere>;
}

export interface HiveOrganisationTimelineDisconnectFieldInput {
  disconnect?: InputMaybe<TimelineItemDisconnectInput>;
  where?: InputMaybe<HiveOrganisationTimelineConnectionWhere>;
}

export interface HiveOrganisationTimelineFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationTimelineConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationTimelineConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationTimelineCreateFieldInput>>;
}

export interface HiveOrganisationTimelineNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveOrganisationTimelineNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveOrganisationTimelineNodeAggregationWhereInput>>;
  endDate_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  notes_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  notes_EQUAL?: InputMaybe<Scalars["String"]>;
  notes_GT?: InputMaybe<Scalars["Int"]>;
  notes_GTE?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  notes_LT?: InputMaybe<Scalars["Int"]>;
  notes_LTE?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  startDate_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  timeline_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  timeline_EQUAL?: InputMaybe<Scalars["String"]>;
  timeline_GT?: InputMaybe<Scalars["Int"]>;
  timeline_GTE?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  timeline_LT?: InputMaybe<Scalars["Int"]>;
  timeline_LTE?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveOrganisationTimelineUpdateConnectionInput {
  node?: InputMaybe<TimelineItemUpdateInput>;
}

export interface HiveOrganisationTimelineUpdateFieldInput {
  connect?: InputMaybe<Array<HiveOrganisationTimelineConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<HiveOrganisationTimelineConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<HiveOrganisationTimelineCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveOrganisationTimelineDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveOrganisationTimelineDisconnectFieldInput>>;
  update?: InputMaybe<HiveOrganisationTimelineUpdateConnectionInput>;
  where?: InputMaybe<HiveOrganisationTimelineConnectionWhere>;
}

export interface HiveOrganisationUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface HiveOrganisationUpdateInput {
  appliances?: InputMaybe<Array<HiveOrganisationAppliancesUpdateFieldInput>>;
  equipment?: InputMaybe<Array<HiveOrganisationEquipmentUpdateFieldInput>>;
  estimates?: InputMaybe<Array<HiveOrganisationEstimatesUpdateFieldInput>>;
  integrations?: InputMaybe<
    Array<HiveOrganisationIntegrationsUpdateFieldInput>
  >;
  members?: InputMaybe<Array<HiveOrganisationMembersUpdateFieldInput>>;
  name?: InputMaybe<Scalars["String"]>;
  people?: InputMaybe<Array<HiveOrganisationPeopleUpdateFieldInput>>;
  projects?: InputMaybe<Array<HiveOrganisationProjectsUpdateFieldInput>>;
  roles?: InputMaybe<Array<HiveOrganisationRolesUpdateFieldInput>>;
  schedule?: InputMaybe<Array<HiveOrganisationScheduleUpdateFieldInput>>;
  timeline?: InputMaybe<Array<HiveOrganisationTimelineUpdateFieldInput>>;
}

export interface HiveOrganisationWhere {
  AND?: InputMaybe<Array<HiveOrganisationWhere>>;
  OR?: InputMaybe<Array<HiveOrganisationWhere>>;
  appliances?: InputMaybe<HiveApplianceWhere>;
  appliancesAggregate?: InputMaybe<HiveOrganisationAppliancesAggregateInput>;
  appliancesConnection?: InputMaybe<HiveOrganisationAppliancesConnectionWhere>;
  appliancesConnection_NOT?: InputMaybe<HiveOrganisationAppliancesConnectionWhere>;
  appliances_NOT?: InputMaybe<HiveApplianceWhere>;
  equipment?: InputMaybe<EquipmentWhere>;
  equipmentAggregate?: InputMaybe<HiveOrganisationEquipmentAggregateInput>;
  equipmentConnection?: InputMaybe<HiveOrganisationEquipmentConnectionWhere>;
  equipmentConnection_NOT?: InputMaybe<HiveOrganisationEquipmentConnectionWhere>;
  equipment_NOT?: InputMaybe<EquipmentWhere>;
  estimates?: InputMaybe<EstimateWhere>;
  estimatesAggregate?: InputMaybe<HiveOrganisationEstimatesAggregateInput>;
  estimatesConnection?: InputMaybe<HiveOrganisationEstimatesConnectionWhere>;
  estimatesConnection_NOT?: InputMaybe<HiveOrganisationEstimatesConnectionWhere>;
  estimates_NOT?: InputMaybe<EstimateWhere>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  integrations?: InputMaybe<HiveIntegrationInstanceWhere>;
  integrationsAggregate?: InputMaybe<HiveOrganisationIntegrationsAggregateInput>;
  integrationsConnection?: InputMaybe<HiveOrganisationIntegrationsConnectionWhere>;
  integrationsConnection_NOT?: InputMaybe<HiveOrganisationIntegrationsConnectionWhere>;
  integrations_NOT?: InputMaybe<HiveIntegrationInstanceWhere>;
  members?: InputMaybe<HiveUserWhere>;
  membersAggregate?: InputMaybe<HiveOrganisationMembersAggregateInput>;
  membersConnection?: InputMaybe<HiveOrganisationMembersConnectionWhere>;
  membersConnection_NOT?: InputMaybe<HiveOrganisationMembersConnectionWhere>;
  members_NOT?: InputMaybe<HiveUserWhere>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  people?: InputMaybe<PeopleWhere>;
  peopleAggregate?: InputMaybe<HiveOrganisationPeopleAggregateInput>;
  peopleConnection?: InputMaybe<HiveOrganisationPeopleConnectionWhere>;
  peopleConnection_NOT?: InputMaybe<HiveOrganisationPeopleConnectionWhere>;
  people_NOT?: InputMaybe<PeopleWhere>;
  projects?: InputMaybe<ProjectWhere>;
  projectsAggregate?: InputMaybe<HiveOrganisationProjectsAggregateInput>;
  projectsConnection?: InputMaybe<HiveOrganisationProjectsConnectionWhere>;
  projectsConnection_NOT?: InputMaybe<HiveOrganisationProjectsConnectionWhere>;
  projects_NOT?: InputMaybe<ProjectWhere>;
  roles?: InputMaybe<RoleWhere>;
  rolesAggregate?: InputMaybe<HiveOrganisationRolesAggregateInput>;
  rolesConnection?: InputMaybe<HiveOrganisationRolesConnectionWhere>;
  rolesConnection_NOT?: InputMaybe<HiveOrganisationRolesConnectionWhere>;
  roles_NOT?: InputMaybe<RoleWhere>;
  schedule?: InputMaybe<ScheduleItemWhere>;
  scheduleAggregate?: InputMaybe<HiveOrganisationScheduleAggregateInput>;
  scheduleConnection?: InputMaybe<HiveOrganisationScheduleConnectionWhere>;
  scheduleConnection_NOT?: InputMaybe<HiveOrganisationScheduleConnectionWhere>;
  schedule_NOT?: InputMaybe<ScheduleItemWhere>;
  timeline?: InputMaybe<TimelineItemWhere>;
  timelineAggregate?: InputMaybe<HiveOrganisationTimelineAggregateInput>;
  timelineConnection?: InputMaybe<HiveOrganisationTimelineConnectionWhere>;
  timelineConnection_NOT?: InputMaybe<HiveOrganisationTimelineConnectionWhere>;
  timeline_NOT?: InputMaybe<TimelineItemWhere>;
}

export interface HiveServiceConnectWhere {
  node: HiveServiceWhere;
}

export interface HiveServiceCreateInput {
  id: Scalars["ID"];
  name?: InputMaybe<Scalars["String"]>;
}

export interface HiveServiceOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more HiveServiceSort objects to sort HiveServices by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<HiveServiceSort>>>;
}

/** Fields to sort HiveServices by. The order in which sorts are applied is not guaranteed when specifying many fields in one HiveServiceSort object. */
export interface HiveServiceSort {
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
}

export interface HiveServiceUpdateInput {
  id?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
}

export interface HiveServiceWhere {
  AND?: InputMaybe<Array<HiveServiceWhere>>;
  OR?: InputMaybe<Array<HiveServiceWhere>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

export interface HiveTypeConnectInput {
  fields?: InputMaybe<Array<HiveTypeFieldsConnectFieldInput>>;
  usedIn?: InputMaybe<Array<HiveTypeUsedInConnectFieldInput>>;
}

export interface HiveTypeConnectOrCreateInput {
  fields?: InputMaybe<Array<HiveTypeFieldsConnectOrCreateFieldInput>>;
  usedIn?: InputMaybe<Array<HiveTypeUsedInConnectOrCreateFieldInput>>;
}

export interface HiveTypeConnectOrCreateWhere {
  node: HiveTypeUniqueWhere;
}

export interface HiveTypeConnectWhere {
  node: HiveTypeWhere;
}

export interface HiveTypeCreateInput {
  fields?: InputMaybe<HiveTypeFieldsFieldInput>;
  name?: InputMaybe<Scalars["String"]>;
  usedIn?: InputMaybe<HiveTypeUsedInFieldInput>;
}

export interface HiveTypeDeleteInput {
  fields?: InputMaybe<Array<HiveTypeFieldsDeleteFieldInput>>;
  usedIn?: InputMaybe<Array<HiveTypeUsedInDeleteFieldInput>>;
}

export interface HiveTypeDisconnectInput {
  fields?: InputMaybe<Array<HiveTypeFieldsDisconnectFieldInput>>;
  usedIn?: InputMaybe<Array<HiveTypeUsedInDisconnectFieldInput>>;
}

export interface HiveTypeFieldConnectOrCreateWhere {
  node: HiveTypeFieldUniqueWhere;
}

export interface HiveTypeFieldConnectWhere {
  node: HiveTypeFieldWhere;
}

export interface HiveTypeFieldCreateInput {
  name?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
}

export interface HiveTypeFieldOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more HiveTypeFieldSort objects to sort HiveTypeFields by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<HiveTypeFieldSort>>>;
}

/** Fields to sort HiveTypeFields by. The order in which sorts are applied is not guaranteed when specifying many fields in one HiveTypeFieldSort object. */
export interface HiveTypeFieldSort {
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  type?: InputMaybe<SortDirection>;
}

export interface HiveTypeFieldUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface HiveTypeFieldUpdateInput {
  name?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
}

export interface HiveTypeFieldWhere {
  AND?: InputMaybe<Array<HiveTypeFieldWhere>>;
  OR?: InputMaybe<Array<HiveTypeFieldWhere>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
  type_CONTAINS?: InputMaybe<Scalars["String"]>;
  type_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  type_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  type_NOT?: InputMaybe<Scalars["String"]>;
  type_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  type_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  type_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  type_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  type_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

export interface HiveTypeFieldsAggregateInput {
  AND?: InputMaybe<Array<HiveTypeFieldsAggregateInput>>;
  OR?: InputMaybe<Array<HiveTypeFieldsAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveTypeFieldsNodeAggregationWhereInput>;
}

export interface HiveTypeFieldsConnectFieldInput {
  where?: InputMaybe<HiveTypeFieldConnectWhere>;
}

export interface HiveTypeFieldsConnectOrCreateFieldInput {
  onCreate: HiveTypeFieldsConnectOrCreateFieldInputOnCreate;
  where: HiveTypeFieldConnectOrCreateWhere;
}

export interface HiveTypeFieldsConnectOrCreateFieldInputOnCreate {
  node: HiveTypeFieldCreateInput;
}

export interface HiveTypeFieldsConnectionSort {
  node?: InputMaybe<HiveTypeFieldSort>;
}

export interface HiveTypeFieldsConnectionWhere {
  AND?: InputMaybe<Array<HiveTypeFieldsConnectionWhere>>;
  OR?: InputMaybe<Array<HiveTypeFieldsConnectionWhere>>;
  node?: InputMaybe<HiveTypeFieldWhere>;
  node_NOT?: InputMaybe<HiveTypeFieldWhere>;
}

export interface HiveTypeFieldsCreateFieldInput {
  node: HiveTypeFieldCreateInput;
}

export interface HiveTypeFieldsDeleteFieldInput {
  where?: InputMaybe<HiveTypeFieldsConnectionWhere>;
}

export interface HiveTypeFieldsDisconnectFieldInput {
  where?: InputMaybe<HiveTypeFieldsConnectionWhere>;
}

export interface HiveTypeFieldsFieldInput {
  connect?: InputMaybe<Array<HiveTypeFieldsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<HiveTypeFieldsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<HiveTypeFieldsCreateFieldInput>>;
}

export interface HiveTypeFieldsNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveTypeFieldsNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveTypeFieldsNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  type_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  type_EQUAL?: InputMaybe<Scalars["String"]>;
  type_GT?: InputMaybe<Scalars["Int"]>;
  type_GTE?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  type_LT?: InputMaybe<Scalars["Int"]>;
  type_LTE?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveTypeFieldsUpdateConnectionInput {
  node?: InputMaybe<HiveTypeFieldUpdateInput>;
}

export interface HiveTypeFieldsUpdateFieldInput {
  connect?: InputMaybe<Array<HiveTypeFieldsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<HiveTypeFieldsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<HiveTypeFieldsCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveTypeFieldsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveTypeFieldsDisconnectFieldInput>>;
  update?: InputMaybe<HiveTypeFieldsUpdateConnectionInput>;
  where?: InputMaybe<HiveTypeFieldsConnectionWhere>;
}

export interface HiveTypeOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more HiveTypeSort objects to sort HiveTypes by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<HiveTypeSort>>>;
}

export interface HiveTypeRelationInput {
  fields?: InputMaybe<Array<HiveTypeFieldsCreateFieldInput>>;
  usedIn?: InputMaybe<Array<HiveTypeUsedInCreateFieldInput>>;
}

/** Fields to sort HiveTypes by. The order in which sorts are applied is not guaranteed when specifying many fields in one HiveTypeSort object. */
export interface HiveTypeSort {
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
}

export interface HiveTypeUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface HiveTypeUpdateInput {
  fields?: InputMaybe<Array<HiveTypeFieldsUpdateFieldInput>>;
  name?: InputMaybe<Scalars["String"]>;
  usedIn?: InputMaybe<Array<HiveTypeUsedInUpdateFieldInput>>;
}

export interface HiveTypeUsedInAggregateInput {
  AND?: InputMaybe<Array<HiveTypeUsedInAggregateInput>>;
  OR?: InputMaybe<Array<HiveTypeUsedInAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveTypeUsedInNodeAggregationWhereInput>;
}

export interface HiveTypeUsedInConnectFieldInput {
  connect?: InputMaybe<Array<HiveApplianceConnectInput>>;
  where?: InputMaybe<HiveApplianceConnectWhere>;
}

export interface HiveTypeUsedInConnectOrCreateFieldInput {
  onCreate: HiveTypeUsedInConnectOrCreateFieldInputOnCreate;
  where: HiveApplianceConnectOrCreateWhere;
}

export interface HiveTypeUsedInConnectOrCreateFieldInputOnCreate {
  node: HiveApplianceCreateInput;
}

export interface HiveTypeUsedInConnectionSort {
  node?: InputMaybe<HiveApplianceSort>;
}

export interface HiveTypeUsedInConnectionWhere {
  AND?: InputMaybe<Array<HiveTypeUsedInConnectionWhere>>;
  OR?: InputMaybe<Array<HiveTypeUsedInConnectionWhere>>;
  node?: InputMaybe<HiveApplianceWhere>;
  node_NOT?: InputMaybe<HiveApplianceWhere>;
}

export interface HiveTypeUsedInCreateFieldInput {
  node: HiveApplianceCreateInput;
}

export interface HiveTypeUsedInDeleteFieldInput {
  delete?: InputMaybe<HiveApplianceDeleteInput>;
  where?: InputMaybe<HiveTypeUsedInConnectionWhere>;
}

export interface HiveTypeUsedInDisconnectFieldInput {
  disconnect?: InputMaybe<HiveApplianceDisconnectInput>;
  where?: InputMaybe<HiveTypeUsedInConnectionWhere>;
}

export interface HiveTypeUsedInFieldInput {
  connect?: InputMaybe<Array<HiveTypeUsedInConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<HiveTypeUsedInConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<HiveTypeUsedInCreateFieldInput>>;
}

export interface HiveTypeUsedInNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveTypeUsedInNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveTypeUsedInNodeAggregationWhereInput>>;
  description_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  description_EQUAL?: InputMaybe<Scalars["String"]>;
  description_GT?: InputMaybe<Scalars["Int"]>;
  description_GTE?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  description_LT?: InputMaybe<Scalars["Int"]>;
  description_LTE?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  label_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  label_EQUAL?: InputMaybe<Scalars["String"]>;
  label_GT?: InputMaybe<Scalars["Int"]>;
  label_GTE?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  label_LT?: InputMaybe<Scalars["Int"]>;
  label_LTE?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveTypeUsedInUpdateConnectionInput {
  node?: InputMaybe<HiveApplianceUpdateInput>;
}

export interface HiveTypeUsedInUpdateFieldInput {
  connect?: InputMaybe<Array<HiveTypeUsedInConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<HiveTypeUsedInConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<HiveTypeUsedInCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveTypeUsedInDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveTypeUsedInDisconnectFieldInput>>;
  update?: InputMaybe<HiveTypeUsedInUpdateConnectionInput>;
  where?: InputMaybe<HiveTypeUsedInConnectionWhere>;
}

export interface HiveTypeWhere {
  AND?: InputMaybe<Array<HiveTypeWhere>>;
  OR?: InputMaybe<Array<HiveTypeWhere>>;
  fields?: InputMaybe<HiveTypeFieldWhere>;
  fieldsAggregate?: InputMaybe<HiveTypeFieldsAggregateInput>;
  fieldsConnection?: InputMaybe<HiveTypeFieldsConnectionWhere>;
  fieldsConnection_NOT?: InputMaybe<HiveTypeFieldsConnectionWhere>;
  fields_NOT?: InputMaybe<HiveTypeFieldWhere>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  usedIn?: InputMaybe<HiveApplianceWhere>;
  usedInAggregate?: InputMaybe<HiveTypeUsedInAggregateInput>;
  usedInConnection?: InputMaybe<HiveTypeUsedInConnectionWhere>;
  usedInConnection_NOT?: InputMaybe<HiveTypeUsedInConnectionWhere>;
  usedIn_NOT?: InputMaybe<HiveApplianceWhere>;
}

export interface HiveUserConnectInput {
  organisation?: InputMaybe<HiveUserOrganisationConnectFieldInput>;
  roles?: InputMaybe<Array<HiveUserRolesConnectFieldInput>>;
}

export interface HiveUserConnectOrCreateInput {
  organisation?: InputMaybe<HiveUserOrganisationConnectOrCreateFieldInput>;
  roles?: InputMaybe<Array<HiveUserRolesConnectOrCreateFieldInput>>;
}

export interface HiveUserConnectOrCreateWhere {
  node: HiveUserUniqueWhere;
}

export interface HiveUserConnectWhere {
  node: HiveUserWhere;
}

export interface HiveUserCreateInput {
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveUserOrganisationFieldInput>;
  password?: InputMaybe<Scalars["String"]>;
  roles?: InputMaybe<HiveUserRolesFieldInput>;
  username?: InputMaybe<Scalars["String"]>;
}

export interface HiveUserDeleteInput {
  organisation?: InputMaybe<HiveUserOrganisationDeleteFieldInput>;
  roles?: InputMaybe<Array<HiveUserRolesDeleteFieldInput>>;
}

export interface HiveUserDisconnectInput {
  organisation?: InputMaybe<HiveUserOrganisationDisconnectFieldInput>;
  roles?: InputMaybe<Array<HiveUserRolesDisconnectFieldInput>>;
}

export interface HiveUserOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more HiveUserSort objects to sort HiveUsers by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<HiveUserSort>>>;
}

export interface HiveUserOrganisationAggregateInput {
  AND?: InputMaybe<Array<HiveUserOrganisationAggregateInput>>;
  OR?: InputMaybe<Array<HiveUserOrganisationAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveUserOrganisationNodeAggregationWhereInput>;
}

export interface HiveUserOrganisationConnectFieldInput {
  connect?: InputMaybe<HiveOrganisationConnectInput>;
  where?: InputMaybe<HiveOrganisationConnectWhere>;
}

export interface HiveUserOrganisationConnectOrCreateFieldInput {
  onCreate: HiveUserOrganisationConnectOrCreateFieldInputOnCreate;
  where: HiveOrganisationConnectOrCreateWhere;
}

export interface HiveUserOrganisationConnectOrCreateFieldInputOnCreate {
  node: HiveOrganisationCreateInput;
}

export interface HiveUserOrganisationConnectionSort {
  node?: InputMaybe<HiveOrganisationSort>;
}

export interface HiveUserOrganisationConnectionWhere {
  AND?: InputMaybe<Array<HiveUserOrganisationConnectionWhere>>;
  OR?: InputMaybe<Array<HiveUserOrganisationConnectionWhere>>;
  node?: InputMaybe<HiveOrganisationWhere>;
  node_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface HiveUserOrganisationCreateFieldInput {
  node: HiveOrganisationCreateInput;
}

export interface HiveUserOrganisationDeleteFieldInput {
  delete?: InputMaybe<HiveOrganisationDeleteInput>;
  where?: InputMaybe<HiveUserOrganisationConnectionWhere>;
}

export interface HiveUserOrganisationDisconnectFieldInput {
  disconnect?: InputMaybe<HiveOrganisationDisconnectInput>;
  where?: InputMaybe<HiveUserOrganisationConnectionWhere>;
}

export interface HiveUserOrganisationFieldInput {
  connect?: InputMaybe<HiveUserOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<HiveUserOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<HiveUserOrganisationCreateFieldInput>;
}

export interface HiveUserOrganisationNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveUserOrganisationNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveUserOrganisationNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveUserOrganisationUpdateConnectionInput {
  node?: InputMaybe<HiveOrganisationUpdateInput>;
}

export interface HiveUserOrganisationUpdateFieldInput {
  connect?: InputMaybe<HiveUserOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<HiveUserOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<HiveUserOrganisationCreateFieldInput>;
  delete?: InputMaybe<HiveUserOrganisationDeleteFieldInput>;
  disconnect?: InputMaybe<HiveUserOrganisationDisconnectFieldInput>;
  update?: InputMaybe<HiveUserOrganisationUpdateConnectionInput>;
  where?: InputMaybe<HiveUserOrganisationConnectionWhere>;
}

export interface HiveUserRelationInput {
  organisation?: InputMaybe<HiveUserOrganisationCreateFieldInput>;
  roles?: InputMaybe<Array<HiveUserRolesCreateFieldInput>>;
}

export interface HiveUserRolesAggregateInput {
  AND?: InputMaybe<Array<HiveUserRolesAggregateInput>>;
  OR?: InputMaybe<Array<HiveUserRolesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<HiveUserRolesNodeAggregationWhereInput>;
}

export interface HiveUserRolesConnectFieldInput {
  connect?: InputMaybe<Array<RoleConnectInput>>;
  where?: InputMaybe<RoleConnectWhere>;
}

export interface HiveUserRolesConnectOrCreateFieldInput {
  onCreate: HiveUserRolesConnectOrCreateFieldInputOnCreate;
  where: RoleConnectOrCreateWhere;
}

export interface HiveUserRolesConnectOrCreateFieldInputOnCreate {
  node: RoleCreateInput;
}

export interface HiveUserRolesConnectionSort {
  node?: InputMaybe<RoleSort>;
}

export interface HiveUserRolesConnectionWhere {
  AND?: InputMaybe<Array<HiveUserRolesConnectionWhere>>;
  OR?: InputMaybe<Array<HiveUserRolesConnectionWhere>>;
  node?: InputMaybe<RoleWhere>;
  node_NOT?: InputMaybe<RoleWhere>;
}

export interface HiveUserRolesCreateFieldInput {
  node: RoleCreateInput;
}

export interface HiveUserRolesDeleteFieldInput {
  delete?: InputMaybe<RoleDeleteInput>;
  where?: InputMaybe<HiveUserRolesConnectionWhere>;
}

export interface HiveUserRolesDisconnectFieldInput {
  disconnect?: InputMaybe<RoleDisconnectInput>;
  where?: InputMaybe<HiveUserRolesConnectionWhere>;
}

export interface HiveUserRolesFieldInput {
  connect?: InputMaybe<Array<HiveUserRolesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<HiveUserRolesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<HiveUserRolesCreateFieldInput>>;
}

export interface HiveUserRolesNodeAggregationWhereInput {
  AND?: InputMaybe<Array<HiveUserRolesNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<HiveUserRolesNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface HiveUserRolesUpdateConnectionInput {
  node?: InputMaybe<RoleUpdateInput>;
}

export interface HiveUserRolesUpdateFieldInput {
  connect?: InputMaybe<Array<HiveUserRolesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<HiveUserRolesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<HiveUserRolesCreateFieldInput>>;
  delete?: InputMaybe<Array<HiveUserRolesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<HiveUserRolesDisconnectFieldInput>>;
  update?: InputMaybe<HiveUserRolesUpdateConnectionInput>;
  where?: InputMaybe<HiveUserRolesConnectionWhere>;
}

/** Fields to sort HiveUsers by. The order in which sorts are applied is not guaranteed when specifying many fields in one HiveUserSort object. */
export interface HiveUserSort {
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  password?: InputMaybe<SortDirection>;
  username?: InputMaybe<SortDirection>;
}

export interface HiveUserUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface HiveUserUpdateInput {
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveUserOrganisationUpdateFieldInput>;
  password?: InputMaybe<Scalars["String"]>;
  roles?: InputMaybe<Array<HiveUserRolesUpdateFieldInput>>;
  username?: InputMaybe<Scalars["String"]>;
}

export interface HiveUserWhere {
  AND?: InputMaybe<Array<HiveUserWhere>>;
  OR?: InputMaybe<Array<HiveUserWhere>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveOrganisationWhere>;
  organisationAggregate?: InputMaybe<HiveUserOrganisationAggregateInput>;
  organisationConnection?: InputMaybe<HiveUserOrganisationConnectionWhere>;
  organisationConnection_NOT?: InputMaybe<HiveUserOrganisationConnectionWhere>;
  organisation_NOT?: InputMaybe<HiveOrganisationWhere>;
  password?: InputMaybe<Scalars["String"]>;
  password_CONTAINS?: InputMaybe<Scalars["String"]>;
  password_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  password_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  password_NOT?: InputMaybe<Scalars["String"]>;
  password_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  password_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  password_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  password_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  password_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  roles?: InputMaybe<RoleWhere>;
  rolesAggregate?: InputMaybe<HiveUserRolesAggregateInput>;
  rolesConnection?: InputMaybe<HiveUserRolesConnectionWhere>;
  rolesConnection_NOT?: InputMaybe<HiveUserRolesConnectionWhere>;
  roles_NOT?: InputMaybe<RoleWhere>;
  username?: InputMaybe<Scalars["String"]>;
  username_CONTAINS?: InputMaybe<Scalars["String"]>;
  username_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  username_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  username_NOT?: InputMaybe<Scalars["String"]>;
  username_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  username_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  username_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  username_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  username_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

export interface PeopleConnectInput {
  organisation?: InputMaybe<PeopleOrganisationConnectFieldInput>;
}

export interface PeopleConnectOrCreateInput {
  organisation?: InputMaybe<PeopleOrganisationConnectOrCreateFieldInput>;
}

export interface PeopleConnectOrCreateWhere {
  node: PeopleUniqueWhere;
}

export interface PeopleConnectWhere {
  node: PeopleWhere;
}

export interface PeopleCreateInput {
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<PeopleOrganisationFieldInput>;
}

export interface PeopleDeleteInput {
  organisation?: InputMaybe<PeopleOrganisationDeleteFieldInput>;
}

export interface PeopleDisconnectInput {
  organisation?: InputMaybe<PeopleOrganisationDisconnectFieldInput>;
}

export interface PeopleOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more PeopleSort objects to sort People by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<PeopleSort>>>;
}

export interface PeopleOrganisationAggregateInput {
  AND?: InputMaybe<Array<PeopleOrganisationAggregateInput>>;
  OR?: InputMaybe<Array<PeopleOrganisationAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<PeopleOrganisationNodeAggregationWhereInput>;
}

export interface PeopleOrganisationConnectFieldInput {
  connect?: InputMaybe<HiveOrganisationConnectInput>;
  where?: InputMaybe<HiveOrganisationConnectWhere>;
}

export interface PeopleOrganisationConnectOrCreateFieldInput {
  onCreate: PeopleOrganisationConnectOrCreateFieldInputOnCreate;
  where: HiveOrganisationConnectOrCreateWhere;
}

export interface PeopleOrganisationConnectOrCreateFieldInputOnCreate {
  node: HiveOrganisationCreateInput;
}

export interface PeopleOrganisationConnectionSort {
  node?: InputMaybe<HiveOrganisationSort>;
}

export interface PeopleOrganisationConnectionWhere {
  AND?: InputMaybe<Array<PeopleOrganisationConnectionWhere>>;
  OR?: InputMaybe<Array<PeopleOrganisationConnectionWhere>>;
  node?: InputMaybe<HiveOrganisationWhere>;
  node_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface PeopleOrganisationCreateFieldInput {
  node: HiveOrganisationCreateInput;
}

export interface PeopleOrganisationDeleteFieldInput {
  delete?: InputMaybe<HiveOrganisationDeleteInput>;
  where?: InputMaybe<PeopleOrganisationConnectionWhere>;
}

export interface PeopleOrganisationDisconnectFieldInput {
  disconnect?: InputMaybe<HiveOrganisationDisconnectInput>;
  where?: InputMaybe<PeopleOrganisationConnectionWhere>;
}

export interface PeopleOrganisationFieldInput {
  connect?: InputMaybe<PeopleOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<PeopleOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<PeopleOrganisationCreateFieldInput>;
}

export interface PeopleOrganisationNodeAggregationWhereInput {
  AND?: InputMaybe<Array<PeopleOrganisationNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<PeopleOrganisationNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface PeopleOrganisationUpdateConnectionInput {
  node?: InputMaybe<HiveOrganisationUpdateInput>;
}

export interface PeopleOrganisationUpdateFieldInput {
  connect?: InputMaybe<PeopleOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<PeopleOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<PeopleOrganisationCreateFieldInput>;
  delete?: InputMaybe<PeopleOrganisationDeleteFieldInput>;
  disconnect?: InputMaybe<PeopleOrganisationDisconnectFieldInput>;
  update?: InputMaybe<PeopleOrganisationUpdateConnectionInput>;
  where?: InputMaybe<PeopleOrganisationConnectionWhere>;
}

export interface PeopleRelationInput {
  organisation?: InputMaybe<PeopleOrganisationCreateFieldInput>;
}

/** Fields to sort People by. The order in which sorts are applied is not guaranteed when specifying many fields in one PeopleSort object. */
export interface PeopleSort {
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
}

export interface PeopleUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface PeopleUpdateInput {
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<PeopleOrganisationUpdateFieldInput>;
}

export interface PeopleWhere {
  AND?: InputMaybe<Array<PeopleWhere>>;
  OR?: InputMaybe<Array<PeopleWhere>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveOrganisationWhere>;
  organisationAggregate?: InputMaybe<PeopleOrganisationAggregateInput>;
  organisationConnection?: InputMaybe<PeopleOrganisationConnectionWhere>;
  organisationConnection_NOT?: InputMaybe<PeopleOrganisationConnectionWhere>;
  organisation_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface PermissionConnectInput {
  roles?: InputMaybe<Array<PermissionRolesConnectFieldInput>>;
}

export interface PermissionConnectOrCreateInput {
  roles?: InputMaybe<Array<PermissionRolesConnectOrCreateFieldInput>>;
}

export interface PermissionConnectOrCreateWhere {
  node: PermissionUniqueWhere;
}

export interface PermissionConnectWhere {
  node: PermissionWhere;
}

export interface PermissionCreateInput {
  action?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  roles?: InputMaybe<PermissionRolesFieldInput>;
  scope?: InputMaybe<Scalars["String"]>;
}

export interface PermissionDeleteInput {
  roles?: InputMaybe<Array<PermissionRolesDeleteFieldInput>>;
}

export interface PermissionDisconnectInput {
  roles?: InputMaybe<Array<PermissionRolesDisconnectFieldInput>>;
}

export interface PermissionOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more PermissionSort objects to sort Permissions by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<PermissionSort>>>;
}

export interface PermissionRelationInput {
  roles?: InputMaybe<Array<PermissionRolesCreateFieldInput>>;
}

export interface PermissionRolesAggregateInput {
  AND?: InputMaybe<Array<PermissionRolesAggregateInput>>;
  OR?: InputMaybe<Array<PermissionRolesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<PermissionRolesNodeAggregationWhereInput>;
}

export interface PermissionRolesConnectFieldInput {
  connect?: InputMaybe<Array<RoleConnectInput>>;
  where?: InputMaybe<RoleConnectWhere>;
}

export interface PermissionRolesConnectOrCreateFieldInput {
  onCreate: PermissionRolesConnectOrCreateFieldInputOnCreate;
  where: RoleConnectOrCreateWhere;
}

export interface PermissionRolesConnectOrCreateFieldInputOnCreate {
  node: RoleCreateInput;
}

export interface PermissionRolesConnectionSort {
  node?: InputMaybe<RoleSort>;
}

export interface PermissionRolesConnectionWhere {
  AND?: InputMaybe<Array<PermissionRolesConnectionWhere>>;
  OR?: InputMaybe<Array<PermissionRolesConnectionWhere>>;
  node?: InputMaybe<RoleWhere>;
  node_NOT?: InputMaybe<RoleWhere>;
}

export interface PermissionRolesCreateFieldInput {
  node: RoleCreateInput;
}

export interface PermissionRolesDeleteFieldInput {
  delete?: InputMaybe<RoleDeleteInput>;
  where?: InputMaybe<PermissionRolesConnectionWhere>;
}

export interface PermissionRolesDisconnectFieldInput {
  disconnect?: InputMaybe<RoleDisconnectInput>;
  where?: InputMaybe<PermissionRolesConnectionWhere>;
}

export interface PermissionRolesFieldInput {
  connect?: InputMaybe<Array<PermissionRolesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<PermissionRolesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<PermissionRolesCreateFieldInput>>;
}

export interface PermissionRolesNodeAggregationWhereInput {
  AND?: InputMaybe<Array<PermissionRolesNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<PermissionRolesNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface PermissionRolesUpdateConnectionInput {
  node?: InputMaybe<RoleUpdateInput>;
}

export interface PermissionRolesUpdateFieldInput {
  connect?: InputMaybe<Array<PermissionRolesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<PermissionRolesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<PermissionRolesCreateFieldInput>>;
  delete?: InputMaybe<Array<PermissionRolesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<PermissionRolesDisconnectFieldInput>>;
  update?: InputMaybe<PermissionRolesUpdateConnectionInput>;
  where?: InputMaybe<PermissionRolesConnectionWhere>;
}

/** Fields to sort Permissions by. The order in which sorts are applied is not guaranteed when specifying many fields in one PermissionSort object. */
export interface PermissionSort {
  action?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  scope?: InputMaybe<SortDirection>;
}

export interface PermissionUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface PermissionUpdateInput {
  action?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  roles?: InputMaybe<Array<PermissionRolesUpdateFieldInput>>;
  scope?: InputMaybe<Scalars["String"]>;
}

export interface PermissionWhere {
  AND?: InputMaybe<Array<PermissionWhere>>;
  OR?: InputMaybe<Array<PermissionWhere>>;
  action?: InputMaybe<Scalars["String"]>;
  action_CONTAINS?: InputMaybe<Scalars["String"]>;
  action_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  action_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  action_NOT?: InputMaybe<Scalars["String"]>;
  action_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  action_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  action_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  action_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  action_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  roles?: InputMaybe<RoleWhere>;
  rolesAggregate?: InputMaybe<PermissionRolesAggregateInput>;
  rolesConnection?: InputMaybe<PermissionRolesConnectionWhere>;
  rolesConnection_NOT?: InputMaybe<PermissionRolesConnectionWhere>;
  roles_NOT?: InputMaybe<RoleWhere>;
  scope?: InputMaybe<Scalars["String"]>;
  scope_CONTAINS?: InputMaybe<Scalars["String"]>;
  scope_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  scope_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  scope_NOT?: InputMaybe<Scalars["String"]>;
  scope_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  scope_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  scope_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  scope_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  scope_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

export interface ProjectConnectInput {
  organisation?: InputMaybe<ProjectOrganisationConnectFieldInput>;
  plan?: InputMaybe<Array<ProjectPlanConnectFieldInput>>;
  schedule?: InputMaybe<Array<ProjectScheduleConnectFieldInput>>;
}

export interface ProjectConnectOrCreateInput {
  organisation?: InputMaybe<ProjectOrganisationConnectOrCreateFieldInput>;
  plan?: InputMaybe<Array<ProjectPlanConnectOrCreateFieldInput>>;
  schedule?: InputMaybe<Array<ProjectScheduleConnectOrCreateFieldInput>>;
}

export interface ProjectConnectOrCreateWhere {
  node: ProjectUniqueWhere;
}

export interface ProjectConnectWhere {
  node: ProjectWhere;
}

export interface ProjectCreateInput {
  endDate?: InputMaybe<Scalars["DateTime"]>;
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<ProjectOrganisationFieldInput>;
  plan?: InputMaybe<ProjectPlanFieldInput>;
  schedule?: InputMaybe<ProjectScheduleFieldInput>;
  startDate?: InputMaybe<Scalars["DateTime"]>;
  status?: InputMaybe<Scalars["String"]>;
}

export interface ProjectDeleteInput {
  organisation?: InputMaybe<ProjectOrganisationDeleteFieldInput>;
  plan?: InputMaybe<Array<ProjectPlanDeleteFieldInput>>;
  schedule?: InputMaybe<Array<ProjectScheduleDeleteFieldInput>>;
}

export interface ProjectDisconnectInput {
  organisation?: InputMaybe<ProjectOrganisationDisconnectFieldInput>;
  plan?: InputMaybe<Array<ProjectPlanDisconnectFieldInput>>;
  schedule?: InputMaybe<Array<ProjectScheduleDisconnectFieldInput>>;
}

export interface ProjectOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more ProjectSort objects to sort Projects by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<ProjectSort>>>;
}

export interface ProjectOrganisationAggregateInput {
  AND?: InputMaybe<Array<ProjectOrganisationAggregateInput>>;
  OR?: InputMaybe<Array<ProjectOrganisationAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<ProjectOrganisationNodeAggregationWhereInput>;
}

export interface ProjectOrganisationConnectFieldInput {
  connect?: InputMaybe<HiveOrganisationConnectInput>;
  where?: InputMaybe<HiveOrganisationConnectWhere>;
}

export interface ProjectOrganisationConnectOrCreateFieldInput {
  onCreate: ProjectOrganisationConnectOrCreateFieldInputOnCreate;
  where: HiveOrganisationConnectOrCreateWhere;
}

export interface ProjectOrganisationConnectOrCreateFieldInputOnCreate {
  node: HiveOrganisationCreateInput;
}

export interface ProjectOrganisationConnectionSort {
  node?: InputMaybe<HiveOrganisationSort>;
}

export interface ProjectOrganisationConnectionWhere {
  AND?: InputMaybe<Array<ProjectOrganisationConnectionWhere>>;
  OR?: InputMaybe<Array<ProjectOrganisationConnectionWhere>>;
  node?: InputMaybe<HiveOrganisationWhere>;
  node_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface ProjectOrganisationCreateFieldInput {
  node: HiveOrganisationCreateInput;
}

export interface ProjectOrganisationDeleteFieldInput {
  delete?: InputMaybe<HiveOrganisationDeleteInput>;
  where?: InputMaybe<ProjectOrganisationConnectionWhere>;
}

export interface ProjectOrganisationDisconnectFieldInput {
  disconnect?: InputMaybe<HiveOrganisationDisconnectInput>;
  where?: InputMaybe<ProjectOrganisationConnectionWhere>;
}

export interface ProjectOrganisationFieldInput {
  connect?: InputMaybe<ProjectOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<ProjectOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<ProjectOrganisationCreateFieldInput>;
}

export interface ProjectOrganisationNodeAggregationWhereInput {
  AND?: InputMaybe<Array<ProjectOrganisationNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<ProjectOrganisationNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface ProjectOrganisationUpdateConnectionInput {
  node?: InputMaybe<HiveOrganisationUpdateInput>;
}

export interface ProjectOrganisationUpdateFieldInput {
  connect?: InputMaybe<ProjectOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<ProjectOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<ProjectOrganisationCreateFieldInput>;
  delete?: InputMaybe<ProjectOrganisationDeleteFieldInput>;
  disconnect?: InputMaybe<ProjectOrganisationDisconnectFieldInput>;
  update?: InputMaybe<ProjectOrganisationUpdateConnectionInput>;
  where?: InputMaybe<ProjectOrganisationConnectionWhere>;
}

export interface ProjectPlanAggregateInput {
  AND?: InputMaybe<Array<ProjectPlanAggregateInput>>;
  OR?: InputMaybe<Array<ProjectPlanAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<ProjectPlanNodeAggregationWhereInput>;
}

export interface ProjectPlanConnectFieldInput {
  connect?: InputMaybe<Array<TimelineItemConnectInput>>;
  where?: InputMaybe<TimelineItemConnectWhere>;
}

export interface ProjectPlanConnectOrCreateFieldInput {
  onCreate: ProjectPlanConnectOrCreateFieldInputOnCreate;
  where: TimelineItemConnectOrCreateWhere;
}

export interface ProjectPlanConnectOrCreateFieldInputOnCreate {
  node: TimelineItemCreateInput;
}

export interface ProjectPlanConnectionSort {
  node?: InputMaybe<TimelineItemSort>;
}

export interface ProjectPlanConnectionWhere {
  AND?: InputMaybe<Array<ProjectPlanConnectionWhere>>;
  OR?: InputMaybe<Array<ProjectPlanConnectionWhere>>;
  node?: InputMaybe<TimelineItemWhere>;
  node_NOT?: InputMaybe<TimelineItemWhere>;
}

export interface ProjectPlanCreateFieldInput {
  node: TimelineItemCreateInput;
}

export interface ProjectPlanDeleteFieldInput {
  delete?: InputMaybe<TimelineItemDeleteInput>;
  where?: InputMaybe<ProjectPlanConnectionWhere>;
}

export interface ProjectPlanDisconnectFieldInput {
  disconnect?: InputMaybe<TimelineItemDisconnectInput>;
  where?: InputMaybe<ProjectPlanConnectionWhere>;
}

export interface ProjectPlanFieldInput {
  connect?: InputMaybe<Array<ProjectPlanConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<ProjectPlanConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<ProjectPlanCreateFieldInput>>;
}

export interface ProjectPlanNodeAggregationWhereInput {
  AND?: InputMaybe<Array<ProjectPlanNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<ProjectPlanNodeAggregationWhereInput>>;
  endDate_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  notes_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  notes_EQUAL?: InputMaybe<Scalars["String"]>;
  notes_GT?: InputMaybe<Scalars["Int"]>;
  notes_GTE?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  notes_LT?: InputMaybe<Scalars["Int"]>;
  notes_LTE?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  startDate_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  timeline_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  timeline_EQUAL?: InputMaybe<Scalars["String"]>;
  timeline_GT?: InputMaybe<Scalars["Int"]>;
  timeline_GTE?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  timeline_LT?: InputMaybe<Scalars["Int"]>;
  timeline_LTE?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface ProjectPlanUpdateConnectionInput {
  node?: InputMaybe<TimelineItemUpdateInput>;
}

export interface ProjectPlanUpdateFieldInput {
  connect?: InputMaybe<Array<ProjectPlanConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<ProjectPlanConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<ProjectPlanCreateFieldInput>>;
  delete?: InputMaybe<Array<ProjectPlanDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ProjectPlanDisconnectFieldInput>>;
  update?: InputMaybe<ProjectPlanUpdateConnectionInput>;
  where?: InputMaybe<ProjectPlanConnectionWhere>;
}

export interface ProjectRelationInput {
  organisation?: InputMaybe<ProjectOrganisationCreateFieldInput>;
  plan?: InputMaybe<Array<ProjectPlanCreateFieldInput>>;
  schedule?: InputMaybe<Array<ProjectScheduleCreateFieldInput>>;
}

export interface ProjectResultConnectInput {
  organisation?: InputMaybe<ProjectResultOrganisationConnectFieldInput>;
}

export interface ProjectResultConnectOrCreateInput {
  organisation?: InputMaybe<ProjectResultOrganisationConnectOrCreateFieldInput>;
}

export interface ProjectResultCreateInput {
  invoiced?: InputMaybe<Scalars["Float"]>;
  organisation?: InputMaybe<ProjectResultOrganisationFieldInput>;
  quoted?: InputMaybe<Scalars["Float"]>;
}

export interface ProjectResultDeleteInput {
  organisation?: InputMaybe<ProjectResultOrganisationDeleteFieldInput>;
}

export interface ProjectResultDisconnectInput {
  organisation?: InputMaybe<ProjectResultOrganisationDisconnectFieldInput>;
}

export interface ProjectResultOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more ProjectResultSort objects to sort ProjectResults by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<ProjectResultSort>>>;
}

export interface ProjectResultOrganisationAggregateInput {
  AND?: InputMaybe<Array<ProjectResultOrganisationAggregateInput>>;
  OR?: InputMaybe<Array<ProjectResultOrganisationAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<ProjectResultOrganisationNodeAggregationWhereInput>;
}

export interface ProjectResultOrganisationConnectFieldInput {
  connect?: InputMaybe<HiveOrganisationConnectInput>;
  where?: InputMaybe<HiveOrganisationConnectWhere>;
}

export interface ProjectResultOrganisationConnectOrCreateFieldInput {
  onCreate: ProjectResultOrganisationConnectOrCreateFieldInputOnCreate;
  where: HiveOrganisationConnectOrCreateWhere;
}

export interface ProjectResultOrganisationConnectOrCreateFieldInputOnCreate {
  node: HiveOrganisationCreateInput;
}

export interface ProjectResultOrganisationConnectionSort {
  node?: InputMaybe<HiveOrganisationSort>;
}

export interface ProjectResultOrganisationConnectionWhere {
  AND?: InputMaybe<Array<ProjectResultOrganisationConnectionWhere>>;
  OR?: InputMaybe<Array<ProjectResultOrganisationConnectionWhere>>;
  node?: InputMaybe<HiveOrganisationWhere>;
  node_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface ProjectResultOrganisationCreateFieldInput {
  node: HiveOrganisationCreateInput;
}

export interface ProjectResultOrganisationDeleteFieldInput {
  delete?: InputMaybe<HiveOrganisationDeleteInput>;
  where?: InputMaybe<ProjectResultOrganisationConnectionWhere>;
}

export interface ProjectResultOrganisationDisconnectFieldInput {
  disconnect?: InputMaybe<HiveOrganisationDisconnectInput>;
  where?: InputMaybe<ProjectResultOrganisationConnectionWhere>;
}

export interface ProjectResultOrganisationFieldInput {
  connect?: InputMaybe<ProjectResultOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<ProjectResultOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<ProjectResultOrganisationCreateFieldInput>;
}

export interface ProjectResultOrganisationNodeAggregationWhereInput {
  AND?: InputMaybe<Array<ProjectResultOrganisationNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<ProjectResultOrganisationNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface ProjectResultOrganisationUpdateConnectionInput {
  node?: InputMaybe<HiveOrganisationUpdateInput>;
}

export interface ProjectResultOrganisationUpdateFieldInput {
  connect?: InputMaybe<ProjectResultOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<ProjectResultOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<ProjectResultOrganisationCreateFieldInput>;
  delete?: InputMaybe<ProjectResultOrganisationDeleteFieldInput>;
  disconnect?: InputMaybe<ProjectResultOrganisationDisconnectFieldInput>;
  update?: InputMaybe<ProjectResultOrganisationUpdateConnectionInput>;
  where?: InputMaybe<ProjectResultOrganisationConnectionWhere>;
}

export interface ProjectResultRelationInput {
  organisation?: InputMaybe<ProjectResultOrganisationCreateFieldInput>;
}

/** Fields to sort ProjectResults by. The order in which sorts are applied is not guaranteed when specifying many fields in one ProjectResultSort object. */
export interface ProjectResultSort {
  id?: InputMaybe<SortDirection>;
  invoiced?: InputMaybe<SortDirection>;
  quoted?: InputMaybe<SortDirection>;
}

export interface ProjectResultUpdateInput {
  invoiced?: InputMaybe<Scalars["Float"]>;
  organisation?: InputMaybe<ProjectResultOrganisationUpdateFieldInput>;
  quoted?: InputMaybe<Scalars["Float"]>;
}

export interface ProjectResultWhere {
  AND?: InputMaybe<Array<ProjectResultWhere>>;
  OR?: InputMaybe<Array<ProjectResultWhere>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  invoiced?: InputMaybe<Scalars["Float"]>;
  invoiced_GT?: InputMaybe<Scalars["Float"]>;
  invoiced_GTE?: InputMaybe<Scalars["Float"]>;
  invoiced_IN?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
  invoiced_LT?: InputMaybe<Scalars["Float"]>;
  invoiced_LTE?: InputMaybe<Scalars["Float"]>;
  invoiced_NOT?: InputMaybe<Scalars["Float"]>;
  invoiced_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
  organisation?: InputMaybe<HiveOrganisationWhere>;
  organisationAggregate?: InputMaybe<ProjectResultOrganisationAggregateInput>;
  organisationConnection?: InputMaybe<ProjectResultOrganisationConnectionWhere>;
  organisationConnection_NOT?: InputMaybe<ProjectResultOrganisationConnectionWhere>;
  organisation_NOT?: InputMaybe<HiveOrganisationWhere>;
  quoted?: InputMaybe<Scalars["Float"]>;
  quoted_GT?: InputMaybe<Scalars["Float"]>;
  quoted_GTE?: InputMaybe<Scalars["Float"]>;
  quoted_IN?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
  quoted_LT?: InputMaybe<Scalars["Float"]>;
  quoted_LTE?: InputMaybe<Scalars["Float"]>;
  quoted_NOT?: InputMaybe<Scalars["Float"]>;
  quoted_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
}

export interface ProjectScheduleAggregateInput {
  AND?: InputMaybe<Array<ProjectScheduleAggregateInput>>;
  OR?: InputMaybe<Array<ProjectScheduleAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<ProjectScheduleNodeAggregationWhereInput>;
}

export interface ProjectScheduleConnectFieldInput {
  connect?: InputMaybe<Array<ScheduleItemConnectInput>>;
  where?: InputMaybe<ScheduleItemConnectWhere>;
}

export interface ProjectScheduleConnectOrCreateFieldInput {
  onCreate: ProjectScheduleConnectOrCreateFieldInputOnCreate;
  where: ScheduleItemConnectOrCreateWhere;
}

export interface ProjectScheduleConnectOrCreateFieldInputOnCreate {
  node: ScheduleItemCreateInput;
}

export interface ProjectScheduleConnectionSort {
  node?: InputMaybe<ScheduleItemSort>;
}

export interface ProjectScheduleConnectionWhere {
  AND?: InputMaybe<Array<ProjectScheduleConnectionWhere>>;
  OR?: InputMaybe<Array<ProjectScheduleConnectionWhere>>;
  node?: InputMaybe<ScheduleItemWhere>;
  node_NOT?: InputMaybe<ScheduleItemWhere>;
}

export interface ProjectScheduleCreateFieldInput {
  node: ScheduleItemCreateInput;
}

export interface ProjectScheduleDeleteFieldInput {
  delete?: InputMaybe<ScheduleItemDeleteInput>;
  where?: InputMaybe<ProjectScheduleConnectionWhere>;
}

export interface ProjectScheduleDisconnectFieldInput {
  disconnect?: InputMaybe<ScheduleItemDisconnectInput>;
  where?: InputMaybe<ProjectScheduleConnectionWhere>;
}

export interface ProjectScheduleFieldInput {
  connect?: InputMaybe<Array<ProjectScheduleConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<ProjectScheduleConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<ProjectScheduleCreateFieldInput>>;
}

export interface ProjectScheduleNodeAggregationWhereInput {
  AND?: InputMaybe<Array<ProjectScheduleNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<ProjectScheduleNodeAggregationWhereInput>>;
  date_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  date_GT?: InputMaybe<Scalars["DateTime"]>;
  date_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_LT?: InputMaybe<Scalars["DateTime"]>;
  date_LTE?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  date_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  date_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
}

export interface ProjectScheduleUpdateConnectionInput {
  node?: InputMaybe<ScheduleItemUpdateInput>;
}

export interface ProjectScheduleUpdateFieldInput {
  connect?: InputMaybe<Array<ProjectScheduleConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<ProjectScheduleConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<ProjectScheduleCreateFieldInput>>;
  delete?: InputMaybe<Array<ProjectScheduleDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ProjectScheduleDisconnectFieldInput>>;
  update?: InputMaybe<ProjectScheduleUpdateConnectionInput>;
  where?: InputMaybe<ProjectScheduleConnectionWhere>;
}

/** Fields to sort Projects by. The order in which sorts are applied is not guaranteed when specifying many fields in one ProjectSort object. */
export interface ProjectSort {
  endDate?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  startDate?: InputMaybe<SortDirection>;
  status?: InputMaybe<SortDirection>;
}

export interface ProjectUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface ProjectUpdateInput {
  endDate?: InputMaybe<Scalars["DateTime"]>;
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<ProjectOrganisationUpdateFieldInput>;
  plan?: InputMaybe<Array<ProjectPlanUpdateFieldInput>>;
  schedule?: InputMaybe<Array<ProjectScheduleUpdateFieldInput>>;
  startDate?: InputMaybe<Scalars["DateTime"]>;
  status?: InputMaybe<Scalars["String"]>;
}

export interface ProjectWhere {
  AND?: InputMaybe<Array<ProjectWhere>>;
  OR?: InputMaybe<Array<ProjectWhere>>;
  endDate?: InputMaybe<Scalars["DateTime"]>;
  endDate_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  endDate_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_NOT?: InputMaybe<Scalars["DateTime"]>;
  endDate_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveOrganisationWhere>;
  organisationAggregate?: InputMaybe<ProjectOrganisationAggregateInput>;
  organisationConnection?: InputMaybe<ProjectOrganisationConnectionWhere>;
  organisationConnection_NOT?: InputMaybe<ProjectOrganisationConnectionWhere>;
  organisation_NOT?: InputMaybe<HiveOrganisationWhere>;
  plan?: InputMaybe<TimelineItemWhere>;
  planAggregate?: InputMaybe<ProjectPlanAggregateInput>;
  planConnection?: InputMaybe<ProjectPlanConnectionWhere>;
  planConnection_NOT?: InputMaybe<ProjectPlanConnectionWhere>;
  plan_NOT?: InputMaybe<TimelineItemWhere>;
  schedule?: InputMaybe<ScheduleItemWhere>;
  scheduleAggregate?: InputMaybe<ProjectScheduleAggregateInput>;
  scheduleConnection?: InputMaybe<ProjectScheduleConnectionWhere>;
  scheduleConnection_NOT?: InputMaybe<ProjectScheduleConnectionWhere>;
  schedule_NOT?: InputMaybe<ScheduleItemWhere>;
  startDate?: InputMaybe<Scalars["DateTime"]>;
  startDate_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  startDate_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_NOT?: InputMaybe<Scalars["DateTime"]>;
  startDate_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  status?: InputMaybe<Scalars["String"]>;
  status_CONTAINS?: InputMaybe<Scalars["String"]>;
  status_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  status_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  status_NOT?: InputMaybe<Scalars["String"]>;
  status_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  status_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  status_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  status_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  status_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

export interface QueryOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
}

export interface RoleAppliancesAggregateInput {
  AND?: InputMaybe<Array<RoleAppliancesAggregateInput>>;
  OR?: InputMaybe<Array<RoleAppliancesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<RoleAppliancesNodeAggregationWhereInput>;
}

export interface RoleAppliancesConnectFieldInput {
  connect?: InputMaybe<Array<HiveApplianceConnectInput>>;
  where?: InputMaybe<HiveApplianceConnectWhere>;
}

export interface RoleAppliancesConnectOrCreateFieldInput {
  onCreate: RoleAppliancesConnectOrCreateFieldInputOnCreate;
  where: HiveApplianceConnectOrCreateWhere;
}

export interface RoleAppliancesConnectOrCreateFieldInputOnCreate {
  node: HiveApplianceCreateInput;
}

export interface RoleAppliancesConnectionSort {
  node?: InputMaybe<HiveApplianceSort>;
}

export interface RoleAppliancesConnectionWhere {
  AND?: InputMaybe<Array<RoleAppliancesConnectionWhere>>;
  OR?: InputMaybe<Array<RoleAppliancesConnectionWhere>>;
  node?: InputMaybe<HiveApplianceWhere>;
  node_NOT?: InputMaybe<HiveApplianceWhere>;
}

export interface RoleAppliancesCreateFieldInput {
  node: HiveApplianceCreateInput;
}

export interface RoleAppliancesDeleteFieldInput {
  delete?: InputMaybe<HiveApplianceDeleteInput>;
  where?: InputMaybe<RoleAppliancesConnectionWhere>;
}

export interface RoleAppliancesDisconnectFieldInput {
  disconnect?: InputMaybe<HiveApplianceDisconnectInput>;
  where?: InputMaybe<RoleAppliancesConnectionWhere>;
}

export interface RoleAppliancesFieldInput {
  connect?: InputMaybe<Array<RoleAppliancesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<RoleAppliancesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<RoleAppliancesCreateFieldInput>>;
}

export interface RoleAppliancesNodeAggregationWhereInput {
  AND?: InputMaybe<Array<RoleAppliancesNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<RoleAppliancesNodeAggregationWhereInput>>;
  description_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  description_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  description_EQUAL?: InputMaybe<Scalars["String"]>;
  description_GT?: InputMaybe<Scalars["Int"]>;
  description_GTE?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  description_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  description_LT?: InputMaybe<Scalars["Int"]>;
  description_LTE?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  description_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  label_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  label_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  label_EQUAL?: InputMaybe<Scalars["String"]>;
  label_GT?: InputMaybe<Scalars["Int"]>;
  label_GTE?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  label_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  label_LT?: InputMaybe<Scalars["Int"]>;
  label_LTE?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  label_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface RoleAppliancesUpdateConnectionInput {
  node?: InputMaybe<HiveApplianceUpdateInput>;
}

export interface RoleAppliancesUpdateFieldInput {
  connect?: InputMaybe<Array<RoleAppliancesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<RoleAppliancesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<RoleAppliancesCreateFieldInput>>;
  delete?: InputMaybe<Array<RoleAppliancesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<RoleAppliancesDisconnectFieldInput>>;
  update?: InputMaybe<RoleAppliancesUpdateConnectionInput>;
  where?: InputMaybe<RoleAppliancesConnectionWhere>;
}

export interface RoleConnectInput {
  appliances?: InputMaybe<Array<RoleAppliancesConnectFieldInput>>;
  organisation?: InputMaybe<RoleOrganisationConnectFieldInput>;
  permissions?: InputMaybe<Array<RolePermissionsConnectFieldInput>>;
}

export interface RoleConnectOrCreateInput {
  appliances?: InputMaybe<Array<RoleAppliancesConnectOrCreateFieldInput>>;
  organisation?: InputMaybe<RoleOrganisationConnectOrCreateFieldInput>;
  permissions?: InputMaybe<Array<RolePermissionsConnectOrCreateFieldInput>>;
}

export interface RoleConnectOrCreateWhere {
  node: RoleUniqueWhere;
}

export interface RoleConnectWhere {
  node: RoleWhere;
}

export interface RoleCreateInput {
  appliances?: InputMaybe<RoleAppliancesFieldInput>;
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<RoleOrganisationFieldInput>;
  permissions?: InputMaybe<RolePermissionsFieldInput>;
}

export interface RoleDeleteInput {
  appliances?: InputMaybe<Array<RoleAppliancesDeleteFieldInput>>;
  organisation?: InputMaybe<RoleOrganisationDeleteFieldInput>;
  permissions?: InputMaybe<Array<RolePermissionsDeleteFieldInput>>;
}

export interface RoleDisconnectInput {
  appliances?: InputMaybe<Array<RoleAppliancesDisconnectFieldInput>>;
  organisation?: InputMaybe<RoleOrganisationDisconnectFieldInput>;
  permissions?: InputMaybe<Array<RolePermissionsDisconnectFieldInput>>;
}

export interface RoleOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more RoleSort objects to sort Roles by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<RoleSort>>>;
}

export interface RoleOrganisationAggregateInput {
  AND?: InputMaybe<Array<RoleOrganisationAggregateInput>>;
  OR?: InputMaybe<Array<RoleOrganisationAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<RoleOrganisationNodeAggregationWhereInput>;
}

export interface RoleOrganisationConnectFieldInput {
  connect?: InputMaybe<HiveOrganisationConnectInput>;
  where?: InputMaybe<HiveOrganisationConnectWhere>;
}

export interface RoleOrganisationConnectOrCreateFieldInput {
  onCreate: RoleOrganisationConnectOrCreateFieldInputOnCreate;
  where: HiveOrganisationConnectOrCreateWhere;
}

export interface RoleOrganisationConnectOrCreateFieldInputOnCreate {
  node: HiveOrganisationCreateInput;
}

export interface RoleOrganisationConnectionSort {
  node?: InputMaybe<HiveOrganisationSort>;
}

export interface RoleOrganisationConnectionWhere {
  AND?: InputMaybe<Array<RoleOrganisationConnectionWhere>>;
  OR?: InputMaybe<Array<RoleOrganisationConnectionWhere>>;
  node?: InputMaybe<HiveOrganisationWhere>;
  node_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface RoleOrganisationCreateFieldInput {
  node: HiveOrganisationCreateInput;
}

export interface RoleOrganisationDeleteFieldInput {
  delete?: InputMaybe<HiveOrganisationDeleteInput>;
  where?: InputMaybe<RoleOrganisationConnectionWhere>;
}

export interface RoleOrganisationDisconnectFieldInput {
  disconnect?: InputMaybe<HiveOrganisationDisconnectInput>;
  where?: InputMaybe<RoleOrganisationConnectionWhere>;
}

export interface RoleOrganisationFieldInput {
  connect?: InputMaybe<RoleOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<RoleOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<RoleOrganisationCreateFieldInput>;
}

export interface RoleOrganisationNodeAggregationWhereInput {
  AND?: InputMaybe<Array<RoleOrganisationNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<RoleOrganisationNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface RoleOrganisationUpdateConnectionInput {
  node?: InputMaybe<HiveOrganisationUpdateInput>;
}

export interface RoleOrganisationUpdateFieldInput {
  connect?: InputMaybe<RoleOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<RoleOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<RoleOrganisationCreateFieldInput>;
  delete?: InputMaybe<RoleOrganisationDeleteFieldInput>;
  disconnect?: InputMaybe<RoleOrganisationDisconnectFieldInput>;
  update?: InputMaybe<RoleOrganisationUpdateConnectionInput>;
  where?: InputMaybe<RoleOrganisationConnectionWhere>;
}

export interface RolePermissionsAggregateInput {
  AND?: InputMaybe<Array<RolePermissionsAggregateInput>>;
  OR?: InputMaybe<Array<RolePermissionsAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<RolePermissionsNodeAggregationWhereInput>;
}

export interface RolePermissionsConnectFieldInput {
  connect?: InputMaybe<Array<PermissionConnectInput>>;
  where?: InputMaybe<PermissionConnectWhere>;
}

export interface RolePermissionsConnectOrCreateFieldInput {
  onCreate: RolePermissionsConnectOrCreateFieldInputOnCreate;
  where: PermissionConnectOrCreateWhere;
}

export interface RolePermissionsConnectOrCreateFieldInputOnCreate {
  node: PermissionCreateInput;
}

export interface RolePermissionsConnectionSort {
  node?: InputMaybe<PermissionSort>;
}

export interface RolePermissionsConnectionWhere {
  AND?: InputMaybe<Array<RolePermissionsConnectionWhere>>;
  OR?: InputMaybe<Array<RolePermissionsConnectionWhere>>;
  node?: InputMaybe<PermissionWhere>;
  node_NOT?: InputMaybe<PermissionWhere>;
}

export interface RolePermissionsCreateFieldInput {
  node: PermissionCreateInput;
}

export interface RolePermissionsDeleteFieldInput {
  delete?: InputMaybe<PermissionDeleteInput>;
  where?: InputMaybe<RolePermissionsConnectionWhere>;
}

export interface RolePermissionsDisconnectFieldInput {
  disconnect?: InputMaybe<PermissionDisconnectInput>;
  where?: InputMaybe<RolePermissionsConnectionWhere>;
}

export interface RolePermissionsFieldInput {
  connect?: InputMaybe<Array<RolePermissionsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<RolePermissionsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<RolePermissionsCreateFieldInput>>;
}

export interface RolePermissionsNodeAggregationWhereInput {
  AND?: InputMaybe<Array<RolePermissionsNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<RolePermissionsNodeAggregationWhereInput>>;
  action_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  action_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  action_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  action_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  action_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  action_EQUAL?: InputMaybe<Scalars["String"]>;
  action_GT?: InputMaybe<Scalars["Int"]>;
  action_GTE?: InputMaybe<Scalars["Int"]>;
  action_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  action_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  action_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  action_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  action_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  action_LT?: InputMaybe<Scalars["Int"]>;
  action_LTE?: InputMaybe<Scalars["Int"]>;
  action_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  action_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  action_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  action_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  action_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  scope_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  scope_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  scope_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  scope_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  scope_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  scope_EQUAL?: InputMaybe<Scalars["String"]>;
  scope_GT?: InputMaybe<Scalars["Int"]>;
  scope_GTE?: InputMaybe<Scalars["Int"]>;
  scope_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  scope_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  scope_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  scope_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  scope_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  scope_LT?: InputMaybe<Scalars["Int"]>;
  scope_LTE?: InputMaybe<Scalars["Int"]>;
  scope_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  scope_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  scope_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  scope_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  scope_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface RolePermissionsUpdateConnectionInput {
  node?: InputMaybe<PermissionUpdateInput>;
}

export interface RolePermissionsUpdateFieldInput {
  connect?: InputMaybe<Array<RolePermissionsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<RolePermissionsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<RolePermissionsCreateFieldInput>>;
  delete?: InputMaybe<Array<RolePermissionsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<RolePermissionsDisconnectFieldInput>>;
  update?: InputMaybe<RolePermissionsUpdateConnectionInput>;
  where?: InputMaybe<RolePermissionsConnectionWhere>;
}

export interface RoleRelationInput {
  appliances?: InputMaybe<Array<RoleAppliancesCreateFieldInput>>;
  organisation?: InputMaybe<RoleOrganisationCreateFieldInput>;
  permissions?: InputMaybe<Array<RolePermissionsCreateFieldInput>>;
}

/** Fields to sort Roles by. The order in which sorts are applied is not guaranteed when specifying many fields in one RoleSort object. */
export interface RoleSort {
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
}

export interface RoleUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface RoleUpdateInput {
  appliances?: InputMaybe<Array<RoleAppliancesUpdateFieldInput>>;
  name?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<RoleOrganisationUpdateFieldInput>;
  permissions?: InputMaybe<Array<RolePermissionsUpdateFieldInput>>;
}

export interface RoleWhere {
  AND?: InputMaybe<Array<RoleWhere>>;
  OR?: InputMaybe<Array<RoleWhere>>;
  appliances?: InputMaybe<HiveApplianceWhere>;
  appliancesAggregate?: InputMaybe<RoleAppliancesAggregateInput>;
  appliancesConnection?: InputMaybe<RoleAppliancesConnectionWhere>;
  appliancesConnection_NOT?: InputMaybe<RoleAppliancesConnectionWhere>;
  appliances_NOT?: InputMaybe<HiveApplianceWhere>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  name_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT?: InputMaybe<Scalars["String"]>;
  name_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  name_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  name_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  name_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveOrganisationWhere>;
  organisationAggregate?: InputMaybe<RoleOrganisationAggregateInput>;
  organisationConnection?: InputMaybe<RoleOrganisationConnectionWhere>;
  organisationConnection_NOT?: InputMaybe<RoleOrganisationConnectionWhere>;
  organisation_NOT?: InputMaybe<HiveOrganisationWhere>;
  permissions?: InputMaybe<PermissionWhere>;
  permissionsAggregate?: InputMaybe<RolePermissionsAggregateInput>;
  permissionsConnection?: InputMaybe<RolePermissionsConnectionWhere>;
  permissionsConnection_NOT?: InputMaybe<RolePermissionsConnectionWhere>;
  permissions_NOT?: InputMaybe<PermissionWhere>;
}

export interface ScheduleItemConnectInput {
  equipment?: InputMaybe<Array<ScheduleItemEquipmentConnectFieldInput>>;
  managers?: InputMaybe<Array<ScheduleItemManagersConnectFieldInput>>;
  organisation?: InputMaybe<ScheduleItemOrganisationConnectFieldInput>;
  owner?: InputMaybe<ScheduleItemOwnerConnectFieldInput>;
  people?: InputMaybe<Array<ScheduleItemPeopleConnectFieldInput>>;
  project?: InputMaybe<ScheduleItemProjectConnectFieldInput>;
}

export interface ScheduleItemConnectOrCreateInput {
  equipment?: InputMaybe<Array<ScheduleItemEquipmentConnectOrCreateFieldInput>>;
  managers?: InputMaybe<Array<ScheduleItemManagersConnectOrCreateFieldInput>>;
  organisation?: InputMaybe<ScheduleItemOrganisationConnectOrCreateFieldInput>;
  owner?: InputMaybe<ScheduleItemOwnerConnectOrCreateFieldInput>;
  people?: InputMaybe<Array<ScheduleItemPeopleConnectOrCreateFieldInput>>;
  project?: InputMaybe<ScheduleItemProjectConnectOrCreateFieldInput>;
}

export interface ScheduleItemConnectOrCreateWhere {
  node: ScheduleItemUniqueWhere;
}

export interface ScheduleItemConnectWhere {
  node: ScheduleItemWhere;
}

export interface ScheduleItemCreateInput {
  date?: InputMaybe<Scalars["DateTime"]>;
  equipment?: InputMaybe<ScheduleItemEquipmentFieldInput>;
  managers?: InputMaybe<ScheduleItemManagersFieldInput>;
  notes?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  organisation?: InputMaybe<ScheduleItemOrganisationFieldInput>;
  owner?: InputMaybe<ScheduleItemOwnerFieldInput>;
  people?: InputMaybe<ScheduleItemPeopleFieldInput>;
  project?: InputMaybe<ScheduleItemProjectFieldInput>;
}

export interface ScheduleItemDeleteInput {
  equipment?: InputMaybe<Array<ScheduleItemEquipmentDeleteFieldInput>>;
  managers?: InputMaybe<Array<ScheduleItemManagersDeleteFieldInput>>;
  organisation?: InputMaybe<ScheduleItemOrganisationDeleteFieldInput>;
  owner?: InputMaybe<ScheduleItemOwnerDeleteFieldInput>;
  people?: InputMaybe<Array<ScheduleItemPeopleDeleteFieldInput>>;
  project?: InputMaybe<ScheduleItemProjectDeleteFieldInput>;
}

export interface ScheduleItemDisconnectInput {
  equipment?: InputMaybe<Array<ScheduleItemEquipmentDisconnectFieldInput>>;
  managers?: InputMaybe<Array<ScheduleItemManagersDisconnectFieldInput>>;
  organisation?: InputMaybe<ScheduleItemOrganisationDisconnectFieldInput>;
  owner?: InputMaybe<ScheduleItemOwnerDisconnectFieldInput>;
  people?: InputMaybe<Array<ScheduleItemPeopleDisconnectFieldInput>>;
  project?: InputMaybe<ScheduleItemProjectDisconnectFieldInput>;
}

export interface ScheduleItemEquipmentAggregateInput {
  AND?: InputMaybe<Array<ScheduleItemEquipmentAggregateInput>>;
  OR?: InputMaybe<Array<ScheduleItemEquipmentAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<ScheduleItemEquipmentNodeAggregationWhereInput>;
}

export interface ScheduleItemEquipmentConnectFieldInput {
  connect?: InputMaybe<Array<EquipmentConnectInput>>;
  where?: InputMaybe<EquipmentConnectWhere>;
}

export interface ScheduleItemEquipmentConnectOrCreateFieldInput {
  onCreate: ScheduleItemEquipmentConnectOrCreateFieldInputOnCreate;
  where: EquipmentConnectOrCreateWhere;
}

export interface ScheduleItemEquipmentConnectOrCreateFieldInputOnCreate {
  node: EquipmentCreateInput;
}

export interface ScheduleItemEquipmentConnectionSort {
  node?: InputMaybe<EquipmentSort>;
}

export interface ScheduleItemEquipmentConnectionWhere {
  AND?: InputMaybe<Array<ScheduleItemEquipmentConnectionWhere>>;
  OR?: InputMaybe<Array<ScheduleItemEquipmentConnectionWhere>>;
  node?: InputMaybe<EquipmentWhere>;
  node_NOT?: InputMaybe<EquipmentWhere>;
}

export interface ScheduleItemEquipmentCreateFieldInput {
  node: EquipmentCreateInput;
}

export interface ScheduleItemEquipmentDeleteFieldInput {
  delete?: InputMaybe<EquipmentDeleteInput>;
  where?: InputMaybe<ScheduleItemEquipmentConnectionWhere>;
}

export interface ScheduleItemEquipmentDisconnectFieldInput {
  disconnect?: InputMaybe<EquipmentDisconnectInput>;
  where?: InputMaybe<ScheduleItemEquipmentConnectionWhere>;
}

export interface ScheduleItemEquipmentFieldInput {
  connect?: InputMaybe<Array<ScheduleItemEquipmentConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<ScheduleItemEquipmentConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<ScheduleItemEquipmentCreateFieldInput>>;
}

export interface ScheduleItemEquipmentNodeAggregationWhereInput {
  AND?: InputMaybe<Array<ScheduleItemEquipmentNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<ScheduleItemEquipmentNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  registration_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  registration_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  registration_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  registration_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  registration_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  registration_EQUAL?: InputMaybe<Scalars["String"]>;
  registration_GT?: InputMaybe<Scalars["Int"]>;
  registration_GTE?: InputMaybe<Scalars["Int"]>;
  registration_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  registration_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  registration_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  registration_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  registration_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  registration_LT?: InputMaybe<Scalars["Int"]>;
  registration_LTE?: InputMaybe<Scalars["Int"]>;
  registration_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  registration_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  registration_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  registration_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  registration_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface ScheduleItemEquipmentUpdateConnectionInput {
  node?: InputMaybe<EquipmentUpdateInput>;
}

export interface ScheduleItemEquipmentUpdateFieldInput {
  connect?: InputMaybe<Array<ScheduleItemEquipmentConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<ScheduleItemEquipmentConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<ScheduleItemEquipmentCreateFieldInput>>;
  delete?: InputMaybe<Array<ScheduleItemEquipmentDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ScheduleItemEquipmentDisconnectFieldInput>>;
  update?: InputMaybe<ScheduleItemEquipmentUpdateConnectionInput>;
  where?: InputMaybe<ScheduleItemEquipmentConnectionWhere>;
}

export interface ScheduleItemManagersAggregateInput {
  AND?: InputMaybe<Array<ScheduleItemManagersAggregateInput>>;
  OR?: InputMaybe<Array<ScheduleItemManagersAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<ScheduleItemManagersNodeAggregationWhereInput>;
}

export interface ScheduleItemManagersConnectFieldInput {
  connect?: InputMaybe<Array<HiveUserConnectInput>>;
  where?: InputMaybe<HiveUserConnectWhere>;
}

export interface ScheduleItemManagersConnectOrCreateFieldInput {
  onCreate: ScheduleItemManagersConnectOrCreateFieldInputOnCreate;
  where: HiveUserConnectOrCreateWhere;
}

export interface ScheduleItemManagersConnectOrCreateFieldInputOnCreate {
  node: HiveUserCreateInput;
}

export interface ScheduleItemManagersConnectionSort {
  node?: InputMaybe<HiveUserSort>;
}

export interface ScheduleItemManagersConnectionWhere {
  AND?: InputMaybe<Array<ScheduleItemManagersConnectionWhere>>;
  OR?: InputMaybe<Array<ScheduleItemManagersConnectionWhere>>;
  node?: InputMaybe<HiveUserWhere>;
  node_NOT?: InputMaybe<HiveUserWhere>;
}

export interface ScheduleItemManagersCreateFieldInput {
  node: HiveUserCreateInput;
}

export interface ScheduleItemManagersDeleteFieldInput {
  delete?: InputMaybe<HiveUserDeleteInput>;
  where?: InputMaybe<ScheduleItemManagersConnectionWhere>;
}

export interface ScheduleItemManagersDisconnectFieldInput {
  disconnect?: InputMaybe<HiveUserDisconnectInput>;
  where?: InputMaybe<ScheduleItemManagersConnectionWhere>;
}

export interface ScheduleItemManagersFieldInput {
  connect?: InputMaybe<Array<ScheduleItemManagersConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<ScheduleItemManagersConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<ScheduleItemManagersCreateFieldInput>>;
}

export interface ScheduleItemManagersNodeAggregationWhereInput {
  AND?: InputMaybe<Array<ScheduleItemManagersNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<ScheduleItemManagersNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  password_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  password_EQUAL?: InputMaybe<Scalars["String"]>;
  password_GT?: InputMaybe<Scalars["Int"]>;
  password_GTE?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  password_LT?: InputMaybe<Scalars["Int"]>;
  password_LTE?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  username_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  username_EQUAL?: InputMaybe<Scalars["String"]>;
  username_GT?: InputMaybe<Scalars["Int"]>;
  username_GTE?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  username_LT?: InputMaybe<Scalars["Int"]>;
  username_LTE?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface ScheduleItemManagersUpdateConnectionInput {
  node?: InputMaybe<HiveUserUpdateInput>;
}

export interface ScheduleItemManagersUpdateFieldInput {
  connect?: InputMaybe<Array<ScheduleItemManagersConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<ScheduleItemManagersConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<ScheduleItemManagersCreateFieldInput>>;
  delete?: InputMaybe<Array<ScheduleItemManagersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ScheduleItemManagersDisconnectFieldInput>>;
  update?: InputMaybe<ScheduleItemManagersUpdateConnectionInput>;
  where?: InputMaybe<ScheduleItemManagersConnectionWhere>;
}

export interface ScheduleItemOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more ScheduleItemSort objects to sort ScheduleItems by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<ScheduleItemSort>>>;
}

export interface ScheduleItemOrganisationAggregateInput {
  AND?: InputMaybe<Array<ScheduleItemOrganisationAggregateInput>>;
  OR?: InputMaybe<Array<ScheduleItemOrganisationAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<ScheduleItemOrganisationNodeAggregationWhereInput>;
}

export interface ScheduleItemOrganisationConnectFieldInput {
  connect?: InputMaybe<HiveOrganisationConnectInput>;
  where?: InputMaybe<HiveOrganisationConnectWhere>;
}

export interface ScheduleItemOrganisationConnectOrCreateFieldInput {
  onCreate: ScheduleItemOrganisationConnectOrCreateFieldInputOnCreate;
  where: HiveOrganisationConnectOrCreateWhere;
}

export interface ScheduleItemOrganisationConnectOrCreateFieldInputOnCreate {
  node: HiveOrganisationCreateInput;
}

export interface ScheduleItemOrganisationConnectionSort {
  node?: InputMaybe<HiveOrganisationSort>;
}

export interface ScheduleItemOrganisationConnectionWhere {
  AND?: InputMaybe<Array<ScheduleItemOrganisationConnectionWhere>>;
  OR?: InputMaybe<Array<ScheduleItemOrganisationConnectionWhere>>;
  node?: InputMaybe<HiveOrganisationWhere>;
  node_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface ScheduleItemOrganisationCreateFieldInput {
  node: HiveOrganisationCreateInput;
}

export interface ScheduleItemOrganisationDeleteFieldInput {
  delete?: InputMaybe<HiveOrganisationDeleteInput>;
  where?: InputMaybe<ScheduleItemOrganisationConnectionWhere>;
}

export interface ScheduleItemOrganisationDisconnectFieldInput {
  disconnect?: InputMaybe<HiveOrganisationDisconnectInput>;
  where?: InputMaybe<ScheduleItemOrganisationConnectionWhere>;
}

export interface ScheduleItemOrganisationFieldInput {
  connect?: InputMaybe<ScheduleItemOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<ScheduleItemOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<ScheduleItemOrganisationCreateFieldInput>;
}

export interface ScheduleItemOrganisationNodeAggregationWhereInput {
  AND?: InputMaybe<Array<ScheduleItemOrganisationNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<ScheduleItemOrganisationNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface ScheduleItemOrganisationUpdateConnectionInput {
  node?: InputMaybe<HiveOrganisationUpdateInput>;
}

export interface ScheduleItemOrganisationUpdateFieldInput {
  connect?: InputMaybe<ScheduleItemOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<ScheduleItemOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<ScheduleItemOrganisationCreateFieldInput>;
  delete?: InputMaybe<ScheduleItemOrganisationDeleteFieldInput>;
  disconnect?: InputMaybe<ScheduleItemOrganisationDisconnectFieldInput>;
  update?: InputMaybe<ScheduleItemOrganisationUpdateConnectionInput>;
  where?: InputMaybe<ScheduleItemOrganisationConnectionWhere>;
}

export interface ScheduleItemOwnerAggregateInput {
  AND?: InputMaybe<Array<ScheduleItemOwnerAggregateInput>>;
  OR?: InputMaybe<Array<ScheduleItemOwnerAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<ScheduleItemOwnerNodeAggregationWhereInput>;
}

export interface ScheduleItemOwnerConnectFieldInput {
  connect?: InputMaybe<HiveUserConnectInput>;
  where?: InputMaybe<HiveUserConnectWhere>;
}

export interface ScheduleItemOwnerConnectOrCreateFieldInput {
  onCreate: ScheduleItemOwnerConnectOrCreateFieldInputOnCreate;
  where: HiveUserConnectOrCreateWhere;
}

export interface ScheduleItemOwnerConnectOrCreateFieldInputOnCreate {
  node: HiveUserCreateInput;
}

export interface ScheduleItemOwnerConnectionSort {
  node?: InputMaybe<HiveUserSort>;
}

export interface ScheduleItemOwnerConnectionWhere {
  AND?: InputMaybe<Array<ScheduleItemOwnerConnectionWhere>>;
  OR?: InputMaybe<Array<ScheduleItemOwnerConnectionWhere>>;
  node?: InputMaybe<HiveUserWhere>;
  node_NOT?: InputMaybe<HiveUserWhere>;
}

export interface ScheduleItemOwnerCreateFieldInput {
  node: HiveUserCreateInput;
}

export interface ScheduleItemOwnerDeleteFieldInput {
  delete?: InputMaybe<HiveUserDeleteInput>;
  where?: InputMaybe<ScheduleItemOwnerConnectionWhere>;
}

export interface ScheduleItemOwnerDisconnectFieldInput {
  disconnect?: InputMaybe<HiveUserDisconnectInput>;
  where?: InputMaybe<ScheduleItemOwnerConnectionWhere>;
}

export interface ScheduleItemOwnerFieldInput {
  connect?: InputMaybe<ScheduleItemOwnerConnectFieldInput>;
  connectOrCreate?: InputMaybe<ScheduleItemOwnerConnectOrCreateFieldInput>;
  create?: InputMaybe<ScheduleItemOwnerCreateFieldInput>;
}

export interface ScheduleItemOwnerNodeAggregationWhereInput {
  AND?: InputMaybe<Array<ScheduleItemOwnerNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<ScheduleItemOwnerNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  password_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  password_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  password_EQUAL?: InputMaybe<Scalars["String"]>;
  password_GT?: InputMaybe<Scalars["Int"]>;
  password_GTE?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  password_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  password_LT?: InputMaybe<Scalars["Int"]>;
  password_LTE?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  password_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  username_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  username_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  username_EQUAL?: InputMaybe<Scalars["String"]>;
  username_GT?: InputMaybe<Scalars["Int"]>;
  username_GTE?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  username_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  username_LT?: InputMaybe<Scalars["Int"]>;
  username_LTE?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  username_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface ScheduleItemOwnerUpdateConnectionInput {
  node?: InputMaybe<HiveUserUpdateInput>;
}

export interface ScheduleItemOwnerUpdateFieldInput {
  connect?: InputMaybe<ScheduleItemOwnerConnectFieldInput>;
  connectOrCreate?: InputMaybe<ScheduleItemOwnerConnectOrCreateFieldInput>;
  create?: InputMaybe<ScheduleItemOwnerCreateFieldInput>;
  delete?: InputMaybe<ScheduleItemOwnerDeleteFieldInput>;
  disconnect?: InputMaybe<ScheduleItemOwnerDisconnectFieldInput>;
  update?: InputMaybe<ScheduleItemOwnerUpdateConnectionInput>;
  where?: InputMaybe<ScheduleItemOwnerConnectionWhere>;
}

export interface ScheduleItemPeopleAggregateInput {
  AND?: InputMaybe<Array<ScheduleItemPeopleAggregateInput>>;
  OR?: InputMaybe<Array<ScheduleItemPeopleAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<ScheduleItemPeopleNodeAggregationWhereInput>;
}

export interface ScheduleItemPeopleConnectFieldInput {
  connect?: InputMaybe<Array<PeopleConnectInput>>;
  where?: InputMaybe<PeopleConnectWhere>;
}

export interface ScheduleItemPeopleConnectOrCreateFieldInput {
  onCreate: ScheduleItemPeopleConnectOrCreateFieldInputOnCreate;
  where: PeopleConnectOrCreateWhere;
}

export interface ScheduleItemPeopleConnectOrCreateFieldInputOnCreate {
  node: PeopleCreateInput;
}

export interface ScheduleItemPeopleConnectionSort {
  node?: InputMaybe<PeopleSort>;
}

export interface ScheduleItemPeopleConnectionWhere {
  AND?: InputMaybe<Array<ScheduleItemPeopleConnectionWhere>>;
  OR?: InputMaybe<Array<ScheduleItemPeopleConnectionWhere>>;
  node?: InputMaybe<PeopleWhere>;
  node_NOT?: InputMaybe<PeopleWhere>;
}

export interface ScheduleItemPeopleCreateFieldInput {
  node: PeopleCreateInput;
}

export interface ScheduleItemPeopleDeleteFieldInput {
  delete?: InputMaybe<PeopleDeleteInput>;
  where?: InputMaybe<ScheduleItemPeopleConnectionWhere>;
}

export interface ScheduleItemPeopleDisconnectFieldInput {
  disconnect?: InputMaybe<PeopleDisconnectInput>;
  where?: InputMaybe<ScheduleItemPeopleConnectionWhere>;
}

export interface ScheduleItemPeopleFieldInput {
  connect?: InputMaybe<Array<ScheduleItemPeopleConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<ScheduleItemPeopleConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<ScheduleItemPeopleCreateFieldInput>>;
}

export interface ScheduleItemPeopleNodeAggregationWhereInput {
  AND?: InputMaybe<Array<ScheduleItemPeopleNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<ScheduleItemPeopleNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface ScheduleItemPeopleUpdateConnectionInput {
  node?: InputMaybe<PeopleUpdateInput>;
}

export interface ScheduleItemPeopleUpdateFieldInput {
  connect?: InputMaybe<Array<ScheduleItemPeopleConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<ScheduleItemPeopleConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<ScheduleItemPeopleCreateFieldInput>>;
  delete?: InputMaybe<Array<ScheduleItemPeopleDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ScheduleItemPeopleDisconnectFieldInput>>;
  update?: InputMaybe<ScheduleItemPeopleUpdateConnectionInput>;
  where?: InputMaybe<ScheduleItemPeopleConnectionWhere>;
}

export interface ScheduleItemProjectAggregateInput {
  AND?: InputMaybe<Array<ScheduleItemProjectAggregateInput>>;
  OR?: InputMaybe<Array<ScheduleItemProjectAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<ScheduleItemProjectNodeAggregationWhereInput>;
}

export interface ScheduleItemProjectConnectFieldInput {
  connect?: InputMaybe<ProjectConnectInput>;
  where?: InputMaybe<ProjectConnectWhere>;
}

export interface ScheduleItemProjectConnectOrCreateFieldInput {
  onCreate: ScheduleItemProjectConnectOrCreateFieldInputOnCreate;
  where: ProjectConnectOrCreateWhere;
}

export interface ScheduleItemProjectConnectOrCreateFieldInputOnCreate {
  node: ProjectCreateInput;
}

export interface ScheduleItemProjectConnectionSort {
  node?: InputMaybe<ProjectSort>;
}

export interface ScheduleItemProjectConnectionWhere {
  AND?: InputMaybe<Array<ScheduleItemProjectConnectionWhere>>;
  OR?: InputMaybe<Array<ScheduleItemProjectConnectionWhere>>;
  node?: InputMaybe<ProjectWhere>;
  node_NOT?: InputMaybe<ProjectWhere>;
}

export interface ScheduleItemProjectCreateFieldInput {
  node: ProjectCreateInput;
}

export interface ScheduleItemProjectDeleteFieldInput {
  delete?: InputMaybe<ProjectDeleteInput>;
  where?: InputMaybe<ScheduleItemProjectConnectionWhere>;
}

export interface ScheduleItemProjectDisconnectFieldInput {
  disconnect?: InputMaybe<ProjectDisconnectInput>;
  where?: InputMaybe<ScheduleItemProjectConnectionWhere>;
}

export interface ScheduleItemProjectFieldInput {
  connect?: InputMaybe<ScheduleItemProjectConnectFieldInput>;
  connectOrCreate?: InputMaybe<ScheduleItemProjectConnectOrCreateFieldInput>;
  create?: InputMaybe<ScheduleItemProjectCreateFieldInput>;
}

export interface ScheduleItemProjectNodeAggregationWhereInput {
  AND?: InputMaybe<Array<ScheduleItemProjectNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<ScheduleItemProjectNodeAggregationWhereInput>>;
  endDate_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  startDate_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  status_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  status_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  status_EQUAL?: InputMaybe<Scalars["String"]>;
  status_GT?: InputMaybe<Scalars["Int"]>;
  status_GTE?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  status_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  status_LT?: InputMaybe<Scalars["Int"]>;
  status_LTE?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  status_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface ScheduleItemProjectUpdateConnectionInput {
  node?: InputMaybe<ProjectUpdateInput>;
}

export interface ScheduleItemProjectUpdateFieldInput {
  connect?: InputMaybe<ScheduleItemProjectConnectFieldInput>;
  connectOrCreate?: InputMaybe<ScheduleItemProjectConnectOrCreateFieldInput>;
  create?: InputMaybe<ScheduleItemProjectCreateFieldInput>;
  delete?: InputMaybe<ScheduleItemProjectDeleteFieldInput>;
  disconnect?: InputMaybe<ScheduleItemProjectDisconnectFieldInput>;
  update?: InputMaybe<ScheduleItemProjectUpdateConnectionInput>;
  where?: InputMaybe<ScheduleItemProjectConnectionWhere>;
}

export interface ScheduleItemRelationInput {
  equipment?: InputMaybe<Array<ScheduleItemEquipmentCreateFieldInput>>;
  managers?: InputMaybe<Array<ScheduleItemManagersCreateFieldInput>>;
  organisation?: InputMaybe<ScheduleItemOrganisationCreateFieldInput>;
  owner?: InputMaybe<ScheduleItemOwnerCreateFieldInput>;
  people?: InputMaybe<Array<ScheduleItemPeopleCreateFieldInput>>;
  project?: InputMaybe<ScheduleItemProjectCreateFieldInput>;
}

/** Fields to sort ScheduleItems by. The order in which sorts are applied is not guaranteed when specifying many fields in one ScheduleItemSort object. */
export interface ScheduleItemSort {
  date?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
}

export interface ScheduleItemUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface ScheduleItemUpdateInput {
  date?: InputMaybe<Scalars["DateTime"]>;
  equipment?: InputMaybe<Array<ScheduleItemEquipmentUpdateFieldInput>>;
  managers?: InputMaybe<Array<ScheduleItemManagersUpdateFieldInput>>;
  notes?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  organisation?: InputMaybe<ScheduleItemOrganisationUpdateFieldInput>;
  owner?: InputMaybe<ScheduleItemOwnerUpdateFieldInput>;
  people?: InputMaybe<Array<ScheduleItemPeopleUpdateFieldInput>>;
  project?: InputMaybe<ScheduleItemProjectUpdateFieldInput>;
}

export interface ScheduleItemWhere {
  AND?: InputMaybe<Array<ScheduleItemWhere>>;
  OR?: InputMaybe<Array<ScheduleItemWhere>>;
  date?: InputMaybe<Scalars["DateTime"]>;
  date_GT?: InputMaybe<Scalars["DateTime"]>;
  date_GTE?: InputMaybe<Scalars["DateTime"]>;
  date_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  date_LT?: InputMaybe<Scalars["DateTime"]>;
  date_LTE?: InputMaybe<Scalars["DateTime"]>;
  date_NOT?: InputMaybe<Scalars["DateTime"]>;
  date_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  equipment?: InputMaybe<EquipmentWhere>;
  equipmentAggregate?: InputMaybe<ScheduleItemEquipmentAggregateInput>;
  equipmentConnection?: InputMaybe<ScheduleItemEquipmentConnectionWhere>;
  equipmentConnection_NOT?: InputMaybe<ScheduleItemEquipmentConnectionWhere>;
  equipment_NOT?: InputMaybe<EquipmentWhere>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  managers?: InputMaybe<HiveUserWhere>;
  managersAggregate?: InputMaybe<ScheduleItemManagersAggregateInput>;
  managersConnection?: InputMaybe<ScheduleItemManagersConnectionWhere>;
  managersConnection_NOT?: InputMaybe<ScheduleItemManagersConnectionWhere>;
  managers_NOT?: InputMaybe<HiveUserWhere>;
  notes?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  notes_INCLUDES?: InputMaybe<Scalars["String"]>;
  notes_NOT?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  notes_NOT_INCLUDES?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveOrganisationWhere>;
  organisationAggregate?: InputMaybe<ScheduleItemOrganisationAggregateInput>;
  organisationConnection?: InputMaybe<ScheduleItemOrganisationConnectionWhere>;
  organisationConnection_NOT?: InputMaybe<ScheduleItemOrganisationConnectionWhere>;
  organisation_NOT?: InputMaybe<HiveOrganisationWhere>;
  owner?: InputMaybe<HiveUserWhere>;
  ownerAggregate?: InputMaybe<ScheduleItemOwnerAggregateInput>;
  ownerConnection?: InputMaybe<ScheduleItemOwnerConnectionWhere>;
  ownerConnection_NOT?: InputMaybe<ScheduleItemOwnerConnectionWhere>;
  owner_NOT?: InputMaybe<HiveUserWhere>;
  people?: InputMaybe<PeopleWhere>;
  peopleAggregate?: InputMaybe<ScheduleItemPeopleAggregateInput>;
  peopleConnection?: InputMaybe<ScheduleItemPeopleConnectionWhere>;
  peopleConnection_NOT?: InputMaybe<ScheduleItemPeopleConnectionWhere>;
  people_NOT?: InputMaybe<PeopleWhere>;
  project?: InputMaybe<ProjectWhere>;
  projectAggregate?: InputMaybe<ScheduleItemProjectAggregateInput>;
  projectConnection?: InputMaybe<ScheduleItemProjectConnectionWhere>;
  projectConnection_NOT?: InputMaybe<ScheduleItemProjectConnectionWhere>;
  project_NOT?: InputMaybe<ProjectWhere>;
}

export enum SortDirection {
  /** Sort by field values in ascending order. */
  ASC = "ASC",
  /** Sort by field values in descending order. */
  DESC = "DESC",
}

export interface TimelineItemConnectInput {
  items?: InputMaybe<Array<TimelineItemItemsConnectFieldInput>>;
  organisation?: InputMaybe<TimelineItemOrganisationConnectFieldInput>;
  project?: InputMaybe<TimelineItemProjectConnectInput>;
}

export interface TimelineItemConnectOrCreateInput {
  items?: InputMaybe<Array<TimelineItemItemsConnectOrCreateFieldInput>>;
  organisation?: InputMaybe<TimelineItemOrganisationConnectOrCreateFieldInput>;
  project?: InputMaybe<TimelineItemProjectConnectOrCreateInput>;
}

export interface TimelineItemConnectOrCreateWhere {
  node: TimelineItemUniqueWhere;
}

export interface TimelineItemConnectWhere {
  node: TimelineItemWhere;
}

export interface TimelineItemCreateInput {
  endDate?: InputMaybe<Scalars["DateTime"]>;
  items?: InputMaybe<TimelineItemItemsFieldInput>;
  notes?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<TimelineItemOrganisationFieldInput>;
  project?: InputMaybe<TimelineItemProjectCreateInput>;
  startDate?: InputMaybe<Scalars["DateTime"]>;
  timeline?: InputMaybe<Scalars["String"]>;
}

export interface TimelineItemDeleteInput {
  items?: InputMaybe<Array<TimelineItemItemsDeleteFieldInput>>;
  organisation?: InputMaybe<TimelineItemOrganisationDeleteFieldInput>;
  project?: InputMaybe<TimelineItemProjectDeleteInput>;
}

export interface TimelineItemDisconnectInput {
  items?: InputMaybe<Array<TimelineItemItemsDisconnectFieldInput>>;
  organisation?: InputMaybe<TimelineItemOrganisationDisconnectFieldInput>;
  project?: InputMaybe<TimelineItemProjectDisconnectInput>;
}

export interface TimelineItemItemsAggregateInput {
  AND?: InputMaybe<Array<TimelineItemItemsAggregateInput>>;
  OR?: InputMaybe<Array<TimelineItemItemsAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<TimelineItemItemsNodeAggregationWhereInput>;
}

export interface TimelineItemItemsConnectFieldInput {
  connect?: InputMaybe<Array<TimelineItemItemsConnectInput>>;
  where?: InputMaybe<TimelineItemItemsConnectWhere>;
}

export interface TimelineItemItemsConnectInput {
  item?: InputMaybe<TimelineItemItemsItemConnectFieldInput>;
}

export interface TimelineItemItemsConnectOrCreateFieldInput {
  onCreate: TimelineItemItemsConnectOrCreateFieldInputOnCreate;
  where: TimelineItemItemsConnectOrCreateWhere;
}

export interface TimelineItemItemsConnectOrCreateFieldInputOnCreate {
  node: TimelineItemItemsCreateInput;
}

export interface TimelineItemItemsConnectOrCreateInput {
  item?: InputMaybe<TimelineItemItemsItemConnectOrCreateFieldInput>;
}

export interface TimelineItemItemsConnectOrCreateWhere {
  node: TimelineItemItemsUniqueWhere;
}

export interface TimelineItemItemsConnectWhere {
  node: TimelineItemItemsWhere;
}

export interface TimelineItemItemsConnectionSort {
  node?: InputMaybe<TimelineItemItemsSort>;
}

export interface TimelineItemItemsConnectionWhere {
  AND?: InputMaybe<Array<TimelineItemItemsConnectionWhere>>;
  OR?: InputMaybe<Array<TimelineItemItemsConnectionWhere>>;
  node?: InputMaybe<TimelineItemItemsWhere>;
  node_NOT?: InputMaybe<TimelineItemItemsWhere>;
}

export interface TimelineItemItemsCreateFieldInput {
  node: TimelineItemItemsCreateInput;
}

export interface TimelineItemItemsCreateInput {
  estimate?: InputMaybe<Scalars["Float"]>;
  item?: InputMaybe<TimelineItemItemsItemFieldInput>;
  location?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
}

export interface TimelineItemItemsDeleteFieldInput {
  delete?: InputMaybe<TimelineItemItemsDeleteInput>;
  where?: InputMaybe<TimelineItemItemsConnectionWhere>;
}

export interface TimelineItemItemsDeleteInput {
  item?: InputMaybe<TimelineItemItemsItemDeleteFieldInput>;
}

export interface TimelineItemItemsDisconnectFieldInput {
  disconnect?: InputMaybe<TimelineItemItemsDisconnectInput>;
  where?: InputMaybe<TimelineItemItemsConnectionWhere>;
}

export interface TimelineItemItemsDisconnectInput {
  item?: InputMaybe<TimelineItemItemsItemDisconnectFieldInput>;
}

export interface TimelineItemItemsFieldInput {
  connect?: InputMaybe<Array<TimelineItemItemsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<TimelineItemItemsConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<TimelineItemItemsCreateFieldInput>>;
}

export interface TimelineItemItemsItemAggregateInput {
  AND?: InputMaybe<Array<TimelineItemItemsItemAggregateInput>>;
  OR?: InputMaybe<Array<TimelineItemItemsItemAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<TimelineItemItemsItemNodeAggregationWhereInput>;
}

export interface TimelineItemItemsItemConnectFieldInput {
  connect?: InputMaybe<TimelineItemConnectInput>;
  where?: InputMaybe<TimelineItemConnectWhere>;
}

export interface TimelineItemItemsItemConnectOrCreateFieldInput {
  onCreate: TimelineItemItemsItemConnectOrCreateFieldInputOnCreate;
  where: TimelineItemConnectOrCreateWhere;
}

export interface TimelineItemItemsItemConnectOrCreateFieldInputOnCreate {
  node: TimelineItemCreateInput;
}

export interface TimelineItemItemsItemConnectionSort {
  node?: InputMaybe<TimelineItemSort>;
}

export interface TimelineItemItemsItemConnectionWhere {
  AND?: InputMaybe<Array<TimelineItemItemsItemConnectionWhere>>;
  OR?: InputMaybe<Array<TimelineItemItemsItemConnectionWhere>>;
  node?: InputMaybe<TimelineItemWhere>;
  node_NOT?: InputMaybe<TimelineItemWhere>;
}

export interface TimelineItemItemsItemCreateFieldInput {
  node: TimelineItemCreateInput;
}

export interface TimelineItemItemsItemDeleteFieldInput {
  delete?: InputMaybe<TimelineItemDeleteInput>;
  where?: InputMaybe<TimelineItemItemsItemConnectionWhere>;
}

export interface TimelineItemItemsItemDisconnectFieldInput {
  disconnect?: InputMaybe<TimelineItemDisconnectInput>;
  where?: InputMaybe<TimelineItemItemsItemConnectionWhere>;
}

export interface TimelineItemItemsItemFieldInput {
  connect?: InputMaybe<TimelineItemItemsItemConnectFieldInput>;
  connectOrCreate?: InputMaybe<TimelineItemItemsItemConnectOrCreateFieldInput>;
  create?: InputMaybe<TimelineItemItemsItemCreateFieldInput>;
}

export interface TimelineItemItemsItemNodeAggregationWhereInput {
  AND?: InputMaybe<Array<TimelineItemItemsItemNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<TimelineItemItemsItemNodeAggregationWhereInput>>;
  endDate_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  notes_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  notes_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  notes_EQUAL?: InputMaybe<Scalars["String"]>;
  notes_GT?: InputMaybe<Scalars["Int"]>;
  notes_GTE?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  notes_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  notes_LT?: InputMaybe<Scalars["Int"]>;
  notes_LTE?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  notes_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  startDate_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MAX_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_EQUAL?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_MIN_LTE?: InputMaybe<Scalars["DateTime"]>;
  timeline_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  timeline_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  timeline_EQUAL?: InputMaybe<Scalars["String"]>;
  timeline_GT?: InputMaybe<Scalars["Int"]>;
  timeline_GTE?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  timeline_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  timeline_LT?: InputMaybe<Scalars["Int"]>;
  timeline_LTE?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  timeline_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface TimelineItemItemsItemUpdateConnectionInput {
  node?: InputMaybe<TimelineItemUpdateInput>;
}

export interface TimelineItemItemsItemUpdateFieldInput {
  connect?: InputMaybe<TimelineItemItemsItemConnectFieldInput>;
  connectOrCreate?: InputMaybe<TimelineItemItemsItemConnectOrCreateFieldInput>;
  create?: InputMaybe<TimelineItemItemsItemCreateFieldInput>;
  delete?: InputMaybe<TimelineItemItemsItemDeleteFieldInput>;
  disconnect?: InputMaybe<TimelineItemItemsItemDisconnectFieldInput>;
  update?: InputMaybe<TimelineItemItemsItemUpdateConnectionInput>;
  where?: InputMaybe<TimelineItemItemsItemConnectionWhere>;
}

export interface TimelineItemItemsNodeAggregationWhereInput {
  AND?: InputMaybe<Array<TimelineItemItemsNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<TimelineItemItemsNodeAggregationWhereInput>>;
  estimate_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  estimate_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  estimate_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  estimate_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  estimate_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  estimate_EQUAL?: InputMaybe<Scalars["Float"]>;
  estimate_GT?: InputMaybe<Scalars["Float"]>;
  estimate_GTE?: InputMaybe<Scalars["Float"]>;
  estimate_LT?: InputMaybe<Scalars["Float"]>;
  estimate_LTE?: InputMaybe<Scalars["Float"]>;
  estimate_MAX_EQUAL?: InputMaybe<Scalars["Float"]>;
  estimate_MAX_GT?: InputMaybe<Scalars["Float"]>;
  estimate_MAX_GTE?: InputMaybe<Scalars["Float"]>;
  estimate_MAX_LT?: InputMaybe<Scalars["Float"]>;
  estimate_MAX_LTE?: InputMaybe<Scalars["Float"]>;
  estimate_MIN_EQUAL?: InputMaybe<Scalars["Float"]>;
  estimate_MIN_GT?: InputMaybe<Scalars["Float"]>;
  estimate_MIN_GTE?: InputMaybe<Scalars["Float"]>;
  estimate_MIN_LT?: InputMaybe<Scalars["Float"]>;
  estimate_MIN_LTE?: InputMaybe<Scalars["Float"]>;
  estimate_SUM_EQUAL?: InputMaybe<Scalars["Float"]>;
  estimate_SUM_GT?: InputMaybe<Scalars["Float"]>;
  estimate_SUM_GTE?: InputMaybe<Scalars["Float"]>;
  estimate_SUM_LT?: InputMaybe<Scalars["Float"]>;
  estimate_SUM_LTE?: InputMaybe<Scalars["Float"]>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  location_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  location_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  location_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  location_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  location_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  location_EQUAL?: InputMaybe<Scalars["String"]>;
  location_GT?: InputMaybe<Scalars["Int"]>;
  location_GTE?: InputMaybe<Scalars["Int"]>;
  location_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  location_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  location_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  location_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  location_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  location_LT?: InputMaybe<Scalars["Int"]>;
  location_LTE?: InputMaybe<Scalars["Int"]>;
  location_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  location_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  location_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  location_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  location_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  type_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  type_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  type_EQUAL?: InputMaybe<Scalars["String"]>;
  type_GT?: InputMaybe<Scalars["Int"]>;
  type_GTE?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  type_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  type_LT?: InputMaybe<Scalars["Int"]>;
  type_LTE?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  type_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface TimelineItemItemsOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more TimelineItemItemsSort objects to sort TimelineItemItems by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<TimelineItemItemsSort>>>;
}

export interface TimelineItemItemsRelationInput {
  item?: InputMaybe<TimelineItemItemsItemCreateFieldInput>;
}

/** Fields to sort TimelineItemItems by. The order in which sorts are applied is not guaranteed when specifying many fields in one TimelineItemItemsSort object. */
export interface TimelineItemItemsSort {
  estimate?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  location?: InputMaybe<SortDirection>;
  type?: InputMaybe<SortDirection>;
}

export interface TimelineItemItemsUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface TimelineItemItemsUpdateConnectionInput {
  node?: InputMaybe<TimelineItemItemsUpdateInput>;
}

export interface TimelineItemItemsUpdateFieldInput {
  connect?: InputMaybe<Array<TimelineItemItemsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<
    Array<TimelineItemItemsConnectOrCreateFieldInput>
  >;
  create?: InputMaybe<Array<TimelineItemItemsCreateFieldInput>>;
  delete?: InputMaybe<Array<TimelineItemItemsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<TimelineItemItemsDisconnectFieldInput>>;
  update?: InputMaybe<TimelineItemItemsUpdateConnectionInput>;
  where?: InputMaybe<TimelineItemItemsConnectionWhere>;
}

export interface TimelineItemItemsUpdateInput {
  estimate?: InputMaybe<Scalars["Float"]>;
  item?: InputMaybe<TimelineItemItemsItemUpdateFieldInput>;
  location?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
}

export interface TimelineItemItemsWhere {
  AND?: InputMaybe<Array<TimelineItemItemsWhere>>;
  OR?: InputMaybe<Array<TimelineItemItemsWhere>>;
  estimate?: InputMaybe<Scalars["Float"]>;
  estimate_GT?: InputMaybe<Scalars["Float"]>;
  estimate_GTE?: InputMaybe<Scalars["Float"]>;
  estimate_IN?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
  estimate_LT?: InputMaybe<Scalars["Float"]>;
  estimate_LTE?: InputMaybe<Scalars["Float"]>;
  estimate_NOT?: InputMaybe<Scalars["Float"]>;
  estimate_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  item?: InputMaybe<TimelineItemWhere>;
  itemAggregate?: InputMaybe<TimelineItemItemsItemAggregateInput>;
  itemConnection?: InputMaybe<TimelineItemItemsItemConnectionWhere>;
  itemConnection_NOT?: InputMaybe<TimelineItemItemsItemConnectionWhere>;
  item_NOT?: InputMaybe<TimelineItemWhere>;
  location?: InputMaybe<Scalars["String"]>;
  location_CONTAINS?: InputMaybe<Scalars["String"]>;
  location_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  location_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  location_NOT?: InputMaybe<Scalars["String"]>;
  location_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  location_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  location_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  location_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  location_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
  type_CONTAINS?: InputMaybe<Scalars["String"]>;
  type_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  type_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  type_NOT?: InputMaybe<Scalars["String"]>;
  type_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  type_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  type_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  type_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  type_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

export interface TimelineItemOptions {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more TimelineItemSort objects to sort TimelineItems by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<InputMaybe<TimelineItemSort>>>;
}

export interface TimelineItemOrganisationAggregateInput {
  AND?: InputMaybe<Array<TimelineItemOrganisationAggregateInput>>;
  OR?: InputMaybe<Array<TimelineItemOrganisationAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<TimelineItemOrganisationNodeAggregationWhereInput>;
}

export interface TimelineItemOrganisationConnectFieldInput {
  connect?: InputMaybe<HiveOrganisationConnectInput>;
  where?: InputMaybe<HiveOrganisationConnectWhere>;
}

export interface TimelineItemOrganisationConnectOrCreateFieldInput {
  onCreate: TimelineItemOrganisationConnectOrCreateFieldInputOnCreate;
  where: HiveOrganisationConnectOrCreateWhere;
}

export interface TimelineItemOrganisationConnectOrCreateFieldInputOnCreate {
  node: HiveOrganisationCreateInput;
}

export interface TimelineItemOrganisationConnectionSort {
  node?: InputMaybe<HiveOrganisationSort>;
}

export interface TimelineItemOrganisationConnectionWhere {
  AND?: InputMaybe<Array<TimelineItemOrganisationConnectionWhere>>;
  OR?: InputMaybe<Array<TimelineItemOrganisationConnectionWhere>>;
  node?: InputMaybe<HiveOrganisationWhere>;
  node_NOT?: InputMaybe<HiveOrganisationWhere>;
}

export interface TimelineItemOrganisationCreateFieldInput {
  node: HiveOrganisationCreateInput;
}

export interface TimelineItemOrganisationDeleteFieldInput {
  delete?: InputMaybe<HiveOrganisationDeleteInput>;
  where?: InputMaybe<TimelineItemOrganisationConnectionWhere>;
}

export interface TimelineItemOrganisationDisconnectFieldInput {
  disconnect?: InputMaybe<HiveOrganisationDisconnectInput>;
  where?: InputMaybe<TimelineItemOrganisationConnectionWhere>;
}

export interface TimelineItemOrganisationFieldInput {
  connect?: InputMaybe<TimelineItemOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<TimelineItemOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<TimelineItemOrganisationCreateFieldInput>;
}

export interface TimelineItemOrganisationNodeAggregationWhereInput {
  AND?: InputMaybe<Array<TimelineItemOrganisationNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<TimelineItemOrganisationNodeAggregationWhereInput>>;
  id_EQUAL?: InputMaybe<Scalars["ID"]>;
  name_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  name_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  name_EQUAL?: InputMaybe<Scalars["String"]>;
  name_GT?: InputMaybe<Scalars["Int"]>;
  name_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  name_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  name_LT?: InputMaybe<Scalars["Int"]>;
  name_LTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  name_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
}

export interface TimelineItemOrganisationUpdateConnectionInput {
  node?: InputMaybe<HiveOrganisationUpdateInput>;
}

export interface TimelineItemOrganisationUpdateFieldInput {
  connect?: InputMaybe<TimelineItemOrganisationConnectFieldInput>;
  connectOrCreate?: InputMaybe<TimelineItemOrganisationConnectOrCreateFieldInput>;
  create?: InputMaybe<TimelineItemOrganisationCreateFieldInput>;
  delete?: InputMaybe<TimelineItemOrganisationDeleteFieldInput>;
  disconnect?: InputMaybe<TimelineItemOrganisationDisconnectFieldInput>;
  update?: InputMaybe<TimelineItemOrganisationUpdateConnectionInput>;
  where?: InputMaybe<TimelineItemOrganisationConnectionWhere>;
}

export interface TimelineItemProjectConnectInput {
  Estimate?: InputMaybe<TimelineItemProjectEstimateConnectFieldInput>;
  Project?: InputMaybe<TimelineItemProjectProjectConnectFieldInput>;
}

export interface TimelineItemProjectConnectOrCreateInput {
  Estimate?: InputMaybe<TimelineItemProjectEstimateConnectOrCreateFieldInput>;
  Project?: InputMaybe<TimelineItemProjectProjectConnectOrCreateFieldInput>;
}

export interface TimelineItemProjectConnectionEstimateWhere {
  AND?: InputMaybe<
    Array<InputMaybe<TimelineItemProjectConnectionEstimateWhere>>
  >;
  OR?: InputMaybe<
    Array<InputMaybe<TimelineItemProjectConnectionEstimateWhere>>
  >;
  node?: InputMaybe<EstimateWhere>;
  node_NOT?: InputMaybe<EstimateWhere>;
}

export interface TimelineItemProjectConnectionProjectWhere {
  AND?: InputMaybe<
    Array<InputMaybe<TimelineItemProjectConnectionProjectWhere>>
  >;
  OR?: InputMaybe<Array<InputMaybe<TimelineItemProjectConnectionProjectWhere>>>;
  node?: InputMaybe<ProjectWhere>;
  node_NOT?: InputMaybe<ProjectWhere>;
}

export interface TimelineItemProjectConnectionWhere {
  Estimate?: InputMaybe<TimelineItemProjectConnectionEstimateWhere>;
  Project?: InputMaybe<TimelineItemProjectConnectionProjectWhere>;
}

export interface TimelineItemProjectCreateFieldInput {
  Estimate?: InputMaybe<Array<TimelineItemProjectEstimateCreateFieldInput>>;
  Project?: InputMaybe<Array<TimelineItemProjectProjectCreateFieldInput>>;
}

export interface TimelineItemProjectCreateInput {
  Estimate?: InputMaybe<TimelineItemProjectEstimateFieldInput>;
  Project?: InputMaybe<TimelineItemProjectProjectFieldInput>;
}

export interface TimelineItemProjectDeleteInput {
  Estimate?: InputMaybe<TimelineItemProjectEstimateDeleteFieldInput>;
  Project?: InputMaybe<TimelineItemProjectProjectDeleteFieldInput>;
}

export interface TimelineItemProjectDisconnectInput {
  Estimate?: InputMaybe<TimelineItemProjectEstimateDisconnectFieldInput>;
  Project?: InputMaybe<TimelineItemProjectProjectDisconnectFieldInput>;
}

export interface TimelineItemProjectEstimateConnectFieldInput {
  connect?: InputMaybe<EstimateConnectInput>;
  where?: InputMaybe<EstimateConnectWhere>;
}

export interface TimelineItemProjectEstimateConnectOrCreateFieldInput {
  onCreate: TimelineItemProjectEstimateConnectOrCreateFieldInputOnCreate;
  where: EstimateConnectOrCreateWhere;
}

export interface TimelineItemProjectEstimateConnectOrCreateFieldInputOnCreate {
  node: EstimateCreateInput;
}

export interface TimelineItemProjectEstimateConnectionWhere {
  AND?: InputMaybe<Array<TimelineItemProjectEstimateConnectionWhere>>;
  OR?: InputMaybe<Array<TimelineItemProjectEstimateConnectionWhere>>;
  node?: InputMaybe<EstimateWhere>;
  node_NOT?: InputMaybe<EstimateWhere>;
}

export interface TimelineItemProjectEstimateCreateFieldInput {
  node: EstimateCreateInput;
}

export interface TimelineItemProjectEstimateDeleteFieldInput {
  delete?: InputMaybe<EstimateDeleteInput>;
  where?: InputMaybe<TimelineItemProjectEstimateConnectionWhere>;
}

export interface TimelineItemProjectEstimateDisconnectFieldInput {
  disconnect?: InputMaybe<EstimateDisconnectInput>;
  where?: InputMaybe<TimelineItemProjectEstimateConnectionWhere>;
}

export interface TimelineItemProjectEstimateFieldInput {
  connect?: InputMaybe<TimelineItemProjectEstimateConnectFieldInput>;
  connectOrCreate?: InputMaybe<TimelineItemProjectEstimateConnectOrCreateFieldInput>;
  create?: InputMaybe<TimelineItemProjectEstimateCreateFieldInput>;
}

export interface TimelineItemProjectEstimateUpdateConnectionInput {
  node?: InputMaybe<EstimateUpdateInput>;
}

export interface TimelineItemProjectEstimateUpdateFieldInput {
  connect?: InputMaybe<TimelineItemProjectEstimateConnectFieldInput>;
  connectOrCreate?: InputMaybe<TimelineItemProjectEstimateConnectOrCreateFieldInput>;
  create?: InputMaybe<TimelineItemProjectEstimateCreateFieldInput>;
  delete?: InputMaybe<TimelineItemProjectEstimateDeleteFieldInput>;
  disconnect?: InputMaybe<TimelineItemProjectEstimateDisconnectFieldInput>;
  update?: InputMaybe<TimelineItemProjectEstimateUpdateConnectionInput>;
  where?: InputMaybe<TimelineItemProjectEstimateConnectionWhere>;
}

export interface TimelineItemProjectProjectConnectFieldInput {
  connect?: InputMaybe<ProjectConnectInput>;
  where?: InputMaybe<ProjectConnectWhere>;
}

export interface TimelineItemProjectProjectConnectOrCreateFieldInput {
  onCreate: TimelineItemProjectProjectConnectOrCreateFieldInputOnCreate;
  where: ProjectConnectOrCreateWhere;
}

export interface TimelineItemProjectProjectConnectOrCreateFieldInputOnCreate {
  node: ProjectCreateInput;
}

export interface TimelineItemProjectProjectConnectionWhere {
  AND?: InputMaybe<Array<TimelineItemProjectProjectConnectionWhere>>;
  OR?: InputMaybe<Array<TimelineItemProjectProjectConnectionWhere>>;
  node?: InputMaybe<ProjectWhere>;
  node_NOT?: InputMaybe<ProjectWhere>;
}

export interface TimelineItemProjectProjectCreateFieldInput {
  node: ProjectCreateInput;
}

export interface TimelineItemProjectProjectDeleteFieldInput {
  delete?: InputMaybe<ProjectDeleteInput>;
  where?: InputMaybe<TimelineItemProjectProjectConnectionWhere>;
}

export interface TimelineItemProjectProjectDisconnectFieldInput {
  disconnect?: InputMaybe<ProjectDisconnectInput>;
  where?: InputMaybe<TimelineItemProjectProjectConnectionWhere>;
}

export interface TimelineItemProjectProjectFieldInput {
  connect?: InputMaybe<TimelineItemProjectProjectConnectFieldInput>;
  connectOrCreate?: InputMaybe<TimelineItemProjectProjectConnectOrCreateFieldInput>;
  create?: InputMaybe<TimelineItemProjectProjectCreateFieldInput>;
}

export interface TimelineItemProjectProjectUpdateConnectionInput {
  node?: InputMaybe<ProjectUpdateInput>;
}

export interface TimelineItemProjectProjectUpdateFieldInput {
  connect?: InputMaybe<TimelineItemProjectProjectConnectFieldInput>;
  connectOrCreate?: InputMaybe<TimelineItemProjectProjectConnectOrCreateFieldInput>;
  create?: InputMaybe<TimelineItemProjectProjectCreateFieldInput>;
  delete?: InputMaybe<TimelineItemProjectProjectDeleteFieldInput>;
  disconnect?: InputMaybe<TimelineItemProjectProjectDisconnectFieldInput>;
  update?: InputMaybe<TimelineItemProjectProjectUpdateConnectionInput>;
  where?: InputMaybe<TimelineItemProjectProjectConnectionWhere>;
}

export interface TimelineItemProjectUpdateInput {
  Estimate?: InputMaybe<TimelineItemProjectEstimateUpdateFieldInput>;
  Project?: InputMaybe<TimelineItemProjectProjectUpdateFieldInput>;
}

export interface TimelineItemRelationInput {
  items?: InputMaybe<Array<TimelineItemItemsCreateFieldInput>>;
  organisation?: InputMaybe<TimelineItemOrganisationCreateFieldInput>;
  project?: InputMaybe<TimelineItemProjectCreateFieldInput>;
}

/** Fields to sort TimelineItems by. The order in which sorts are applied is not guaranteed when specifying many fields in one TimelineItemSort object. */
export interface TimelineItemSort {
  endDate?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  notes?: InputMaybe<SortDirection>;
  startDate?: InputMaybe<SortDirection>;
  timeline?: InputMaybe<SortDirection>;
}

export interface TimelineItemUniqueWhere {
  id?: InputMaybe<Scalars["ID"]>;
}

export interface TimelineItemUpdateInput {
  endDate?: InputMaybe<Scalars["DateTime"]>;
  items?: InputMaybe<Array<TimelineItemItemsUpdateFieldInput>>;
  notes?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<TimelineItemOrganisationUpdateFieldInput>;
  project?: InputMaybe<TimelineItemProjectUpdateInput>;
  startDate?: InputMaybe<Scalars["DateTime"]>;
  timeline?: InputMaybe<Scalars["String"]>;
}

export interface TimelineItemWhere {
  AND?: InputMaybe<Array<TimelineItemWhere>>;
  OR?: InputMaybe<Array<TimelineItemWhere>>;
  endDate?: InputMaybe<Scalars["DateTime"]>;
  endDate_GT?: InputMaybe<Scalars["DateTime"]>;
  endDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  endDate_LT?: InputMaybe<Scalars["DateTime"]>;
  endDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  endDate_NOT?: InputMaybe<Scalars["DateTime"]>;
  endDate_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT?: InputMaybe<Scalars["ID"]>;
  id_NOT_CONTAINS?: InputMaybe<Scalars["ID"]>;
  id_NOT_ENDS_WITH?: InputMaybe<Scalars["ID"]>;
  id_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_NOT_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  id_STARTS_WITH?: InputMaybe<Scalars["ID"]>;
  items?: InputMaybe<TimelineItemItemsWhere>;
  itemsAggregate?: InputMaybe<TimelineItemItemsAggregateInput>;
  itemsConnection?: InputMaybe<TimelineItemItemsConnectionWhere>;
  itemsConnection_NOT?: InputMaybe<TimelineItemItemsConnectionWhere>;
  items_NOT?: InputMaybe<TimelineItemItemsWhere>;
  notes?: InputMaybe<Scalars["String"]>;
  notes_CONTAINS?: InputMaybe<Scalars["String"]>;
  notes_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  notes_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  notes_NOT?: InputMaybe<Scalars["String"]>;
  notes_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  notes_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  notes_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  notes_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  notes_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  organisation?: InputMaybe<HiveOrganisationWhere>;
  organisationAggregate?: InputMaybe<TimelineItemOrganisationAggregateInput>;
  organisationConnection?: InputMaybe<TimelineItemOrganisationConnectionWhere>;
  organisationConnection_NOT?: InputMaybe<TimelineItemOrganisationConnectionWhere>;
  organisation_NOT?: InputMaybe<HiveOrganisationWhere>;
  projectConnection?: InputMaybe<TimelineItemProjectConnectionWhere>;
  projectConnection_NOT?: InputMaybe<TimelineItemProjectConnectionWhere>;
  startDate?: InputMaybe<Scalars["DateTime"]>;
  startDate_GT?: InputMaybe<Scalars["DateTime"]>;
  startDate_GTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  startDate_LT?: InputMaybe<Scalars["DateTime"]>;
  startDate_LTE?: InputMaybe<Scalars["DateTime"]>;
  startDate_NOT?: InputMaybe<Scalars["DateTime"]>;
  startDate_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]>>>;
  timeline?: InputMaybe<Scalars["String"]>;
  timeline_CONTAINS?: InputMaybe<Scalars["String"]>;
  timeline_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  timeline_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  timeline_NOT?: InputMaybe<Scalars["String"]>;
  timeline_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  timeline_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  timeline_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  timeline_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  timeline_STARTS_WITH?: InputMaybe<Scalars["String"]>;
}

export interface TimelineProjectWhere {
  Estimate?: InputMaybe<EstimateWhere>;
  Project?: InputMaybe<ProjectWhere>;
}

export const scalarsEnumsHash: import("gqty").ScalarsEnumsHash = {
  Boolean: true,
  DateTime: true,
  Float: true,
  ID: true,
  Int: true,
  SortDirection: true,
  String: true,
};
export const generatedSchema = {
  CreateEquipmentMutationResponse: {
    __typename: { __type: "String!" },
    equipment: { __type: "[Equipment!]!" },
    info: { __type: "CreateInfo!" },
  },
  CreateEstimatesMutationResponse: {
    __typename: { __type: "String!" },
    estimates: { __type: "[Estimate!]!" },
    info: { __type: "CreateInfo!" },
  },
  CreateHiveAppliancesMutationResponse: {
    __typename: { __type: "String!" },
    hiveAppliances: { __type: "[HiveAppliance!]!" },
    info: { __type: "CreateInfo!" },
  },
  CreateHiveIntegrationInstancesMutationResponse: {
    __typename: { __type: "String!" },
    hiveIntegrationInstances: { __type: "[HiveIntegrationInstance!]!" },
    info: { __type: "CreateInfo!" },
  },
  CreateHiveIntegrationPathCollectionsMutationResponse: {
    __typename: { __type: "String!" },
    hiveIntegrationPathCollections: {
      __type: "[HiveIntegrationPathCollection!]!",
    },
    info: { __type: "CreateInfo!" },
  },
  CreateHiveIntegrationPathsMutationResponse: {
    __typename: { __type: "String!" },
    hiveIntegrationPaths: { __type: "[HiveIntegrationPath!]!" },
    info: { __type: "CreateInfo!" },
  },
  CreateHiveIntegrationsMutationResponse: {
    __typename: { __type: "String!" },
    hiveIntegrations: { __type: "[HiveIntegration!]!" },
    info: { __type: "CreateInfo!" },
  },
  CreateHiveOrganisationsMutationResponse: {
    __typename: { __type: "String!" },
    hiveOrganisations: { __type: "[HiveOrganisation!]!" },
    info: { __type: "CreateInfo!" },
  },
  CreateHiveServicesMutationResponse: {
    __typename: { __type: "String!" },
    hiveServices: { __type: "[HiveService!]!" },
    info: { __type: "CreateInfo!" },
  },
  CreateHiveTypeFieldsMutationResponse: {
    __typename: { __type: "String!" },
    hiveTypeFields: { __type: "[HiveTypeField!]!" },
    info: { __type: "CreateInfo!" },
  },
  CreateHiveTypesMutationResponse: {
    __typename: { __type: "String!" },
    hiveTypes: { __type: "[HiveType!]!" },
    info: { __type: "CreateInfo!" },
  },
  CreateHiveUsersMutationResponse: {
    __typename: { __type: "String!" },
    hiveUsers: { __type: "[HiveUser!]!" },
    info: { __type: "CreateInfo!" },
  },
  CreateInfo: {
    __typename: { __type: "String!" },
    bookmark: { __type: "String" },
    nodesCreated: { __type: "Int!" },
    relationshipsCreated: { __type: "Int!" },
  },
  CreatePeopleMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "CreateInfo!" },
    people: { __type: "[People!]!" },
  },
  CreatePermissionsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "CreateInfo!" },
    permissions: { __type: "[Permission!]!" },
  },
  CreateProjectResultsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "CreateInfo!" },
    projectResults: { __type: "[ProjectResult!]!" },
  },
  CreateProjectsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "CreateInfo!" },
    projects: { __type: "[Project!]!" },
  },
  CreateRolesMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "CreateInfo!" },
    roles: { __type: "[Role!]!" },
  },
  CreateScheduleItemsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "CreateInfo!" },
    scheduleItems: { __type: "[ScheduleItem!]!" },
  },
  CreateTimelineItemItemsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "CreateInfo!" },
    timelineItemItems: { __type: "[TimelineItemItems!]!" },
  },
  CreateTimelineItemsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "CreateInfo!" },
    timelineItems: { __type: "[TimelineItem!]!" },
  },
  DateTimeAggregateSelection: {
    __typename: { __type: "String!" },
    max: { __type: "DateTime" },
    min: { __type: "DateTime" },
  },
  DeleteInfo: {
    __typename: { __type: "String!" },
    bookmark: { __type: "String" },
    nodesDeleted: { __type: "Int!" },
    relationshipsDeleted: { __type: "Int!" },
  },
  Equipment: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    name: { __type: "String" },
    organisation: {
      __type: "HiveOrganisation",
      __args: {
        options: "HiveOrganisationOptions",
        where: "HiveOrganisationWhere",
      },
    },
    organisationAggregate: {
      __type: "EquipmentHiveOrganisationOrganisationAggregationSelection",
      __args: { where: "HiveOrganisationWhere" },
    },
    organisationConnection: {
      __type: "EquipmentOrganisationConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[EquipmentOrganisationConnectionSort!]",
        where: "EquipmentOrganisationConnectionWhere",
      },
    },
    registration: { __type: "String" },
  },
  EquipmentAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    registration: { __type: "StringAggregateSelection!" },
  },
  EquipmentConnectInput: {
    organisation: { __type: "EquipmentOrganisationConnectFieldInput" },
  },
  EquipmentConnectOrCreateInput: {
    organisation: { __type: "EquipmentOrganisationConnectOrCreateFieldInput" },
  },
  EquipmentConnectOrCreateWhere: { node: { __type: "EquipmentUniqueWhere!" } },
  EquipmentConnectWhere: { node: { __type: "EquipmentWhere!" } },
  EquipmentCreateInput: {
    name: { __type: "String" },
    organisation: { __type: "EquipmentOrganisationFieldInput" },
    registration: { __type: "String" },
  },
  EquipmentDeleteInput: {
    organisation: { __type: "EquipmentOrganisationDeleteFieldInput" },
  },
  EquipmentDisconnectInput: {
    organisation: { __type: "EquipmentOrganisationDisconnectFieldInput" },
  },
  EquipmentHiveOrganisationOrganisationAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "EquipmentHiveOrganisationOrganisationNodeAggregateSelection",
    },
  },
  EquipmentHiveOrganisationOrganisationNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  EquipmentOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[EquipmentSort]" },
  },
  EquipmentOrganisationAggregateInput: {
    AND: { __type: "[EquipmentOrganisationAggregateInput!]" },
    OR: { __type: "[EquipmentOrganisationAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "EquipmentOrganisationNodeAggregationWhereInput" },
  },
  EquipmentOrganisationConnectFieldInput: {
    connect: { __type: "HiveOrganisationConnectInput" },
    where: { __type: "HiveOrganisationConnectWhere" },
  },
  EquipmentOrganisationConnectOrCreateFieldInput: {
    onCreate: {
      __type: "EquipmentOrganisationConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveOrganisationConnectOrCreateWhere!" },
  },
  EquipmentOrganisationConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  EquipmentOrganisationConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[EquipmentOrganisationRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  EquipmentOrganisationConnectionSort: {
    node: { __type: "HiveOrganisationSort" },
  },
  EquipmentOrganisationConnectionWhere: {
    AND: { __type: "[EquipmentOrganisationConnectionWhere!]" },
    OR: { __type: "[EquipmentOrganisationConnectionWhere!]" },
    node: { __type: "HiveOrganisationWhere" },
    node_NOT: { __type: "HiveOrganisationWhere" },
  },
  EquipmentOrganisationCreateFieldInput: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  EquipmentOrganisationDeleteFieldInput: {
    delete: { __type: "HiveOrganisationDeleteInput" },
    where: { __type: "EquipmentOrganisationConnectionWhere" },
  },
  EquipmentOrganisationDisconnectFieldInput: {
    disconnect: { __type: "HiveOrganisationDisconnectInput" },
    where: { __type: "EquipmentOrganisationConnectionWhere" },
  },
  EquipmentOrganisationFieldInput: {
    connect: { __type: "EquipmentOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "EquipmentOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "EquipmentOrganisationCreateFieldInput" },
  },
  EquipmentOrganisationNodeAggregationWhereInput: {
    AND: { __type: "[EquipmentOrganisationNodeAggregationWhereInput!]" },
    OR: { __type: "[EquipmentOrganisationNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  EquipmentOrganisationRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveOrganisation!" },
  },
  EquipmentOrganisationUpdateConnectionInput: {
    node: { __type: "HiveOrganisationUpdateInput" },
  },
  EquipmentOrganisationUpdateFieldInput: {
    connect: { __type: "EquipmentOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "EquipmentOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "EquipmentOrganisationCreateFieldInput" },
    delete: { __type: "EquipmentOrganisationDeleteFieldInput" },
    disconnect: { __type: "EquipmentOrganisationDisconnectFieldInput" },
    update: { __type: "EquipmentOrganisationUpdateConnectionInput" },
    where: { __type: "EquipmentOrganisationConnectionWhere" },
  },
  EquipmentRelationInput: {
    organisation: { __type: "EquipmentOrganisationCreateFieldInput" },
  },
  EquipmentSort: {
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
    registration: { __type: "SortDirection" },
  },
  EquipmentUniqueWhere: { id: { __type: "ID" } },
  EquipmentUpdateInput: {
    name: { __type: "String" },
    organisation: { __type: "EquipmentOrganisationUpdateFieldInput" },
    registration: { __type: "String" },
  },
  EquipmentWhere: {
    AND: { __type: "[EquipmentWhere!]" },
    OR: { __type: "[EquipmentWhere!]" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    organisation: { __type: "HiveOrganisationWhere" },
    organisationAggregate: { __type: "EquipmentOrganisationAggregateInput" },
    organisationConnection: { __type: "EquipmentOrganisationConnectionWhere" },
    organisationConnection_NOT: {
      __type: "EquipmentOrganisationConnectionWhere",
    },
    organisation_NOT: { __type: "HiveOrganisationWhere" },
    registration: { __type: "String" },
    registration_CONTAINS: { __type: "String" },
    registration_ENDS_WITH: { __type: "String" },
    registration_IN: { __type: "[String]" },
    registration_NOT: { __type: "String" },
    registration_NOT_CONTAINS: { __type: "String" },
    registration_NOT_ENDS_WITH: { __type: "String" },
    registration_NOT_IN: { __type: "[String]" },
    registration_NOT_STARTS_WITH: { __type: "String" },
    registration_STARTS_WITH: { __type: "String" },
  },
  Estimate: {
    __typename: { __type: "String!" },
    date: { __type: "DateTime" },
    id: { __type: "ID!" },
    name: { __type: "String" },
    organisation: {
      __type: "HiveOrganisation",
      __args: {
        options: "HiveOrganisationOptions",
        where: "HiveOrganisationWhere",
      },
    },
    organisationAggregate: {
      __type: "EstimateHiveOrganisationOrganisationAggregationSelection",
      __args: { where: "HiveOrganisationWhere" },
    },
    organisationConnection: {
      __type: "EstimateOrganisationConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[EstimateOrganisationConnectionSort!]",
        where: "EstimateOrganisationConnectionWhere",
      },
    },
    price: { __type: "Float" },
    status: { __type: "String" },
  },
  EstimateAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    date: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    price: { __type: "FloatAggregateSelection!" },
    status: { __type: "StringAggregateSelection!" },
  },
  EstimateConnectInput: {
    organisation: { __type: "EstimateOrganisationConnectFieldInput" },
  },
  EstimateConnectOrCreateInput: {
    organisation: { __type: "EstimateOrganisationConnectOrCreateFieldInput" },
  },
  EstimateConnectOrCreateWhere: { node: { __type: "EstimateUniqueWhere!" } },
  EstimateConnectWhere: { node: { __type: "EstimateWhere!" } },
  EstimateCreateInput: {
    date: { __type: "DateTime" },
    name: { __type: "String" },
    organisation: { __type: "EstimateOrganisationFieldInput" },
    price: { __type: "Float" },
    status: { __type: "String" },
  },
  EstimateDeleteInput: {
    organisation: { __type: "EstimateOrganisationDeleteFieldInput" },
  },
  EstimateDisconnectInput: {
    organisation: { __type: "EstimateOrganisationDisconnectFieldInput" },
  },
  EstimateHiveOrganisationOrganisationAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "EstimateHiveOrganisationOrganisationNodeAggregateSelection",
    },
  },
  EstimateHiveOrganisationOrganisationNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  EstimateOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[EstimateSort]" },
  },
  EstimateOrganisationAggregateInput: {
    AND: { __type: "[EstimateOrganisationAggregateInput!]" },
    OR: { __type: "[EstimateOrganisationAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "EstimateOrganisationNodeAggregationWhereInput" },
  },
  EstimateOrganisationConnectFieldInput: {
    connect: { __type: "HiveOrganisationConnectInput" },
    where: { __type: "HiveOrganisationConnectWhere" },
  },
  EstimateOrganisationConnectOrCreateFieldInput: {
    onCreate: {
      __type: "EstimateOrganisationConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveOrganisationConnectOrCreateWhere!" },
  },
  EstimateOrganisationConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  EstimateOrganisationConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[EstimateOrganisationRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  EstimateOrganisationConnectionSort: {
    node: { __type: "HiveOrganisationSort" },
  },
  EstimateOrganisationConnectionWhere: {
    AND: { __type: "[EstimateOrganisationConnectionWhere!]" },
    OR: { __type: "[EstimateOrganisationConnectionWhere!]" },
    node: { __type: "HiveOrganisationWhere" },
    node_NOT: { __type: "HiveOrganisationWhere" },
  },
  EstimateOrganisationCreateFieldInput: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  EstimateOrganisationDeleteFieldInput: {
    delete: { __type: "HiveOrganisationDeleteInput" },
    where: { __type: "EstimateOrganisationConnectionWhere" },
  },
  EstimateOrganisationDisconnectFieldInput: {
    disconnect: { __type: "HiveOrganisationDisconnectInput" },
    where: { __type: "EstimateOrganisationConnectionWhere" },
  },
  EstimateOrganisationFieldInput: {
    connect: { __type: "EstimateOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "EstimateOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "EstimateOrganisationCreateFieldInput" },
  },
  EstimateOrganisationNodeAggregationWhereInput: {
    AND: { __type: "[EstimateOrganisationNodeAggregationWhereInput!]" },
    OR: { __type: "[EstimateOrganisationNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  EstimateOrganisationRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveOrganisation!" },
  },
  EstimateOrganisationUpdateConnectionInput: {
    node: { __type: "HiveOrganisationUpdateInput" },
  },
  EstimateOrganisationUpdateFieldInput: {
    connect: { __type: "EstimateOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "EstimateOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "EstimateOrganisationCreateFieldInput" },
    delete: { __type: "EstimateOrganisationDeleteFieldInput" },
    disconnect: { __type: "EstimateOrganisationDisconnectFieldInput" },
    update: { __type: "EstimateOrganisationUpdateConnectionInput" },
    where: { __type: "EstimateOrganisationConnectionWhere" },
  },
  EstimateRelationInput: {
    organisation: { __type: "EstimateOrganisationCreateFieldInput" },
  },
  EstimateSort: {
    date: { __type: "SortDirection" },
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
    price: { __type: "SortDirection" },
    status: { __type: "SortDirection" },
  },
  EstimateUniqueWhere: { id: { __type: "ID" } },
  EstimateUpdateInput: {
    date: { __type: "DateTime" },
    name: { __type: "String" },
    organisation: { __type: "EstimateOrganisationUpdateFieldInput" },
    price: { __type: "Float" },
    status: { __type: "String" },
  },
  EstimateWhere: {
    AND: { __type: "[EstimateWhere!]" },
    OR: { __type: "[EstimateWhere!]" },
    date: { __type: "DateTime" },
    date_GT: { __type: "DateTime" },
    date_GTE: { __type: "DateTime" },
    date_IN: { __type: "[DateTime]" },
    date_LT: { __type: "DateTime" },
    date_LTE: { __type: "DateTime" },
    date_NOT: { __type: "DateTime" },
    date_NOT_IN: { __type: "[DateTime]" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    organisation: { __type: "HiveOrganisationWhere" },
    organisationAggregate: { __type: "EstimateOrganisationAggregateInput" },
    organisationConnection: { __type: "EstimateOrganisationConnectionWhere" },
    organisationConnection_NOT: {
      __type: "EstimateOrganisationConnectionWhere",
    },
    organisation_NOT: { __type: "HiveOrganisationWhere" },
    price: { __type: "Float" },
    price_GT: { __type: "Float" },
    price_GTE: { __type: "Float" },
    price_IN: { __type: "[Float]" },
    price_LT: { __type: "Float" },
    price_LTE: { __type: "Float" },
    price_NOT: { __type: "Float" },
    price_NOT_IN: { __type: "[Float]" },
    status: { __type: "String" },
    status_CONTAINS: { __type: "String" },
    status_ENDS_WITH: { __type: "String" },
    status_IN: { __type: "[String]" },
    status_NOT: { __type: "String" },
    status_NOT_CONTAINS: { __type: "String" },
    status_NOT_ENDS_WITH: { __type: "String" },
    status_NOT_IN: { __type: "[String]" },
    status_NOT_STARTS_WITH: { __type: "String" },
    status_STARTS_WITH: { __type: "String" },
  },
  FloatAggregateSelection: {
    __typename: { __type: "String!" },
    average: { __type: "Float" },
    max: { __type: "Float" },
    min: { __type: "Float" },
    sum: { __type: "Float" },
  },
  HiveAppliance: {
    __typename: { __type: "String!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    label: { __type: "String" },
    name: { __type: "String!" },
    permissions: {
      __type: "[Permission]",
      __args: { options: "PermissionOptions", where: "PermissionWhere" },
    },
    permissionsAggregate: {
      __type: "HiveAppliancePermissionPermissionsAggregationSelection",
      __args: { where: "PermissionWhere" },
    },
    permissionsConnection: {
      __type: "HiveAppliancePermissionsConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveAppliancePermissionsConnectionSort!]",
        where: "HiveAppliancePermissionsConnectionWhere",
      },
    },
    services: {
      __type: "[HiveService]",
      __args: { options: "HiveServiceOptions", where: "HiveServiceWhere" },
    },
    servicesAggregate: {
      __type: "HiveApplianceHiveServiceServicesAggregationSelection",
      __args: { where: "HiveServiceWhere" },
    },
    servicesConnection: {
      __type: "HiveApplianceServicesConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveApplianceServicesConnectionSort!]",
        where: "HiveApplianceServicesConnectionWhere",
      },
    },
    types: {
      __type: "[HiveType]",
      __args: { options: "HiveTypeOptions", where: "HiveTypeWhere" },
    },
    typesAggregate: {
      __type: "HiveApplianceHiveTypeTypesAggregationSelection",
      __args: { where: "HiveTypeWhere" },
    },
    typesConnection: {
      __type: "HiveApplianceTypesConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveApplianceTypesConnectionSort!]",
        where: "HiveApplianceTypesConnectionWhere",
      },
    },
  },
  HiveApplianceAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    description: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    label: { __type: "StringAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveApplianceConnectInput: {
    permissions: { __type: "[HiveAppliancePermissionsConnectFieldInput!]" },
    services: { __type: "[HiveApplianceServicesConnectFieldInput!]" },
    types: { __type: "[HiveApplianceTypesConnectFieldInput!]" },
  },
  HiveApplianceConnectOrCreateInput: {
    permissions: {
      __type: "[HiveAppliancePermissionsConnectOrCreateFieldInput!]",
    },
    types: { __type: "[HiveApplianceTypesConnectOrCreateFieldInput!]" },
  },
  HiveApplianceConnectOrCreateWhere: {
    node: { __type: "HiveApplianceUniqueWhere!" },
  },
  HiveApplianceConnectWhere: { node: { __type: "HiveApplianceWhere!" } },
  HiveApplianceCreateInput: {
    description: { __type: "String" },
    label: { __type: "String" },
    name: { __type: "String!" },
    permissions: { __type: "HiveAppliancePermissionsFieldInput" },
    services: { __type: "HiveApplianceServicesFieldInput" },
    types: { __type: "HiveApplianceTypesFieldInput" },
  },
  HiveApplianceDeleteInput: {
    permissions: { __type: "[HiveAppliancePermissionsDeleteFieldInput!]" },
    services: { __type: "[HiveApplianceServicesDeleteFieldInput!]" },
    types: { __type: "[HiveApplianceTypesDeleteFieldInput!]" },
  },
  HiveApplianceDisconnectInput: {
    permissions: { __type: "[HiveAppliancePermissionsDisconnectFieldInput!]" },
    services: { __type: "[HiveApplianceServicesDisconnectFieldInput!]" },
    types: { __type: "[HiveApplianceTypesDisconnectFieldInput!]" },
  },
  HiveApplianceHiveServiceServicesAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "HiveApplianceHiveServiceServicesNodeAggregateSelection" },
  },
  HiveApplianceHiveServiceServicesNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveApplianceHiveTypeTypesAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "HiveApplianceHiveTypeTypesNodeAggregateSelection" },
  },
  HiveApplianceHiveTypeTypesNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveApplianceOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[HiveApplianceSort]" },
  },
  HiveAppliancePermissionPermissionsAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "HiveAppliancePermissionPermissionsNodeAggregateSelection",
    },
  },
  HiveAppliancePermissionPermissionsNodeAggregateSelection: {
    __typename: { __type: "String!" },
    action: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    scope: { __type: "StringAggregateSelection!" },
  },
  HiveAppliancePermissionsAggregateInput: {
    AND: { __type: "[HiveAppliancePermissionsAggregateInput!]" },
    OR: { __type: "[HiveAppliancePermissionsAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveAppliancePermissionsNodeAggregationWhereInput" },
  },
  HiveAppliancePermissionsConnectFieldInput: {
    connect: { __type: "[PermissionConnectInput!]" },
    where: { __type: "PermissionConnectWhere" },
  },
  HiveAppliancePermissionsConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveAppliancePermissionsConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "PermissionConnectOrCreateWhere!" },
  },
  HiveAppliancePermissionsConnectOrCreateFieldInputOnCreate: {
    node: { __type: "PermissionCreateInput!" },
  },
  HiveAppliancePermissionsConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveAppliancePermissionsRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveAppliancePermissionsConnectionSort: {
    node: { __type: "PermissionSort" },
  },
  HiveAppliancePermissionsConnectionWhere: {
    AND: { __type: "[HiveAppliancePermissionsConnectionWhere!]" },
    OR: { __type: "[HiveAppliancePermissionsConnectionWhere!]" },
    node: { __type: "PermissionWhere" },
    node_NOT: { __type: "PermissionWhere" },
  },
  HiveAppliancePermissionsCreateFieldInput: {
    node: { __type: "PermissionCreateInput!" },
  },
  HiveAppliancePermissionsDeleteFieldInput: {
    delete: { __type: "PermissionDeleteInput" },
    where: { __type: "HiveAppliancePermissionsConnectionWhere" },
  },
  HiveAppliancePermissionsDisconnectFieldInput: {
    disconnect: { __type: "PermissionDisconnectInput" },
    where: { __type: "HiveAppliancePermissionsConnectionWhere" },
  },
  HiveAppliancePermissionsFieldInput: {
    connect: { __type: "[HiveAppliancePermissionsConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveAppliancePermissionsConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveAppliancePermissionsCreateFieldInput!]" },
  },
  HiveAppliancePermissionsNodeAggregationWhereInput: {
    AND: { __type: "[HiveAppliancePermissionsNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveAppliancePermissionsNodeAggregationWhereInput!]" },
    action_AVERAGE_EQUAL: { __type: "Float" },
    action_AVERAGE_GT: { __type: "Float" },
    action_AVERAGE_GTE: { __type: "Float" },
    action_AVERAGE_LT: { __type: "Float" },
    action_AVERAGE_LTE: { __type: "Float" },
    action_EQUAL: { __type: "String" },
    action_GT: { __type: "Int" },
    action_GTE: { __type: "Int" },
    action_LONGEST_EQUAL: { __type: "Int" },
    action_LONGEST_GT: { __type: "Int" },
    action_LONGEST_GTE: { __type: "Int" },
    action_LONGEST_LT: { __type: "Int" },
    action_LONGEST_LTE: { __type: "Int" },
    action_LT: { __type: "Int" },
    action_LTE: { __type: "Int" },
    action_SHORTEST_EQUAL: { __type: "Int" },
    action_SHORTEST_GT: { __type: "Int" },
    action_SHORTEST_GTE: { __type: "Int" },
    action_SHORTEST_LT: { __type: "Int" },
    action_SHORTEST_LTE: { __type: "Int" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    scope_AVERAGE_EQUAL: { __type: "Float" },
    scope_AVERAGE_GT: { __type: "Float" },
    scope_AVERAGE_GTE: { __type: "Float" },
    scope_AVERAGE_LT: { __type: "Float" },
    scope_AVERAGE_LTE: { __type: "Float" },
    scope_EQUAL: { __type: "String" },
    scope_GT: { __type: "Int" },
    scope_GTE: { __type: "Int" },
    scope_LONGEST_EQUAL: { __type: "Int" },
    scope_LONGEST_GT: { __type: "Int" },
    scope_LONGEST_GTE: { __type: "Int" },
    scope_LONGEST_LT: { __type: "Int" },
    scope_LONGEST_LTE: { __type: "Int" },
    scope_LT: { __type: "Int" },
    scope_LTE: { __type: "Int" },
    scope_SHORTEST_EQUAL: { __type: "Int" },
    scope_SHORTEST_GT: { __type: "Int" },
    scope_SHORTEST_GTE: { __type: "Int" },
    scope_SHORTEST_LT: { __type: "Int" },
    scope_SHORTEST_LTE: { __type: "Int" },
  },
  HiveAppliancePermissionsRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "Permission!" },
  },
  HiveAppliancePermissionsUpdateConnectionInput: {
    node: { __type: "PermissionUpdateInput" },
  },
  HiveAppliancePermissionsUpdateFieldInput: {
    connect: { __type: "[HiveAppliancePermissionsConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveAppliancePermissionsConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveAppliancePermissionsCreateFieldInput!]" },
    delete: { __type: "[HiveAppliancePermissionsDeleteFieldInput!]" },
    disconnect: { __type: "[HiveAppliancePermissionsDisconnectFieldInput!]" },
    update: { __type: "HiveAppliancePermissionsUpdateConnectionInput" },
    where: { __type: "HiveAppliancePermissionsConnectionWhere" },
  },
  HiveApplianceRelationInput: {
    permissions: { __type: "[HiveAppliancePermissionsCreateFieldInput!]" },
    services: { __type: "[HiveApplianceServicesCreateFieldInput!]" },
    types: { __type: "[HiveApplianceTypesCreateFieldInput!]" },
  },
  HiveApplianceServicesAggregateInput: {
    AND: { __type: "[HiveApplianceServicesAggregateInput!]" },
    OR: { __type: "[HiveApplianceServicesAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveApplianceServicesNodeAggregationWhereInput" },
  },
  HiveApplianceServicesConnectFieldInput: {
    where: { __type: "HiveServiceConnectWhere" },
  },
  HiveApplianceServicesConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveApplianceServicesRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveApplianceServicesConnectionSort: { node: { __type: "HiveServiceSort" } },
  HiveApplianceServicesConnectionWhere: {
    AND: { __type: "[HiveApplianceServicesConnectionWhere!]" },
    OR: { __type: "[HiveApplianceServicesConnectionWhere!]" },
    node: { __type: "HiveServiceWhere" },
    node_NOT: { __type: "HiveServiceWhere" },
  },
  HiveApplianceServicesCreateFieldInput: {
    node: { __type: "HiveServiceCreateInput!" },
  },
  HiveApplianceServicesDeleteFieldInput: {
    where: { __type: "HiveApplianceServicesConnectionWhere" },
  },
  HiveApplianceServicesDisconnectFieldInput: {
    where: { __type: "HiveApplianceServicesConnectionWhere" },
  },
  HiveApplianceServicesFieldInput: {
    connect: { __type: "[HiveApplianceServicesConnectFieldInput!]" },
    create: { __type: "[HiveApplianceServicesCreateFieldInput!]" },
  },
  HiveApplianceServicesNodeAggregationWhereInput: {
    AND: { __type: "[HiveApplianceServicesNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveApplianceServicesNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveApplianceServicesRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveService!" },
  },
  HiveApplianceServicesUpdateConnectionInput: {
    node: { __type: "HiveServiceUpdateInput" },
  },
  HiveApplianceServicesUpdateFieldInput: {
    connect: { __type: "[HiveApplianceServicesConnectFieldInput!]" },
    create: { __type: "[HiveApplianceServicesCreateFieldInput!]" },
    delete: { __type: "[HiveApplianceServicesDeleteFieldInput!]" },
    disconnect: { __type: "[HiveApplianceServicesDisconnectFieldInput!]" },
    update: { __type: "HiveApplianceServicesUpdateConnectionInput" },
    where: { __type: "HiveApplianceServicesConnectionWhere" },
  },
  HiveApplianceSort: {
    description: { __type: "SortDirection" },
    id: { __type: "SortDirection" },
    label: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
  },
  HiveApplianceTypesAggregateInput: {
    AND: { __type: "[HiveApplianceTypesAggregateInput!]" },
    OR: { __type: "[HiveApplianceTypesAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveApplianceTypesNodeAggregationWhereInput" },
  },
  HiveApplianceTypesConnectFieldInput: {
    connect: { __type: "[HiveTypeConnectInput!]" },
    where: { __type: "HiveTypeConnectWhere" },
  },
  HiveApplianceTypesConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveApplianceTypesConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveTypeConnectOrCreateWhere!" },
  },
  HiveApplianceTypesConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveTypeCreateInput!" },
  },
  HiveApplianceTypesConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveApplianceTypesRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveApplianceTypesConnectionSort: { node: { __type: "HiveTypeSort" } },
  HiveApplianceTypesConnectionWhere: {
    AND: { __type: "[HiveApplianceTypesConnectionWhere!]" },
    OR: { __type: "[HiveApplianceTypesConnectionWhere!]" },
    node: { __type: "HiveTypeWhere" },
    node_NOT: { __type: "HiveTypeWhere" },
  },
  HiveApplianceTypesCreateFieldInput: {
    node: { __type: "HiveTypeCreateInput!" },
  },
  HiveApplianceTypesDeleteFieldInput: {
    delete: { __type: "HiveTypeDeleteInput" },
    where: { __type: "HiveApplianceTypesConnectionWhere" },
  },
  HiveApplianceTypesDisconnectFieldInput: {
    disconnect: { __type: "HiveTypeDisconnectInput" },
    where: { __type: "HiveApplianceTypesConnectionWhere" },
  },
  HiveApplianceTypesFieldInput: {
    connect: { __type: "[HiveApplianceTypesConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveApplianceTypesConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveApplianceTypesCreateFieldInput!]" },
  },
  HiveApplianceTypesNodeAggregationWhereInput: {
    AND: { __type: "[HiveApplianceTypesNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveApplianceTypesNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveApplianceTypesRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveType!" },
  },
  HiveApplianceTypesUpdateConnectionInput: {
    node: { __type: "HiveTypeUpdateInput" },
  },
  HiveApplianceTypesUpdateFieldInput: {
    connect: { __type: "[HiveApplianceTypesConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveApplianceTypesConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveApplianceTypesCreateFieldInput!]" },
    delete: { __type: "[HiveApplianceTypesDeleteFieldInput!]" },
    disconnect: { __type: "[HiveApplianceTypesDisconnectFieldInput!]" },
    update: { __type: "HiveApplianceTypesUpdateConnectionInput" },
    where: { __type: "HiveApplianceTypesConnectionWhere" },
  },
  HiveApplianceUniqueWhere: { id: { __type: "ID" } },
  HiveApplianceUpdateInput: {
    description: { __type: "String" },
    label: { __type: "String" },
    name: { __type: "String" },
    permissions: { __type: "[HiveAppliancePermissionsUpdateFieldInput!]" },
    services: { __type: "[HiveApplianceServicesUpdateFieldInput!]" },
    types: { __type: "[HiveApplianceTypesUpdateFieldInput!]" },
  },
  HiveApplianceWhere: {
    AND: { __type: "[HiveApplianceWhere!]" },
    OR: { __type: "[HiveApplianceWhere!]" },
    description: { __type: "String" },
    description_CONTAINS: { __type: "String" },
    description_ENDS_WITH: { __type: "String" },
    description_IN: { __type: "[String]" },
    description_NOT: { __type: "String" },
    description_NOT_CONTAINS: { __type: "String" },
    description_NOT_ENDS_WITH: { __type: "String" },
    description_NOT_IN: { __type: "[String]" },
    description_NOT_STARTS_WITH: { __type: "String" },
    description_STARTS_WITH: { __type: "String" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    label: { __type: "String" },
    label_CONTAINS: { __type: "String" },
    label_ENDS_WITH: { __type: "String" },
    label_IN: { __type: "[String]" },
    label_NOT: { __type: "String" },
    label_NOT_CONTAINS: { __type: "String" },
    label_NOT_ENDS_WITH: { __type: "String" },
    label_NOT_IN: { __type: "[String]" },
    label_NOT_STARTS_WITH: { __type: "String" },
    label_STARTS_WITH: { __type: "String" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    permissions: { __type: "PermissionWhere" },
    permissionsAggregate: { __type: "HiveAppliancePermissionsAggregateInput" },
    permissionsConnection: {
      __type: "HiveAppliancePermissionsConnectionWhere",
    },
    permissionsConnection_NOT: {
      __type: "HiveAppliancePermissionsConnectionWhere",
    },
    permissions_NOT: { __type: "PermissionWhere" },
    services: { __type: "HiveServiceWhere" },
    servicesAggregate: { __type: "HiveApplianceServicesAggregateInput" },
    servicesConnection: { __type: "HiveApplianceServicesConnectionWhere" },
    servicesConnection_NOT: { __type: "HiveApplianceServicesConnectionWhere" },
    services_NOT: { __type: "HiveServiceWhere" },
    types: { __type: "HiveTypeWhere" },
    typesAggregate: { __type: "HiveApplianceTypesAggregateInput" },
    typesConnection: { __type: "HiveApplianceTypesConnectionWhere" },
    typesConnection_NOT: { __type: "HiveApplianceTypesConnectionWhere" },
    types_NOT: { __type: "HiveTypeWhere" },
  },
  HiveIntegration: {
    __typename: { __type: "String!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    name: { __type: "String" },
  },
  HiveIntegrationAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    description: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveIntegrationConnectOrCreateWhere: {
    node: { __type: "HiveIntegrationUniqueWhere!" },
  },
  HiveIntegrationConnectWhere: { node: { __type: "HiveIntegrationWhere!" } },
  HiveIntegrationCreateInput: {
    description: { __type: "String" },
    name: { __type: "String" },
  },
  HiveIntegrationInstance: {
    __typename: { __type: "String!" },
    appliances: {
      __type: "[HiveAppliance]",
      __args: { options: "HiveApplianceOptions", where: "HiveApplianceWhere" },
    },
    appliancesAggregate: {
      __type:
        "HiveIntegrationInstanceHiveApplianceAppliancesAggregationSelection",
      __args: { where: "HiveApplianceWhere" },
    },
    appliancesConnection: {
      __type: "HiveIntegrationInstanceAppliancesConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveIntegrationInstanceAppliancesConnectionSort!]",
        where: "HiveIntegrationInstanceAppliancesConnectionWhere",
      },
    },
    config: { __type: "String" },
    connections: {
      __type: "[HiveIntegrationPath]",
      __args: {
        options: "HiveIntegrationPathOptions",
        where: "HiveIntegrationPathWhere",
      },
    },
    connectionsAggregate: {
      __type:
        "HiveIntegrationInstanceHiveIntegrationPathConnectionsAggregationSelection",
      __args: { where: "HiveIntegrationPathWhere" },
    },
    connectionsConnection: {
      __type: "HiveIntegrationInstanceConnectionsConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveIntegrationInstanceConnectionsConnectionSort!]",
        where: "HiveIntegrationInstanceConnectionsConnectionWhere",
      },
    },
    id: { __type: "ID!" },
    integration: {
      __type: "HiveIntegration",
      __args: {
        options: "HiveIntegrationOptions",
        where: "HiveIntegrationWhere",
      },
    },
    integrationAggregate: {
      __type:
        "HiveIntegrationInstanceHiveIntegrationIntegrationAggregationSelection",
      __args: { where: "HiveIntegrationWhere" },
    },
    integrationConnection: {
      __type: "HiveIntegrationInstanceIntegrationConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveIntegrationInstanceIntegrationConnectionSort!]",
        where: "HiveIntegrationInstanceIntegrationConnectionWhere",
      },
    },
    isRunning: { __type: "Boolean" },
    name: { __type: "String" },
    organisation: {
      __type: "HiveOrganisation",
      __args: {
        options: "HiveOrganisationOptions",
        where: "HiveOrganisationWhere",
      },
    },
    organisationAggregate: {
      __type:
        "HiveIntegrationInstanceHiveOrganisationOrganisationAggregationSelection",
      __args: { where: "HiveOrganisationWhere" },
    },
    organisationConnection: {
      __type: "HiveIntegrationInstanceOrganisationConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveIntegrationInstanceOrganisationConnectionSort!]",
        where: "HiveIntegrationInstanceOrganisationConnectionWhere",
      },
    },
  },
  HiveIntegrationInstanceAggregateSelection: {
    __typename: { __type: "String!" },
    config: { __type: "StringAggregateSelection!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveIntegrationInstanceAppliancesAggregateInput: {
    AND: { __type: "[HiveIntegrationInstanceAppliancesAggregateInput!]" },
    OR: { __type: "[HiveIntegrationInstanceAppliancesAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: {
      __type: "HiveIntegrationInstanceAppliancesNodeAggregationWhereInput",
    },
  },
  HiveIntegrationInstanceAppliancesConnectFieldInput: {
    connect: { __type: "[HiveApplianceConnectInput!]" },
    where: { __type: "HiveApplianceConnectWhere" },
  },
  HiveIntegrationInstanceAppliancesConnectOrCreateFieldInput: {
    onCreate: {
      __type:
        "HiveIntegrationInstanceAppliancesConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveApplianceConnectOrCreateWhere!" },
  },
  HiveIntegrationInstanceAppliancesConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveApplianceCreateInput!" },
  },
  HiveIntegrationInstanceAppliancesConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveIntegrationInstanceAppliancesRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveIntegrationInstanceAppliancesConnectionSort: {
    node: { __type: "HiveApplianceSort" },
  },
  HiveIntegrationInstanceAppliancesConnectionWhere: {
    AND: { __type: "[HiveIntegrationInstanceAppliancesConnectionWhere!]" },
    OR: { __type: "[HiveIntegrationInstanceAppliancesConnectionWhere!]" },
    node: { __type: "HiveApplianceWhere" },
    node_NOT: { __type: "HiveApplianceWhere" },
  },
  HiveIntegrationInstanceAppliancesCreateFieldInput: {
    node: { __type: "HiveApplianceCreateInput!" },
  },
  HiveIntegrationInstanceAppliancesDeleteFieldInput: {
    delete: { __type: "HiveApplianceDeleteInput" },
    where: { __type: "HiveIntegrationInstanceAppliancesConnectionWhere" },
  },
  HiveIntegrationInstanceAppliancesDisconnectFieldInput: {
    disconnect: { __type: "HiveApplianceDisconnectInput" },
    where: { __type: "HiveIntegrationInstanceAppliancesConnectionWhere" },
  },
  HiveIntegrationInstanceAppliancesFieldInput: {
    connect: {
      __type: "[HiveIntegrationInstanceAppliancesConnectFieldInput!]",
    },
    connectOrCreate: {
      __type: "[HiveIntegrationInstanceAppliancesConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveIntegrationInstanceAppliancesCreateFieldInput!]" },
  },
  HiveIntegrationInstanceAppliancesNodeAggregationWhereInput: {
    AND: {
      __type: "[HiveIntegrationInstanceAppliancesNodeAggregationWhereInput!]",
    },
    OR: {
      __type: "[HiveIntegrationInstanceAppliancesNodeAggregationWhereInput!]",
    },
    description_AVERAGE_EQUAL: { __type: "Float" },
    description_AVERAGE_GT: { __type: "Float" },
    description_AVERAGE_GTE: { __type: "Float" },
    description_AVERAGE_LT: { __type: "Float" },
    description_AVERAGE_LTE: { __type: "Float" },
    description_EQUAL: { __type: "String" },
    description_GT: { __type: "Int" },
    description_GTE: { __type: "Int" },
    description_LONGEST_EQUAL: { __type: "Int" },
    description_LONGEST_GT: { __type: "Int" },
    description_LONGEST_GTE: { __type: "Int" },
    description_LONGEST_LT: { __type: "Int" },
    description_LONGEST_LTE: { __type: "Int" },
    description_LT: { __type: "Int" },
    description_LTE: { __type: "Int" },
    description_SHORTEST_EQUAL: { __type: "Int" },
    description_SHORTEST_GT: { __type: "Int" },
    description_SHORTEST_GTE: { __type: "Int" },
    description_SHORTEST_LT: { __type: "Int" },
    description_SHORTEST_LTE: { __type: "Int" },
    id_EQUAL: { __type: "ID" },
    label_AVERAGE_EQUAL: { __type: "Float" },
    label_AVERAGE_GT: { __type: "Float" },
    label_AVERAGE_GTE: { __type: "Float" },
    label_AVERAGE_LT: { __type: "Float" },
    label_AVERAGE_LTE: { __type: "Float" },
    label_EQUAL: { __type: "String" },
    label_GT: { __type: "Int" },
    label_GTE: { __type: "Int" },
    label_LONGEST_EQUAL: { __type: "Int" },
    label_LONGEST_GT: { __type: "Int" },
    label_LONGEST_GTE: { __type: "Int" },
    label_LONGEST_LT: { __type: "Int" },
    label_LONGEST_LTE: { __type: "Int" },
    label_LT: { __type: "Int" },
    label_LTE: { __type: "Int" },
    label_SHORTEST_EQUAL: { __type: "Int" },
    label_SHORTEST_GT: { __type: "Int" },
    label_SHORTEST_GTE: { __type: "Int" },
    label_SHORTEST_LT: { __type: "Int" },
    label_SHORTEST_LTE: { __type: "Int" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveIntegrationInstanceAppliancesRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveAppliance!" },
  },
  HiveIntegrationInstanceAppliancesUpdateConnectionInput: {
    node: { __type: "HiveApplianceUpdateInput" },
  },
  HiveIntegrationInstanceAppliancesUpdateFieldInput: {
    connect: {
      __type: "[HiveIntegrationInstanceAppliancesConnectFieldInput!]",
    },
    connectOrCreate: {
      __type: "[HiveIntegrationInstanceAppliancesConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveIntegrationInstanceAppliancesCreateFieldInput!]" },
    delete: { __type: "[HiveIntegrationInstanceAppliancesDeleteFieldInput!]" },
    disconnect: {
      __type: "[HiveIntegrationInstanceAppliancesDisconnectFieldInput!]",
    },
    update: {
      __type: "HiveIntegrationInstanceAppliancesUpdateConnectionInput",
    },
    where: { __type: "HiveIntegrationInstanceAppliancesConnectionWhere" },
  },
  HiveIntegrationInstanceConnectInput: {
    appliances: {
      __type: "[HiveIntegrationInstanceAppliancesConnectFieldInput!]",
    },
    connections: {
      __type: "[HiveIntegrationInstanceConnectionsConnectFieldInput!]",
    },
    integration: {
      __type: "HiveIntegrationInstanceIntegrationConnectFieldInput",
    },
    organisation: {
      __type: "HiveIntegrationInstanceOrganisationConnectFieldInput",
    },
  },
  HiveIntegrationInstanceConnectOrCreateInput: {
    appliances: {
      __type: "[HiveIntegrationInstanceAppliancesConnectOrCreateFieldInput!]",
    },
    connections: {
      __type: "[HiveIntegrationInstanceConnectionsConnectOrCreateFieldInput!]",
    },
    integration: {
      __type: "HiveIntegrationInstanceIntegrationConnectOrCreateFieldInput",
    },
    organisation: {
      __type: "HiveIntegrationInstanceOrganisationConnectOrCreateFieldInput",
    },
  },
  HiveIntegrationInstanceConnectOrCreateWhere: {
    node: { __type: "HiveIntegrationInstanceUniqueWhere!" },
  },
  HiveIntegrationInstanceConnectWhere: {
    node: { __type: "HiveIntegrationInstanceWhere!" },
  },
  HiveIntegrationInstanceConnectionsAggregateInput: {
    AND: { __type: "[HiveIntegrationInstanceConnectionsAggregateInput!]" },
    OR: { __type: "[HiveIntegrationInstanceConnectionsAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: {
      __type: "HiveIntegrationInstanceConnectionsNodeAggregationWhereInput",
    },
  },
  HiveIntegrationInstanceConnectionsConnectFieldInput: {
    connect: { __type: "[HiveIntegrationPathConnectInput!]" },
    where: { __type: "HiveIntegrationPathConnectWhere" },
  },
  HiveIntegrationInstanceConnectionsConnectOrCreateFieldInput: {
    onCreate: {
      __type:
        "HiveIntegrationInstanceConnectionsConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveIntegrationPathConnectOrCreateWhere!" },
  },
  HiveIntegrationInstanceConnectionsConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveIntegrationPathCreateInput!" },
  },
  HiveIntegrationInstanceConnectionsConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveIntegrationInstanceConnectionsRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveIntegrationInstanceConnectionsConnectionSort: {
    node: { __type: "HiveIntegrationPathSort" },
  },
  HiveIntegrationInstanceConnectionsConnectionWhere: {
    AND: { __type: "[HiveIntegrationInstanceConnectionsConnectionWhere!]" },
    OR: { __type: "[HiveIntegrationInstanceConnectionsConnectionWhere!]" },
    node: { __type: "HiveIntegrationPathWhere" },
    node_NOT: { __type: "HiveIntegrationPathWhere" },
  },
  HiveIntegrationInstanceConnectionsCreateFieldInput: {
    node: { __type: "HiveIntegrationPathCreateInput!" },
  },
  HiveIntegrationInstanceConnectionsDeleteFieldInput: {
    delete: { __type: "HiveIntegrationPathDeleteInput" },
    where: { __type: "HiveIntegrationInstanceConnectionsConnectionWhere" },
  },
  HiveIntegrationInstanceConnectionsDisconnectFieldInput: {
    disconnect: { __type: "HiveIntegrationPathDisconnectInput" },
    where: { __type: "HiveIntegrationInstanceConnectionsConnectionWhere" },
  },
  HiveIntegrationInstanceConnectionsFieldInput: {
    connect: {
      __type: "[HiveIntegrationInstanceConnectionsConnectFieldInput!]",
    },
    connectOrCreate: {
      __type: "[HiveIntegrationInstanceConnectionsConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveIntegrationInstanceConnectionsCreateFieldInput!]" },
  },
  HiveIntegrationInstanceConnectionsNodeAggregationWhereInput: {
    AND: {
      __type: "[HiveIntegrationInstanceConnectionsNodeAggregationWhereInput!]",
    },
    OR: {
      __type: "[HiveIntegrationInstanceConnectionsNodeAggregationWhereInput!]",
    },
    connectionBlob_AVERAGE_EQUAL: { __type: "Float" },
    connectionBlob_AVERAGE_GT: { __type: "Float" },
    connectionBlob_AVERAGE_GTE: { __type: "Float" },
    connectionBlob_AVERAGE_LT: { __type: "Float" },
    connectionBlob_AVERAGE_LTE: { __type: "Float" },
    connectionBlob_EQUAL: { __type: "String" },
    connectionBlob_GT: { __type: "Int" },
    connectionBlob_GTE: { __type: "Int" },
    connectionBlob_LONGEST_EQUAL: { __type: "Int" },
    connectionBlob_LONGEST_GT: { __type: "Int" },
    connectionBlob_LONGEST_GTE: { __type: "Int" },
    connectionBlob_LONGEST_LT: { __type: "Int" },
    connectionBlob_LONGEST_LTE: { __type: "Int" },
    connectionBlob_LT: { __type: "Int" },
    connectionBlob_LTE: { __type: "Int" },
    connectionBlob_SHORTEST_EQUAL: { __type: "Int" },
    connectionBlob_SHORTEST_GT: { __type: "Int" },
    connectionBlob_SHORTEST_GTE: { __type: "Int" },
    connectionBlob_SHORTEST_LT: { __type: "Int" },
    connectionBlob_SHORTEST_LTE: { __type: "Int" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    type_AVERAGE_EQUAL: { __type: "Float" },
    type_AVERAGE_GT: { __type: "Float" },
    type_AVERAGE_GTE: { __type: "Float" },
    type_AVERAGE_LT: { __type: "Float" },
    type_AVERAGE_LTE: { __type: "Float" },
    type_EQUAL: { __type: "String" },
    type_GT: { __type: "Int" },
    type_GTE: { __type: "Int" },
    type_LONGEST_EQUAL: { __type: "Int" },
    type_LONGEST_GT: { __type: "Int" },
    type_LONGEST_GTE: { __type: "Int" },
    type_LONGEST_LT: { __type: "Int" },
    type_LONGEST_LTE: { __type: "Int" },
    type_LT: { __type: "Int" },
    type_LTE: { __type: "Int" },
    type_SHORTEST_EQUAL: { __type: "Int" },
    type_SHORTEST_GT: { __type: "Int" },
    type_SHORTEST_GTE: { __type: "Int" },
    type_SHORTEST_LT: { __type: "Int" },
    type_SHORTEST_LTE: { __type: "Int" },
  },
  HiveIntegrationInstanceConnectionsRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveIntegrationPath!" },
  },
  HiveIntegrationInstanceConnectionsUpdateConnectionInput: {
    node: { __type: "HiveIntegrationPathUpdateInput" },
  },
  HiveIntegrationInstanceConnectionsUpdateFieldInput: {
    connect: {
      __type: "[HiveIntegrationInstanceConnectionsConnectFieldInput!]",
    },
    connectOrCreate: {
      __type: "[HiveIntegrationInstanceConnectionsConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveIntegrationInstanceConnectionsCreateFieldInput!]" },
    delete: { __type: "[HiveIntegrationInstanceConnectionsDeleteFieldInput!]" },
    disconnect: {
      __type: "[HiveIntegrationInstanceConnectionsDisconnectFieldInput!]",
    },
    update: {
      __type: "HiveIntegrationInstanceConnectionsUpdateConnectionInput",
    },
    where: { __type: "HiveIntegrationInstanceConnectionsConnectionWhere" },
  },
  HiveIntegrationInstanceCreateInput: {
    appliances: { __type: "HiveIntegrationInstanceAppliancesFieldInput" },
    config: { __type: "String" },
    connections: { __type: "HiveIntegrationInstanceConnectionsFieldInput" },
    integration: { __type: "HiveIntegrationInstanceIntegrationFieldInput" },
    isRunning: { __type: "Boolean" },
    name: { __type: "String" },
    organisation: { __type: "HiveIntegrationInstanceOrganisationFieldInput" },
  },
  HiveIntegrationInstanceDeleteInput: {
    appliances: {
      __type: "[HiveIntegrationInstanceAppliancesDeleteFieldInput!]",
    },
    connections: {
      __type: "[HiveIntegrationInstanceConnectionsDeleteFieldInput!]",
    },
    integration: {
      __type: "HiveIntegrationInstanceIntegrationDeleteFieldInput",
    },
    organisation: {
      __type: "HiveIntegrationInstanceOrganisationDeleteFieldInput",
    },
  },
  HiveIntegrationInstanceDisconnectInput: {
    appliances: {
      __type: "[HiveIntegrationInstanceAppliancesDisconnectFieldInput!]",
    },
    connections: {
      __type: "[HiveIntegrationInstanceConnectionsDisconnectFieldInput!]",
    },
    integration: {
      __type: "HiveIntegrationInstanceIntegrationDisconnectFieldInput",
    },
    organisation: {
      __type: "HiveIntegrationInstanceOrganisationDisconnectFieldInput",
    },
  },
  HiveIntegrationInstanceHiveApplianceAppliancesAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type:
        "HiveIntegrationInstanceHiveApplianceAppliancesNodeAggregateSelection",
    },
  },
  HiveIntegrationInstanceHiveApplianceAppliancesNodeAggregateSelection: {
    __typename: { __type: "String!" },
    description: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    label: { __type: "StringAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveIntegrationInstanceHiveIntegrationIntegrationAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type:
        "HiveIntegrationInstanceHiveIntegrationIntegrationNodeAggregateSelection",
    },
  },
  HiveIntegrationInstanceHiveIntegrationIntegrationNodeAggregateSelection: {
    __typename: { __type: "String!" },
    description: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveIntegrationInstanceHiveIntegrationPathConnectionsAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type:
        "HiveIntegrationInstanceHiveIntegrationPathConnectionsNodeAggregateSelection",
    },
  },
  HiveIntegrationInstanceHiveIntegrationPathConnectionsNodeAggregateSelection: {
    __typename: { __type: "String!" },
    connectionBlob: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    type: { __type: "StringAggregateSelection!" },
  },
  HiveIntegrationInstanceHiveOrganisationOrganisationAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type:
        "HiveIntegrationInstanceHiveOrganisationOrganisationNodeAggregateSelection",
    },
  },
  HiveIntegrationInstanceHiveOrganisationOrganisationNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveIntegrationInstanceIntegrationAggregateInput: {
    AND: { __type: "[HiveIntegrationInstanceIntegrationAggregateInput!]" },
    OR: { __type: "[HiveIntegrationInstanceIntegrationAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: {
      __type: "HiveIntegrationInstanceIntegrationNodeAggregationWhereInput",
    },
  },
  HiveIntegrationInstanceIntegrationConnectFieldInput: {
    where: { __type: "HiveIntegrationConnectWhere" },
  },
  HiveIntegrationInstanceIntegrationConnectOrCreateFieldInput: {
    onCreate: {
      __type:
        "HiveIntegrationInstanceIntegrationConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveIntegrationConnectOrCreateWhere!" },
  },
  HiveIntegrationInstanceIntegrationConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveIntegrationCreateInput!" },
  },
  HiveIntegrationInstanceIntegrationConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveIntegrationInstanceIntegrationRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveIntegrationInstanceIntegrationConnectionSort: {
    node: { __type: "HiveIntegrationSort" },
  },
  HiveIntegrationInstanceIntegrationConnectionWhere: {
    AND: { __type: "[HiveIntegrationInstanceIntegrationConnectionWhere!]" },
    OR: { __type: "[HiveIntegrationInstanceIntegrationConnectionWhere!]" },
    node: { __type: "HiveIntegrationWhere" },
    node_NOT: { __type: "HiveIntegrationWhere" },
  },
  HiveIntegrationInstanceIntegrationCreateFieldInput: {
    node: { __type: "HiveIntegrationCreateInput!" },
  },
  HiveIntegrationInstanceIntegrationDeleteFieldInput: {
    where: { __type: "HiveIntegrationInstanceIntegrationConnectionWhere" },
  },
  HiveIntegrationInstanceIntegrationDisconnectFieldInput: {
    where: { __type: "HiveIntegrationInstanceIntegrationConnectionWhere" },
  },
  HiveIntegrationInstanceIntegrationFieldInput: {
    connect: { __type: "HiveIntegrationInstanceIntegrationConnectFieldInput" },
    connectOrCreate: {
      __type: "HiveIntegrationInstanceIntegrationConnectOrCreateFieldInput",
    },
    create: { __type: "HiveIntegrationInstanceIntegrationCreateFieldInput" },
  },
  HiveIntegrationInstanceIntegrationNodeAggregationWhereInput: {
    AND: {
      __type: "[HiveIntegrationInstanceIntegrationNodeAggregationWhereInput!]",
    },
    OR: {
      __type: "[HiveIntegrationInstanceIntegrationNodeAggregationWhereInput!]",
    },
    description_AVERAGE_EQUAL: { __type: "Float" },
    description_AVERAGE_GT: { __type: "Float" },
    description_AVERAGE_GTE: { __type: "Float" },
    description_AVERAGE_LT: { __type: "Float" },
    description_AVERAGE_LTE: { __type: "Float" },
    description_EQUAL: { __type: "String" },
    description_GT: { __type: "Int" },
    description_GTE: { __type: "Int" },
    description_LONGEST_EQUAL: { __type: "Int" },
    description_LONGEST_GT: { __type: "Int" },
    description_LONGEST_GTE: { __type: "Int" },
    description_LONGEST_LT: { __type: "Int" },
    description_LONGEST_LTE: { __type: "Int" },
    description_LT: { __type: "Int" },
    description_LTE: { __type: "Int" },
    description_SHORTEST_EQUAL: { __type: "Int" },
    description_SHORTEST_GT: { __type: "Int" },
    description_SHORTEST_GTE: { __type: "Int" },
    description_SHORTEST_LT: { __type: "Int" },
    description_SHORTEST_LTE: { __type: "Int" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveIntegrationInstanceIntegrationRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveIntegration!" },
  },
  HiveIntegrationInstanceIntegrationUpdateConnectionInput: {
    node: { __type: "HiveIntegrationUpdateInput" },
  },
  HiveIntegrationInstanceIntegrationUpdateFieldInput: {
    connect: { __type: "HiveIntegrationInstanceIntegrationConnectFieldInput" },
    connectOrCreate: {
      __type: "HiveIntegrationInstanceIntegrationConnectOrCreateFieldInput",
    },
    create: { __type: "HiveIntegrationInstanceIntegrationCreateFieldInput" },
    delete: { __type: "HiveIntegrationInstanceIntegrationDeleteFieldInput" },
    disconnect: {
      __type: "HiveIntegrationInstanceIntegrationDisconnectFieldInput",
    },
    update: {
      __type: "HiveIntegrationInstanceIntegrationUpdateConnectionInput",
    },
    where: { __type: "HiveIntegrationInstanceIntegrationConnectionWhere" },
  },
  HiveIntegrationInstanceOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[HiveIntegrationInstanceSort]" },
  },
  HiveIntegrationInstanceOrganisationAggregateInput: {
    AND: { __type: "[HiveIntegrationInstanceOrganisationAggregateInput!]" },
    OR: { __type: "[HiveIntegrationInstanceOrganisationAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: {
      __type: "HiveIntegrationInstanceOrganisationNodeAggregationWhereInput",
    },
  },
  HiveIntegrationInstanceOrganisationConnectFieldInput: {
    connect: { __type: "HiveOrganisationConnectInput" },
    where: { __type: "HiveOrganisationConnectWhere" },
  },
  HiveIntegrationInstanceOrganisationConnectOrCreateFieldInput: {
    onCreate: {
      __type:
        "HiveIntegrationInstanceOrganisationConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveOrganisationConnectOrCreateWhere!" },
  },
  HiveIntegrationInstanceOrganisationConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  HiveIntegrationInstanceOrganisationConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveIntegrationInstanceOrganisationRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveIntegrationInstanceOrganisationConnectionSort: {
    node: { __type: "HiveOrganisationSort" },
  },
  HiveIntegrationInstanceOrganisationConnectionWhere: {
    AND: { __type: "[HiveIntegrationInstanceOrganisationConnectionWhere!]" },
    OR: { __type: "[HiveIntegrationInstanceOrganisationConnectionWhere!]" },
    node: { __type: "HiveOrganisationWhere" },
    node_NOT: { __type: "HiveOrganisationWhere" },
  },
  HiveIntegrationInstanceOrganisationCreateFieldInput: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  HiveIntegrationInstanceOrganisationDeleteFieldInput: {
    delete: { __type: "HiveOrganisationDeleteInput" },
    where: { __type: "HiveIntegrationInstanceOrganisationConnectionWhere" },
  },
  HiveIntegrationInstanceOrganisationDisconnectFieldInput: {
    disconnect: { __type: "HiveOrganisationDisconnectInput" },
    where: { __type: "HiveIntegrationInstanceOrganisationConnectionWhere" },
  },
  HiveIntegrationInstanceOrganisationFieldInput: {
    connect: { __type: "HiveIntegrationInstanceOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "HiveIntegrationInstanceOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "HiveIntegrationInstanceOrganisationCreateFieldInput" },
  },
  HiveIntegrationInstanceOrganisationNodeAggregationWhereInput: {
    AND: {
      __type: "[HiveIntegrationInstanceOrganisationNodeAggregationWhereInput!]",
    },
    OR: {
      __type: "[HiveIntegrationInstanceOrganisationNodeAggregationWhereInput!]",
    },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveIntegrationInstanceOrganisationRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveOrganisation!" },
  },
  HiveIntegrationInstanceOrganisationUpdateConnectionInput: {
    node: { __type: "HiveOrganisationUpdateInput" },
  },
  HiveIntegrationInstanceOrganisationUpdateFieldInput: {
    connect: { __type: "HiveIntegrationInstanceOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "HiveIntegrationInstanceOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "HiveIntegrationInstanceOrganisationCreateFieldInput" },
    delete: { __type: "HiveIntegrationInstanceOrganisationDeleteFieldInput" },
    disconnect: {
      __type: "HiveIntegrationInstanceOrganisationDisconnectFieldInput",
    },
    update: {
      __type: "HiveIntegrationInstanceOrganisationUpdateConnectionInput",
    },
    where: { __type: "HiveIntegrationInstanceOrganisationConnectionWhere" },
  },
  HiveIntegrationInstanceRelationInput: {
    appliances: {
      __type: "[HiveIntegrationInstanceAppliancesCreateFieldInput!]",
    },
    connections: {
      __type: "[HiveIntegrationInstanceConnectionsCreateFieldInput!]",
    },
    integration: {
      __type: "HiveIntegrationInstanceIntegrationCreateFieldInput",
    },
    organisation: {
      __type: "HiveIntegrationInstanceOrganisationCreateFieldInput",
    },
  },
  HiveIntegrationInstanceSort: {
    config: { __type: "SortDirection" },
    id: { __type: "SortDirection" },
    isRunning: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
  },
  HiveIntegrationInstanceUniqueWhere: { id: { __type: "ID" } },
  HiveIntegrationInstanceUpdateInput: {
    appliances: {
      __type: "[HiveIntegrationInstanceAppliancesUpdateFieldInput!]",
    },
    config: { __type: "String" },
    connections: {
      __type: "[HiveIntegrationInstanceConnectionsUpdateFieldInput!]",
    },
    integration: {
      __type: "HiveIntegrationInstanceIntegrationUpdateFieldInput",
    },
    name: { __type: "String" },
    organisation: {
      __type: "HiveIntegrationInstanceOrganisationUpdateFieldInput",
    },
  },
  HiveIntegrationInstanceWhere: {
    AND: { __type: "[HiveIntegrationInstanceWhere!]" },
    OR: { __type: "[HiveIntegrationInstanceWhere!]" },
    appliances: { __type: "HiveApplianceWhere" },
    appliancesAggregate: {
      __type: "HiveIntegrationInstanceAppliancesAggregateInput",
    },
    appliancesConnection: {
      __type: "HiveIntegrationInstanceAppliancesConnectionWhere",
    },
    appliancesConnection_NOT: {
      __type: "HiveIntegrationInstanceAppliancesConnectionWhere",
    },
    appliances_NOT: { __type: "HiveApplianceWhere" },
    config: { __type: "String" },
    config_CONTAINS: { __type: "String" },
    config_ENDS_WITH: { __type: "String" },
    config_IN: { __type: "[String]" },
    config_NOT: { __type: "String" },
    config_NOT_CONTAINS: { __type: "String" },
    config_NOT_ENDS_WITH: { __type: "String" },
    config_NOT_IN: { __type: "[String]" },
    config_NOT_STARTS_WITH: { __type: "String" },
    config_STARTS_WITH: { __type: "String" },
    connections: { __type: "HiveIntegrationPathWhere" },
    connectionsAggregate: {
      __type: "HiveIntegrationInstanceConnectionsAggregateInput",
    },
    connectionsConnection: {
      __type: "HiveIntegrationInstanceConnectionsConnectionWhere",
    },
    connectionsConnection_NOT: {
      __type: "HiveIntegrationInstanceConnectionsConnectionWhere",
    },
    connections_NOT: { __type: "HiveIntegrationPathWhere" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    integration: { __type: "HiveIntegrationWhere" },
    integrationAggregate: {
      __type: "HiveIntegrationInstanceIntegrationAggregateInput",
    },
    integrationConnection: {
      __type: "HiveIntegrationInstanceIntegrationConnectionWhere",
    },
    integrationConnection_NOT: {
      __type: "HiveIntegrationInstanceIntegrationConnectionWhere",
    },
    integration_NOT: { __type: "HiveIntegrationWhere" },
    isRunning: { __type: "Boolean" },
    isRunning_NOT: { __type: "Boolean" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    organisation: { __type: "HiveOrganisationWhere" },
    organisationAggregate: {
      __type: "HiveIntegrationInstanceOrganisationAggregateInput",
    },
    organisationConnection: {
      __type: "HiveIntegrationInstanceOrganisationConnectionWhere",
    },
    organisationConnection_NOT: {
      __type: "HiveIntegrationInstanceOrganisationConnectionWhere",
    },
    organisation_NOT: { __type: "HiveOrganisationWhere" },
  },
  HiveIntegrationOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[HiveIntegrationSort]" },
  },
  HiveIntegrationPath: {
    __typename: { __type: "String!" },
    collections: { __type: "[HiveIntegrationPathCollection]" },
    connectionBlob: { __type: "String" },
    id: { __type: "ID!" },
    instance: {
      __type: "HiveIntegrationInstance",
      __args: {
        options: "HiveIntegrationInstanceOptions",
        where: "HiveIntegrationInstanceWhere",
      },
    },
    instanceAggregate: {
      __type:
        "HiveIntegrationPathHiveIntegrationInstanceInstanceAggregationSelection",
      __args: { where: "HiveIntegrationInstanceWhere" },
    },
    instanceConnection: {
      __type: "HiveIntegrationPathInstanceConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveIntegrationPathInstanceConnectionSort!]",
        where: "HiveIntegrationPathInstanceConnectionWhere",
      },
    },
    name: { __type: "String" },
    type: { __type: "String" },
  },
  HiveIntegrationPathAggregateSelection: {
    __typename: { __type: "String!" },
    connectionBlob: { __type: "StringAggregateSelection!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    type: { __type: "StringAggregateSelection!" },
  },
  HiveIntegrationPathCollection: {
    __typename: { __type: "String!" },
    name: { __type: "String" },
  },
  HiveIntegrationPathCollectionAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveIntegrationPathCollectionCreateInput: { name: { __type: "String" } },
  HiveIntegrationPathCollectionOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[HiveIntegrationPathCollectionSort]" },
  },
  HiveIntegrationPathCollectionSort: { name: { __type: "SortDirection" } },
  HiveIntegrationPathCollectionUpdateInput: { name: { __type: "String" } },
  HiveIntegrationPathCollectionWhere: {
    AND: { __type: "[HiveIntegrationPathCollectionWhere!]" },
    OR: { __type: "[HiveIntegrationPathCollectionWhere!]" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
  },
  HiveIntegrationPathConnectInput: {
    instance: { __type: "HiveIntegrationPathInstanceConnectFieldInput" },
  },
  HiveIntegrationPathConnectOrCreateInput: {
    instance: {
      __type: "HiveIntegrationPathInstanceConnectOrCreateFieldInput",
    },
  },
  HiveIntegrationPathConnectOrCreateWhere: {
    node: { __type: "HiveIntegrationPathUniqueWhere!" },
  },
  HiveIntegrationPathConnectWhere: {
    node: { __type: "HiveIntegrationPathWhere!" },
  },
  HiveIntegrationPathCreateInput: {
    connectionBlob: { __type: "String" },
    instance: { __type: "HiveIntegrationPathInstanceFieldInput" },
    name: { __type: "String" },
    type: { __type: "String" },
  },
  HiveIntegrationPathDeleteInput: {
    instance: { __type: "HiveIntegrationPathInstanceDeleteFieldInput" },
  },
  HiveIntegrationPathDisconnectInput: {
    instance: { __type: "HiveIntegrationPathInstanceDisconnectFieldInput" },
  },
  HiveIntegrationPathHiveIntegrationInstanceInstanceAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type:
        "HiveIntegrationPathHiveIntegrationInstanceInstanceNodeAggregateSelection",
    },
  },
  HiveIntegrationPathHiveIntegrationInstanceInstanceNodeAggregateSelection: {
    __typename: { __type: "String!" },
    config: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveIntegrationPathInstanceAggregateInput: {
    AND: { __type: "[HiveIntegrationPathInstanceAggregateInput!]" },
    OR: { __type: "[HiveIntegrationPathInstanceAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveIntegrationPathInstanceNodeAggregationWhereInput" },
  },
  HiveIntegrationPathInstanceConnectFieldInput: {
    connect: { __type: "HiveIntegrationInstanceConnectInput" },
    where: { __type: "HiveIntegrationInstanceConnectWhere" },
  },
  HiveIntegrationPathInstanceConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveIntegrationPathInstanceConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveIntegrationInstanceConnectOrCreateWhere!" },
  },
  HiveIntegrationPathInstanceConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveIntegrationInstanceCreateInput!" },
  },
  HiveIntegrationPathInstanceConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveIntegrationPathInstanceRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveIntegrationPathInstanceConnectionSort: {
    node: { __type: "HiveIntegrationInstanceSort" },
  },
  HiveIntegrationPathInstanceConnectionWhere: {
    AND: { __type: "[HiveIntegrationPathInstanceConnectionWhere!]" },
    OR: { __type: "[HiveIntegrationPathInstanceConnectionWhere!]" },
    node: { __type: "HiveIntegrationInstanceWhere" },
    node_NOT: { __type: "HiveIntegrationInstanceWhere" },
  },
  HiveIntegrationPathInstanceCreateFieldInput: {
    node: { __type: "HiveIntegrationInstanceCreateInput!" },
  },
  HiveIntegrationPathInstanceDeleteFieldInput: {
    delete: { __type: "HiveIntegrationInstanceDeleteInput" },
    where: { __type: "HiveIntegrationPathInstanceConnectionWhere" },
  },
  HiveIntegrationPathInstanceDisconnectFieldInput: {
    disconnect: { __type: "HiveIntegrationInstanceDisconnectInput" },
    where: { __type: "HiveIntegrationPathInstanceConnectionWhere" },
  },
  HiveIntegrationPathInstanceFieldInput: {
    connect: { __type: "HiveIntegrationPathInstanceConnectFieldInput" },
    connectOrCreate: {
      __type: "HiveIntegrationPathInstanceConnectOrCreateFieldInput",
    },
    create: { __type: "HiveIntegrationPathInstanceCreateFieldInput" },
  },
  HiveIntegrationPathInstanceNodeAggregationWhereInput: {
    AND: { __type: "[HiveIntegrationPathInstanceNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveIntegrationPathInstanceNodeAggregationWhereInput!]" },
    config_AVERAGE_EQUAL: { __type: "Float" },
    config_AVERAGE_GT: { __type: "Float" },
    config_AVERAGE_GTE: { __type: "Float" },
    config_AVERAGE_LT: { __type: "Float" },
    config_AVERAGE_LTE: { __type: "Float" },
    config_EQUAL: { __type: "String" },
    config_GT: { __type: "Int" },
    config_GTE: { __type: "Int" },
    config_LONGEST_EQUAL: { __type: "Int" },
    config_LONGEST_GT: { __type: "Int" },
    config_LONGEST_GTE: { __type: "Int" },
    config_LONGEST_LT: { __type: "Int" },
    config_LONGEST_LTE: { __type: "Int" },
    config_LT: { __type: "Int" },
    config_LTE: { __type: "Int" },
    config_SHORTEST_EQUAL: { __type: "Int" },
    config_SHORTEST_GT: { __type: "Int" },
    config_SHORTEST_GTE: { __type: "Int" },
    config_SHORTEST_LT: { __type: "Int" },
    config_SHORTEST_LTE: { __type: "Int" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveIntegrationPathInstanceRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveIntegrationInstance!" },
  },
  HiveIntegrationPathInstanceUpdateConnectionInput: {
    node: { __type: "HiveIntegrationInstanceUpdateInput" },
  },
  HiveIntegrationPathInstanceUpdateFieldInput: {
    connect: { __type: "HiveIntegrationPathInstanceConnectFieldInput" },
    connectOrCreate: {
      __type: "HiveIntegrationPathInstanceConnectOrCreateFieldInput",
    },
    create: { __type: "HiveIntegrationPathInstanceCreateFieldInput" },
    delete: { __type: "HiveIntegrationPathInstanceDeleteFieldInput" },
    disconnect: { __type: "HiveIntegrationPathInstanceDisconnectFieldInput" },
    update: { __type: "HiveIntegrationPathInstanceUpdateConnectionInput" },
    where: { __type: "HiveIntegrationPathInstanceConnectionWhere" },
  },
  HiveIntegrationPathOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[HiveIntegrationPathSort]" },
  },
  HiveIntegrationPathRelationInput: {
    instance: { __type: "HiveIntegrationPathInstanceCreateFieldInput" },
  },
  HiveIntegrationPathSort: {
    connectionBlob: { __type: "SortDirection" },
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
    type: { __type: "SortDirection" },
  },
  HiveIntegrationPathUniqueWhere: { id: { __type: "ID" } },
  HiveIntegrationPathUpdateInput: {
    connectionBlob: { __type: "String" },
    instance: { __type: "HiveIntegrationPathInstanceUpdateFieldInput" },
    name: { __type: "String" },
    type: { __type: "String" },
  },
  HiveIntegrationPathWhere: {
    AND: { __type: "[HiveIntegrationPathWhere!]" },
    OR: { __type: "[HiveIntegrationPathWhere!]" },
    connectionBlob: { __type: "String" },
    connectionBlob_CONTAINS: { __type: "String" },
    connectionBlob_ENDS_WITH: { __type: "String" },
    connectionBlob_IN: { __type: "[String]" },
    connectionBlob_NOT: { __type: "String" },
    connectionBlob_NOT_CONTAINS: { __type: "String" },
    connectionBlob_NOT_ENDS_WITH: { __type: "String" },
    connectionBlob_NOT_IN: { __type: "[String]" },
    connectionBlob_NOT_STARTS_WITH: { __type: "String" },
    connectionBlob_STARTS_WITH: { __type: "String" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    instance: { __type: "HiveIntegrationInstanceWhere" },
    instanceAggregate: { __type: "HiveIntegrationPathInstanceAggregateInput" },
    instanceConnection: {
      __type: "HiveIntegrationPathInstanceConnectionWhere",
    },
    instanceConnection_NOT: {
      __type: "HiveIntegrationPathInstanceConnectionWhere",
    },
    instance_NOT: { __type: "HiveIntegrationInstanceWhere" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    type: { __type: "String" },
    type_CONTAINS: { __type: "String" },
    type_ENDS_WITH: { __type: "String" },
    type_IN: { __type: "[String]" },
    type_NOT: { __type: "String" },
    type_NOT_CONTAINS: { __type: "String" },
    type_NOT_ENDS_WITH: { __type: "String" },
    type_NOT_IN: { __type: "[String]" },
    type_NOT_STARTS_WITH: { __type: "String" },
    type_STARTS_WITH: { __type: "String" },
  },
  HiveIntegrationSort: {
    description: { __type: "SortDirection" },
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
  },
  HiveIntegrationUniqueWhere: { id: { __type: "ID" } },
  HiveIntegrationUpdateInput: {
    description: { __type: "String" },
    name: { __type: "String" },
  },
  HiveIntegrationWhere: {
    AND: { __type: "[HiveIntegrationWhere!]" },
    OR: { __type: "[HiveIntegrationWhere!]" },
    description: { __type: "String" },
    description_CONTAINS: { __type: "String" },
    description_ENDS_WITH: { __type: "String" },
    description_IN: { __type: "[String]" },
    description_NOT: { __type: "String" },
    description_NOT_CONTAINS: { __type: "String" },
    description_NOT_ENDS_WITH: { __type: "String" },
    description_NOT_IN: { __type: "[String]" },
    description_NOT_STARTS_WITH: { __type: "String" },
    description_STARTS_WITH: { __type: "String" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
  },
  HiveOrganisation: {
    __typename: { __type: "String!" },
    appliances: {
      __type: "[HiveAppliance]",
      __args: { options: "HiveApplianceOptions", where: "HiveApplianceWhere" },
    },
    appliancesAggregate: {
      __type: "HiveOrganisationHiveApplianceAppliancesAggregationSelection",
      __args: { where: "HiveApplianceWhere" },
    },
    appliancesConnection: {
      __type: "HiveOrganisationAppliancesConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveOrganisationAppliancesConnectionSort!]",
        where: "HiveOrganisationAppliancesConnectionWhere",
      },
    },
    equipment: {
      __type: "[Equipment]",
      __args: { options: "EquipmentOptions", where: "EquipmentWhere" },
    },
    equipmentAggregate: {
      __type: "HiveOrganisationEquipmentEquipmentAggregationSelection",
      __args: { where: "EquipmentWhere" },
    },
    equipmentConnection: {
      __type: "HiveOrganisationEquipmentConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveOrganisationEquipmentConnectionSort!]",
        where: "HiveOrganisationEquipmentConnectionWhere",
      },
    },
    estimates: {
      __type: "[Estimate]",
      __args: { options: "EstimateOptions", where: "EstimateWhere" },
    },
    estimatesAggregate: {
      __type: "HiveOrganisationEstimateEstimatesAggregationSelection",
      __args: { where: "EstimateWhere" },
    },
    estimatesConnection: {
      __type: "HiveOrganisationEstimatesConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveOrganisationEstimatesConnectionSort!]",
        where: "HiveOrganisationEstimatesConnectionWhere",
      },
    },
    id: { __type: "ID!" },
    integrations: {
      __type: "[HiveIntegrationInstance]",
      __args: {
        options: "HiveIntegrationInstanceOptions",
        where: "HiveIntegrationInstanceWhere",
      },
    },
    integrationsAggregate: {
      __type:
        "HiveOrganisationHiveIntegrationInstanceIntegrationsAggregationSelection",
      __args: { where: "HiveIntegrationInstanceWhere" },
    },
    integrationsConnection: {
      __type: "HiveOrganisationIntegrationsConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveOrganisationIntegrationsConnectionSort!]",
        where: "HiveOrganisationIntegrationsConnectionWhere",
      },
    },
    members: {
      __type: "[HiveUser]",
      __args: { options: "HiveUserOptions", where: "HiveUserWhere" },
    },
    membersAggregate: {
      __type: "HiveOrganisationHiveUserMembersAggregationSelection",
      __args: { where: "HiveUserWhere" },
    },
    membersConnection: {
      __type: "HiveOrganisationMembersConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveOrganisationMembersConnectionSort!]",
        where: "HiveOrganisationMembersConnectionWhere",
      },
    },
    name: { __type: "String" },
    people: {
      __type: "[People]",
      __args: { options: "PeopleOptions", where: "PeopleWhere" },
    },
    peopleAggregate: {
      __type: "HiveOrganisationPeoplePeopleAggregationSelection",
      __args: { where: "PeopleWhere" },
    },
    peopleConnection: {
      __type: "HiveOrganisationPeopleConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveOrganisationPeopleConnectionSort!]",
        where: "HiveOrganisationPeopleConnectionWhere",
      },
    },
    projects: {
      __type: "[Project]",
      __args: { options: "ProjectOptions", where: "ProjectWhere" },
    },
    projectsAggregate: {
      __type: "HiveOrganisationProjectProjectsAggregationSelection",
      __args: { where: "ProjectWhere" },
    },
    projectsConnection: {
      __type: "HiveOrganisationProjectsConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveOrganisationProjectsConnectionSort!]",
        where: "HiveOrganisationProjectsConnectionWhere",
      },
    },
    roles: {
      __type: "[Role]",
      __args: { options: "RoleOptions", where: "RoleWhere" },
    },
    rolesAggregate: {
      __type: "HiveOrganisationRoleRolesAggregationSelection",
      __args: { where: "RoleWhere" },
    },
    rolesConnection: {
      __type: "HiveOrganisationRolesConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveOrganisationRolesConnectionSort!]",
        where: "HiveOrganisationRolesConnectionWhere",
      },
    },
    schedule: {
      __type: "[ScheduleItem]",
      __args: { options: "ScheduleItemOptions", where: "ScheduleItemWhere" },
    },
    scheduleAggregate: {
      __type: "HiveOrganisationScheduleItemScheduleAggregationSelection",
      __args: { where: "ScheduleItemWhere" },
    },
    scheduleConnection: {
      __type: "HiveOrganisationScheduleConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveOrganisationScheduleConnectionSort!]",
        where: "HiveOrganisationScheduleConnectionWhere",
      },
    },
    timeline: {
      __type: "[TimelineItem]",
      __args: { options: "TimelineItemOptions", where: "TimelineItemWhere" },
    },
    timelineAggregate: {
      __type: "HiveOrganisationTimelineItemTimelineAggregationSelection",
      __args: { where: "TimelineItemWhere" },
    },
    timelineConnection: {
      __type: "HiveOrganisationTimelineConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveOrganisationTimelineConnectionSort!]",
        where: "HiveOrganisationTimelineConnectionWhere",
      },
    },
  },
  HiveOrganisationAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveOrganisationAppliancesAggregateInput: {
    AND: { __type: "[HiveOrganisationAppliancesAggregateInput!]" },
    OR: { __type: "[HiveOrganisationAppliancesAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveOrganisationAppliancesNodeAggregationWhereInput" },
  },
  HiveOrganisationAppliancesConnectFieldInput: {
    connect: { __type: "[HiveApplianceConnectInput!]" },
    where: { __type: "HiveApplianceConnectWhere" },
  },
  HiveOrganisationAppliancesConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveOrganisationAppliancesConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveApplianceConnectOrCreateWhere!" },
  },
  HiveOrganisationAppliancesConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveApplianceCreateInput!" },
  },
  HiveOrganisationAppliancesConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveOrganisationAppliancesRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveOrganisationAppliancesConnectionSort: {
    node: { __type: "HiveApplianceSort" },
  },
  HiveOrganisationAppliancesConnectionWhere: {
    AND: { __type: "[HiveOrganisationAppliancesConnectionWhere!]" },
    OR: { __type: "[HiveOrganisationAppliancesConnectionWhere!]" },
    node: { __type: "HiveApplianceWhere" },
    node_NOT: { __type: "HiveApplianceWhere" },
  },
  HiveOrganisationAppliancesCreateFieldInput: {
    node: { __type: "HiveApplianceCreateInput!" },
  },
  HiveOrganisationAppliancesDeleteFieldInput: {
    delete: { __type: "HiveApplianceDeleteInput" },
    where: { __type: "HiveOrganisationAppliancesConnectionWhere" },
  },
  HiveOrganisationAppliancesDisconnectFieldInput: {
    disconnect: { __type: "HiveApplianceDisconnectInput" },
    where: { __type: "HiveOrganisationAppliancesConnectionWhere" },
  },
  HiveOrganisationAppliancesFieldInput: {
    connect: { __type: "[HiveOrganisationAppliancesConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationAppliancesConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationAppliancesCreateFieldInput!]" },
  },
  HiveOrganisationAppliancesNodeAggregationWhereInput: {
    AND: { __type: "[HiveOrganisationAppliancesNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveOrganisationAppliancesNodeAggregationWhereInput!]" },
    description_AVERAGE_EQUAL: { __type: "Float" },
    description_AVERAGE_GT: { __type: "Float" },
    description_AVERAGE_GTE: { __type: "Float" },
    description_AVERAGE_LT: { __type: "Float" },
    description_AVERAGE_LTE: { __type: "Float" },
    description_EQUAL: { __type: "String" },
    description_GT: { __type: "Int" },
    description_GTE: { __type: "Int" },
    description_LONGEST_EQUAL: { __type: "Int" },
    description_LONGEST_GT: { __type: "Int" },
    description_LONGEST_GTE: { __type: "Int" },
    description_LONGEST_LT: { __type: "Int" },
    description_LONGEST_LTE: { __type: "Int" },
    description_LT: { __type: "Int" },
    description_LTE: { __type: "Int" },
    description_SHORTEST_EQUAL: { __type: "Int" },
    description_SHORTEST_GT: { __type: "Int" },
    description_SHORTEST_GTE: { __type: "Int" },
    description_SHORTEST_LT: { __type: "Int" },
    description_SHORTEST_LTE: { __type: "Int" },
    id_EQUAL: { __type: "ID" },
    label_AVERAGE_EQUAL: { __type: "Float" },
    label_AVERAGE_GT: { __type: "Float" },
    label_AVERAGE_GTE: { __type: "Float" },
    label_AVERAGE_LT: { __type: "Float" },
    label_AVERAGE_LTE: { __type: "Float" },
    label_EQUAL: { __type: "String" },
    label_GT: { __type: "Int" },
    label_GTE: { __type: "Int" },
    label_LONGEST_EQUAL: { __type: "Int" },
    label_LONGEST_GT: { __type: "Int" },
    label_LONGEST_GTE: { __type: "Int" },
    label_LONGEST_LT: { __type: "Int" },
    label_LONGEST_LTE: { __type: "Int" },
    label_LT: { __type: "Int" },
    label_LTE: { __type: "Int" },
    label_SHORTEST_EQUAL: { __type: "Int" },
    label_SHORTEST_GT: { __type: "Int" },
    label_SHORTEST_GTE: { __type: "Int" },
    label_SHORTEST_LT: { __type: "Int" },
    label_SHORTEST_LTE: { __type: "Int" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveOrganisationAppliancesRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveAppliance!" },
  },
  HiveOrganisationAppliancesUpdateConnectionInput: {
    node: { __type: "HiveApplianceUpdateInput" },
  },
  HiveOrganisationAppliancesUpdateFieldInput: {
    connect: { __type: "[HiveOrganisationAppliancesConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationAppliancesConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationAppliancesCreateFieldInput!]" },
    delete: { __type: "[HiveOrganisationAppliancesDeleteFieldInput!]" },
    disconnect: { __type: "[HiveOrganisationAppliancesDisconnectFieldInput!]" },
    update: { __type: "HiveOrganisationAppliancesUpdateConnectionInput" },
    where: { __type: "HiveOrganisationAppliancesConnectionWhere" },
  },
  HiveOrganisationConnectInput: {
    appliances: { __type: "[HiveOrganisationAppliancesConnectFieldInput!]" },
    equipment: { __type: "[HiveOrganisationEquipmentConnectFieldInput!]" },
    estimates: { __type: "[HiveOrganisationEstimatesConnectFieldInput!]" },
    integrations: {
      __type: "[HiveOrganisationIntegrationsConnectFieldInput!]",
    },
    members: { __type: "[HiveOrganisationMembersConnectFieldInput!]" },
    people: { __type: "[HiveOrganisationPeopleConnectFieldInput!]" },
    projects: { __type: "[HiveOrganisationProjectsConnectFieldInput!]" },
    roles: { __type: "[HiveOrganisationRolesConnectFieldInput!]" },
    schedule: { __type: "[HiveOrganisationScheduleConnectFieldInput!]" },
    timeline: { __type: "[HiveOrganisationTimelineConnectFieldInput!]" },
  },
  HiveOrganisationConnectOrCreateInput: {
    appliances: {
      __type: "[HiveOrganisationAppliancesConnectOrCreateFieldInput!]",
    },
    equipment: {
      __type: "[HiveOrganisationEquipmentConnectOrCreateFieldInput!]",
    },
    estimates: {
      __type: "[HiveOrganisationEstimatesConnectOrCreateFieldInput!]",
    },
    integrations: {
      __type: "[HiveOrganisationIntegrationsConnectOrCreateFieldInput!]",
    },
    members: { __type: "[HiveOrganisationMembersConnectOrCreateFieldInput!]" },
    people: { __type: "[HiveOrganisationPeopleConnectOrCreateFieldInput!]" },
    projects: {
      __type: "[HiveOrganisationProjectsConnectOrCreateFieldInput!]",
    },
    roles: { __type: "[HiveOrganisationRolesConnectOrCreateFieldInput!]" },
    schedule: {
      __type: "[HiveOrganisationScheduleConnectOrCreateFieldInput!]",
    },
    timeline: {
      __type: "[HiveOrganisationTimelineConnectOrCreateFieldInput!]",
    },
  },
  HiveOrganisationConnectOrCreateWhere: {
    node: { __type: "HiveOrganisationUniqueWhere!" },
  },
  HiveOrganisationConnectWhere: { node: { __type: "HiveOrganisationWhere!" } },
  HiveOrganisationCreateInput: {
    appliances: { __type: "HiveOrganisationAppliancesFieldInput" },
    equipment: { __type: "HiveOrganisationEquipmentFieldInput" },
    estimates: { __type: "HiveOrganisationEstimatesFieldInput" },
    integrations: { __type: "HiveOrganisationIntegrationsFieldInput" },
    members: { __type: "HiveOrganisationMembersFieldInput" },
    name: { __type: "String" },
    people: { __type: "HiveOrganisationPeopleFieldInput" },
    projects: { __type: "HiveOrganisationProjectsFieldInput" },
    roles: { __type: "HiveOrganisationRolesFieldInput" },
    schedule: { __type: "HiveOrganisationScheduleFieldInput" },
    timeline: { __type: "HiveOrganisationTimelineFieldInput" },
  },
  HiveOrganisationDeleteInput: {
    appliances: { __type: "[HiveOrganisationAppliancesDeleteFieldInput!]" },
    equipment: { __type: "[HiveOrganisationEquipmentDeleteFieldInput!]" },
    estimates: { __type: "[HiveOrganisationEstimatesDeleteFieldInput!]" },
    integrations: { __type: "[HiveOrganisationIntegrationsDeleteFieldInput!]" },
    members: { __type: "[HiveOrganisationMembersDeleteFieldInput!]" },
    people: { __type: "[HiveOrganisationPeopleDeleteFieldInput!]" },
    projects: { __type: "[HiveOrganisationProjectsDeleteFieldInput!]" },
    roles: { __type: "[HiveOrganisationRolesDeleteFieldInput!]" },
    schedule: { __type: "[HiveOrganisationScheduleDeleteFieldInput!]" },
    timeline: { __type: "[HiveOrganisationTimelineDeleteFieldInput!]" },
  },
  HiveOrganisationDisconnectInput: {
    appliances: { __type: "[HiveOrganisationAppliancesDisconnectFieldInput!]" },
    equipment: { __type: "[HiveOrganisationEquipmentDisconnectFieldInput!]" },
    estimates: { __type: "[HiveOrganisationEstimatesDisconnectFieldInput!]" },
    integrations: {
      __type: "[HiveOrganisationIntegrationsDisconnectFieldInput!]",
    },
    members: { __type: "[HiveOrganisationMembersDisconnectFieldInput!]" },
    people: { __type: "[HiveOrganisationPeopleDisconnectFieldInput!]" },
    projects: { __type: "[HiveOrganisationProjectsDisconnectFieldInput!]" },
    roles: { __type: "[HiveOrganisationRolesDisconnectFieldInput!]" },
    schedule: { __type: "[HiveOrganisationScheduleDisconnectFieldInput!]" },
    timeline: { __type: "[HiveOrganisationTimelineDisconnectFieldInput!]" },
  },
  HiveOrganisationEquipmentAggregateInput: {
    AND: { __type: "[HiveOrganisationEquipmentAggregateInput!]" },
    OR: { __type: "[HiveOrganisationEquipmentAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveOrganisationEquipmentNodeAggregationWhereInput" },
  },
  HiveOrganisationEquipmentConnectFieldInput: {
    connect: { __type: "[EquipmentConnectInput!]" },
    where: { __type: "EquipmentConnectWhere" },
  },
  HiveOrganisationEquipmentConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveOrganisationEquipmentConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "EquipmentConnectOrCreateWhere!" },
  },
  HiveOrganisationEquipmentConnectOrCreateFieldInputOnCreate: {
    node: { __type: "EquipmentCreateInput!" },
  },
  HiveOrganisationEquipmentConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveOrganisationEquipmentRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveOrganisationEquipmentConnectionSort: {
    node: { __type: "EquipmentSort" },
  },
  HiveOrganisationEquipmentConnectionWhere: {
    AND: { __type: "[HiveOrganisationEquipmentConnectionWhere!]" },
    OR: { __type: "[HiveOrganisationEquipmentConnectionWhere!]" },
    node: { __type: "EquipmentWhere" },
    node_NOT: { __type: "EquipmentWhere" },
  },
  HiveOrganisationEquipmentCreateFieldInput: {
    node: { __type: "EquipmentCreateInput!" },
  },
  HiveOrganisationEquipmentDeleteFieldInput: {
    delete: { __type: "EquipmentDeleteInput" },
    where: { __type: "HiveOrganisationEquipmentConnectionWhere" },
  },
  HiveOrganisationEquipmentDisconnectFieldInput: {
    disconnect: { __type: "EquipmentDisconnectInput" },
    where: { __type: "HiveOrganisationEquipmentConnectionWhere" },
  },
  HiveOrganisationEquipmentEquipmentAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "HiveOrganisationEquipmentEquipmentNodeAggregateSelection",
    },
  },
  HiveOrganisationEquipmentEquipmentNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    registration: { __type: "StringAggregateSelection!" },
  },
  HiveOrganisationEquipmentFieldInput: {
    connect: { __type: "[HiveOrganisationEquipmentConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationEquipmentConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationEquipmentCreateFieldInput!]" },
  },
  HiveOrganisationEquipmentNodeAggregationWhereInput: {
    AND: { __type: "[HiveOrganisationEquipmentNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveOrganisationEquipmentNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    registration_AVERAGE_EQUAL: { __type: "Float" },
    registration_AVERAGE_GT: { __type: "Float" },
    registration_AVERAGE_GTE: { __type: "Float" },
    registration_AVERAGE_LT: { __type: "Float" },
    registration_AVERAGE_LTE: { __type: "Float" },
    registration_EQUAL: { __type: "String" },
    registration_GT: { __type: "Int" },
    registration_GTE: { __type: "Int" },
    registration_LONGEST_EQUAL: { __type: "Int" },
    registration_LONGEST_GT: { __type: "Int" },
    registration_LONGEST_GTE: { __type: "Int" },
    registration_LONGEST_LT: { __type: "Int" },
    registration_LONGEST_LTE: { __type: "Int" },
    registration_LT: { __type: "Int" },
    registration_LTE: { __type: "Int" },
    registration_SHORTEST_EQUAL: { __type: "Int" },
    registration_SHORTEST_GT: { __type: "Int" },
    registration_SHORTEST_GTE: { __type: "Int" },
    registration_SHORTEST_LT: { __type: "Int" },
    registration_SHORTEST_LTE: { __type: "Int" },
  },
  HiveOrganisationEquipmentRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "Equipment!" },
  },
  HiveOrganisationEquipmentUpdateConnectionInput: {
    node: { __type: "EquipmentUpdateInput" },
  },
  HiveOrganisationEquipmentUpdateFieldInput: {
    connect: { __type: "[HiveOrganisationEquipmentConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationEquipmentConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationEquipmentCreateFieldInput!]" },
    delete: { __type: "[HiveOrganisationEquipmentDeleteFieldInput!]" },
    disconnect: { __type: "[HiveOrganisationEquipmentDisconnectFieldInput!]" },
    update: { __type: "HiveOrganisationEquipmentUpdateConnectionInput" },
    where: { __type: "HiveOrganisationEquipmentConnectionWhere" },
  },
  HiveOrganisationEstimateEstimatesAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "HiveOrganisationEstimateEstimatesNodeAggregateSelection" },
  },
  HiveOrganisationEstimateEstimatesNodeAggregateSelection: {
    __typename: { __type: "String!" },
    date: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    price: { __type: "FloatAggregateSelection!" },
    status: { __type: "StringAggregateSelection!" },
  },
  HiveOrganisationEstimatesAggregateInput: {
    AND: { __type: "[HiveOrganisationEstimatesAggregateInput!]" },
    OR: { __type: "[HiveOrganisationEstimatesAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveOrganisationEstimatesNodeAggregationWhereInput" },
  },
  HiveOrganisationEstimatesConnectFieldInput: {
    connect: { __type: "[EstimateConnectInput!]" },
    where: { __type: "EstimateConnectWhere" },
  },
  HiveOrganisationEstimatesConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveOrganisationEstimatesConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "EstimateConnectOrCreateWhere!" },
  },
  HiveOrganisationEstimatesConnectOrCreateFieldInputOnCreate: {
    node: { __type: "EstimateCreateInput!" },
  },
  HiveOrganisationEstimatesConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveOrganisationEstimatesRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveOrganisationEstimatesConnectionSort: { node: { __type: "EstimateSort" } },
  HiveOrganisationEstimatesConnectionWhere: {
    AND: { __type: "[HiveOrganisationEstimatesConnectionWhere!]" },
    OR: { __type: "[HiveOrganisationEstimatesConnectionWhere!]" },
    node: { __type: "EstimateWhere" },
    node_NOT: { __type: "EstimateWhere" },
  },
  HiveOrganisationEstimatesCreateFieldInput: {
    node: { __type: "EstimateCreateInput!" },
  },
  HiveOrganisationEstimatesDeleteFieldInput: {
    delete: { __type: "EstimateDeleteInput" },
    where: { __type: "HiveOrganisationEstimatesConnectionWhere" },
  },
  HiveOrganisationEstimatesDisconnectFieldInput: {
    disconnect: { __type: "EstimateDisconnectInput" },
    where: { __type: "HiveOrganisationEstimatesConnectionWhere" },
  },
  HiveOrganisationEstimatesFieldInput: {
    connect: { __type: "[HiveOrganisationEstimatesConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationEstimatesConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationEstimatesCreateFieldInput!]" },
  },
  HiveOrganisationEstimatesNodeAggregationWhereInput: {
    AND: { __type: "[HiveOrganisationEstimatesNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveOrganisationEstimatesNodeAggregationWhereInput!]" },
    date_EQUAL: { __type: "DateTime" },
    date_GT: { __type: "DateTime" },
    date_GTE: { __type: "DateTime" },
    date_LT: { __type: "DateTime" },
    date_LTE: { __type: "DateTime" },
    date_MAX_EQUAL: { __type: "DateTime" },
    date_MAX_GT: { __type: "DateTime" },
    date_MAX_GTE: { __type: "DateTime" },
    date_MAX_LT: { __type: "DateTime" },
    date_MAX_LTE: { __type: "DateTime" },
    date_MIN_EQUAL: { __type: "DateTime" },
    date_MIN_GT: { __type: "DateTime" },
    date_MIN_GTE: { __type: "DateTime" },
    date_MIN_LT: { __type: "DateTime" },
    date_MIN_LTE: { __type: "DateTime" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    price_AVERAGE_EQUAL: { __type: "Float" },
    price_AVERAGE_GT: { __type: "Float" },
    price_AVERAGE_GTE: { __type: "Float" },
    price_AVERAGE_LT: { __type: "Float" },
    price_AVERAGE_LTE: { __type: "Float" },
    price_EQUAL: { __type: "Float" },
    price_GT: { __type: "Float" },
    price_GTE: { __type: "Float" },
    price_LT: { __type: "Float" },
    price_LTE: { __type: "Float" },
    price_MAX_EQUAL: { __type: "Float" },
    price_MAX_GT: { __type: "Float" },
    price_MAX_GTE: { __type: "Float" },
    price_MAX_LT: { __type: "Float" },
    price_MAX_LTE: { __type: "Float" },
    price_MIN_EQUAL: { __type: "Float" },
    price_MIN_GT: { __type: "Float" },
    price_MIN_GTE: { __type: "Float" },
    price_MIN_LT: { __type: "Float" },
    price_MIN_LTE: { __type: "Float" },
    price_SUM_EQUAL: { __type: "Float" },
    price_SUM_GT: { __type: "Float" },
    price_SUM_GTE: { __type: "Float" },
    price_SUM_LT: { __type: "Float" },
    price_SUM_LTE: { __type: "Float" },
    status_AVERAGE_EQUAL: { __type: "Float" },
    status_AVERAGE_GT: { __type: "Float" },
    status_AVERAGE_GTE: { __type: "Float" },
    status_AVERAGE_LT: { __type: "Float" },
    status_AVERAGE_LTE: { __type: "Float" },
    status_EQUAL: { __type: "String" },
    status_GT: { __type: "Int" },
    status_GTE: { __type: "Int" },
    status_LONGEST_EQUAL: { __type: "Int" },
    status_LONGEST_GT: { __type: "Int" },
    status_LONGEST_GTE: { __type: "Int" },
    status_LONGEST_LT: { __type: "Int" },
    status_LONGEST_LTE: { __type: "Int" },
    status_LT: { __type: "Int" },
    status_LTE: { __type: "Int" },
    status_SHORTEST_EQUAL: { __type: "Int" },
    status_SHORTEST_GT: { __type: "Int" },
    status_SHORTEST_GTE: { __type: "Int" },
    status_SHORTEST_LT: { __type: "Int" },
    status_SHORTEST_LTE: { __type: "Int" },
  },
  HiveOrganisationEstimatesRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "Estimate!" },
  },
  HiveOrganisationEstimatesUpdateConnectionInput: {
    node: { __type: "EstimateUpdateInput" },
  },
  HiveOrganisationEstimatesUpdateFieldInput: {
    connect: { __type: "[HiveOrganisationEstimatesConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationEstimatesConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationEstimatesCreateFieldInput!]" },
    delete: { __type: "[HiveOrganisationEstimatesDeleteFieldInput!]" },
    disconnect: { __type: "[HiveOrganisationEstimatesDisconnectFieldInput!]" },
    update: { __type: "HiveOrganisationEstimatesUpdateConnectionInput" },
    where: { __type: "HiveOrganisationEstimatesConnectionWhere" },
  },
  HiveOrganisationHiveApplianceAppliancesAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "HiveOrganisationHiveApplianceAppliancesNodeAggregateSelection",
    },
  },
  HiveOrganisationHiveApplianceAppliancesNodeAggregateSelection: {
    __typename: { __type: "String!" },
    description: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    label: { __type: "StringAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveOrganisationHiveIntegrationInstanceIntegrationsAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type:
        "HiveOrganisationHiveIntegrationInstanceIntegrationsNodeAggregateSelection",
    },
  },
  HiveOrganisationHiveIntegrationInstanceIntegrationsNodeAggregateSelection: {
    __typename: { __type: "String!" },
    config: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveOrganisationHiveUserMembersAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "HiveOrganisationHiveUserMembersNodeAggregateSelection" },
  },
  HiveOrganisationHiveUserMembersNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    password: { __type: "StringAggregateSelection!" },
    username: { __type: "StringAggregateSelection!" },
  },
  HiveOrganisationIntegrationsAggregateInput: {
    AND: { __type: "[HiveOrganisationIntegrationsAggregateInput!]" },
    OR: { __type: "[HiveOrganisationIntegrationsAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveOrganisationIntegrationsNodeAggregationWhereInput" },
  },
  HiveOrganisationIntegrationsConnectFieldInput: {
    connect: { __type: "[HiveIntegrationInstanceConnectInput!]" },
    where: { __type: "HiveIntegrationInstanceConnectWhere" },
  },
  HiveOrganisationIntegrationsConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveOrganisationIntegrationsConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveIntegrationInstanceConnectOrCreateWhere!" },
  },
  HiveOrganisationIntegrationsConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveIntegrationInstanceCreateInput!" },
  },
  HiveOrganisationIntegrationsConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveOrganisationIntegrationsRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveOrganisationIntegrationsConnectionSort: {
    node: { __type: "HiveIntegrationInstanceSort" },
  },
  HiveOrganisationIntegrationsConnectionWhere: {
    AND: { __type: "[HiveOrganisationIntegrationsConnectionWhere!]" },
    OR: { __type: "[HiveOrganisationIntegrationsConnectionWhere!]" },
    node: { __type: "HiveIntegrationInstanceWhere" },
    node_NOT: { __type: "HiveIntegrationInstanceWhere" },
  },
  HiveOrganisationIntegrationsCreateFieldInput: {
    node: { __type: "HiveIntegrationInstanceCreateInput!" },
  },
  HiveOrganisationIntegrationsDeleteFieldInput: {
    delete: { __type: "HiveIntegrationInstanceDeleteInput" },
    where: { __type: "HiveOrganisationIntegrationsConnectionWhere" },
  },
  HiveOrganisationIntegrationsDisconnectFieldInput: {
    disconnect: { __type: "HiveIntegrationInstanceDisconnectInput" },
    where: { __type: "HiveOrganisationIntegrationsConnectionWhere" },
  },
  HiveOrganisationIntegrationsFieldInput: {
    connect: { __type: "[HiveOrganisationIntegrationsConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationIntegrationsConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationIntegrationsCreateFieldInput!]" },
  },
  HiveOrganisationIntegrationsNodeAggregationWhereInput: {
    AND: { __type: "[HiveOrganisationIntegrationsNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveOrganisationIntegrationsNodeAggregationWhereInput!]" },
    config_AVERAGE_EQUAL: { __type: "Float" },
    config_AVERAGE_GT: { __type: "Float" },
    config_AVERAGE_GTE: { __type: "Float" },
    config_AVERAGE_LT: { __type: "Float" },
    config_AVERAGE_LTE: { __type: "Float" },
    config_EQUAL: { __type: "String" },
    config_GT: { __type: "Int" },
    config_GTE: { __type: "Int" },
    config_LONGEST_EQUAL: { __type: "Int" },
    config_LONGEST_GT: { __type: "Int" },
    config_LONGEST_GTE: { __type: "Int" },
    config_LONGEST_LT: { __type: "Int" },
    config_LONGEST_LTE: { __type: "Int" },
    config_LT: { __type: "Int" },
    config_LTE: { __type: "Int" },
    config_SHORTEST_EQUAL: { __type: "Int" },
    config_SHORTEST_GT: { __type: "Int" },
    config_SHORTEST_GTE: { __type: "Int" },
    config_SHORTEST_LT: { __type: "Int" },
    config_SHORTEST_LTE: { __type: "Int" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveOrganisationIntegrationsRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveIntegrationInstance!" },
  },
  HiveOrganisationIntegrationsUpdateConnectionInput: {
    node: { __type: "HiveIntegrationInstanceUpdateInput" },
  },
  HiveOrganisationIntegrationsUpdateFieldInput: {
    connect: { __type: "[HiveOrganisationIntegrationsConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationIntegrationsConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationIntegrationsCreateFieldInput!]" },
    delete: { __type: "[HiveOrganisationIntegrationsDeleteFieldInput!]" },
    disconnect: {
      __type: "[HiveOrganisationIntegrationsDisconnectFieldInput!]",
    },
    update: { __type: "HiveOrganisationIntegrationsUpdateConnectionInput" },
    where: { __type: "HiveOrganisationIntegrationsConnectionWhere" },
  },
  HiveOrganisationMembersAggregateInput: {
    AND: { __type: "[HiveOrganisationMembersAggregateInput!]" },
    OR: { __type: "[HiveOrganisationMembersAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveOrganisationMembersNodeAggregationWhereInput" },
  },
  HiveOrganisationMembersConnectFieldInput: {
    connect: { __type: "[HiveUserConnectInput!]" },
    where: { __type: "HiveUserConnectWhere" },
  },
  HiveOrganisationMembersConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveOrganisationMembersConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveUserConnectOrCreateWhere!" },
  },
  HiveOrganisationMembersConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveUserCreateInput!" },
  },
  HiveOrganisationMembersConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveOrganisationMembersRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveOrganisationMembersConnectionSort: { node: { __type: "HiveUserSort" } },
  HiveOrganisationMembersConnectionWhere: {
    AND: { __type: "[HiveOrganisationMembersConnectionWhere!]" },
    OR: { __type: "[HiveOrganisationMembersConnectionWhere!]" },
    node: { __type: "HiveUserWhere" },
    node_NOT: { __type: "HiveUserWhere" },
  },
  HiveOrganisationMembersCreateFieldInput: {
    node: { __type: "HiveUserCreateInput!" },
  },
  HiveOrganisationMembersDeleteFieldInput: {
    delete: { __type: "HiveUserDeleteInput" },
    where: { __type: "HiveOrganisationMembersConnectionWhere" },
  },
  HiveOrganisationMembersDisconnectFieldInput: {
    disconnect: { __type: "HiveUserDisconnectInput" },
    where: { __type: "HiveOrganisationMembersConnectionWhere" },
  },
  HiveOrganisationMembersFieldInput: {
    connect: { __type: "[HiveOrganisationMembersConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationMembersConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationMembersCreateFieldInput!]" },
  },
  HiveOrganisationMembersNodeAggregationWhereInput: {
    AND: { __type: "[HiveOrganisationMembersNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveOrganisationMembersNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    password_AVERAGE_EQUAL: { __type: "Float" },
    password_AVERAGE_GT: { __type: "Float" },
    password_AVERAGE_GTE: { __type: "Float" },
    password_AVERAGE_LT: { __type: "Float" },
    password_AVERAGE_LTE: { __type: "Float" },
    password_EQUAL: { __type: "String" },
    password_GT: { __type: "Int" },
    password_GTE: { __type: "Int" },
    password_LONGEST_EQUAL: { __type: "Int" },
    password_LONGEST_GT: { __type: "Int" },
    password_LONGEST_GTE: { __type: "Int" },
    password_LONGEST_LT: { __type: "Int" },
    password_LONGEST_LTE: { __type: "Int" },
    password_LT: { __type: "Int" },
    password_LTE: { __type: "Int" },
    password_SHORTEST_EQUAL: { __type: "Int" },
    password_SHORTEST_GT: { __type: "Int" },
    password_SHORTEST_GTE: { __type: "Int" },
    password_SHORTEST_LT: { __type: "Int" },
    password_SHORTEST_LTE: { __type: "Int" },
    username_AVERAGE_EQUAL: { __type: "Float" },
    username_AVERAGE_GT: { __type: "Float" },
    username_AVERAGE_GTE: { __type: "Float" },
    username_AVERAGE_LT: { __type: "Float" },
    username_AVERAGE_LTE: { __type: "Float" },
    username_EQUAL: { __type: "String" },
    username_GT: { __type: "Int" },
    username_GTE: { __type: "Int" },
    username_LONGEST_EQUAL: { __type: "Int" },
    username_LONGEST_GT: { __type: "Int" },
    username_LONGEST_GTE: { __type: "Int" },
    username_LONGEST_LT: { __type: "Int" },
    username_LONGEST_LTE: { __type: "Int" },
    username_LT: { __type: "Int" },
    username_LTE: { __type: "Int" },
    username_SHORTEST_EQUAL: { __type: "Int" },
    username_SHORTEST_GT: { __type: "Int" },
    username_SHORTEST_GTE: { __type: "Int" },
    username_SHORTEST_LT: { __type: "Int" },
    username_SHORTEST_LTE: { __type: "Int" },
  },
  HiveOrganisationMembersRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveUser!" },
  },
  HiveOrganisationMembersUpdateConnectionInput: {
    node: { __type: "HiveUserUpdateInput" },
  },
  HiveOrganisationMembersUpdateFieldInput: {
    connect: { __type: "[HiveOrganisationMembersConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationMembersConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationMembersCreateFieldInput!]" },
    delete: { __type: "[HiveOrganisationMembersDeleteFieldInput!]" },
    disconnect: { __type: "[HiveOrganisationMembersDisconnectFieldInput!]" },
    update: { __type: "HiveOrganisationMembersUpdateConnectionInput" },
    where: { __type: "HiveOrganisationMembersConnectionWhere" },
  },
  HiveOrganisationOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[HiveOrganisationSort]" },
  },
  HiveOrganisationPeopleAggregateInput: {
    AND: { __type: "[HiveOrganisationPeopleAggregateInput!]" },
    OR: { __type: "[HiveOrganisationPeopleAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveOrganisationPeopleNodeAggregationWhereInput" },
  },
  HiveOrganisationPeopleConnectFieldInput: {
    connect: { __type: "[PeopleConnectInput!]" },
    where: { __type: "PeopleConnectWhere" },
  },
  HiveOrganisationPeopleConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveOrganisationPeopleConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "PeopleConnectOrCreateWhere!" },
  },
  HiveOrganisationPeopleConnectOrCreateFieldInputOnCreate: {
    node: { __type: "PeopleCreateInput!" },
  },
  HiveOrganisationPeopleConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveOrganisationPeopleRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveOrganisationPeopleConnectionSort: { node: { __type: "PeopleSort" } },
  HiveOrganisationPeopleConnectionWhere: {
    AND: { __type: "[HiveOrganisationPeopleConnectionWhere!]" },
    OR: { __type: "[HiveOrganisationPeopleConnectionWhere!]" },
    node: { __type: "PeopleWhere" },
    node_NOT: { __type: "PeopleWhere" },
  },
  HiveOrganisationPeopleCreateFieldInput: {
    node: { __type: "PeopleCreateInput!" },
  },
  HiveOrganisationPeopleDeleteFieldInput: {
    delete: { __type: "PeopleDeleteInput" },
    where: { __type: "HiveOrganisationPeopleConnectionWhere" },
  },
  HiveOrganisationPeopleDisconnectFieldInput: {
    disconnect: { __type: "PeopleDisconnectInput" },
    where: { __type: "HiveOrganisationPeopleConnectionWhere" },
  },
  HiveOrganisationPeopleFieldInput: {
    connect: { __type: "[HiveOrganisationPeopleConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationPeopleConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationPeopleCreateFieldInput!]" },
  },
  HiveOrganisationPeopleNodeAggregationWhereInput: {
    AND: { __type: "[HiveOrganisationPeopleNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveOrganisationPeopleNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveOrganisationPeoplePeopleAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "HiveOrganisationPeoplePeopleNodeAggregateSelection" },
  },
  HiveOrganisationPeoplePeopleNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveOrganisationPeopleRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "People!" },
  },
  HiveOrganisationPeopleUpdateConnectionInput: {
    node: { __type: "PeopleUpdateInput" },
  },
  HiveOrganisationPeopleUpdateFieldInput: {
    connect: { __type: "[HiveOrganisationPeopleConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationPeopleConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationPeopleCreateFieldInput!]" },
    delete: { __type: "[HiveOrganisationPeopleDeleteFieldInput!]" },
    disconnect: { __type: "[HiveOrganisationPeopleDisconnectFieldInput!]" },
    update: { __type: "HiveOrganisationPeopleUpdateConnectionInput" },
    where: { __type: "HiveOrganisationPeopleConnectionWhere" },
  },
  HiveOrganisationProjectProjectsAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "HiveOrganisationProjectProjectsNodeAggregateSelection" },
  },
  HiveOrganisationProjectProjectsNodeAggregateSelection: {
    __typename: { __type: "String!" },
    endDate: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    startDate: { __type: "DateTimeAggregateSelection!" },
    status: { __type: "StringAggregateSelection!" },
  },
  HiveOrganisationProjectsAggregateInput: {
    AND: { __type: "[HiveOrganisationProjectsAggregateInput!]" },
    OR: { __type: "[HiveOrganisationProjectsAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveOrganisationProjectsNodeAggregationWhereInput" },
  },
  HiveOrganisationProjectsConnectFieldInput: {
    connect: { __type: "[ProjectConnectInput!]" },
    where: { __type: "ProjectConnectWhere" },
  },
  HiveOrganisationProjectsConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveOrganisationProjectsConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "ProjectConnectOrCreateWhere!" },
  },
  HiveOrganisationProjectsConnectOrCreateFieldInputOnCreate: {
    node: { __type: "ProjectCreateInput!" },
  },
  HiveOrganisationProjectsConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveOrganisationProjectsRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveOrganisationProjectsConnectionSort: { node: { __type: "ProjectSort" } },
  HiveOrganisationProjectsConnectionWhere: {
    AND: { __type: "[HiveOrganisationProjectsConnectionWhere!]" },
    OR: { __type: "[HiveOrganisationProjectsConnectionWhere!]" },
    node: { __type: "ProjectWhere" },
    node_NOT: { __type: "ProjectWhere" },
  },
  HiveOrganisationProjectsCreateFieldInput: {
    node: { __type: "ProjectCreateInput!" },
  },
  HiveOrganisationProjectsDeleteFieldInput: {
    delete: { __type: "ProjectDeleteInput" },
    where: { __type: "HiveOrganisationProjectsConnectionWhere" },
  },
  HiveOrganisationProjectsDisconnectFieldInput: {
    disconnect: { __type: "ProjectDisconnectInput" },
    where: { __type: "HiveOrganisationProjectsConnectionWhere" },
  },
  HiveOrganisationProjectsFieldInput: {
    connect: { __type: "[HiveOrganisationProjectsConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationProjectsConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationProjectsCreateFieldInput!]" },
  },
  HiveOrganisationProjectsNodeAggregationWhereInput: {
    AND: { __type: "[HiveOrganisationProjectsNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveOrganisationProjectsNodeAggregationWhereInput!]" },
    endDate_EQUAL: { __type: "DateTime" },
    endDate_GT: { __type: "DateTime" },
    endDate_GTE: { __type: "DateTime" },
    endDate_LT: { __type: "DateTime" },
    endDate_LTE: { __type: "DateTime" },
    endDate_MAX_EQUAL: { __type: "DateTime" },
    endDate_MAX_GT: { __type: "DateTime" },
    endDate_MAX_GTE: { __type: "DateTime" },
    endDate_MAX_LT: { __type: "DateTime" },
    endDate_MAX_LTE: { __type: "DateTime" },
    endDate_MIN_EQUAL: { __type: "DateTime" },
    endDate_MIN_GT: { __type: "DateTime" },
    endDate_MIN_GTE: { __type: "DateTime" },
    endDate_MIN_LT: { __type: "DateTime" },
    endDate_MIN_LTE: { __type: "DateTime" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    startDate_EQUAL: { __type: "DateTime" },
    startDate_GT: { __type: "DateTime" },
    startDate_GTE: { __type: "DateTime" },
    startDate_LT: { __type: "DateTime" },
    startDate_LTE: { __type: "DateTime" },
    startDate_MAX_EQUAL: { __type: "DateTime" },
    startDate_MAX_GT: { __type: "DateTime" },
    startDate_MAX_GTE: { __type: "DateTime" },
    startDate_MAX_LT: { __type: "DateTime" },
    startDate_MAX_LTE: { __type: "DateTime" },
    startDate_MIN_EQUAL: { __type: "DateTime" },
    startDate_MIN_GT: { __type: "DateTime" },
    startDate_MIN_GTE: { __type: "DateTime" },
    startDate_MIN_LT: { __type: "DateTime" },
    startDate_MIN_LTE: { __type: "DateTime" },
    status_AVERAGE_EQUAL: { __type: "Float" },
    status_AVERAGE_GT: { __type: "Float" },
    status_AVERAGE_GTE: { __type: "Float" },
    status_AVERAGE_LT: { __type: "Float" },
    status_AVERAGE_LTE: { __type: "Float" },
    status_EQUAL: { __type: "String" },
    status_GT: { __type: "Int" },
    status_GTE: { __type: "Int" },
    status_LONGEST_EQUAL: { __type: "Int" },
    status_LONGEST_GT: { __type: "Int" },
    status_LONGEST_GTE: { __type: "Int" },
    status_LONGEST_LT: { __type: "Int" },
    status_LONGEST_LTE: { __type: "Int" },
    status_LT: { __type: "Int" },
    status_LTE: { __type: "Int" },
    status_SHORTEST_EQUAL: { __type: "Int" },
    status_SHORTEST_GT: { __type: "Int" },
    status_SHORTEST_GTE: { __type: "Int" },
    status_SHORTEST_LT: { __type: "Int" },
    status_SHORTEST_LTE: { __type: "Int" },
  },
  HiveOrganisationProjectsRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "Project!" },
  },
  HiveOrganisationProjectsUpdateConnectionInput: {
    node: { __type: "ProjectUpdateInput" },
  },
  HiveOrganisationProjectsUpdateFieldInput: {
    connect: { __type: "[HiveOrganisationProjectsConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationProjectsConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationProjectsCreateFieldInput!]" },
    delete: { __type: "[HiveOrganisationProjectsDeleteFieldInput!]" },
    disconnect: { __type: "[HiveOrganisationProjectsDisconnectFieldInput!]" },
    update: { __type: "HiveOrganisationProjectsUpdateConnectionInput" },
    where: { __type: "HiveOrganisationProjectsConnectionWhere" },
  },
  HiveOrganisationRelationInput: {
    appliances: { __type: "[HiveOrganisationAppliancesCreateFieldInput!]" },
    equipment: { __type: "[HiveOrganisationEquipmentCreateFieldInput!]" },
    estimates: { __type: "[HiveOrganisationEstimatesCreateFieldInput!]" },
    integrations: { __type: "[HiveOrganisationIntegrationsCreateFieldInput!]" },
    members: { __type: "[HiveOrganisationMembersCreateFieldInput!]" },
    people: { __type: "[HiveOrganisationPeopleCreateFieldInput!]" },
    projects: { __type: "[HiveOrganisationProjectsCreateFieldInput!]" },
    roles: { __type: "[HiveOrganisationRolesCreateFieldInput!]" },
    schedule: { __type: "[HiveOrganisationScheduleCreateFieldInput!]" },
    timeline: { __type: "[HiveOrganisationTimelineCreateFieldInput!]" },
  },
  HiveOrganisationRoleRolesAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "HiveOrganisationRoleRolesNodeAggregateSelection" },
  },
  HiveOrganisationRoleRolesNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveOrganisationRolesAggregateInput: {
    AND: { __type: "[HiveOrganisationRolesAggregateInput!]" },
    OR: { __type: "[HiveOrganisationRolesAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveOrganisationRolesNodeAggregationWhereInput" },
  },
  HiveOrganisationRolesConnectFieldInput: {
    connect: { __type: "[RoleConnectInput!]" },
    where: { __type: "RoleConnectWhere" },
  },
  HiveOrganisationRolesConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveOrganisationRolesConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "RoleConnectOrCreateWhere!" },
  },
  HiveOrganisationRolesConnectOrCreateFieldInputOnCreate: {
    node: { __type: "RoleCreateInput!" },
  },
  HiveOrganisationRolesConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveOrganisationRolesRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveOrganisationRolesConnectionSort: { node: { __type: "RoleSort" } },
  HiveOrganisationRolesConnectionWhere: {
    AND: { __type: "[HiveOrganisationRolesConnectionWhere!]" },
    OR: { __type: "[HiveOrganisationRolesConnectionWhere!]" },
    node: { __type: "RoleWhere" },
    node_NOT: { __type: "RoleWhere" },
  },
  HiveOrganisationRolesCreateFieldInput: {
    node: { __type: "RoleCreateInput!" },
  },
  HiveOrganisationRolesDeleteFieldInput: {
    delete: { __type: "RoleDeleteInput" },
    where: { __type: "HiveOrganisationRolesConnectionWhere" },
  },
  HiveOrganisationRolesDisconnectFieldInput: {
    disconnect: { __type: "RoleDisconnectInput" },
    where: { __type: "HiveOrganisationRolesConnectionWhere" },
  },
  HiveOrganisationRolesFieldInput: {
    connect: { __type: "[HiveOrganisationRolesConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationRolesConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationRolesCreateFieldInput!]" },
  },
  HiveOrganisationRolesNodeAggregationWhereInput: {
    AND: { __type: "[HiveOrganisationRolesNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveOrganisationRolesNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveOrganisationRolesRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "Role!" },
  },
  HiveOrganisationRolesUpdateConnectionInput: {
    node: { __type: "RoleUpdateInput" },
  },
  HiveOrganisationRolesUpdateFieldInput: {
    connect: { __type: "[HiveOrganisationRolesConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationRolesConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationRolesCreateFieldInput!]" },
    delete: { __type: "[HiveOrganisationRolesDeleteFieldInput!]" },
    disconnect: { __type: "[HiveOrganisationRolesDisconnectFieldInput!]" },
    update: { __type: "HiveOrganisationRolesUpdateConnectionInput" },
    where: { __type: "HiveOrganisationRolesConnectionWhere" },
  },
  HiveOrganisationScheduleAggregateInput: {
    AND: { __type: "[HiveOrganisationScheduleAggregateInput!]" },
    OR: { __type: "[HiveOrganisationScheduleAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveOrganisationScheduleNodeAggregationWhereInput" },
  },
  HiveOrganisationScheduleConnectFieldInput: {
    connect: { __type: "[ScheduleItemConnectInput!]" },
    where: { __type: "ScheduleItemConnectWhere" },
  },
  HiveOrganisationScheduleConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveOrganisationScheduleConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "ScheduleItemConnectOrCreateWhere!" },
  },
  HiveOrganisationScheduleConnectOrCreateFieldInputOnCreate: {
    node: { __type: "ScheduleItemCreateInput!" },
  },
  HiveOrganisationScheduleConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveOrganisationScheduleRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveOrganisationScheduleConnectionSort: {
    node: { __type: "ScheduleItemSort" },
  },
  HiveOrganisationScheduleConnectionWhere: {
    AND: { __type: "[HiveOrganisationScheduleConnectionWhere!]" },
    OR: { __type: "[HiveOrganisationScheduleConnectionWhere!]" },
    node: { __type: "ScheduleItemWhere" },
    node_NOT: { __type: "ScheduleItemWhere" },
  },
  HiveOrganisationScheduleCreateFieldInput: {
    node: { __type: "ScheduleItemCreateInput!" },
  },
  HiveOrganisationScheduleDeleteFieldInput: {
    delete: { __type: "ScheduleItemDeleteInput" },
    where: { __type: "HiveOrganisationScheduleConnectionWhere" },
  },
  HiveOrganisationScheduleDisconnectFieldInput: {
    disconnect: { __type: "ScheduleItemDisconnectInput" },
    where: { __type: "HiveOrganisationScheduleConnectionWhere" },
  },
  HiveOrganisationScheduleFieldInput: {
    connect: { __type: "[HiveOrganisationScheduleConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationScheduleConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationScheduleCreateFieldInput!]" },
  },
  HiveOrganisationScheduleItemScheduleAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "HiveOrganisationScheduleItemScheduleNodeAggregateSelection",
    },
  },
  HiveOrganisationScheduleItemScheduleNodeAggregateSelection: {
    __typename: { __type: "String!" },
    date: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
  },
  HiveOrganisationScheduleNodeAggregationWhereInput: {
    AND: { __type: "[HiveOrganisationScheduleNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveOrganisationScheduleNodeAggregationWhereInput!]" },
    date_EQUAL: { __type: "DateTime" },
    date_GT: { __type: "DateTime" },
    date_GTE: { __type: "DateTime" },
    date_LT: { __type: "DateTime" },
    date_LTE: { __type: "DateTime" },
    date_MAX_EQUAL: { __type: "DateTime" },
    date_MAX_GT: { __type: "DateTime" },
    date_MAX_GTE: { __type: "DateTime" },
    date_MAX_LT: { __type: "DateTime" },
    date_MAX_LTE: { __type: "DateTime" },
    date_MIN_EQUAL: { __type: "DateTime" },
    date_MIN_GT: { __type: "DateTime" },
    date_MIN_GTE: { __type: "DateTime" },
    date_MIN_LT: { __type: "DateTime" },
    date_MIN_LTE: { __type: "DateTime" },
    id_EQUAL: { __type: "ID" },
  },
  HiveOrganisationScheduleRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "ScheduleItem!" },
  },
  HiveOrganisationScheduleUpdateConnectionInput: {
    node: { __type: "ScheduleItemUpdateInput" },
  },
  HiveOrganisationScheduleUpdateFieldInput: {
    connect: { __type: "[HiveOrganisationScheduleConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationScheduleConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationScheduleCreateFieldInput!]" },
    delete: { __type: "[HiveOrganisationScheduleDeleteFieldInput!]" },
    disconnect: { __type: "[HiveOrganisationScheduleDisconnectFieldInput!]" },
    update: { __type: "HiveOrganisationScheduleUpdateConnectionInput" },
    where: { __type: "HiveOrganisationScheduleConnectionWhere" },
  },
  HiveOrganisationSort: {
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
  },
  HiveOrganisationTimelineAggregateInput: {
    AND: { __type: "[HiveOrganisationTimelineAggregateInput!]" },
    OR: { __type: "[HiveOrganisationTimelineAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveOrganisationTimelineNodeAggregationWhereInput" },
  },
  HiveOrganisationTimelineConnectFieldInput: {
    connect: { __type: "[TimelineItemConnectInput!]" },
    where: { __type: "TimelineItemConnectWhere" },
  },
  HiveOrganisationTimelineConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveOrganisationTimelineConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "TimelineItemConnectOrCreateWhere!" },
  },
  HiveOrganisationTimelineConnectOrCreateFieldInputOnCreate: {
    node: { __type: "TimelineItemCreateInput!" },
  },
  HiveOrganisationTimelineConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveOrganisationTimelineRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveOrganisationTimelineConnectionSort: {
    node: { __type: "TimelineItemSort" },
  },
  HiveOrganisationTimelineConnectionWhere: {
    AND: { __type: "[HiveOrganisationTimelineConnectionWhere!]" },
    OR: { __type: "[HiveOrganisationTimelineConnectionWhere!]" },
    node: { __type: "TimelineItemWhere" },
    node_NOT: { __type: "TimelineItemWhere" },
  },
  HiveOrganisationTimelineCreateFieldInput: {
    node: { __type: "TimelineItemCreateInput!" },
  },
  HiveOrganisationTimelineDeleteFieldInput: {
    delete: { __type: "TimelineItemDeleteInput" },
    where: { __type: "HiveOrganisationTimelineConnectionWhere" },
  },
  HiveOrganisationTimelineDisconnectFieldInput: {
    disconnect: { __type: "TimelineItemDisconnectInput" },
    where: { __type: "HiveOrganisationTimelineConnectionWhere" },
  },
  HiveOrganisationTimelineFieldInput: {
    connect: { __type: "[HiveOrganisationTimelineConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationTimelineConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationTimelineCreateFieldInput!]" },
  },
  HiveOrganisationTimelineItemTimelineAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "HiveOrganisationTimelineItemTimelineNodeAggregateSelection",
    },
  },
  HiveOrganisationTimelineItemTimelineNodeAggregateSelection: {
    __typename: { __type: "String!" },
    endDate: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    notes: { __type: "StringAggregateSelection!" },
    startDate: { __type: "DateTimeAggregateSelection!" },
    timeline: { __type: "StringAggregateSelection!" },
  },
  HiveOrganisationTimelineNodeAggregationWhereInput: {
    AND: { __type: "[HiveOrganisationTimelineNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveOrganisationTimelineNodeAggregationWhereInput!]" },
    endDate_EQUAL: { __type: "DateTime" },
    endDate_GT: { __type: "DateTime" },
    endDate_GTE: { __type: "DateTime" },
    endDate_LT: { __type: "DateTime" },
    endDate_LTE: { __type: "DateTime" },
    endDate_MAX_EQUAL: { __type: "DateTime" },
    endDate_MAX_GT: { __type: "DateTime" },
    endDate_MAX_GTE: { __type: "DateTime" },
    endDate_MAX_LT: { __type: "DateTime" },
    endDate_MAX_LTE: { __type: "DateTime" },
    endDate_MIN_EQUAL: { __type: "DateTime" },
    endDate_MIN_GT: { __type: "DateTime" },
    endDate_MIN_GTE: { __type: "DateTime" },
    endDate_MIN_LT: { __type: "DateTime" },
    endDate_MIN_LTE: { __type: "DateTime" },
    id_EQUAL: { __type: "ID" },
    notes_AVERAGE_EQUAL: { __type: "Float" },
    notes_AVERAGE_GT: { __type: "Float" },
    notes_AVERAGE_GTE: { __type: "Float" },
    notes_AVERAGE_LT: { __type: "Float" },
    notes_AVERAGE_LTE: { __type: "Float" },
    notes_EQUAL: { __type: "String" },
    notes_GT: { __type: "Int" },
    notes_GTE: { __type: "Int" },
    notes_LONGEST_EQUAL: { __type: "Int" },
    notes_LONGEST_GT: { __type: "Int" },
    notes_LONGEST_GTE: { __type: "Int" },
    notes_LONGEST_LT: { __type: "Int" },
    notes_LONGEST_LTE: { __type: "Int" },
    notes_LT: { __type: "Int" },
    notes_LTE: { __type: "Int" },
    notes_SHORTEST_EQUAL: { __type: "Int" },
    notes_SHORTEST_GT: { __type: "Int" },
    notes_SHORTEST_GTE: { __type: "Int" },
    notes_SHORTEST_LT: { __type: "Int" },
    notes_SHORTEST_LTE: { __type: "Int" },
    startDate_EQUAL: { __type: "DateTime" },
    startDate_GT: { __type: "DateTime" },
    startDate_GTE: { __type: "DateTime" },
    startDate_LT: { __type: "DateTime" },
    startDate_LTE: { __type: "DateTime" },
    startDate_MAX_EQUAL: { __type: "DateTime" },
    startDate_MAX_GT: { __type: "DateTime" },
    startDate_MAX_GTE: { __type: "DateTime" },
    startDate_MAX_LT: { __type: "DateTime" },
    startDate_MAX_LTE: { __type: "DateTime" },
    startDate_MIN_EQUAL: { __type: "DateTime" },
    startDate_MIN_GT: { __type: "DateTime" },
    startDate_MIN_GTE: { __type: "DateTime" },
    startDate_MIN_LT: { __type: "DateTime" },
    startDate_MIN_LTE: { __type: "DateTime" },
    timeline_AVERAGE_EQUAL: { __type: "Float" },
    timeline_AVERAGE_GT: { __type: "Float" },
    timeline_AVERAGE_GTE: { __type: "Float" },
    timeline_AVERAGE_LT: { __type: "Float" },
    timeline_AVERAGE_LTE: { __type: "Float" },
    timeline_EQUAL: { __type: "String" },
    timeline_GT: { __type: "Int" },
    timeline_GTE: { __type: "Int" },
    timeline_LONGEST_EQUAL: { __type: "Int" },
    timeline_LONGEST_GT: { __type: "Int" },
    timeline_LONGEST_GTE: { __type: "Int" },
    timeline_LONGEST_LT: { __type: "Int" },
    timeline_LONGEST_LTE: { __type: "Int" },
    timeline_LT: { __type: "Int" },
    timeline_LTE: { __type: "Int" },
    timeline_SHORTEST_EQUAL: { __type: "Int" },
    timeline_SHORTEST_GT: { __type: "Int" },
    timeline_SHORTEST_GTE: { __type: "Int" },
    timeline_SHORTEST_LT: { __type: "Int" },
    timeline_SHORTEST_LTE: { __type: "Int" },
  },
  HiveOrganisationTimelineRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "TimelineItem!" },
  },
  HiveOrganisationTimelineUpdateConnectionInput: {
    node: { __type: "TimelineItemUpdateInput" },
  },
  HiveOrganisationTimelineUpdateFieldInput: {
    connect: { __type: "[HiveOrganisationTimelineConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[HiveOrganisationTimelineConnectOrCreateFieldInput!]",
    },
    create: { __type: "[HiveOrganisationTimelineCreateFieldInput!]" },
    delete: { __type: "[HiveOrganisationTimelineDeleteFieldInput!]" },
    disconnect: { __type: "[HiveOrganisationTimelineDisconnectFieldInput!]" },
    update: { __type: "HiveOrganisationTimelineUpdateConnectionInput" },
    where: { __type: "HiveOrganisationTimelineConnectionWhere" },
  },
  HiveOrganisationUniqueWhere: { id: { __type: "ID" } },
  HiveOrganisationUpdateInput: {
    appliances: { __type: "[HiveOrganisationAppliancesUpdateFieldInput!]" },
    equipment: { __type: "[HiveOrganisationEquipmentUpdateFieldInput!]" },
    estimates: { __type: "[HiveOrganisationEstimatesUpdateFieldInput!]" },
    integrations: { __type: "[HiveOrganisationIntegrationsUpdateFieldInput!]" },
    members: { __type: "[HiveOrganisationMembersUpdateFieldInput!]" },
    name: { __type: "String" },
    people: { __type: "[HiveOrganisationPeopleUpdateFieldInput!]" },
    projects: { __type: "[HiveOrganisationProjectsUpdateFieldInput!]" },
    roles: { __type: "[HiveOrganisationRolesUpdateFieldInput!]" },
    schedule: { __type: "[HiveOrganisationScheduleUpdateFieldInput!]" },
    timeline: { __type: "[HiveOrganisationTimelineUpdateFieldInput!]" },
  },
  HiveOrganisationWhere: {
    AND: { __type: "[HiveOrganisationWhere!]" },
    OR: { __type: "[HiveOrganisationWhere!]" },
    appliances: { __type: "HiveApplianceWhere" },
    appliancesAggregate: { __type: "HiveOrganisationAppliancesAggregateInput" },
    appliancesConnection: {
      __type: "HiveOrganisationAppliancesConnectionWhere",
    },
    appliancesConnection_NOT: {
      __type: "HiveOrganisationAppliancesConnectionWhere",
    },
    appliances_NOT: { __type: "HiveApplianceWhere" },
    equipment: { __type: "EquipmentWhere" },
    equipmentAggregate: { __type: "HiveOrganisationEquipmentAggregateInput" },
    equipmentConnection: { __type: "HiveOrganisationEquipmentConnectionWhere" },
    equipmentConnection_NOT: {
      __type: "HiveOrganisationEquipmentConnectionWhere",
    },
    equipment_NOT: { __type: "EquipmentWhere" },
    estimates: { __type: "EstimateWhere" },
    estimatesAggregate: { __type: "HiveOrganisationEstimatesAggregateInput" },
    estimatesConnection: { __type: "HiveOrganisationEstimatesConnectionWhere" },
    estimatesConnection_NOT: {
      __type: "HiveOrganisationEstimatesConnectionWhere",
    },
    estimates_NOT: { __type: "EstimateWhere" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    integrations: { __type: "HiveIntegrationInstanceWhere" },
    integrationsAggregate: {
      __type: "HiveOrganisationIntegrationsAggregateInput",
    },
    integrationsConnection: {
      __type: "HiveOrganisationIntegrationsConnectionWhere",
    },
    integrationsConnection_NOT: {
      __type: "HiveOrganisationIntegrationsConnectionWhere",
    },
    integrations_NOT: { __type: "HiveIntegrationInstanceWhere" },
    members: { __type: "HiveUserWhere" },
    membersAggregate: { __type: "HiveOrganisationMembersAggregateInput" },
    membersConnection: { __type: "HiveOrganisationMembersConnectionWhere" },
    membersConnection_NOT: { __type: "HiveOrganisationMembersConnectionWhere" },
    members_NOT: { __type: "HiveUserWhere" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    people: { __type: "PeopleWhere" },
    peopleAggregate: { __type: "HiveOrganisationPeopleAggregateInput" },
    peopleConnection: { __type: "HiveOrganisationPeopleConnectionWhere" },
    peopleConnection_NOT: { __type: "HiveOrganisationPeopleConnectionWhere" },
    people_NOT: { __type: "PeopleWhere" },
    projects: { __type: "ProjectWhere" },
    projectsAggregate: { __type: "HiveOrganisationProjectsAggregateInput" },
    projectsConnection: { __type: "HiveOrganisationProjectsConnectionWhere" },
    projectsConnection_NOT: {
      __type: "HiveOrganisationProjectsConnectionWhere",
    },
    projects_NOT: { __type: "ProjectWhere" },
    roles: { __type: "RoleWhere" },
    rolesAggregate: { __type: "HiveOrganisationRolesAggregateInput" },
    rolesConnection: { __type: "HiveOrganisationRolesConnectionWhere" },
    rolesConnection_NOT: { __type: "HiveOrganisationRolesConnectionWhere" },
    roles_NOT: { __type: "RoleWhere" },
    schedule: { __type: "ScheduleItemWhere" },
    scheduleAggregate: { __type: "HiveOrganisationScheduleAggregateInput" },
    scheduleConnection: { __type: "HiveOrganisationScheduleConnectionWhere" },
    scheduleConnection_NOT: {
      __type: "HiveOrganisationScheduleConnectionWhere",
    },
    schedule_NOT: { __type: "ScheduleItemWhere" },
    timeline: { __type: "TimelineItemWhere" },
    timelineAggregate: { __type: "HiveOrganisationTimelineAggregateInput" },
    timelineConnection: { __type: "HiveOrganisationTimelineConnectionWhere" },
    timelineConnection_NOT: {
      __type: "HiveOrganisationTimelineConnectionWhere",
    },
    timeline_NOT: { __type: "TimelineItemWhere" },
  },
  HiveService: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    name: { __type: "String" },
  },
  HiveServiceAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveServiceConnectWhere: { node: { __type: "HiveServiceWhere!" } },
  HiveServiceCreateInput: { id: { __type: "ID!" }, name: { __type: "String" } },
  HiveServiceOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[HiveServiceSort]" },
  },
  HiveServiceSort: {
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
  },
  HiveServiceUpdateInput: { id: { __type: "ID" }, name: { __type: "String" } },
  HiveServiceWhere: {
    AND: { __type: "[HiveServiceWhere!]" },
    OR: { __type: "[HiveServiceWhere!]" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
  },
  HiveType: {
    __typename: { __type: "String!" },
    fields: {
      __type: "[HiveTypeField]",
      __args: { options: "HiveTypeFieldOptions", where: "HiveTypeFieldWhere" },
    },
    fieldsAggregate: {
      __type: "HiveTypeHiveTypeFieldFieldsAggregationSelection",
      __args: { where: "HiveTypeFieldWhere" },
    },
    fieldsConnection: {
      __type: "HiveTypeFieldsConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveTypeFieldsConnectionSort!]",
        where: "HiveTypeFieldsConnectionWhere",
      },
    },
    id: { __type: "ID!" },
    name: { __type: "String" },
    usedIn: {
      __type: "[HiveAppliance]",
      __args: { options: "HiveApplianceOptions", where: "HiveApplianceWhere" },
    },
    usedInAggregate: {
      __type: "HiveTypeHiveApplianceUsedInAggregationSelection",
      __args: { where: "HiveApplianceWhere" },
    },
    usedInConnection: {
      __type: "HiveTypeUsedInConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveTypeUsedInConnectionSort!]",
        where: "HiveTypeUsedInConnectionWhere",
      },
    },
  },
  HiveTypeAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveTypeConnectInput: {
    fields: { __type: "[HiveTypeFieldsConnectFieldInput!]" },
    usedIn: { __type: "[HiveTypeUsedInConnectFieldInput!]" },
  },
  HiveTypeConnectOrCreateInput: {
    fields: { __type: "[HiveTypeFieldsConnectOrCreateFieldInput!]" },
    usedIn: { __type: "[HiveTypeUsedInConnectOrCreateFieldInput!]" },
  },
  HiveTypeConnectOrCreateWhere: { node: { __type: "HiveTypeUniqueWhere!" } },
  HiveTypeConnectWhere: { node: { __type: "HiveTypeWhere!" } },
  HiveTypeCreateInput: {
    fields: { __type: "HiveTypeFieldsFieldInput" },
    name: { __type: "String" },
    usedIn: { __type: "HiveTypeUsedInFieldInput" },
  },
  HiveTypeDeleteInput: {
    fields: { __type: "[HiveTypeFieldsDeleteFieldInput!]" },
    usedIn: { __type: "[HiveTypeUsedInDeleteFieldInput!]" },
  },
  HiveTypeDisconnectInput: {
    fields: { __type: "[HiveTypeFieldsDisconnectFieldInput!]" },
    usedIn: { __type: "[HiveTypeUsedInDisconnectFieldInput!]" },
  },
  HiveTypeField: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    name: { __type: "String" },
    type: { __type: "String" },
  },
  HiveTypeFieldAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    type: { __type: "StringAggregateSelection!" },
  },
  HiveTypeFieldConnectOrCreateWhere: {
    node: { __type: "HiveTypeFieldUniqueWhere!" },
  },
  HiveTypeFieldConnectWhere: { node: { __type: "HiveTypeFieldWhere!" } },
  HiveTypeFieldCreateInput: {
    name: { __type: "String" },
    type: { __type: "String" },
  },
  HiveTypeFieldOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[HiveTypeFieldSort]" },
  },
  HiveTypeFieldSort: {
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
    type: { __type: "SortDirection" },
  },
  HiveTypeFieldUniqueWhere: { id: { __type: "ID" } },
  HiveTypeFieldUpdateInput: {
    name: { __type: "String" },
    type: { __type: "String" },
  },
  HiveTypeFieldWhere: {
    AND: { __type: "[HiveTypeFieldWhere!]" },
    OR: { __type: "[HiveTypeFieldWhere!]" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    type: { __type: "String" },
    type_CONTAINS: { __type: "String" },
    type_ENDS_WITH: { __type: "String" },
    type_IN: { __type: "[String]" },
    type_NOT: { __type: "String" },
    type_NOT_CONTAINS: { __type: "String" },
    type_NOT_ENDS_WITH: { __type: "String" },
    type_NOT_IN: { __type: "[String]" },
    type_NOT_STARTS_WITH: { __type: "String" },
    type_STARTS_WITH: { __type: "String" },
  },
  HiveTypeFieldsAggregateInput: {
    AND: { __type: "[HiveTypeFieldsAggregateInput!]" },
    OR: { __type: "[HiveTypeFieldsAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveTypeFieldsNodeAggregationWhereInput" },
  },
  HiveTypeFieldsConnectFieldInput: {
    where: { __type: "HiveTypeFieldConnectWhere" },
  },
  HiveTypeFieldsConnectOrCreateFieldInput: {
    onCreate: { __type: "HiveTypeFieldsConnectOrCreateFieldInputOnCreate!" },
    where: { __type: "HiveTypeFieldConnectOrCreateWhere!" },
  },
  HiveTypeFieldsConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveTypeFieldCreateInput!" },
  },
  HiveTypeFieldsConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveTypeFieldsRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveTypeFieldsConnectionSort: { node: { __type: "HiveTypeFieldSort" } },
  HiveTypeFieldsConnectionWhere: {
    AND: { __type: "[HiveTypeFieldsConnectionWhere!]" },
    OR: { __type: "[HiveTypeFieldsConnectionWhere!]" },
    node: { __type: "HiveTypeFieldWhere" },
    node_NOT: { __type: "HiveTypeFieldWhere" },
  },
  HiveTypeFieldsCreateFieldInput: {
    node: { __type: "HiveTypeFieldCreateInput!" },
  },
  HiveTypeFieldsDeleteFieldInput: {
    where: { __type: "HiveTypeFieldsConnectionWhere" },
  },
  HiveTypeFieldsDisconnectFieldInput: {
    where: { __type: "HiveTypeFieldsConnectionWhere" },
  },
  HiveTypeFieldsFieldInput: {
    connect: { __type: "[HiveTypeFieldsConnectFieldInput!]" },
    connectOrCreate: { __type: "[HiveTypeFieldsConnectOrCreateFieldInput!]" },
    create: { __type: "[HiveTypeFieldsCreateFieldInput!]" },
  },
  HiveTypeFieldsNodeAggregationWhereInput: {
    AND: { __type: "[HiveTypeFieldsNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveTypeFieldsNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    type_AVERAGE_EQUAL: { __type: "Float" },
    type_AVERAGE_GT: { __type: "Float" },
    type_AVERAGE_GTE: { __type: "Float" },
    type_AVERAGE_LT: { __type: "Float" },
    type_AVERAGE_LTE: { __type: "Float" },
    type_EQUAL: { __type: "String" },
    type_GT: { __type: "Int" },
    type_GTE: { __type: "Int" },
    type_LONGEST_EQUAL: { __type: "Int" },
    type_LONGEST_GT: { __type: "Int" },
    type_LONGEST_GTE: { __type: "Int" },
    type_LONGEST_LT: { __type: "Int" },
    type_LONGEST_LTE: { __type: "Int" },
    type_LT: { __type: "Int" },
    type_LTE: { __type: "Int" },
    type_SHORTEST_EQUAL: { __type: "Int" },
    type_SHORTEST_GT: { __type: "Int" },
    type_SHORTEST_GTE: { __type: "Int" },
    type_SHORTEST_LT: { __type: "Int" },
    type_SHORTEST_LTE: { __type: "Int" },
  },
  HiveTypeFieldsRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveTypeField!" },
  },
  HiveTypeFieldsUpdateConnectionInput: {
    node: { __type: "HiveTypeFieldUpdateInput" },
  },
  HiveTypeFieldsUpdateFieldInput: {
    connect: { __type: "[HiveTypeFieldsConnectFieldInput!]" },
    connectOrCreate: { __type: "[HiveTypeFieldsConnectOrCreateFieldInput!]" },
    create: { __type: "[HiveTypeFieldsCreateFieldInput!]" },
    delete: { __type: "[HiveTypeFieldsDeleteFieldInput!]" },
    disconnect: { __type: "[HiveTypeFieldsDisconnectFieldInput!]" },
    update: { __type: "HiveTypeFieldsUpdateConnectionInput" },
    where: { __type: "HiveTypeFieldsConnectionWhere" },
  },
  HiveTypeHiveApplianceUsedInAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "HiveTypeHiveApplianceUsedInNodeAggregateSelection" },
  },
  HiveTypeHiveApplianceUsedInNodeAggregateSelection: {
    __typename: { __type: "String!" },
    description: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    label: { __type: "StringAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveTypeHiveTypeFieldFieldsAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "HiveTypeHiveTypeFieldFieldsNodeAggregateSelection" },
  },
  HiveTypeHiveTypeFieldFieldsNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    type: { __type: "StringAggregateSelection!" },
  },
  HiveTypeOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[HiveTypeSort]" },
  },
  HiveTypeRelationInput: {
    fields: { __type: "[HiveTypeFieldsCreateFieldInput!]" },
    usedIn: { __type: "[HiveTypeUsedInCreateFieldInput!]" },
  },
  HiveTypeSort: {
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
  },
  HiveTypeUniqueWhere: { id: { __type: "ID" } },
  HiveTypeUpdateInput: {
    fields: { __type: "[HiveTypeFieldsUpdateFieldInput!]" },
    name: { __type: "String" },
    usedIn: { __type: "[HiveTypeUsedInUpdateFieldInput!]" },
  },
  HiveTypeUsedInAggregateInput: {
    AND: { __type: "[HiveTypeUsedInAggregateInput!]" },
    OR: { __type: "[HiveTypeUsedInAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveTypeUsedInNodeAggregationWhereInput" },
  },
  HiveTypeUsedInConnectFieldInput: {
    connect: { __type: "[HiveApplianceConnectInput!]" },
    where: { __type: "HiveApplianceConnectWhere" },
  },
  HiveTypeUsedInConnectOrCreateFieldInput: {
    onCreate: { __type: "HiveTypeUsedInConnectOrCreateFieldInputOnCreate!" },
    where: { __type: "HiveApplianceConnectOrCreateWhere!" },
  },
  HiveTypeUsedInConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveApplianceCreateInput!" },
  },
  HiveTypeUsedInConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveTypeUsedInRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveTypeUsedInConnectionSort: { node: { __type: "HiveApplianceSort" } },
  HiveTypeUsedInConnectionWhere: {
    AND: { __type: "[HiveTypeUsedInConnectionWhere!]" },
    OR: { __type: "[HiveTypeUsedInConnectionWhere!]" },
    node: { __type: "HiveApplianceWhere" },
    node_NOT: { __type: "HiveApplianceWhere" },
  },
  HiveTypeUsedInCreateFieldInput: {
    node: { __type: "HiveApplianceCreateInput!" },
  },
  HiveTypeUsedInDeleteFieldInput: {
    delete: { __type: "HiveApplianceDeleteInput" },
    where: { __type: "HiveTypeUsedInConnectionWhere" },
  },
  HiveTypeUsedInDisconnectFieldInput: {
    disconnect: { __type: "HiveApplianceDisconnectInput" },
    where: { __type: "HiveTypeUsedInConnectionWhere" },
  },
  HiveTypeUsedInFieldInput: {
    connect: { __type: "[HiveTypeUsedInConnectFieldInput!]" },
    connectOrCreate: { __type: "[HiveTypeUsedInConnectOrCreateFieldInput!]" },
    create: { __type: "[HiveTypeUsedInCreateFieldInput!]" },
  },
  HiveTypeUsedInNodeAggregationWhereInput: {
    AND: { __type: "[HiveTypeUsedInNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveTypeUsedInNodeAggregationWhereInput!]" },
    description_AVERAGE_EQUAL: { __type: "Float" },
    description_AVERAGE_GT: { __type: "Float" },
    description_AVERAGE_GTE: { __type: "Float" },
    description_AVERAGE_LT: { __type: "Float" },
    description_AVERAGE_LTE: { __type: "Float" },
    description_EQUAL: { __type: "String" },
    description_GT: { __type: "Int" },
    description_GTE: { __type: "Int" },
    description_LONGEST_EQUAL: { __type: "Int" },
    description_LONGEST_GT: { __type: "Int" },
    description_LONGEST_GTE: { __type: "Int" },
    description_LONGEST_LT: { __type: "Int" },
    description_LONGEST_LTE: { __type: "Int" },
    description_LT: { __type: "Int" },
    description_LTE: { __type: "Int" },
    description_SHORTEST_EQUAL: { __type: "Int" },
    description_SHORTEST_GT: { __type: "Int" },
    description_SHORTEST_GTE: { __type: "Int" },
    description_SHORTEST_LT: { __type: "Int" },
    description_SHORTEST_LTE: { __type: "Int" },
    id_EQUAL: { __type: "ID" },
    label_AVERAGE_EQUAL: { __type: "Float" },
    label_AVERAGE_GT: { __type: "Float" },
    label_AVERAGE_GTE: { __type: "Float" },
    label_AVERAGE_LT: { __type: "Float" },
    label_AVERAGE_LTE: { __type: "Float" },
    label_EQUAL: { __type: "String" },
    label_GT: { __type: "Int" },
    label_GTE: { __type: "Int" },
    label_LONGEST_EQUAL: { __type: "Int" },
    label_LONGEST_GT: { __type: "Int" },
    label_LONGEST_GTE: { __type: "Int" },
    label_LONGEST_LT: { __type: "Int" },
    label_LONGEST_LTE: { __type: "Int" },
    label_LT: { __type: "Int" },
    label_LTE: { __type: "Int" },
    label_SHORTEST_EQUAL: { __type: "Int" },
    label_SHORTEST_GT: { __type: "Int" },
    label_SHORTEST_GTE: { __type: "Int" },
    label_SHORTEST_LT: { __type: "Int" },
    label_SHORTEST_LTE: { __type: "Int" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveTypeUsedInRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveAppliance!" },
  },
  HiveTypeUsedInUpdateConnectionInput: {
    node: { __type: "HiveApplianceUpdateInput" },
  },
  HiveTypeUsedInUpdateFieldInput: {
    connect: { __type: "[HiveTypeUsedInConnectFieldInput!]" },
    connectOrCreate: { __type: "[HiveTypeUsedInConnectOrCreateFieldInput!]" },
    create: { __type: "[HiveTypeUsedInCreateFieldInput!]" },
    delete: { __type: "[HiveTypeUsedInDeleteFieldInput!]" },
    disconnect: { __type: "[HiveTypeUsedInDisconnectFieldInput!]" },
    update: { __type: "HiveTypeUsedInUpdateConnectionInput" },
    where: { __type: "HiveTypeUsedInConnectionWhere" },
  },
  HiveTypeWhere: {
    AND: { __type: "[HiveTypeWhere!]" },
    OR: { __type: "[HiveTypeWhere!]" },
    fields: { __type: "HiveTypeFieldWhere" },
    fieldsAggregate: { __type: "HiveTypeFieldsAggregateInput" },
    fieldsConnection: { __type: "HiveTypeFieldsConnectionWhere" },
    fieldsConnection_NOT: { __type: "HiveTypeFieldsConnectionWhere" },
    fields_NOT: { __type: "HiveTypeFieldWhere" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    usedIn: { __type: "HiveApplianceWhere" },
    usedInAggregate: { __type: "HiveTypeUsedInAggregateInput" },
    usedInConnection: { __type: "HiveTypeUsedInConnectionWhere" },
    usedInConnection_NOT: { __type: "HiveTypeUsedInConnectionWhere" },
    usedIn_NOT: { __type: "HiveApplianceWhere" },
  },
  HiveUser: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    name: { __type: "String" },
    organisation: {
      __type: "HiveOrganisation",
      __args: {
        options: "HiveOrganisationOptions",
        where: "HiveOrganisationWhere",
      },
    },
    organisationAggregate: {
      __type: "HiveUserHiveOrganisationOrganisationAggregationSelection",
      __args: { where: "HiveOrganisationWhere" },
    },
    organisationConnection: {
      __type: "HiveUserOrganisationConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveUserOrganisationConnectionSort!]",
        where: "HiveUserOrganisationConnectionWhere",
      },
    },
    password: { __type: "String" },
    roles: {
      __type: "[Role]",
      __args: { options: "RoleOptions", where: "RoleWhere" },
    },
    rolesAggregate: {
      __type: "HiveUserRoleRolesAggregationSelection",
      __args: { where: "RoleWhere" },
    },
    rolesConnection: {
      __type: "HiveUserRolesConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[HiveUserRolesConnectionSort!]",
        where: "HiveUserRolesConnectionWhere",
      },
    },
    username: { __type: "String" },
  },
  HiveUserAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    password: { __type: "StringAggregateSelection!" },
    username: { __type: "StringAggregateSelection!" },
  },
  HiveUserConnectInput: {
    organisation: { __type: "HiveUserOrganisationConnectFieldInput" },
    roles: { __type: "[HiveUserRolesConnectFieldInput!]" },
  },
  HiveUserConnectOrCreateInput: {
    organisation: { __type: "HiveUserOrganisationConnectOrCreateFieldInput" },
    roles: { __type: "[HiveUserRolesConnectOrCreateFieldInput!]" },
  },
  HiveUserConnectOrCreateWhere: { node: { __type: "HiveUserUniqueWhere!" } },
  HiveUserConnectWhere: { node: { __type: "HiveUserWhere!" } },
  HiveUserCreateInput: {
    name: { __type: "String" },
    organisation: { __type: "HiveUserOrganisationFieldInput" },
    password: { __type: "String" },
    roles: { __type: "HiveUserRolesFieldInput" },
    username: { __type: "String" },
  },
  HiveUserDeleteInput: {
    organisation: { __type: "HiveUserOrganisationDeleteFieldInput" },
    roles: { __type: "[HiveUserRolesDeleteFieldInput!]" },
  },
  HiveUserDisconnectInput: {
    organisation: { __type: "HiveUserOrganisationDisconnectFieldInput" },
    roles: { __type: "[HiveUserRolesDisconnectFieldInput!]" },
  },
  HiveUserHiveOrganisationOrganisationAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "HiveUserHiveOrganisationOrganisationNodeAggregateSelection",
    },
  },
  HiveUserHiveOrganisationOrganisationNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveUserOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[HiveUserSort]" },
  },
  HiveUserOrganisationAggregateInput: {
    AND: { __type: "[HiveUserOrganisationAggregateInput!]" },
    OR: { __type: "[HiveUserOrganisationAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveUserOrganisationNodeAggregationWhereInput" },
  },
  HiveUserOrganisationConnectFieldInput: {
    connect: { __type: "HiveOrganisationConnectInput" },
    where: { __type: "HiveOrganisationConnectWhere" },
  },
  HiveUserOrganisationConnectOrCreateFieldInput: {
    onCreate: {
      __type: "HiveUserOrganisationConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveOrganisationConnectOrCreateWhere!" },
  },
  HiveUserOrganisationConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  HiveUserOrganisationConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveUserOrganisationRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveUserOrganisationConnectionSort: {
    node: { __type: "HiveOrganisationSort" },
  },
  HiveUserOrganisationConnectionWhere: {
    AND: { __type: "[HiveUserOrganisationConnectionWhere!]" },
    OR: { __type: "[HiveUserOrganisationConnectionWhere!]" },
    node: { __type: "HiveOrganisationWhere" },
    node_NOT: { __type: "HiveOrganisationWhere" },
  },
  HiveUserOrganisationCreateFieldInput: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  HiveUserOrganisationDeleteFieldInput: {
    delete: { __type: "HiveOrganisationDeleteInput" },
    where: { __type: "HiveUserOrganisationConnectionWhere" },
  },
  HiveUserOrganisationDisconnectFieldInput: {
    disconnect: { __type: "HiveOrganisationDisconnectInput" },
    where: { __type: "HiveUserOrganisationConnectionWhere" },
  },
  HiveUserOrganisationFieldInput: {
    connect: { __type: "HiveUserOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "HiveUserOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "HiveUserOrganisationCreateFieldInput" },
  },
  HiveUserOrganisationNodeAggregationWhereInput: {
    AND: { __type: "[HiveUserOrganisationNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveUserOrganisationNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveUserOrganisationRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveOrganisation!" },
  },
  HiveUserOrganisationUpdateConnectionInput: {
    node: { __type: "HiveOrganisationUpdateInput" },
  },
  HiveUserOrganisationUpdateFieldInput: {
    connect: { __type: "HiveUserOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "HiveUserOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "HiveUserOrganisationCreateFieldInput" },
    delete: { __type: "HiveUserOrganisationDeleteFieldInput" },
    disconnect: { __type: "HiveUserOrganisationDisconnectFieldInput" },
    update: { __type: "HiveUserOrganisationUpdateConnectionInput" },
    where: { __type: "HiveUserOrganisationConnectionWhere" },
  },
  HiveUserRelationInput: {
    organisation: { __type: "HiveUserOrganisationCreateFieldInput" },
    roles: { __type: "[HiveUserRolesCreateFieldInput!]" },
  },
  HiveUserRoleRolesAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "HiveUserRoleRolesNodeAggregateSelection" },
  },
  HiveUserRoleRolesNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  HiveUserRolesAggregateInput: {
    AND: { __type: "[HiveUserRolesAggregateInput!]" },
    OR: { __type: "[HiveUserRolesAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "HiveUserRolesNodeAggregationWhereInput" },
  },
  HiveUserRolesConnectFieldInput: {
    connect: { __type: "[RoleConnectInput!]" },
    where: { __type: "RoleConnectWhere" },
  },
  HiveUserRolesConnectOrCreateFieldInput: {
    onCreate: { __type: "HiveUserRolesConnectOrCreateFieldInputOnCreate!" },
    where: { __type: "RoleConnectOrCreateWhere!" },
  },
  HiveUserRolesConnectOrCreateFieldInputOnCreate: {
    node: { __type: "RoleCreateInput!" },
  },
  HiveUserRolesConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[HiveUserRolesRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  HiveUserRolesConnectionSort: { node: { __type: "RoleSort" } },
  HiveUserRolesConnectionWhere: {
    AND: { __type: "[HiveUserRolesConnectionWhere!]" },
    OR: { __type: "[HiveUserRolesConnectionWhere!]" },
    node: { __type: "RoleWhere" },
    node_NOT: { __type: "RoleWhere" },
  },
  HiveUserRolesCreateFieldInput: { node: { __type: "RoleCreateInput!" } },
  HiveUserRolesDeleteFieldInput: {
    delete: { __type: "RoleDeleteInput" },
    where: { __type: "HiveUserRolesConnectionWhere" },
  },
  HiveUserRolesDisconnectFieldInput: {
    disconnect: { __type: "RoleDisconnectInput" },
    where: { __type: "HiveUserRolesConnectionWhere" },
  },
  HiveUserRolesFieldInput: {
    connect: { __type: "[HiveUserRolesConnectFieldInput!]" },
    connectOrCreate: { __type: "[HiveUserRolesConnectOrCreateFieldInput!]" },
    create: { __type: "[HiveUserRolesCreateFieldInput!]" },
  },
  HiveUserRolesNodeAggregationWhereInput: {
    AND: { __type: "[HiveUserRolesNodeAggregationWhereInput!]" },
    OR: { __type: "[HiveUserRolesNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  HiveUserRolesRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "Role!" },
  },
  HiveUserRolesUpdateConnectionInput: { node: { __type: "RoleUpdateInput" } },
  HiveUserRolesUpdateFieldInput: {
    connect: { __type: "[HiveUserRolesConnectFieldInput!]" },
    connectOrCreate: { __type: "[HiveUserRolesConnectOrCreateFieldInput!]" },
    create: { __type: "[HiveUserRolesCreateFieldInput!]" },
    delete: { __type: "[HiveUserRolesDeleteFieldInput!]" },
    disconnect: { __type: "[HiveUserRolesDisconnectFieldInput!]" },
    update: { __type: "HiveUserRolesUpdateConnectionInput" },
    where: { __type: "HiveUserRolesConnectionWhere" },
  },
  HiveUserSort: {
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
    password: { __type: "SortDirection" },
    username: { __type: "SortDirection" },
  },
  HiveUserUniqueWhere: { id: { __type: "ID" } },
  HiveUserUpdateInput: {
    name: { __type: "String" },
    organisation: { __type: "HiveUserOrganisationUpdateFieldInput" },
    password: { __type: "String" },
    roles: { __type: "[HiveUserRolesUpdateFieldInput!]" },
    username: { __type: "String" },
  },
  HiveUserWhere: {
    AND: { __type: "[HiveUserWhere!]" },
    OR: { __type: "[HiveUserWhere!]" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    organisation: { __type: "HiveOrganisationWhere" },
    organisationAggregate: { __type: "HiveUserOrganisationAggregateInput" },
    organisationConnection: { __type: "HiveUserOrganisationConnectionWhere" },
    organisationConnection_NOT: {
      __type: "HiveUserOrganisationConnectionWhere",
    },
    organisation_NOT: { __type: "HiveOrganisationWhere" },
    password: { __type: "String" },
    password_CONTAINS: { __type: "String" },
    password_ENDS_WITH: { __type: "String" },
    password_IN: { __type: "[String]" },
    password_NOT: { __type: "String" },
    password_NOT_CONTAINS: { __type: "String" },
    password_NOT_ENDS_WITH: { __type: "String" },
    password_NOT_IN: { __type: "[String]" },
    password_NOT_STARTS_WITH: { __type: "String" },
    password_STARTS_WITH: { __type: "String" },
    roles: { __type: "RoleWhere" },
    rolesAggregate: { __type: "HiveUserRolesAggregateInput" },
    rolesConnection: { __type: "HiveUserRolesConnectionWhere" },
    rolesConnection_NOT: { __type: "HiveUserRolesConnectionWhere" },
    roles_NOT: { __type: "RoleWhere" },
    username: { __type: "String" },
    username_CONTAINS: { __type: "String" },
    username_ENDS_WITH: { __type: "String" },
    username_IN: { __type: "[String]" },
    username_NOT: { __type: "String" },
    username_NOT_CONTAINS: { __type: "String" },
    username_NOT_ENDS_WITH: { __type: "String" },
    username_NOT_IN: { __type: "[String]" },
    username_NOT_STARTS_WITH: { __type: "String" },
    username_STARTS_WITH: { __type: "String" },
  },
  IDAggregateSelection: {
    __typename: { __type: "String!" },
    longest: { __type: "ID" },
    shortest: { __type: "ID" },
  },
  PageInfo: {
    __typename: { __type: "String!" },
    endCursor: { __type: "String" },
    hasNextPage: { __type: "Boolean!" },
    hasPreviousPage: { __type: "Boolean!" },
    startCursor: { __type: "String" },
  },
  People: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    name: { __type: "String" },
    organisation: {
      __type: "HiveOrganisation",
      __args: {
        options: "HiveOrganisationOptions",
        where: "HiveOrganisationWhere",
      },
    },
    organisationAggregate: {
      __type: "PeopleHiveOrganisationOrganisationAggregationSelection",
      __args: { where: "HiveOrganisationWhere" },
    },
    organisationConnection: {
      __type: "PeopleOrganisationConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[PeopleOrganisationConnectionSort!]",
        where: "PeopleOrganisationConnectionWhere",
      },
    },
  },
  PeopleAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  PeopleConnectInput: {
    organisation: { __type: "PeopleOrganisationConnectFieldInput" },
  },
  PeopleConnectOrCreateInput: {
    organisation: { __type: "PeopleOrganisationConnectOrCreateFieldInput" },
  },
  PeopleConnectOrCreateWhere: { node: { __type: "PeopleUniqueWhere!" } },
  PeopleConnectWhere: { node: { __type: "PeopleWhere!" } },
  PeopleCreateInput: {
    name: { __type: "String" },
    organisation: { __type: "PeopleOrganisationFieldInput" },
  },
  PeopleDeleteInput: {
    organisation: { __type: "PeopleOrganisationDeleteFieldInput" },
  },
  PeopleDisconnectInput: {
    organisation: { __type: "PeopleOrganisationDisconnectFieldInput" },
  },
  PeopleHiveOrganisationOrganisationAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "PeopleHiveOrganisationOrganisationNodeAggregateSelection",
    },
  },
  PeopleHiveOrganisationOrganisationNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  PeopleOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[PeopleSort]" },
  },
  PeopleOrganisationAggregateInput: {
    AND: { __type: "[PeopleOrganisationAggregateInput!]" },
    OR: { __type: "[PeopleOrganisationAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "PeopleOrganisationNodeAggregationWhereInput" },
  },
  PeopleOrganisationConnectFieldInput: {
    connect: { __type: "HiveOrganisationConnectInput" },
    where: { __type: "HiveOrganisationConnectWhere" },
  },
  PeopleOrganisationConnectOrCreateFieldInput: {
    onCreate: {
      __type: "PeopleOrganisationConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveOrganisationConnectOrCreateWhere!" },
  },
  PeopleOrganisationConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  PeopleOrganisationConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[PeopleOrganisationRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  PeopleOrganisationConnectionSort: {
    node: { __type: "HiveOrganisationSort" },
  },
  PeopleOrganisationConnectionWhere: {
    AND: { __type: "[PeopleOrganisationConnectionWhere!]" },
    OR: { __type: "[PeopleOrganisationConnectionWhere!]" },
    node: { __type: "HiveOrganisationWhere" },
    node_NOT: { __type: "HiveOrganisationWhere" },
  },
  PeopleOrganisationCreateFieldInput: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  PeopleOrganisationDeleteFieldInput: {
    delete: { __type: "HiveOrganisationDeleteInput" },
    where: { __type: "PeopleOrganisationConnectionWhere" },
  },
  PeopleOrganisationDisconnectFieldInput: {
    disconnect: { __type: "HiveOrganisationDisconnectInput" },
    where: { __type: "PeopleOrganisationConnectionWhere" },
  },
  PeopleOrganisationFieldInput: {
    connect: { __type: "PeopleOrganisationConnectFieldInput" },
    connectOrCreate: { __type: "PeopleOrganisationConnectOrCreateFieldInput" },
    create: { __type: "PeopleOrganisationCreateFieldInput" },
  },
  PeopleOrganisationNodeAggregationWhereInput: {
    AND: { __type: "[PeopleOrganisationNodeAggregationWhereInput!]" },
    OR: { __type: "[PeopleOrganisationNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  PeopleOrganisationRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveOrganisation!" },
  },
  PeopleOrganisationUpdateConnectionInput: {
    node: { __type: "HiveOrganisationUpdateInput" },
  },
  PeopleOrganisationUpdateFieldInput: {
    connect: { __type: "PeopleOrganisationConnectFieldInput" },
    connectOrCreate: { __type: "PeopleOrganisationConnectOrCreateFieldInput" },
    create: { __type: "PeopleOrganisationCreateFieldInput" },
    delete: { __type: "PeopleOrganisationDeleteFieldInput" },
    disconnect: { __type: "PeopleOrganisationDisconnectFieldInput" },
    update: { __type: "PeopleOrganisationUpdateConnectionInput" },
    where: { __type: "PeopleOrganisationConnectionWhere" },
  },
  PeopleRelationInput: {
    organisation: { __type: "PeopleOrganisationCreateFieldInput" },
  },
  PeopleSort: {
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
  },
  PeopleUniqueWhere: { id: { __type: "ID" } },
  PeopleUpdateInput: {
    name: { __type: "String" },
    organisation: { __type: "PeopleOrganisationUpdateFieldInput" },
  },
  PeopleWhere: {
    AND: { __type: "[PeopleWhere!]" },
    OR: { __type: "[PeopleWhere!]" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    organisation: { __type: "HiveOrganisationWhere" },
    organisationAggregate: { __type: "PeopleOrganisationAggregateInput" },
    organisationConnection: { __type: "PeopleOrganisationConnectionWhere" },
    organisationConnection_NOT: { __type: "PeopleOrganisationConnectionWhere" },
    organisation_NOT: { __type: "HiveOrganisationWhere" },
  },
  Permission: {
    __typename: { __type: "String!" },
    action: { __type: "String" },
    id: { __type: "ID!" },
    name: { __type: "String" },
    roles: {
      __type: "[Role]",
      __args: { options: "RoleOptions", where: "RoleWhere" },
    },
    rolesAggregate: {
      __type: "PermissionRoleRolesAggregationSelection",
      __args: { where: "RoleWhere" },
    },
    rolesConnection: {
      __type: "PermissionRolesConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[PermissionRolesConnectionSort!]",
        where: "PermissionRolesConnectionWhere",
      },
    },
    scope: { __type: "String" },
  },
  PermissionAggregateSelection: {
    __typename: { __type: "String!" },
    action: { __type: "StringAggregateSelection!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    scope: { __type: "StringAggregateSelection!" },
  },
  PermissionConnectInput: {
    roles: { __type: "[PermissionRolesConnectFieldInput!]" },
  },
  PermissionConnectOrCreateInput: {
    roles: { __type: "[PermissionRolesConnectOrCreateFieldInput!]" },
  },
  PermissionConnectOrCreateWhere: {
    node: { __type: "PermissionUniqueWhere!" },
  },
  PermissionConnectWhere: { node: { __type: "PermissionWhere!" } },
  PermissionCreateInput: {
    action: { __type: "String" },
    name: { __type: "String" },
    roles: { __type: "PermissionRolesFieldInput" },
    scope: { __type: "String" },
  },
  PermissionDeleteInput: {
    roles: { __type: "[PermissionRolesDeleteFieldInput!]" },
  },
  PermissionDisconnectInput: {
    roles: { __type: "[PermissionRolesDisconnectFieldInput!]" },
  },
  PermissionOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[PermissionSort]" },
  },
  PermissionRelationInput: {
    roles: { __type: "[PermissionRolesCreateFieldInput!]" },
  },
  PermissionRoleRolesAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "PermissionRoleRolesNodeAggregateSelection" },
  },
  PermissionRoleRolesNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  PermissionRolesAggregateInput: {
    AND: { __type: "[PermissionRolesAggregateInput!]" },
    OR: { __type: "[PermissionRolesAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "PermissionRolesNodeAggregationWhereInput" },
  },
  PermissionRolesConnectFieldInput: {
    connect: { __type: "[RoleConnectInput!]" },
    where: { __type: "RoleConnectWhere" },
  },
  PermissionRolesConnectOrCreateFieldInput: {
    onCreate: { __type: "PermissionRolesConnectOrCreateFieldInputOnCreate!" },
    where: { __type: "RoleConnectOrCreateWhere!" },
  },
  PermissionRolesConnectOrCreateFieldInputOnCreate: {
    node: { __type: "RoleCreateInput!" },
  },
  PermissionRolesConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[PermissionRolesRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  PermissionRolesConnectionSort: { node: { __type: "RoleSort" } },
  PermissionRolesConnectionWhere: {
    AND: { __type: "[PermissionRolesConnectionWhere!]" },
    OR: { __type: "[PermissionRolesConnectionWhere!]" },
    node: { __type: "RoleWhere" },
    node_NOT: { __type: "RoleWhere" },
  },
  PermissionRolesCreateFieldInput: { node: { __type: "RoleCreateInput!" } },
  PermissionRolesDeleteFieldInput: {
    delete: { __type: "RoleDeleteInput" },
    where: { __type: "PermissionRolesConnectionWhere" },
  },
  PermissionRolesDisconnectFieldInput: {
    disconnect: { __type: "RoleDisconnectInput" },
    where: { __type: "PermissionRolesConnectionWhere" },
  },
  PermissionRolesFieldInput: {
    connect: { __type: "[PermissionRolesConnectFieldInput!]" },
    connectOrCreate: { __type: "[PermissionRolesConnectOrCreateFieldInput!]" },
    create: { __type: "[PermissionRolesCreateFieldInput!]" },
  },
  PermissionRolesNodeAggregationWhereInput: {
    AND: { __type: "[PermissionRolesNodeAggregationWhereInput!]" },
    OR: { __type: "[PermissionRolesNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  PermissionRolesRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "Role!" },
  },
  PermissionRolesUpdateConnectionInput: { node: { __type: "RoleUpdateInput" } },
  PermissionRolesUpdateFieldInput: {
    connect: { __type: "[PermissionRolesConnectFieldInput!]" },
    connectOrCreate: { __type: "[PermissionRolesConnectOrCreateFieldInput!]" },
    create: { __type: "[PermissionRolesCreateFieldInput!]" },
    delete: { __type: "[PermissionRolesDeleteFieldInput!]" },
    disconnect: { __type: "[PermissionRolesDisconnectFieldInput!]" },
    update: { __type: "PermissionRolesUpdateConnectionInput" },
    where: { __type: "PermissionRolesConnectionWhere" },
  },
  PermissionSort: {
    action: { __type: "SortDirection" },
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
    scope: { __type: "SortDirection" },
  },
  PermissionUniqueWhere: { id: { __type: "ID" } },
  PermissionUpdateInput: {
    action: { __type: "String" },
    name: { __type: "String" },
    roles: { __type: "[PermissionRolesUpdateFieldInput!]" },
    scope: { __type: "String" },
  },
  PermissionWhere: {
    AND: { __type: "[PermissionWhere!]" },
    OR: { __type: "[PermissionWhere!]" },
    action: { __type: "String" },
    action_CONTAINS: { __type: "String" },
    action_ENDS_WITH: { __type: "String" },
    action_IN: { __type: "[String]" },
    action_NOT: { __type: "String" },
    action_NOT_CONTAINS: { __type: "String" },
    action_NOT_ENDS_WITH: { __type: "String" },
    action_NOT_IN: { __type: "[String]" },
    action_NOT_STARTS_WITH: { __type: "String" },
    action_STARTS_WITH: { __type: "String" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    roles: { __type: "RoleWhere" },
    rolesAggregate: { __type: "PermissionRolesAggregateInput" },
    rolesConnection: { __type: "PermissionRolesConnectionWhere" },
    rolesConnection_NOT: { __type: "PermissionRolesConnectionWhere" },
    roles_NOT: { __type: "RoleWhere" },
    scope: { __type: "String" },
    scope_CONTAINS: { __type: "String" },
    scope_ENDS_WITH: { __type: "String" },
    scope_IN: { __type: "[String]" },
    scope_NOT: { __type: "String" },
    scope_NOT_CONTAINS: { __type: "String" },
    scope_NOT_ENDS_WITH: { __type: "String" },
    scope_NOT_IN: { __type: "[String]" },
    scope_NOT_STARTS_WITH: { __type: "String" },
    scope_STARTS_WITH: { __type: "String" },
  },
  Project: {
    __typename: { __type: "String!" },
    endDate: { __type: "DateTime" },
    id: { __type: "ID!" },
    name: { __type: "String" },
    organisation: {
      __type: "HiveOrganisation",
      __args: {
        options: "HiveOrganisationOptions",
        where: "HiveOrganisationWhere",
      },
    },
    organisationAggregate: {
      __type: "ProjectHiveOrganisationOrganisationAggregationSelection",
      __args: { where: "HiveOrganisationWhere" },
    },
    organisationConnection: {
      __type: "ProjectOrganisationConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[ProjectOrganisationConnectionSort!]",
        where: "ProjectOrganisationConnectionWhere",
      },
    },
    plan: {
      __type: "[TimelineItem]",
      __args: { options: "TimelineItemOptions", where: "TimelineItemWhere" },
    },
    planAggregate: {
      __type: "ProjectTimelineItemPlanAggregationSelection",
      __args: { where: "TimelineItemWhere" },
    },
    planConnection: {
      __type: "ProjectPlanConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[ProjectPlanConnectionSort!]",
        where: "ProjectPlanConnectionWhere",
      },
    },
    schedule: {
      __type: "[ScheduleItem]",
      __args: { options: "ScheduleItemOptions", where: "ScheduleItemWhere" },
    },
    scheduleAggregate: {
      __type: "ProjectScheduleItemScheduleAggregationSelection",
      __args: { where: "ScheduleItemWhere" },
    },
    scheduleConnection: {
      __type: "ProjectScheduleConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[ProjectScheduleConnectionSort!]",
        where: "ProjectScheduleConnectionWhere",
      },
    },
    startDate: { __type: "DateTime" },
    status: { __type: "String" },
  },
  ProjectAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    endDate: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    startDate: { __type: "DateTimeAggregateSelection!" },
    status: { __type: "StringAggregateSelection!" },
  },
  ProjectConnectInput: {
    organisation: { __type: "ProjectOrganisationConnectFieldInput" },
    plan: { __type: "[ProjectPlanConnectFieldInput!]" },
    schedule: { __type: "[ProjectScheduleConnectFieldInput!]" },
  },
  ProjectConnectOrCreateInput: {
    organisation: { __type: "ProjectOrganisationConnectOrCreateFieldInput" },
    plan: { __type: "[ProjectPlanConnectOrCreateFieldInput!]" },
    schedule: { __type: "[ProjectScheduleConnectOrCreateFieldInput!]" },
  },
  ProjectConnectOrCreateWhere: { node: { __type: "ProjectUniqueWhere!" } },
  ProjectConnectWhere: { node: { __type: "ProjectWhere!" } },
  ProjectCreateInput: {
    endDate: { __type: "DateTime" },
    name: { __type: "String" },
    organisation: { __type: "ProjectOrganisationFieldInput" },
    plan: { __type: "ProjectPlanFieldInput" },
    schedule: { __type: "ProjectScheduleFieldInput" },
    startDate: { __type: "DateTime" },
    status: { __type: "String" },
  },
  ProjectDeleteInput: {
    organisation: { __type: "ProjectOrganisationDeleteFieldInput" },
    plan: { __type: "[ProjectPlanDeleteFieldInput!]" },
    schedule: { __type: "[ProjectScheduleDeleteFieldInput!]" },
  },
  ProjectDisconnectInput: {
    organisation: { __type: "ProjectOrganisationDisconnectFieldInput" },
    plan: { __type: "[ProjectPlanDisconnectFieldInput!]" },
    schedule: { __type: "[ProjectScheduleDisconnectFieldInput!]" },
  },
  ProjectHiveOrganisationOrganisationAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "ProjectHiveOrganisationOrganisationNodeAggregateSelection",
    },
  },
  ProjectHiveOrganisationOrganisationNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  ProjectOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[ProjectSort]" },
  },
  ProjectOrganisationAggregateInput: {
    AND: { __type: "[ProjectOrganisationAggregateInput!]" },
    OR: { __type: "[ProjectOrganisationAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "ProjectOrganisationNodeAggregationWhereInput" },
  },
  ProjectOrganisationConnectFieldInput: {
    connect: { __type: "HiveOrganisationConnectInput" },
    where: { __type: "HiveOrganisationConnectWhere" },
  },
  ProjectOrganisationConnectOrCreateFieldInput: {
    onCreate: {
      __type: "ProjectOrganisationConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveOrganisationConnectOrCreateWhere!" },
  },
  ProjectOrganisationConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  ProjectOrganisationConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[ProjectOrganisationRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  ProjectOrganisationConnectionSort: {
    node: { __type: "HiveOrganisationSort" },
  },
  ProjectOrganisationConnectionWhere: {
    AND: { __type: "[ProjectOrganisationConnectionWhere!]" },
    OR: { __type: "[ProjectOrganisationConnectionWhere!]" },
    node: { __type: "HiveOrganisationWhere" },
    node_NOT: { __type: "HiveOrganisationWhere" },
  },
  ProjectOrganisationCreateFieldInput: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  ProjectOrganisationDeleteFieldInput: {
    delete: { __type: "HiveOrganisationDeleteInput" },
    where: { __type: "ProjectOrganisationConnectionWhere" },
  },
  ProjectOrganisationDisconnectFieldInput: {
    disconnect: { __type: "HiveOrganisationDisconnectInput" },
    where: { __type: "ProjectOrganisationConnectionWhere" },
  },
  ProjectOrganisationFieldInput: {
    connect: { __type: "ProjectOrganisationConnectFieldInput" },
    connectOrCreate: { __type: "ProjectOrganisationConnectOrCreateFieldInput" },
    create: { __type: "ProjectOrganisationCreateFieldInput" },
  },
  ProjectOrganisationNodeAggregationWhereInput: {
    AND: { __type: "[ProjectOrganisationNodeAggregationWhereInput!]" },
    OR: { __type: "[ProjectOrganisationNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  ProjectOrganisationRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveOrganisation!" },
  },
  ProjectOrganisationUpdateConnectionInput: {
    node: { __type: "HiveOrganisationUpdateInput" },
  },
  ProjectOrganisationUpdateFieldInput: {
    connect: { __type: "ProjectOrganisationConnectFieldInput" },
    connectOrCreate: { __type: "ProjectOrganisationConnectOrCreateFieldInput" },
    create: { __type: "ProjectOrganisationCreateFieldInput" },
    delete: { __type: "ProjectOrganisationDeleteFieldInput" },
    disconnect: { __type: "ProjectOrganisationDisconnectFieldInput" },
    update: { __type: "ProjectOrganisationUpdateConnectionInput" },
    where: { __type: "ProjectOrganisationConnectionWhere" },
  },
  ProjectPlanAggregateInput: {
    AND: { __type: "[ProjectPlanAggregateInput!]" },
    OR: { __type: "[ProjectPlanAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "ProjectPlanNodeAggregationWhereInput" },
  },
  ProjectPlanConnectFieldInput: {
    connect: { __type: "[TimelineItemConnectInput!]" },
    where: { __type: "TimelineItemConnectWhere" },
  },
  ProjectPlanConnectOrCreateFieldInput: {
    onCreate: { __type: "ProjectPlanConnectOrCreateFieldInputOnCreate!" },
    where: { __type: "TimelineItemConnectOrCreateWhere!" },
  },
  ProjectPlanConnectOrCreateFieldInputOnCreate: {
    node: { __type: "TimelineItemCreateInput!" },
  },
  ProjectPlanConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[ProjectPlanRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  ProjectPlanConnectionSort: { node: { __type: "TimelineItemSort" } },
  ProjectPlanConnectionWhere: {
    AND: { __type: "[ProjectPlanConnectionWhere!]" },
    OR: { __type: "[ProjectPlanConnectionWhere!]" },
    node: { __type: "TimelineItemWhere" },
    node_NOT: { __type: "TimelineItemWhere" },
  },
  ProjectPlanCreateFieldInput: { node: { __type: "TimelineItemCreateInput!" } },
  ProjectPlanDeleteFieldInput: {
    delete: { __type: "TimelineItemDeleteInput" },
    where: { __type: "ProjectPlanConnectionWhere" },
  },
  ProjectPlanDisconnectFieldInput: {
    disconnect: { __type: "TimelineItemDisconnectInput" },
    where: { __type: "ProjectPlanConnectionWhere" },
  },
  ProjectPlanFieldInput: {
    connect: { __type: "[ProjectPlanConnectFieldInput!]" },
    connectOrCreate: { __type: "[ProjectPlanConnectOrCreateFieldInput!]" },
    create: { __type: "[ProjectPlanCreateFieldInput!]" },
  },
  ProjectPlanNodeAggregationWhereInput: {
    AND: { __type: "[ProjectPlanNodeAggregationWhereInput!]" },
    OR: { __type: "[ProjectPlanNodeAggregationWhereInput!]" },
    endDate_EQUAL: { __type: "DateTime" },
    endDate_GT: { __type: "DateTime" },
    endDate_GTE: { __type: "DateTime" },
    endDate_LT: { __type: "DateTime" },
    endDate_LTE: { __type: "DateTime" },
    endDate_MAX_EQUAL: { __type: "DateTime" },
    endDate_MAX_GT: { __type: "DateTime" },
    endDate_MAX_GTE: { __type: "DateTime" },
    endDate_MAX_LT: { __type: "DateTime" },
    endDate_MAX_LTE: { __type: "DateTime" },
    endDate_MIN_EQUAL: { __type: "DateTime" },
    endDate_MIN_GT: { __type: "DateTime" },
    endDate_MIN_GTE: { __type: "DateTime" },
    endDate_MIN_LT: { __type: "DateTime" },
    endDate_MIN_LTE: { __type: "DateTime" },
    id_EQUAL: { __type: "ID" },
    notes_AVERAGE_EQUAL: { __type: "Float" },
    notes_AVERAGE_GT: { __type: "Float" },
    notes_AVERAGE_GTE: { __type: "Float" },
    notes_AVERAGE_LT: { __type: "Float" },
    notes_AVERAGE_LTE: { __type: "Float" },
    notes_EQUAL: { __type: "String" },
    notes_GT: { __type: "Int" },
    notes_GTE: { __type: "Int" },
    notes_LONGEST_EQUAL: { __type: "Int" },
    notes_LONGEST_GT: { __type: "Int" },
    notes_LONGEST_GTE: { __type: "Int" },
    notes_LONGEST_LT: { __type: "Int" },
    notes_LONGEST_LTE: { __type: "Int" },
    notes_LT: { __type: "Int" },
    notes_LTE: { __type: "Int" },
    notes_SHORTEST_EQUAL: { __type: "Int" },
    notes_SHORTEST_GT: { __type: "Int" },
    notes_SHORTEST_GTE: { __type: "Int" },
    notes_SHORTEST_LT: { __type: "Int" },
    notes_SHORTEST_LTE: { __type: "Int" },
    startDate_EQUAL: { __type: "DateTime" },
    startDate_GT: { __type: "DateTime" },
    startDate_GTE: { __type: "DateTime" },
    startDate_LT: { __type: "DateTime" },
    startDate_LTE: { __type: "DateTime" },
    startDate_MAX_EQUAL: { __type: "DateTime" },
    startDate_MAX_GT: { __type: "DateTime" },
    startDate_MAX_GTE: { __type: "DateTime" },
    startDate_MAX_LT: { __type: "DateTime" },
    startDate_MAX_LTE: { __type: "DateTime" },
    startDate_MIN_EQUAL: { __type: "DateTime" },
    startDate_MIN_GT: { __type: "DateTime" },
    startDate_MIN_GTE: { __type: "DateTime" },
    startDate_MIN_LT: { __type: "DateTime" },
    startDate_MIN_LTE: { __type: "DateTime" },
    timeline_AVERAGE_EQUAL: { __type: "Float" },
    timeline_AVERAGE_GT: { __type: "Float" },
    timeline_AVERAGE_GTE: { __type: "Float" },
    timeline_AVERAGE_LT: { __type: "Float" },
    timeline_AVERAGE_LTE: { __type: "Float" },
    timeline_EQUAL: { __type: "String" },
    timeline_GT: { __type: "Int" },
    timeline_GTE: { __type: "Int" },
    timeline_LONGEST_EQUAL: { __type: "Int" },
    timeline_LONGEST_GT: { __type: "Int" },
    timeline_LONGEST_GTE: { __type: "Int" },
    timeline_LONGEST_LT: { __type: "Int" },
    timeline_LONGEST_LTE: { __type: "Int" },
    timeline_LT: { __type: "Int" },
    timeline_LTE: { __type: "Int" },
    timeline_SHORTEST_EQUAL: { __type: "Int" },
    timeline_SHORTEST_GT: { __type: "Int" },
    timeline_SHORTEST_GTE: { __type: "Int" },
    timeline_SHORTEST_LT: { __type: "Int" },
    timeline_SHORTEST_LTE: { __type: "Int" },
  },
  ProjectPlanRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "TimelineItem!" },
  },
  ProjectPlanUpdateConnectionInput: {
    node: { __type: "TimelineItemUpdateInput" },
  },
  ProjectPlanUpdateFieldInput: {
    connect: { __type: "[ProjectPlanConnectFieldInput!]" },
    connectOrCreate: { __type: "[ProjectPlanConnectOrCreateFieldInput!]" },
    create: { __type: "[ProjectPlanCreateFieldInput!]" },
    delete: { __type: "[ProjectPlanDeleteFieldInput!]" },
    disconnect: { __type: "[ProjectPlanDisconnectFieldInput!]" },
    update: { __type: "ProjectPlanUpdateConnectionInput" },
    where: { __type: "ProjectPlanConnectionWhere" },
  },
  ProjectRelationInput: {
    organisation: { __type: "ProjectOrganisationCreateFieldInput" },
    plan: { __type: "[ProjectPlanCreateFieldInput!]" },
    schedule: { __type: "[ProjectScheduleCreateFieldInput!]" },
  },
  ProjectResult: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    invoiced: { __type: "Float" },
    organisation: {
      __type: "HiveOrganisation",
      __args: {
        options: "HiveOrganisationOptions",
        where: "HiveOrganisationWhere",
      },
    },
    organisationAggregate: {
      __type: "ProjectResultHiveOrganisationOrganisationAggregationSelection",
      __args: { where: "HiveOrganisationWhere" },
    },
    organisationConnection: {
      __type: "ProjectResultOrganisationConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[ProjectResultOrganisationConnectionSort!]",
        where: "ProjectResultOrganisationConnectionWhere",
      },
    },
    quoted: { __type: "Float" },
  },
  ProjectResultAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    invoiced: { __type: "FloatAggregateSelection!" },
    quoted: { __type: "FloatAggregateSelection!" },
  },
  ProjectResultConnectInput: {
    organisation: { __type: "ProjectResultOrganisationConnectFieldInput" },
  },
  ProjectResultConnectOrCreateInput: {
    organisation: {
      __type: "ProjectResultOrganisationConnectOrCreateFieldInput",
    },
  },
  ProjectResultCreateInput: {
    invoiced: { __type: "Float" },
    organisation: { __type: "ProjectResultOrganisationFieldInput" },
    quoted: { __type: "Float" },
  },
  ProjectResultDeleteInput: {
    organisation: { __type: "ProjectResultOrganisationDeleteFieldInput" },
  },
  ProjectResultDisconnectInput: {
    organisation: { __type: "ProjectResultOrganisationDisconnectFieldInput" },
  },
  ProjectResultHiveOrganisationOrganisationAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "ProjectResultHiveOrganisationOrganisationNodeAggregateSelection",
    },
  },
  ProjectResultHiveOrganisationOrganisationNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  ProjectResultOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[ProjectResultSort]" },
  },
  ProjectResultOrganisationAggregateInput: {
    AND: { __type: "[ProjectResultOrganisationAggregateInput!]" },
    OR: { __type: "[ProjectResultOrganisationAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "ProjectResultOrganisationNodeAggregationWhereInput" },
  },
  ProjectResultOrganisationConnectFieldInput: {
    connect: { __type: "HiveOrganisationConnectInput" },
    where: { __type: "HiveOrganisationConnectWhere" },
  },
  ProjectResultOrganisationConnectOrCreateFieldInput: {
    onCreate: {
      __type: "ProjectResultOrganisationConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveOrganisationConnectOrCreateWhere!" },
  },
  ProjectResultOrganisationConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  ProjectResultOrganisationConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[ProjectResultOrganisationRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  ProjectResultOrganisationConnectionSort: {
    node: { __type: "HiveOrganisationSort" },
  },
  ProjectResultOrganisationConnectionWhere: {
    AND: { __type: "[ProjectResultOrganisationConnectionWhere!]" },
    OR: { __type: "[ProjectResultOrganisationConnectionWhere!]" },
    node: { __type: "HiveOrganisationWhere" },
    node_NOT: { __type: "HiveOrganisationWhere" },
  },
  ProjectResultOrganisationCreateFieldInput: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  ProjectResultOrganisationDeleteFieldInput: {
    delete: { __type: "HiveOrganisationDeleteInput" },
    where: { __type: "ProjectResultOrganisationConnectionWhere" },
  },
  ProjectResultOrganisationDisconnectFieldInput: {
    disconnect: { __type: "HiveOrganisationDisconnectInput" },
    where: { __type: "ProjectResultOrganisationConnectionWhere" },
  },
  ProjectResultOrganisationFieldInput: {
    connect: { __type: "ProjectResultOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "ProjectResultOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "ProjectResultOrganisationCreateFieldInput" },
  },
  ProjectResultOrganisationNodeAggregationWhereInput: {
    AND: { __type: "[ProjectResultOrganisationNodeAggregationWhereInput!]" },
    OR: { __type: "[ProjectResultOrganisationNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  ProjectResultOrganisationRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveOrganisation!" },
  },
  ProjectResultOrganisationUpdateConnectionInput: {
    node: { __type: "HiveOrganisationUpdateInput" },
  },
  ProjectResultOrganisationUpdateFieldInput: {
    connect: { __type: "ProjectResultOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "ProjectResultOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "ProjectResultOrganisationCreateFieldInput" },
    delete: { __type: "ProjectResultOrganisationDeleteFieldInput" },
    disconnect: { __type: "ProjectResultOrganisationDisconnectFieldInput" },
    update: { __type: "ProjectResultOrganisationUpdateConnectionInput" },
    where: { __type: "ProjectResultOrganisationConnectionWhere" },
  },
  ProjectResultRelationInput: {
    organisation: { __type: "ProjectResultOrganisationCreateFieldInput" },
  },
  ProjectResultSort: {
    id: { __type: "SortDirection" },
    invoiced: { __type: "SortDirection" },
    quoted: { __type: "SortDirection" },
  },
  ProjectResultUpdateInput: {
    invoiced: { __type: "Float" },
    organisation: { __type: "ProjectResultOrganisationUpdateFieldInput" },
    quoted: { __type: "Float" },
  },
  ProjectResultWhere: {
    AND: { __type: "[ProjectResultWhere!]" },
    OR: { __type: "[ProjectResultWhere!]" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    invoiced: { __type: "Float" },
    invoiced_GT: { __type: "Float" },
    invoiced_GTE: { __type: "Float" },
    invoiced_IN: { __type: "[Float]" },
    invoiced_LT: { __type: "Float" },
    invoiced_LTE: { __type: "Float" },
    invoiced_NOT: { __type: "Float" },
    invoiced_NOT_IN: { __type: "[Float]" },
    organisation: { __type: "HiveOrganisationWhere" },
    organisationAggregate: {
      __type: "ProjectResultOrganisationAggregateInput",
    },
    organisationConnection: {
      __type: "ProjectResultOrganisationConnectionWhere",
    },
    organisationConnection_NOT: {
      __type: "ProjectResultOrganisationConnectionWhere",
    },
    organisation_NOT: { __type: "HiveOrganisationWhere" },
    quoted: { __type: "Float" },
    quoted_GT: { __type: "Float" },
    quoted_GTE: { __type: "Float" },
    quoted_IN: { __type: "[Float]" },
    quoted_LT: { __type: "Float" },
    quoted_LTE: { __type: "Float" },
    quoted_NOT: { __type: "Float" },
    quoted_NOT_IN: { __type: "[Float]" },
  },
  ProjectScheduleAggregateInput: {
    AND: { __type: "[ProjectScheduleAggregateInput!]" },
    OR: { __type: "[ProjectScheduleAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "ProjectScheduleNodeAggregationWhereInput" },
  },
  ProjectScheduleConnectFieldInput: {
    connect: { __type: "[ScheduleItemConnectInput!]" },
    where: { __type: "ScheduleItemConnectWhere" },
  },
  ProjectScheduleConnectOrCreateFieldInput: {
    onCreate: { __type: "ProjectScheduleConnectOrCreateFieldInputOnCreate!" },
    where: { __type: "ScheduleItemConnectOrCreateWhere!" },
  },
  ProjectScheduleConnectOrCreateFieldInputOnCreate: {
    node: { __type: "ScheduleItemCreateInput!" },
  },
  ProjectScheduleConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[ProjectScheduleRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  ProjectScheduleConnectionSort: { node: { __type: "ScheduleItemSort" } },
  ProjectScheduleConnectionWhere: {
    AND: { __type: "[ProjectScheduleConnectionWhere!]" },
    OR: { __type: "[ProjectScheduleConnectionWhere!]" },
    node: { __type: "ScheduleItemWhere" },
    node_NOT: { __type: "ScheduleItemWhere" },
  },
  ProjectScheduleCreateFieldInput: {
    node: { __type: "ScheduleItemCreateInput!" },
  },
  ProjectScheduleDeleteFieldInput: {
    delete: { __type: "ScheduleItemDeleteInput" },
    where: { __type: "ProjectScheduleConnectionWhere" },
  },
  ProjectScheduleDisconnectFieldInput: {
    disconnect: { __type: "ScheduleItemDisconnectInput" },
    where: { __type: "ProjectScheduleConnectionWhere" },
  },
  ProjectScheduleFieldInput: {
    connect: { __type: "[ProjectScheduleConnectFieldInput!]" },
    connectOrCreate: { __type: "[ProjectScheduleConnectOrCreateFieldInput!]" },
    create: { __type: "[ProjectScheduleCreateFieldInput!]" },
  },
  ProjectScheduleItemScheduleAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "ProjectScheduleItemScheduleNodeAggregateSelection" },
  },
  ProjectScheduleItemScheduleNodeAggregateSelection: {
    __typename: { __type: "String!" },
    date: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
  },
  ProjectScheduleNodeAggregationWhereInput: {
    AND: { __type: "[ProjectScheduleNodeAggregationWhereInput!]" },
    OR: { __type: "[ProjectScheduleNodeAggregationWhereInput!]" },
    date_EQUAL: { __type: "DateTime" },
    date_GT: { __type: "DateTime" },
    date_GTE: { __type: "DateTime" },
    date_LT: { __type: "DateTime" },
    date_LTE: { __type: "DateTime" },
    date_MAX_EQUAL: { __type: "DateTime" },
    date_MAX_GT: { __type: "DateTime" },
    date_MAX_GTE: { __type: "DateTime" },
    date_MAX_LT: { __type: "DateTime" },
    date_MAX_LTE: { __type: "DateTime" },
    date_MIN_EQUAL: { __type: "DateTime" },
    date_MIN_GT: { __type: "DateTime" },
    date_MIN_GTE: { __type: "DateTime" },
    date_MIN_LT: { __type: "DateTime" },
    date_MIN_LTE: { __type: "DateTime" },
    id_EQUAL: { __type: "ID" },
  },
  ProjectScheduleRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "ScheduleItem!" },
  },
  ProjectScheduleUpdateConnectionInput: {
    node: { __type: "ScheduleItemUpdateInput" },
  },
  ProjectScheduleUpdateFieldInput: {
    connect: { __type: "[ProjectScheduleConnectFieldInput!]" },
    connectOrCreate: { __type: "[ProjectScheduleConnectOrCreateFieldInput!]" },
    create: { __type: "[ProjectScheduleCreateFieldInput!]" },
    delete: { __type: "[ProjectScheduleDeleteFieldInput!]" },
    disconnect: { __type: "[ProjectScheduleDisconnectFieldInput!]" },
    update: { __type: "ProjectScheduleUpdateConnectionInput" },
    where: { __type: "ProjectScheduleConnectionWhere" },
  },
  ProjectSort: {
    endDate: { __type: "SortDirection" },
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
    startDate: { __type: "SortDirection" },
    status: { __type: "SortDirection" },
  },
  ProjectTimelineItemPlanAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "ProjectTimelineItemPlanNodeAggregateSelection" },
  },
  ProjectTimelineItemPlanNodeAggregateSelection: {
    __typename: { __type: "String!" },
    endDate: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    notes: { __type: "StringAggregateSelection!" },
    startDate: { __type: "DateTimeAggregateSelection!" },
    timeline: { __type: "StringAggregateSelection!" },
  },
  ProjectUniqueWhere: { id: { __type: "ID" } },
  ProjectUpdateInput: {
    endDate: { __type: "DateTime" },
    name: { __type: "String" },
    organisation: { __type: "ProjectOrganisationUpdateFieldInput" },
    plan: { __type: "[ProjectPlanUpdateFieldInput!]" },
    schedule: { __type: "[ProjectScheduleUpdateFieldInput!]" },
    startDate: { __type: "DateTime" },
    status: { __type: "String" },
  },
  ProjectWhere: {
    AND: { __type: "[ProjectWhere!]" },
    OR: { __type: "[ProjectWhere!]" },
    endDate: { __type: "DateTime" },
    endDate_GT: { __type: "DateTime" },
    endDate_GTE: { __type: "DateTime" },
    endDate_IN: { __type: "[DateTime]" },
    endDate_LT: { __type: "DateTime" },
    endDate_LTE: { __type: "DateTime" },
    endDate_NOT: { __type: "DateTime" },
    endDate_NOT_IN: { __type: "[DateTime]" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    organisation: { __type: "HiveOrganisationWhere" },
    organisationAggregate: { __type: "ProjectOrganisationAggregateInput" },
    organisationConnection: { __type: "ProjectOrganisationConnectionWhere" },
    organisationConnection_NOT: {
      __type: "ProjectOrganisationConnectionWhere",
    },
    organisation_NOT: { __type: "HiveOrganisationWhere" },
    plan: { __type: "TimelineItemWhere" },
    planAggregate: { __type: "ProjectPlanAggregateInput" },
    planConnection: { __type: "ProjectPlanConnectionWhere" },
    planConnection_NOT: { __type: "ProjectPlanConnectionWhere" },
    plan_NOT: { __type: "TimelineItemWhere" },
    schedule: { __type: "ScheduleItemWhere" },
    scheduleAggregate: { __type: "ProjectScheduleAggregateInput" },
    scheduleConnection: { __type: "ProjectScheduleConnectionWhere" },
    scheduleConnection_NOT: { __type: "ProjectScheduleConnectionWhere" },
    schedule_NOT: { __type: "ScheduleItemWhere" },
    startDate: { __type: "DateTime" },
    startDate_GT: { __type: "DateTime" },
    startDate_GTE: { __type: "DateTime" },
    startDate_IN: { __type: "[DateTime]" },
    startDate_LT: { __type: "DateTime" },
    startDate_LTE: { __type: "DateTime" },
    startDate_NOT: { __type: "DateTime" },
    startDate_NOT_IN: { __type: "[DateTime]" },
    status: { __type: "String" },
    status_CONTAINS: { __type: "String" },
    status_ENDS_WITH: { __type: "String" },
    status_IN: { __type: "[String]" },
    status_NOT: { __type: "String" },
    status_NOT_CONTAINS: { __type: "String" },
    status_NOT_ENDS_WITH: { __type: "String" },
    status_NOT_IN: { __type: "[String]" },
    status_NOT_STARTS_WITH: { __type: "String" },
    status_STARTS_WITH: { __type: "String" },
  },
  QueryOptions: { limit: { __type: "Int" }, offset: { __type: "Int" } },
  Role: {
    __typename: { __type: "String!" },
    appliances: {
      __type: "[HiveAppliance]",
      __args: { options: "HiveApplianceOptions", where: "HiveApplianceWhere" },
    },
    appliancesAggregate: {
      __type: "RoleHiveApplianceAppliancesAggregationSelection",
      __args: { where: "HiveApplianceWhere" },
    },
    appliancesConnection: {
      __type: "RoleAppliancesConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[RoleAppliancesConnectionSort!]",
        where: "RoleAppliancesConnectionWhere",
      },
    },
    id: { __type: "ID!" },
    name: { __type: "String" },
    organisation: {
      __type: "HiveOrganisation",
      __args: {
        options: "HiveOrganisationOptions",
        where: "HiveOrganisationWhere",
      },
    },
    organisationAggregate: {
      __type: "RoleHiveOrganisationOrganisationAggregationSelection",
      __args: { where: "HiveOrganisationWhere" },
    },
    organisationConnection: {
      __type: "RoleOrganisationConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[RoleOrganisationConnectionSort!]",
        where: "RoleOrganisationConnectionWhere",
      },
    },
    permissions: {
      __type: "[Permission]",
      __args: { options: "PermissionOptions", where: "PermissionWhere" },
    },
    permissionsAggregate: {
      __type: "RolePermissionPermissionsAggregationSelection",
      __args: { where: "PermissionWhere" },
    },
    permissionsConnection: {
      __type: "RolePermissionsConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[RolePermissionsConnectionSort!]",
        where: "RolePermissionsConnectionWhere",
      },
    },
  },
  RoleAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  RoleAppliancesAggregateInput: {
    AND: { __type: "[RoleAppliancesAggregateInput!]" },
    OR: { __type: "[RoleAppliancesAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "RoleAppliancesNodeAggregationWhereInput" },
  },
  RoleAppliancesConnectFieldInput: {
    connect: { __type: "[HiveApplianceConnectInput!]" },
    where: { __type: "HiveApplianceConnectWhere" },
  },
  RoleAppliancesConnectOrCreateFieldInput: {
    onCreate: { __type: "RoleAppliancesConnectOrCreateFieldInputOnCreate!" },
    where: { __type: "HiveApplianceConnectOrCreateWhere!" },
  },
  RoleAppliancesConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveApplianceCreateInput!" },
  },
  RoleAppliancesConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[RoleAppliancesRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  RoleAppliancesConnectionSort: { node: { __type: "HiveApplianceSort" } },
  RoleAppliancesConnectionWhere: {
    AND: { __type: "[RoleAppliancesConnectionWhere!]" },
    OR: { __type: "[RoleAppliancesConnectionWhere!]" },
    node: { __type: "HiveApplianceWhere" },
    node_NOT: { __type: "HiveApplianceWhere" },
  },
  RoleAppliancesCreateFieldInput: {
    node: { __type: "HiveApplianceCreateInput!" },
  },
  RoleAppliancesDeleteFieldInput: {
    delete: { __type: "HiveApplianceDeleteInput" },
    where: { __type: "RoleAppliancesConnectionWhere" },
  },
  RoleAppliancesDisconnectFieldInput: {
    disconnect: { __type: "HiveApplianceDisconnectInput" },
    where: { __type: "RoleAppliancesConnectionWhere" },
  },
  RoleAppliancesFieldInput: {
    connect: { __type: "[RoleAppliancesConnectFieldInput!]" },
    connectOrCreate: { __type: "[RoleAppliancesConnectOrCreateFieldInput!]" },
    create: { __type: "[RoleAppliancesCreateFieldInput!]" },
  },
  RoleAppliancesNodeAggregationWhereInput: {
    AND: { __type: "[RoleAppliancesNodeAggregationWhereInput!]" },
    OR: { __type: "[RoleAppliancesNodeAggregationWhereInput!]" },
    description_AVERAGE_EQUAL: { __type: "Float" },
    description_AVERAGE_GT: { __type: "Float" },
    description_AVERAGE_GTE: { __type: "Float" },
    description_AVERAGE_LT: { __type: "Float" },
    description_AVERAGE_LTE: { __type: "Float" },
    description_EQUAL: { __type: "String" },
    description_GT: { __type: "Int" },
    description_GTE: { __type: "Int" },
    description_LONGEST_EQUAL: { __type: "Int" },
    description_LONGEST_GT: { __type: "Int" },
    description_LONGEST_GTE: { __type: "Int" },
    description_LONGEST_LT: { __type: "Int" },
    description_LONGEST_LTE: { __type: "Int" },
    description_LT: { __type: "Int" },
    description_LTE: { __type: "Int" },
    description_SHORTEST_EQUAL: { __type: "Int" },
    description_SHORTEST_GT: { __type: "Int" },
    description_SHORTEST_GTE: { __type: "Int" },
    description_SHORTEST_LT: { __type: "Int" },
    description_SHORTEST_LTE: { __type: "Int" },
    id_EQUAL: { __type: "ID" },
    label_AVERAGE_EQUAL: { __type: "Float" },
    label_AVERAGE_GT: { __type: "Float" },
    label_AVERAGE_GTE: { __type: "Float" },
    label_AVERAGE_LT: { __type: "Float" },
    label_AVERAGE_LTE: { __type: "Float" },
    label_EQUAL: { __type: "String" },
    label_GT: { __type: "Int" },
    label_GTE: { __type: "Int" },
    label_LONGEST_EQUAL: { __type: "Int" },
    label_LONGEST_GT: { __type: "Int" },
    label_LONGEST_GTE: { __type: "Int" },
    label_LONGEST_LT: { __type: "Int" },
    label_LONGEST_LTE: { __type: "Int" },
    label_LT: { __type: "Int" },
    label_LTE: { __type: "Int" },
    label_SHORTEST_EQUAL: { __type: "Int" },
    label_SHORTEST_GT: { __type: "Int" },
    label_SHORTEST_GTE: { __type: "Int" },
    label_SHORTEST_LT: { __type: "Int" },
    label_SHORTEST_LTE: { __type: "Int" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  RoleAppliancesRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveAppliance!" },
  },
  RoleAppliancesUpdateConnectionInput: {
    node: { __type: "HiveApplianceUpdateInput" },
  },
  RoleAppliancesUpdateFieldInput: {
    connect: { __type: "[RoleAppliancesConnectFieldInput!]" },
    connectOrCreate: { __type: "[RoleAppliancesConnectOrCreateFieldInput!]" },
    create: { __type: "[RoleAppliancesCreateFieldInput!]" },
    delete: { __type: "[RoleAppliancesDeleteFieldInput!]" },
    disconnect: { __type: "[RoleAppliancesDisconnectFieldInput!]" },
    update: { __type: "RoleAppliancesUpdateConnectionInput" },
    where: { __type: "RoleAppliancesConnectionWhere" },
  },
  RoleConnectInput: {
    appliances: { __type: "[RoleAppliancesConnectFieldInput!]" },
    organisation: { __type: "RoleOrganisationConnectFieldInput" },
    permissions: { __type: "[RolePermissionsConnectFieldInput!]" },
  },
  RoleConnectOrCreateInput: {
    appliances: { __type: "[RoleAppliancesConnectOrCreateFieldInput!]" },
    organisation: { __type: "RoleOrganisationConnectOrCreateFieldInput" },
    permissions: { __type: "[RolePermissionsConnectOrCreateFieldInput!]" },
  },
  RoleConnectOrCreateWhere: { node: { __type: "RoleUniqueWhere!" } },
  RoleConnectWhere: { node: { __type: "RoleWhere!" } },
  RoleCreateInput: {
    appliances: { __type: "RoleAppliancesFieldInput" },
    name: { __type: "String" },
    organisation: { __type: "RoleOrganisationFieldInput" },
    permissions: { __type: "RolePermissionsFieldInput" },
  },
  RoleDeleteInput: {
    appliances: { __type: "[RoleAppliancesDeleteFieldInput!]" },
    organisation: { __type: "RoleOrganisationDeleteFieldInput" },
    permissions: { __type: "[RolePermissionsDeleteFieldInput!]" },
  },
  RoleDisconnectInput: {
    appliances: { __type: "[RoleAppliancesDisconnectFieldInput!]" },
    organisation: { __type: "RoleOrganisationDisconnectFieldInput" },
    permissions: { __type: "[RolePermissionsDisconnectFieldInput!]" },
  },
  RoleHiveApplianceAppliancesAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "RoleHiveApplianceAppliancesNodeAggregateSelection" },
  },
  RoleHiveApplianceAppliancesNodeAggregateSelection: {
    __typename: { __type: "String!" },
    description: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    label: { __type: "StringAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  RoleHiveOrganisationOrganisationAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "RoleHiveOrganisationOrganisationNodeAggregateSelection" },
  },
  RoleHiveOrganisationOrganisationNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  RoleOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[RoleSort]" },
  },
  RoleOrganisationAggregateInput: {
    AND: { __type: "[RoleOrganisationAggregateInput!]" },
    OR: { __type: "[RoleOrganisationAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "RoleOrganisationNodeAggregationWhereInput" },
  },
  RoleOrganisationConnectFieldInput: {
    connect: { __type: "HiveOrganisationConnectInput" },
    where: { __type: "HiveOrganisationConnectWhere" },
  },
  RoleOrganisationConnectOrCreateFieldInput: {
    onCreate: { __type: "RoleOrganisationConnectOrCreateFieldInputOnCreate!" },
    where: { __type: "HiveOrganisationConnectOrCreateWhere!" },
  },
  RoleOrganisationConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  RoleOrganisationConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[RoleOrganisationRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  RoleOrganisationConnectionSort: { node: { __type: "HiveOrganisationSort" } },
  RoleOrganisationConnectionWhere: {
    AND: { __type: "[RoleOrganisationConnectionWhere!]" },
    OR: { __type: "[RoleOrganisationConnectionWhere!]" },
    node: { __type: "HiveOrganisationWhere" },
    node_NOT: { __type: "HiveOrganisationWhere" },
  },
  RoleOrganisationCreateFieldInput: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  RoleOrganisationDeleteFieldInput: {
    delete: { __type: "HiveOrganisationDeleteInput" },
    where: { __type: "RoleOrganisationConnectionWhere" },
  },
  RoleOrganisationDisconnectFieldInput: {
    disconnect: { __type: "HiveOrganisationDisconnectInput" },
    where: { __type: "RoleOrganisationConnectionWhere" },
  },
  RoleOrganisationFieldInput: {
    connect: { __type: "RoleOrganisationConnectFieldInput" },
    connectOrCreate: { __type: "RoleOrganisationConnectOrCreateFieldInput" },
    create: { __type: "RoleOrganisationCreateFieldInput" },
  },
  RoleOrganisationNodeAggregationWhereInput: {
    AND: { __type: "[RoleOrganisationNodeAggregationWhereInput!]" },
    OR: { __type: "[RoleOrganisationNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  RoleOrganisationRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveOrganisation!" },
  },
  RoleOrganisationUpdateConnectionInput: {
    node: { __type: "HiveOrganisationUpdateInput" },
  },
  RoleOrganisationUpdateFieldInput: {
    connect: { __type: "RoleOrganisationConnectFieldInput" },
    connectOrCreate: { __type: "RoleOrganisationConnectOrCreateFieldInput" },
    create: { __type: "RoleOrganisationCreateFieldInput" },
    delete: { __type: "RoleOrganisationDeleteFieldInput" },
    disconnect: { __type: "RoleOrganisationDisconnectFieldInput" },
    update: { __type: "RoleOrganisationUpdateConnectionInput" },
    where: { __type: "RoleOrganisationConnectionWhere" },
  },
  RolePermissionPermissionsAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "RolePermissionPermissionsNodeAggregateSelection" },
  },
  RolePermissionPermissionsNodeAggregateSelection: {
    __typename: { __type: "String!" },
    action: { __type: "StringAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    scope: { __type: "StringAggregateSelection!" },
  },
  RolePermissionsAggregateInput: {
    AND: { __type: "[RolePermissionsAggregateInput!]" },
    OR: { __type: "[RolePermissionsAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "RolePermissionsNodeAggregationWhereInput" },
  },
  RolePermissionsConnectFieldInput: {
    connect: { __type: "[PermissionConnectInput!]" },
    where: { __type: "PermissionConnectWhere" },
  },
  RolePermissionsConnectOrCreateFieldInput: {
    onCreate: { __type: "RolePermissionsConnectOrCreateFieldInputOnCreate!" },
    where: { __type: "PermissionConnectOrCreateWhere!" },
  },
  RolePermissionsConnectOrCreateFieldInputOnCreate: {
    node: { __type: "PermissionCreateInput!" },
  },
  RolePermissionsConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[RolePermissionsRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  RolePermissionsConnectionSort: { node: { __type: "PermissionSort" } },
  RolePermissionsConnectionWhere: {
    AND: { __type: "[RolePermissionsConnectionWhere!]" },
    OR: { __type: "[RolePermissionsConnectionWhere!]" },
    node: { __type: "PermissionWhere" },
    node_NOT: { __type: "PermissionWhere" },
  },
  RolePermissionsCreateFieldInput: {
    node: { __type: "PermissionCreateInput!" },
  },
  RolePermissionsDeleteFieldInput: {
    delete: { __type: "PermissionDeleteInput" },
    where: { __type: "RolePermissionsConnectionWhere" },
  },
  RolePermissionsDisconnectFieldInput: {
    disconnect: { __type: "PermissionDisconnectInput" },
    where: { __type: "RolePermissionsConnectionWhere" },
  },
  RolePermissionsFieldInput: {
    connect: { __type: "[RolePermissionsConnectFieldInput!]" },
    connectOrCreate: { __type: "[RolePermissionsConnectOrCreateFieldInput!]" },
    create: { __type: "[RolePermissionsCreateFieldInput!]" },
  },
  RolePermissionsNodeAggregationWhereInput: {
    AND: { __type: "[RolePermissionsNodeAggregationWhereInput!]" },
    OR: { __type: "[RolePermissionsNodeAggregationWhereInput!]" },
    action_AVERAGE_EQUAL: { __type: "Float" },
    action_AVERAGE_GT: { __type: "Float" },
    action_AVERAGE_GTE: { __type: "Float" },
    action_AVERAGE_LT: { __type: "Float" },
    action_AVERAGE_LTE: { __type: "Float" },
    action_EQUAL: { __type: "String" },
    action_GT: { __type: "Int" },
    action_GTE: { __type: "Int" },
    action_LONGEST_EQUAL: { __type: "Int" },
    action_LONGEST_GT: { __type: "Int" },
    action_LONGEST_GTE: { __type: "Int" },
    action_LONGEST_LT: { __type: "Int" },
    action_LONGEST_LTE: { __type: "Int" },
    action_LT: { __type: "Int" },
    action_LTE: { __type: "Int" },
    action_SHORTEST_EQUAL: { __type: "Int" },
    action_SHORTEST_GT: { __type: "Int" },
    action_SHORTEST_GTE: { __type: "Int" },
    action_SHORTEST_LT: { __type: "Int" },
    action_SHORTEST_LTE: { __type: "Int" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    scope_AVERAGE_EQUAL: { __type: "Float" },
    scope_AVERAGE_GT: { __type: "Float" },
    scope_AVERAGE_GTE: { __type: "Float" },
    scope_AVERAGE_LT: { __type: "Float" },
    scope_AVERAGE_LTE: { __type: "Float" },
    scope_EQUAL: { __type: "String" },
    scope_GT: { __type: "Int" },
    scope_GTE: { __type: "Int" },
    scope_LONGEST_EQUAL: { __type: "Int" },
    scope_LONGEST_GT: { __type: "Int" },
    scope_LONGEST_GTE: { __type: "Int" },
    scope_LONGEST_LT: { __type: "Int" },
    scope_LONGEST_LTE: { __type: "Int" },
    scope_LT: { __type: "Int" },
    scope_LTE: { __type: "Int" },
    scope_SHORTEST_EQUAL: { __type: "Int" },
    scope_SHORTEST_GT: { __type: "Int" },
    scope_SHORTEST_GTE: { __type: "Int" },
    scope_SHORTEST_LT: { __type: "Int" },
    scope_SHORTEST_LTE: { __type: "Int" },
  },
  RolePermissionsRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "Permission!" },
  },
  RolePermissionsUpdateConnectionInput: {
    node: { __type: "PermissionUpdateInput" },
  },
  RolePermissionsUpdateFieldInput: {
    connect: { __type: "[RolePermissionsConnectFieldInput!]" },
    connectOrCreate: { __type: "[RolePermissionsConnectOrCreateFieldInput!]" },
    create: { __type: "[RolePermissionsCreateFieldInput!]" },
    delete: { __type: "[RolePermissionsDeleteFieldInput!]" },
    disconnect: { __type: "[RolePermissionsDisconnectFieldInput!]" },
    update: { __type: "RolePermissionsUpdateConnectionInput" },
    where: { __type: "RolePermissionsConnectionWhere" },
  },
  RoleRelationInput: {
    appliances: { __type: "[RoleAppliancesCreateFieldInput!]" },
    organisation: { __type: "RoleOrganisationCreateFieldInput" },
    permissions: { __type: "[RolePermissionsCreateFieldInput!]" },
  },
  RoleSort: {
    id: { __type: "SortDirection" },
    name: { __type: "SortDirection" },
  },
  RoleUniqueWhere: { id: { __type: "ID" } },
  RoleUpdateInput: {
    appliances: { __type: "[RoleAppliancesUpdateFieldInput!]" },
    name: { __type: "String" },
    organisation: { __type: "RoleOrganisationUpdateFieldInput" },
    permissions: { __type: "[RolePermissionsUpdateFieldInput!]" },
  },
  RoleWhere: {
    AND: { __type: "[RoleWhere!]" },
    OR: { __type: "[RoleWhere!]" },
    appliances: { __type: "HiveApplianceWhere" },
    appliancesAggregate: { __type: "RoleAppliancesAggregateInput" },
    appliancesConnection: { __type: "RoleAppliancesConnectionWhere" },
    appliancesConnection_NOT: { __type: "RoleAppliancesConnectionWhere" },
    appliances_NOT: { __type: "HiveApplianceWhere" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    name: { __type: "String" },
    name_CONTAINS: { __type: "String" },
    name_ENDS_WITH: { __type: "String" },
    name_IN: { __type: "[String]" },
    name_NOT: { __type: "String" },
    name_NOT_CONTAINS: { __type: "String" },
    name_NOT_ENDS_WITH: { __type: "String" },
    name_NOT_IN: { __type: "[String]" },
    name_NOT_STARTS_WITH: { __type: "String" },
    name_STARTS_WITH: { __type: "String" },
    organisation: { __type: "HiveOrganisationWhere" },
    organisationAggregate: { __type: "RoleOrganisationAggregateInput" },
    organisationConnection: { __type: "RoleOrganisationConnectionWhere" },
    organisationConnection_NOT: { __type: "RoleOrganisationConnectionWhere" },
    organisation_NOT: { __type: "HiveOrganisationWhere" },
    permissions: { __type: "PermissionWhere" },
    permissionsAggregate: { __type: "RolePermissionsAggregateInput" },
    permissionsConnection: { __type: "RolePermissionsConnectionWhere" },
    permissionsConnection_NOT: { __type: "RolePermissionsConnectionWhere" },
    permissions_NOT: { __type: "PermissionWhere" },
  },
  ScheduleItem: {
    __typename: { __type: "String!" },
    date: { __type: "DateTime" },
    equipment: {
      __type: "[Equipment]",
      __args: { options: "EquipmentOptions", where: "EquipmentWhere" },
    },
    equipmentAggregate: {
      __type: "ScheduleItemEquipmentEquipmentAggregationSelection",
      __args: { where: "EquipmentWhere" },
    },
    equipmentConnection: {
      __type: "ScheduleItemEquipmentConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[ScheduleItemEquipmentConnectionSort!]",
        where: "ScheduleItemEquipmentConnectionWhere",
      },
    },
    id: { __type: "ID" },
    managers: {
      __type: "[HiveUser]",
      __args: { options: "HiveUserOptions", where: "HiveUserWhere" },
    },
    managersAggregate: {
      __type: "ScheduleItemHiveUserManagersAggregationSelection",
      __args: { where: "HiveUserWhere" },
    },
    managersConnection: {
      __type: "ScheduleItemManagersConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[ScheduleItemManagersConnectionSort!]",
        where: "ScheduleItemManagersConnectionWhere",
      },
    },
    notes: { __type: "[String]" },
    organisation: {
      __type: "HiveOrganisation",
      __args: {
        options: "HiveOrganisationOptions",
        where: "HiveOrganisationWhere",
      },
    },
    organisationAggregate: {
      __type: "ScheduleItemHiveOrganisationOrganisationAggregationSelection",
      __args: { where: "HiveOrganisationWhere" },
    },
    organisationConnection: {
      __type: "ScheduleItemOrganisationConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[ScheduleItemOrganisationConnectionSort!]",
        where: "ScheduleItemOrganisationConnectionWhere",
      },
    },
    owner: {
      __type: "HiveUser",
      __args: { options: "HiveUserOptions", where: "HiveUserWhere" },
    },
    ownerAggregate: {
      __type: "ScheduleItemHiveUserOwnerAggregationSelection",
      __args: { where: "HiveUserWhere" },
    },
    ownerConnection: {
      __type: "ScheduleItemOwnerConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[ScheduleItemOwnerConnectionSort!]",
        where: "ScheduleItemOwnerConnectionWhere",
      },
    },
    people: {
      __type: "[People]",
      __args: { options: "PeopleOptions", where: "PeopleWhere" },
    },
    peopleAggregate: {
      __type: "ScheduleItemPeoplePeopleAggregationSelection",
      __args: { where: "PeopleWhere" },
    },
    peopleConnection: {
      __type: "ScheduleItemPeopleConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[ScheduleItemPeopleConnectionSort!]",
        where: "ScheduleItemPeopleConnectionWhere",
      },
    },
    project: {
      __type: "Project",
      __args: { options: "ProjectOptions", where: "ProjectWhere" },
    },
    projectAggregate: {
      __type: "ScheduleItemProjectProjectAggregationSelection",
      __args: { where: "ProjectWhere" },
    },
    projectConnection: {
      __type: "ScheduleItemProjectConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[ScheduleItemProjectConnectionSort!]",
        where: "ScheduleItemProjectConnectionWhere",
      },
    },
  },
  ScheduleItemAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    date: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
  },
  ScheduleItemConnectInput: {
    equipment: { __type: "[ScheduleItemEquipmentConnectFieldInput!]" },
    managers: { __type: "[ScheduleItemManagersConnectFieldInput!]" },
    organisation: { __type: "ScheduleItemOrganisationConnectFieldInput" },
    owner: { __type: "ScheduleItemOwnerConnectFieldInput" },
    people: { __type: "[ScheduleItemPeopleConnectFieldInput!]" },
    project: { __type: "ScheduleItemProjectConnectFieldInput" },
  },
  ScheduleItemConnectOrCreateInput: {
    equipment: { __type: "[ScheduleItemEquipmentConnectOrCreateFieldInput!]" },
    managers: { __type: "[ScheduleItemManagersConnectOrCreateFieldInput!]" },
    organisation: {
      __type: "ScheduleItemOrganisationConnectOrCreateFieldInput",
    },
    owner: { __type: "ScheduleItemOwnerConnectOrCreateFieldInput" },
    people: { __type: "[ScheduleItemPeopleConnectOrCreateFieldInput!]" },
    project: { __type: "ScheduleItemProjectConnectOrCreateFieldInput" },
  },
  ScheduleItemConnectOrCreateWhere: {
    node: { __type: "ScheduleItemUniqueWhere!" },
  },
  ScheduleItemConnectWhere: { node: { __type: "ScheduleItemWhere!" } },
  ScheduleItemCreateInput: {
    date: { __type: "DateTime" },
    equipment: { __type: "ScheduleItemEquipmentFieldInput" },
    managers: { __type: "ScheduleItemManagersFieldInput" },
    notes: { __type: "[String]" },
    organisation: { __type: "ScheduleItemOrganisationFieldInput" },
    owner: { __type: "ScheduleItemOwnerFieldInput" },
    people: { __type: "ScheduleItemPeopleFieldInput" },
    project: { __type: "ScheduleItemProjectFieldInput" },
  },
  ScheduleItemDeleteInput: {
    equipment: { __type: "[ScheduleItemEquipmentDeleteFieldInput!]" },
    managers: { __type: "[ScheduleItemManagersDeleteFieldInput!]" },
    organisation: { __type: "ScheduleItemOrganisationDeleteFieldInput" },
    owner: { __type: "ScheduleItemOwnerDeleteFieldInput" },
    people: { __type: "[ScheduleItemPeopleDeleteFieldInput!]" },
    project: { __type: "ScheduleItemProjectDeleteFieldInput" },
  },
  ScheduleItemDisconnectInput: {
    equipment: { __type: "[ScheduleItemEquipmentDisconnectFieldInput!]" },
    managers: { __type: "[ScheduleItemManagersDisconnectFieldInput!]" },
    organisation: { __type: "ScheduleItemOrganisationDisconnectFieldInput" },
    owner: { __type: "ScheduleItemOwnerDisconnectFieldInput" },
    people: { __type: "[ScheduleItemPeopleDisconnectFieldInput!]" },
    project: { __type: "ScheduleItemProjectDisconnectFieldInput" },
  },
  ScheduleItemEquipmentAggregateInput: {
    AND: { __type: "[ScheduleItemEquipmentAggregateInput!]" },
    OR: { __type: "[ScheduleItemEquipmentAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "ScheduleItemEquipmentNodeAggregationWhereInput" },
  },
  ScheduleItemEquipmentConnectFieldInput: {
    connect: { __type: "[EquipmentConnectInput!]" },
    where: { __type: "EquipmentConnectWhere" },
  },
  ScheduleItemEquipmentConnectOrCreateFieldInput: {
    onCreate: {
      __type: "ScheduleItemEquipmentConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "EquipmentConnectOrCreateWhere!" },
  },
  ScheduleItemEquipmentConnectOrCreateFieldInputOnCreate: {
    node: { __type: "EquipmentCreateInput!" },
  },
  ScheduleItemEquipmentConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[ScheduleItemEquipmentRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  ScheduleItemEquipmentConnectionSort: { node: { __type: "EquipmentSort" } },
  ScheduleItemEquipmentConnectionWhere: {
    AND: { __type: "[ScheduleItemEquipmentConnectionWhere!]" },
    OR: { __type: "[ScheduleItemEquipmentConnectionWhere!]" },
    node: { __type: "EquipmentWhere" },
    node_NOT: { __type: "EquipmentWhere" },
  },
  ScheduleItemEquipmentCreateFieldInput: {
    node: { __type: "EquipmentCreateInput!" },
  },
  ScheduleItemEquipmentDeleteFieldInput: {
    delete: { __type: "EquipmentDeleteInput" },
    where: { __type: "ScheduleItemEquipmentConnectionWhere" },
  },
  ScheduleItemEquipmentDisconnectFieldInput: {
    disconnect: { __type: "EquipmentDisconnectInput" },
    where: { __type: "ScheduleItemEquipmentConnectionWhere" },
  },
  ScheduleItemEquipmentEquipmentAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "ScheduleItemEquipmentEquipmentNodeAggregateSelection" },
  },
  ScheduleItemEquipmentEquipmentNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    registration: { __type: "StringAggregateSelection!" },
  },
  ScheduleItemEquipmentFieldInput: {
    connect: { __type: "[ScheduleItemEquipmentConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[ScheduleItemEquipmentConnectOrCreateFieldInput!]",
    },
    create: { __type: "[ScheduleItemEquipmentCreateFieldInput!]" },
  },
  ScheduleItemEquipmentNodeAggregationWhereInput: {
    AND: { __type: "[ScheduleItemEquipmentNodeAggregationWhereInput!]" },
    OR: { __type: "[ScheduleItemEquipmentNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    registration_AVERAGE_EQUAL: { __type: "Float" },
    registration_AVERAGE_GT: { __type: "Float" },
    registration_AVERAGE_GTE: { __type: "Float" },
    registration_AVERAGE_LT: { __type: "Float" },
    registration_AVERAGE_LTE: { __type: "Float" },
    registration_EQUAL: { __type: "String" },
    registration_GT: { __type: "Int" },
    registration_GTE: { __type: "Int" },
    registration_LONGEST_EQUAL: { __type: "Int" },
    registration_LONGEST_GT: { __type: "Int" },
    registration_LONGEST_GTE: { __type: "Int" },
    registration_LONGEST_LT: { __type: "Int" },
    registration_LONGEST_LTE: { __type: "Int" },
    registration_LT: { __type: "Int" },
    registration_LTE: { __type: "Int" },
    registration_SHORTEST_EQUAL: { __type: "Int" },
    registration_SHORTEST_GT: { __type: "Int" },
    registration_SHORTEST_GTE: { __type: "Int" },
    registration_SHORTEST_LT: { __type: "Int" },
    registration_SHORTEST_LTE: { __type: "Int" },
  },
  ScheduleItemEquipmentRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "Equipment!" },
  },
  ScheduleItemEquipmentUpdateConnectionInput: {
    node: { __type: "EquipmentUpdateInput" },
  },
  ScheduleItemEquipmentUpdateFieldInput: {
    connect: { __type: "[ScheduleItemEquipmentConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[ScheduleItemEquipmentConnectOrCreateFieldInput!]",
    },
    create: { __type: "[ScheduleItemEquipmentCreateFieldInput!]" },
    delete: { __type: "[ScheduleItemEquipmentDeleteFieldInput!]" },
    disconnect: { __type: "[ScheduleItemEquipmentDisconnectFieldInput!]" },
    update: { __type: "ScheduleItemEquipmentUpdateConnectionInput" },
    where: { __type: "ScheduleItemEquipmentConnectionWhere" },
  },
  ScheduleItemHiveOrganisationOrganisationAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "ScheduleItemHiveOrganisationOrganisationNodeAggregateSelection",
    },
  },
  ScheduleItemHiveOrganisationOrganisationNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  ScheduleItemHiveUserManagersAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "ScheduleItemHiveUserManagersNodeAggregateSelection" },
  },
  ScheduleItemHiveUserManagersNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    password: { __type: "StringAggregateSelection!" },
    username: { __type: "StringAggregateSelection!" },
  },
  ScheduleItemHiveUserOwnerAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "ScheduleItemHiveUserOwnerNodeAggregateSelection" },
  },
  ScheduleItemHiveUserOwnerNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    password: { __type: "StringAggregateSelection!" },
    username: { __type: "StringAggregateSelection!" },
  },
  ScheduleItemManagersAggregateInput: {
    AND: { __type: "[ScheduleItemManagersAggregateInput!]" },
    OR: { __type: "[ScheduleItemManagersAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "ScheduleItemManagersNodeAggregationWhereInput" },
  },
  ScheduleItemManagersConnectFieldInput: {
    connect: { __type: "[HiveUserConnectInput!]" },
    where: { __type: "HiveUserConnectWhere" },
  },
  ScheduleItemManagersConnectOrCreateFieldInput: {
    onCreate: {
      __type: "ScheduleItemManagersConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveUserConnectOrCreateWhere!" },
  },
  ScheduleItemManagersConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveUserCreateInput!" },
  },
  ScheduleItemManagersConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[ScheduleItemManagersRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  ScheduleItemManagersConnectionSort: { node: { __type: "HiveUserSort" } },
  ScheduleItemManagersConnectionWhere: {
    AND: { __type: "[ScheduleItemManagersConnectionWhere!]" },
    OR: { __type: "[ScheduleItemManagersConnectionWhere!]" },
    node: { __type: "HiveUserWhere" },
    node_NOT: { __type: "HiveUserWhere" },
  },
  ScheduleItemManagersCreateFieldInput: {
    node: { __type: "HiveUserCreateInput!" },
  },
  ScheduleItemManagersDeleteFieldInput: {
    delete: { __type: "HiveUserDeleteInput" },
    where: { __type: "ScheduleItemManagersConnectionWhere" },
  },
  ScheduleItemManagersDisconnectFieldInput: {
    disconnect: { __type: "HiveUserDisconnectInput" },
    where: { __type: "ScheduleItemManagersConnectionWhere" },
  },
  ScheduleItemManagersFieldInput: {
    connect: { __type: "[ScheduleItemManagersConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[ScheduleItemManagersConnectOrCreateFieldInput!]",
    },
    create: { __type: "[ScheduleItemManagersCreateFieldInput!]" },
  },
  ScheduleItemManagersNodeAggregationWhereInput: {
    AND: { __type: "[ScheduleItemManagersNodeAggregationWhereInput!]" },
    OR: { __type: "[ScheduleItemManagersNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    password_AVERAGE_EQUAL: { __type: "Float" },
    password_AVERAGE_GT: { __type: "Float" },
    password_AVERAGE_GTE: { __type: "Float" },
    password_AVERAGE_LT: { __type: "Float" },
    password_AVERAGE_LTE: { __type: "Float" },
    password_EQUAL: { __type: "String" },
    password_GT: { __type: "Int" },
    password_GTE: { __type: "Int" },
    password_LONGEST_EQUAL: { __type: "Int" },
    password_LONGEST_GT: { __type: "Int" },
    password_LONGEST_GTE: { __type: "Int" },
    password_LONGEST_LT: { __type: "Int" },
    password_LONGEST_LTE: { __type: "Int" },
    password_LT: { __type: "Int" },
    password_LTE: { __type: "Int" },
    password_SHORTEST_EQUAL: { __type: "Int" },
    password_SHORTEST_GT: { __type: "Int" },
    password_SHORTEST_GTE: { __type: "Int" },
    password_SHORTEST_LT: { __type: "Int" },
    password_SHORTEST_LTE: { __type: "Int" },
    username_AVERAGE_EQUAL: { __type: "Float" },
    username_AVERAGE_GT: { __type: "Float" },
    username_AVERAGE_GTE: { __type: "Float" },
    username_AVERAGE_LT: { __type: "Float" },
    username_AVERAGE_LTE: { __type: "Float" },
    username_EQUAL: { __type: "String" },
    username_GT: { __type: "Int" },
    username_GTE: { __type: "Int" },
    username_LONGEST_EQUAL: { __type: "Int" },
    username_LONGEST_GT: { __type: "Int" },
    username_LONGEST_GTE: { __type: "Int" },
    username_LONGEST_LT: { __type: "Int" },
    username_LONGEST_LTE: { __type: "Int" },
    username_LT: { __type: "Int" },
    username_LTE: { __type: "Int" },
    username_SHORTEST_EQUAL: { __type: "Int" },
    username_SHORTEST_GT: { __type: "Int" },
    username_SHORTEST_GTE: { __type: "Int" },
    username_SHORTEST_LT: { __type: "Int" },
    username_SHORTEST_LTE: { __type: "Int" },
  },
  ScheduleItemManagersRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveUser!" },
  },
  ScheduleItemManagersUpdateConnectionInput: {
    node: { __type: "HiveUserUpdateInput" },
  },
  ScheduleItemManagersUpdateFieldInput: {
    connect: { __type: "[ScheduleItemManagersConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[ScheduleItemManagersConnectOrCreateFieldInput!]",
    },
    create: { __type: "[ScheduleItemManagersCreateFieldInput!]" },
    delete: { __type: "[ScheduleItemManagersDeleteFieldInput!]" },
    disconnect: { __type: "[ScheduleItemManagersDisconnectFieldInput!]" },
    update: { __type: "ScheduleItemManagersUpdateConnectionInput" },
    where: { __type: "ScheduleItemManagersConnectionWhere" },
  },
  ScheduleItemOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[ScheduleItemSort]" },
  },
  ScheduleItemOrganisationAggregateInput: {
    AND: { __type: "[ScheduleItemOrganisationAggregateInput!]" },
    OR: { __type: "[ScheduleItemOrganisationAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "ScheduleItemOrganisationNodeAggregationWhereInput" },
  },
  ScheduleItemOrganisationConnectFieldInput: {
    connect: { __type: "HiveOrganisationConnectInput" },
    where: { __type: "HiveOrganisationConnectWhere" },
  },
  ScheduleItemOrganisationConnectOrCreateFieldInput: {
    onCreate: {
      __type: "ScheduleItemOrganisationConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveOrganisationConnectOrCreateWhere!" },
  },
  ScheduleItemOrganisationConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  ScheduleItemOrganisationConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[ScheduleItemOrganisationRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  ScheduleItemOrganisationConnectionSort: {
    node: { __type: "HiveOrganisationSort" },
  },
  ScheduleItemOrganisationConnectionWhere: {
    AND: { __type: "[ScheduleItemOrganisationConnectionWhere!]" },
    OR: { __type: "[ScheduleItemOrganisationConnectionWhere!]" },
    node: { __type: "HiveOrganisationWhere" },
    node_NOT: { __type: "HiveOrganisationWhere" },
  },
  ScheduleItemOrganisationCreateFieldInput: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  ScheduleItemOrganisationDeleteFieldInput: {
    delete: { __type: "HiveOrganisationDeleteInput" },
    where: { __type: "ScheduleItemOrganisationConnectionWhere" },
  },
  ScheduleItemOrganisationDisconnectFieldInput: {
    disconnect: { __type: "HiveOrganisationDisconnectInput" },
    where: { __type: "ScheduleItemOrganisationConnectionWhere" },
  },
  ScheduleItemOrganisationFieldInput: {
    connect: { __type: "ScheduleItemOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "ScheduleItemOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "ScheduleItemOrganisationCreateFieldInput" },
  },
  ScheduleItemOrganisationNodeAggregationWhereInput: {
    AND: { __type: "[ScheduleItemOrganisationNodeAggregationWhereInput!]" },
    OR: { __type: "[ScheduleItemOrganisationNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  ScheduleItemOrganisationRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveOrganisation!" },
  },
  ScheduleItemOrganisationUpdateConnectionInput: {
    node: { __type: "HiveOrganisationUpdateInput" },
  },
  ScheduleItemOrganisationUpdateFieldInput: {
    connect: { __type: "ScheduleItemOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "ScheduleItemOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "ScheduleItemOrganisationCreateFieldInput" },
    delete: { __type: "ScheduleItemOrganisationDeleteFieldInput" },
    disconnect: { __type: "ScheduleItemOrganisationDisconnectFieldInput" },
    update: { __type: "ScheduleItemOrganisationUpdateConnectionInput" },
    where: { __type: "ScheduleItemOrganisationConnectionWhere" },
  },
  ScheduleItemOwnerAggregateInput: {
    AND: { __type: "[ScheduleItemOwnerAggregateInput!]" },
    OR: { __type: "[ScheduleItemOwnerAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "ScheduleItemOwnerNodeAggregationWhereInput" },
  },
  ScheduleItemOwnerConnectFieldInput: {
    connect: { __type: "HiveUserConnectInput" },
    where: { __type: "HiveUserConnectWhere" },
  },
  ScheduleItemOwnerConnectOrCreateFieldInput: {
    onCreate: { __type: "ScheduleItemOwnerConnectOrCreateFieldInputOnCreate!" },
    where: { __type: "HiveUserConnectOrCreateWhere!" },
  },
  ScheduleItemOwnerConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveUserCreateInput!" },
  },
  ScheduleItemOwnerConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[ScheduleItemOwnerRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  ScheduleItemOwnerConnectionSort: { node: { __type: "HiveUserSort" } },
  ScheduleItemOwnerConnectionWhere: {
    AND: { __type: "[ScheduleItemOwnerConnectionWhere!]" },
    OR: { __type: "[ScheduleItemOwnerConnectionWhere!]" },
    node: { __type: "HiveUserWhere" },
    node_NOT: { __type: "HiveUserWhere" },
  },
  ScheduleItemOwnerCreateFieldInput: {
    node: { __type: "HiveUserCreateInput!" },
  },
  ScheduleItemOwnerDeleteFieldInput: {
    delete: { __type: "HiveUserDeleteInput" },
    where: { __type: "ScheduleItemOwnerConnectionWhere" },
  },
  ScheduleItemOwnerDisconnectFieldInput: {
    disconnect: { __type: "HiveUserDisconnectInput" },
    where: { __type: "ScheduleItemOwnerConnectionWhere" },
  },
  ScheduleItemOwnerFieldInput: {
    connect: { __type: "ScheduleItemOwnerConnectFieldInput" },
    connectOrCreate: { __type: "ScheduleItemOwnerConnectOrCreateFieldInput" },
    create: { __type: "ScheduleItemOwnerCreateFieldInput" },
  },
  ScheduleItemOwnerNodeAggregationWhereInput: {
    AND: { __type: "[ScheduleItemOwnerNodeAggregationWhereInput!]" },
    OR: { __type: "[ScheduleItemOwnerNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    password_AVERAGE_EQUAL: { __type: "Float" },
    password_AVERAGE_GT: { __type: "Float" },
    password_AVERAGE_GTE: { __type: "Float" },
    password_AVERAGE_LT: { __type: "Float" },
    password_AVERAGE_LTE: { __type: "Float" },
    password_EQUAL: { __type: "String" },
    password_GT: { __type: "Int" },
    password_GTE: { __type: "Int" },
    password_LONGEST_EQUAL: { __type: "Int" },
    password_LONGEST_GT: { __type: "Int" },
    password_LONGEST_GTE: { __type: "Int" },
    password_LONGEST_LT: { __type: "Int" },
    password_LONGEST_LTE: { __type: "Int" },
    password_LT: { __type: "Int" },
    password_LTE: { __type: "Int" },
    password_SHORTEST_EQUAL: { __type: "Int" },
    password_SHORTEST_GT: { __type: "Int" },
    password_SHORTEST_GTE: { __type: "Int" },
    password_SHORTEST_LT: { __type: "Int" },
    password_SHORTEST_LTE: { __type: "Int" },
    username_AVERAGE_EQUAL: { __type: "Float" },
    username_AVERAGE_GT: { __type: "Float" },
    username_AVERAGE_GTE: { __type: "Float" },
    username_AVERAGE_LT: { __type: "Float" },
    username_AVERAGE_LTE: { __type: "Float" },
    username_EQUAL: { __type: "String" },
    username_GT: { __type: "Int" },
    username_GTE: { __type: "Int" },
    username_LONGEST_EQUAL: { __type: "Int" },
    username_LONGEST_GT: { __type: "Int" },
    username_LONGEST_GTE: { __type: "Int" },
    username_LONGEST_LT: { __type: "Int" },
    username_LONGEST_LTE: { __type: "Int" },
    username_LT: { __type: "Int" },
    username_LTE: { __type: "Int" },
    username_SHORTEST_EQUAL: { __type: "Int" },
    username_SHORTEST_GT: { __type: "Int" },
    username_SHORTEST_GTE: { __type: "Int" },
    username_SHORTEST_LT: { __type: "Int" },
    username_SHORTEST_LTE: { __type: "Int" },
  },
  ScheduleItemOwnerRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveUser!" },
  },
  ScheduleItemOwnerUpdateConnectionInput: {
    node: { __type: "HiveUserUpdateInput" },
  },
  ScheduleItemOwnerUpdateFieldInput: {
    connect: { __type: "ScheduleItemOwnerConnectFieldInput" },
    connectOrCreate: { __type: "ScheduleItemOwnerConnectOrCreateFieldInput" },
    create: { __type: "ScheduleItemOwnerCreateFieldInput" },
    delete: { __type: "ScheduleItemOwnerDeleteFieldInput" },
    disconnect: { __type: "ScheduleItemOwnerDisconnectFieldInput" },
    update: { __type: "ScheduleItemOwnerUpdateConnectionInput" },
    where: { __type: "ScheduleItemOwnerConnectionWhere" },
  },
  ScheduleItemPeopleAggregateInput: {
    AND: { __type: "[ScheduleItemPeopleAggregateInput!]" },
    OR: { __type: "[ScheduleItemPeopleAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "ScheduleItemPeopleNodeAggregationWhereInput" },
  },
  ScheduleItemPeopleConnectFieldInput: {
    connect: { __type: "[PeopleConnectInput!]" },
    where: { __type: "PeopleConnectWhere" },
  },
  ScheduleItemPeopleConnectOrCreateFieldInput: {
    onCreate: {
      __type: "ScheduleItemPeopleConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "PeopleConnectOrCreateWhere!" },
  },
  ScheduleItemPeopleConnectOrCreateFieldInputOnCreate: {
    node: { __type: "PeopleCreateInput!" },
  },
  ScheduleItemPeopleConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[ScheduleItemPeopleRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  ScheduleItemPeopleConnectionSort: { node: { __type: "PeopleSort" } },
  ScheduleItemPeopleConnectionWhere: {
    AND: { __type: "[ScheduleItemPeopleConnectionWhere!]" },
    OR: { __type: "[ScheduleItemPeopleConnectionWhere!]" },
    node: { __type: "PeopleWhere" },
    node_NOT: { __type: "PeopleWhere" },
  },
  ScheduleItemPeopleCreateFieldInput: {
    node: { __type: "PeopleCreateInput!" },
  },
  ScheduleItemPeopleDeleteFieldInput: {
    delete: { __type: "PeopleDeleteInput" },
    where: { __type: "ScheduleItemPeopleConnectionWhere" },
  },
  ScheduleItemPeopleDisconnectFieldInput: {
    disconnect: { __type: "PeopleDisconnectInput" },
    where: { __type: "ScheduleItemPeopleConnectionWhere" },
  },
  ScheduleItemPeopleFieldInput: {
    connect: { __type: "[ScheduleItemPeopleConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[ScheduleItemPeopleConnectOrCreateFieldInput!]",
    },
    create: { __type: "[ScheduleItemPeopleCreateFieldInput!]" },
  },
  ScheduleItemPeopleNodeAggregationWhereInput: {
    AND: { __type: "[ScheduleItemPeopleNodeAggregationWhereInput!]" },
    OR: { __type: "[ScheduleItemPeopleNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  ScheduleItemPeoplePeopleAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "ScheduleItemPeoplePeopleNodeAggregateSelection" },
  },
  ScheduleItemPeoplePeopleNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  ScheduleItemPeopleRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "People!" },
  },
  ScheduleItemPeopleUpdateConnectionInput: {
    node: { __type: "PeopleUpdateInput" },
  },
  ScheduleItemPeopleUpdateFieldInput: {
    connect: { __type: "[ScheduleItemPeopleConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[ScheduleItemPeopleConnectOrCreateFieldInput!]",
    },
    create: { __type: "[ScheduleItemPeopleCreateFieldInput!]" },
    delete: { __type: "[ScheduleItemPeopleDeleteFieldInput!]" },
    disconnect: { __type: "[ScheduleItemPeopleDisconnectFieldInput!]" },
    update: { __type: "ScheduleItemPeopleUpdateConnectionInput" },
    where: { __type: "ScheduleItemPeopleConnectionWhere" },
  },
  ScheduleItemProjectAggregateInput: {
    AND: { __type: "[ScheduleItemProjectAggregateInput!]" },
    OR: { __type: "[ScheduleItemProjectAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "ScheduleItemProjectNodeAggregationWhereInput" },
  },
  ScheduleItemProjectConnectFieldInput: {
    connect: { __type: "ProjectConnectInput" },
    where: { __type: "ProjectConnectWhere" },
  },
  ScheduleItemProjectConnectOrCreateFieldInput: {
    onCreate: {
      __type: "ScheduleItemProjectConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "ProjectConnectOrCreateWhere!" },
  },
  ScheduleItemProjectConnectOrCreateFieldInputOnCreate: {
    node: { __type: "ProjectCreateInput!" },
  },
  ScheduleItemProjectConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[ScheduleItemProjectRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  ScheduleItemProjectConnectionSort: { node: { __type: "ProjectSort" } },
  ScheduleItemProjectConnectionWhere: {
    AND: { __type: "[ScheduleItemProjectConnectionWhere!]" },
    OR: { __type: "[ScheduleItemProjectConnectionWhere!]" },
    node: { __type: "ProjectWhere" },
    node_NOT: { __type: "ProjectWhere" },
  },
  ScheduleItemProjectCreateFieldInput: {
    node: { __type: "ProjectCreateInput!" },
  },
  ScheduleItemProjectDeleteFieldInput: {
    delete: { __type: "ProjectDeleteInput" },
    where: { __type: "ScheduleItemProjectConnectionWhere" },
  },
  ScheduleItemProjectDisconnectFieldInput: {
    disconnect: { __type: "ProjectDisconnectInput" },
    where: { __type: "ScheduleItemProjectConnectionWhere" },
  },
  ScheduleItemProjectFieldInput: {
    connect: { __type: "ScheduleItemProjectConnectFieldInput" },
    connectOrCreate: { __type: "ScheduleItemProjectConnectOrCreateFieldInput" },
    create: { __type: "ScheduleItemProjectCreateFieldInput" },
  },
  ScheduleItemProjectNodeAggregationWhereInput: {
    AND: { __type: "[ScheduleItemProjectNodeAggregationWhereInput!]" },
    OR: { __type: "[ScheduleItemProjectNodeAggregationWhereInput!]" },
    endDate_EQUAL: { __type: "DateTime" },
    endDate_GT: { __type: "DateTime" },
    endDate_GTE: { __type: "DateTime" },
    endDate_LT: { __type: "DateTime" },
    endDate_LTE: { __type: "DateTime" },
    endDate_MAX_EQUAL: { __type: "DateTime" },
    endDate_MAX_GT: { __type: "DateTime" },
    endDate_MAX_GTE: { __type: "DateTime" },
    endDate_MAX_LT: { __type: "DateTime" },
    endDate_MAX_LTE: { __type: "DateTime" },
    endDate_MIN_EQUAL: { __type: "DateTime" },
    endDate_MIN_GT: { __type: "DateTime" },
    endDate_MIN_GTE: { __type: "DateTime" },
    endDate_MIN_LT: { __type: "DateTime" },
    endDate_MIN_LTE: { __type: "DateTime" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
    startDate_EQUAL: { __type: "DateTime" },
    startDate_GT: { __type: "DateTime" },
    startDate_GTE: { __type: "DateTime" },
    startDate_LT: { __type: "DateTime" },
    startDate_LTE: { __type: "DateTime" },
    startDate_MAX_EQUAL: { __type: "DateTime" },
    startDate_MAX_GT: { __type: "DateTime" },
    startDate_MAX_GTE: { __type: "DateTime" },
    startDate_MAX_LT: { __type: "DateTime" },
    startDate_MAX_LTE: { __type: "DateTime" },
    startDate_MIN_EQUAL: { __type: "DateTime" },
    startDate_MIN_GT: { __type: "DateTime" },
    startDate_MIN_GTE: { __type: "DateTime" },
    startDate_MIN_LT: { __type: "DateTime" },
    startDate_MIN_LTE: { __type: "DateTime" },
    status_AVERAGE_EQUAL: { __type: "Float" },
    status_AVERAGE_GT: { __type: "Float" },
    status_AVERAGE_GTE: { __type: "Float" },
    status_AVERAGE_LT: { __type: "Float" },
    status_AVERAGE_LTE: { __type: "Float" },
    status_EQUAL: { __type: "String" },
    status_GT: { __type: "Int" },
    status_GTE: { __type: "Int" },
    status_LONGEST_EQUAL: { __type: "Int" },
    status_LONGEST_GT: { __type: "Int" },
    status_LONGEST_GTE: { __type: "Int" },
    status_LONGEST_LT: { __type: "Int" },
    status_LONGEST_LTE: { __type: "Int" },
    status_LT: { __type: "Int" },
    status_LTE: { __type: "Int" },
    status_SHORTEST_EQUAL: { __type: "Int" },
    status_SHORTEST_GT: { __type: "Int" },
    status_SHORTEST_GTE: { __type: "Int" },
    status_SHORTEST_LT: { __type: "Int" },
    status_SHORTEST_LTE: { __type: "Int" },
  },
  ScheduleItemProjectProjectAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "ScheduleItemProjectProjectNodeAggregateSelection" },
  },
  ScheduleItemProjectProjectNodeAggregateSelection: {
    __typename: { __type: "String!" },
    endDate: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
    startDate: { __type: "DateTimeAggregateSelection!" },
    status: { __type: "StringAggregateSelection!" },
  },
  ScheduleItemProjectRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "Project!" },
  },
  ScheduleItemProjectUpdateConnectionInput: {
    node: { __type: "ProjectUpdateInput" },
  },
  ScheduleItemProjectUpdateFieldInput: {
    connect: { __type: "ScheduleItemProjectConnectFieldInput" },
    connectOrCreate: { __type: "ScheduleItemProjectConnectOrCreateFieldInput" },
    create: { __type: "ScheduleItemProjectCreateFieldInput" },
    delete: { __type: "ScheduleItemProjectDeleteFieldInput" },
    disconnect: { __type: "ScheduleItemProjectDisconnectFieldInput" },
    update: { __type: "ScheduleItemProjectUpdateConnectionInput" },
    where: { __type: "ScheduleItemProjectConnectionWhere" },
  },
  ScheduleItemRelationInput: {
    equipment: { __type: "[ScheduleItemEquipmentCreateFieldInput!]" },
    managers: { __type: "[ScheduleItemManagersCreateFieldInput!]" },
    organisation: { __type: "ScheduleItemOrganisationCreateFieldInput" },
    owner: { __type: "ScheduleItemOwnerCreateFieldInput" },
    people: { __type: "[ScheduleItemPeopleCreateFieldInput!]" },
    project: { __type: "ScheduleItemProjectCreateFieldInput" },
  },
  ScheduleItemSort: {
    date: { __type: "SortDirection" },
    id: { __type: "SortDirection" },
  },
  ScheduleItemUniqueWhere: { id: { __type: "ID" } },
  ScheduleItemUpdateInput: {
    date: { __type: "DateTime" },
    equipment: { __type: "[ScheduleItemEquipmentUpdateFieldInput!]" },
    managers: { __type: "[ScheduleItemManagersUpdateFieldInput!]" },
    notes: { __type: "[String]" },
    organisation: { __type: "ScheduleItemOrganisationUpdateFieldInput" },
    owner: { __type: "ScheduleItemOwnerUpdateFieldInput" },
    people: { __type: "[ScheduleItemPeopleUpdateFieldInput!]" },
    project: { __type: "ScheduleItemProjectUpdateFieldInput" },
  },
  ScheduleItemWhere: {
    AND: { __type: "[ScheduleItemWhere!]" },
    OR: { __type: "[ScheduleItemWhere!]" },
    date: { __type: "DateTime" },
    date_GT: { __type: "DateTime" },
    date_GTE: { __type: "DateTime" },
    date_IN: { __type: "[DateTime]" },
    date_LT: { __type: "DateTime" },
    date_LTE: { __type: "DateTime" },
    date_NOT: { __type: "DateTime" },
    date_NOT_IN: { __type: "[DateTime]" },
    equipment: { __type: "EquipmentWhere" },
    equipmentAggregate: { __type: "ScheduleItemEquipmentAggregateInput" },
    equipmentConnection: { __type: "ScheduleItemEquipmentConnectionWhere" },
    equipmentConnection_NOT: { __type: "ScheduleItemEquipmentConnectionWhere" },
    equipment_NOT: { __type: "EquipmentWhere" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    managers: { __type: "HiveUserWhere" },
    managersAggregate: { __type: "ScheduleItemManagersAggregateInput" },
    managersConnection: { __type: "ScheduleItemManagersConnectionWhere" },
    managersConnection_NOT: { __type: "ScheduleItemManagersConnectionWhere" },
    managers_NOT: { __type: "HiveUserWhere" },
    notes: { __type: "[String]" },
    notes_INCLUDES: { __type: "String" },
    notes_NOT: { __type: "[String]" },
    notes_NOT_INCLUDES: { __type: "String" },
    organisation: { __type: "HiveOrganisationWhere" },
    organisationAggregate: { __type: "ScheduleItemOrganisationAggregateInput" },
    organisationConnection: {
      __type: "ScheduleItemOrganisationConnectionWhere",
    },
    organisationConnection_NOT: {
      __type: "ScheduleItemOrganisationConnectionWhere",
    },
    organisation_NOT: { __type: "HiveOrganisationWhere" },
    owner: { __type: "HiveUserWhere" },
    ownerAggregate: { __type: "ScheduleItemOwnerAggregateInput" },
    ownerConnection: { __type: "ScheduleItemOwnerConnectionWhere" },
    ownerConnection_NOT: { __type: "ScheduleItemOwnerConnectionWhere" },
    owner_NOT: { __type: "HiveUserWhere" },
    people: { __type: "PeopleWhere" },
    peopleAggregate: { __type: "ScheduleItemPeopleAggregateInput" },
    peopleConnection: { __type: "ScheduleItemPeopleConnectionWhere" },
    peopleConnection_NOT: { __type: "ScheduleItemPeopleConnectionWhere" },
    people_NOT: { __type: "PeopleWhere" },
    project: { __type: "ProjectWhere" },
    projectAggregate: { __type: "ScheduleItemProjectAggregateInput" },
    projectConnection: { __type: "ScheduleItemProjectConnectionWhere" },
    projectConnection_NOT: { __type: "ScheduleItemProjectConnectionWhere" },
    project_NOT: { __type: "ProjectWhere" },
  },
  StringAggregateSelection: {
    __typename: { __type: "String!" },
    longest: { __type: "String" },
    shortest: { __type: "String" },
  },
  TimelineItem: {
    __typename: { __type: "String!" },
    endDate: { __type: "DateTime" },
    id: { __type: "ID" },
    items: {
      __type: "[TimelineItemItems]",
      __args: {
        options: "TimelineItemItemsOptions",
        where: "TimelineItemItemsWhere",
      },
    },
    itemsAggregate: {
      __type: "TimelineItemTimelineItemItemsItemsAggregationSelection",
      __args: { where: "TimelineItemItemsWhere" },
    },
    itemsConnection: {
      __type: "TimelineItemItemsConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[TimelineItemItemsConnectionSort!]",
        where: "TimelineItemItemsConnectionWhere",
      },
    },
    notes: { __type: "String" },
    organisation: {
      __type: "HiveOrganisation",
      __args: {
        options: "HiveOrganisationOptions",
        where: "HiveOrganisationWhere",
      },
    },
    organisationAggregate: {
      __type: "TimelineItemHiveOrganisationOrganisationAggregationSelection",
      __args: { where: "HiveOrganisationWhere" },
    },
    organisationConnection: {
      __type: "TimelineItemOrganisationConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[TimelineItemOrganisationConnectionSort!]",
        where: "TimelineItemOrganisationConnectionWhere",
      },
    },
    project: {
      __type: "TimelineProject",
      __args: { options: "QueryOptions", where: "TimelineProjectWhere" },
    },
    projectConnection: {
      __type: "TimelineItemProjectConnection!",
      __args: { where: "TimelineItemProjectConnectionWhere" },
    },
    startDate: { __type: "DateTime" },
    timeline: { __type: "String" },
  },
  TimelineItemAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    endDate: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    notes: { __type: "StringAggregateSelection!" },
    startDate: { __type: "DateTimeAggregateSelection!" },
    timeline: { __type: "StringAggregateSelection!" },
  },
  TimelineItemConnectInput: {
    items: { __type: "[TimelineItemItemsConnectFieldInput!]" },
    organisation: { __type: "TimelineItemOrganisationConnectFieldInput" },
    project: { __type: "TimelineItemProjectConnectInput" },
  },
  TimelineItemConnectOrCreateInput: {
    items: { __type: "[TimelineItemItemsConnectOrCreateFieldInput!]" },
    organisation: {
      __type: "TimelineItemOrganisationConnectOrCreateFieldInput",
    },
    project: { __type: "TimelineItemProjectConnectOrCreateInput" },
  },
  TimelineItemConnectOrCreateWhere: {
    node: { __type: "TimelineItemUniqueWhere!" },
  },
  TimelineItemConnectWhere: { node: { __type: "TimelineItemWhere!" } },
  TimelineItemCreateInput: {
    endDate: { __type: "DateTime" },
    items: { __type: "TimelineItemItemsFieldInput" },
    notes: { __type: "String" },
    organisation: { __type: "TimelineItemOrganisationFieldInput" },
    project: { __type: "TimelineItemProjectCreateInput" },
    startDate: { __type: "DateTime" },
    timeline: { __type: "String" },
  },
  TimelineItemDeleteInput: {
    items: { __type: "[TimelineItemItemsDeleteFieldInput!]" },
    organisation: { __type: "TimelineItemOrganisationDeleteFieldInput" },
    project: { __type: "TimelineItemProjectDeleteInput" },
  },
  TimelineItemDisconnectInput: {
    items: { __type: "[TimelineItemItemsDisconnectFieldInput!]" },
    organisation: { __type: "TimelineItemOrganisationDisconnectFieldInput" },
    project: { __type: "TimelineItemProjectDisconnectInput" },
  },
  TimelineItemHiveOrganisationOrganisationAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "TimelineItemHiveOrganisationOrganisationNodeAggregateSelection",
    },
  },
  TimelineItemHiveOrganisationOrganisationNodeAggregateSelection: {
    __typename: { __type: "String!" },
    id: { __type: "IDAggregateSelection!" },
    name: { __type: "StringAggregateSelection!" },
  },
  TimelineItemItems: {
    __typename: { __type: "String!" },
    estimate: { __type: "Float" },
    id: { __type: "ID" },
    item: {
      __type: "TimelineItem",
      __args: { options: "TimelineItemOptions", where: "TimelineItemWhere" },
    },
    itemAggregate: {
      __type: "TimelineItemItemsTimelineItemItemAggregationSelection",
      __args: { where: "TimelineItemWhere" },
    },
    itemConnection: {
      __type: "TimelineItemItemsItemConnection!",
      __args: {
        after: "String",
        first: "Int",
        sort: "[TimelineItemItemsItemConnectionSort!]",
        where: "TimelineItemItemsItemConnectionWhere",
      },
    },
    location: { __type: "String" },
    type: { __type: "String" },
  },
  TimelineItemItemsAggregateInput: {
    AND: { __type: "[TimelineItemItemsAggregateInput!]" },
    OR: { __type: "[TimelineItemItemsAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "TimelineItemItemsNodeAggregationWhereInput" },
  },
  TimelineItemItemsAggregateSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    estimate: { __type: "FloatAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    location: { __type: "StringAggregateSelection!" },
    type: { __type: "StringAggregateSelection!" },
  },
  TimelineItemItemsConnectFieldInput: {
    connect: { __type: "[TimelineItemItemsConnectInput!]" },
    where: { __type: "TimelineItemItemsConnectWhere" },
  },
  TimelineItemItemsConnectInput: {
    item: { __type: "TimelineItemItemsItemConnectFieldInput" },
  },
  TimelineItemItemsConnectOrCreateFieldInput: {
    onCreate: { __type: "TimelineItemItemsConnectOrCreateFieldInputOnCreate!" },
    where: { __type: "TimelineItemItemsConnectOrCreateWhere!" },
  },
  TimelineItemItemsConnectOrCreateFieldInputOnCreate: {
    node: { __type: "TimelineItemItemsCreateInput!" },
  },
  TimelineItemItemsConnectOrCreateInput: {
    item: { __type: "TimelineItemItemsItemConnectOrCreateFieldInput" },
  },
  TimelineItemItemsConnectOrCreateWhere: {
    node: { __type: "TimelineItemItemsUniqueWhere!" },
  },
  TimelineItemItemsConnectWhere: {
    node: { __type: "TimelineItemItemsWhere!" },
  },
  TimelineItemItemsConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[TimelineItemItemsRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  TimelineItemItemsConnectionSort: {
    node: { __type: "TimelineItemItemsSort" },
  },
  TimelineItemItemsConnectionWhere: {
    AND: { __type: "[TimelineItemItemsConnectionWhere!]" },
    OR: { __type: "[TimelineItemItemsConnectionWhere!]" },
    node: { __type: "TimelineItemItemsWhere" },
    node_NOT: { __type: "TimelineItemItemsWhere" },
  },
  TimelineItemItemsCreateFieldInput: {
    node: { __type: "TimelineItemItemsCreateInput!" },
  },
  TimelineItemItemsCreateInput: {
    estimate: { __type: "Float" },
    item: { __type: "TimelineItemItemsItemFieldInput" },
    location: { __type: "String" },
    type: { __type: "String" },
  },
  TimelineItemItemsDeleteFieldInput: {
    delete: { __type: "TimelineItemItemsDeleteInput" },
    where: { __type: "TimelineItemItemsConnectionWhere" },
  },
  TimelineItemItemsDeleteInput: {
    item: { __type: "TimelineItemItemsItemDeleteFieldInput" },
  },
  TimelineItemItemsDisconnectFieldInput: {
    disconnect: { __type: "TimelineItemItemsDisconnectInput" },
    where: { __type: "TimelineItemItemsConnectionWhere" },
  },
  TimelineItemItemsDisconnectInput: {
    item: { __type: "TimelineItemItemsItemDisconnectFieldInput" },
  },
  TimelineItemItemsFieldInput: {
    connect: { __type: "[TimelineItemItemsConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[TimelineItemItemsConnectOrCreateFieldInput!]",
    },
    create: { __type: "[TimelineItemItemsCreateFieldInput!]" },
  },
  TimelineItemItemsItemAggregateInput: {
    AND: { __type: "[TimelineItemItemsItemAggregateInput!]" },
    OR: { __type: "[TimelineItemItemsItemAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "TimelineItemItemsItemNodeAggregationWhereInput" },
  },
  TimelineItemItemsItemConnectFieldInput: {
    connect: { __type: "TimelineItemConnectInput" },
    where: { __type: "TimelineItemConnectWhere" },
  },
  TimelineItemItemsItemConnectOrCreateFieldInput: {
    onCreate: {
      __type: "TimelineItemItemsItemConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "TimelineItemConnectOrCreateWhere!" },
  },
  TimelineItemItemsItemConnectOrCreateFieldInputOnCreate: {
    node: { __type: "TimelineItemCreateInput!" },
  },
  TimelineItemItemsItemConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[TimelineItemItemsItemRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  TimelineItemItemsItemConnectionSort: { node: { __type: "TimelineItemSort" } },
  TimelineItemItemsItemConnectionWhere: {
    AND: { __type: "[TimelineItemItemsItemConnectionWhere!]" },
    OR: { __type: "[TimelineItemItemsItemConnectionWhere!]" },
    node: { __type: "TimelineItemWhere" },
    node_NOT: { __type: "TimelineItemWhere" },
  },
  TimelineItemItemsItemCreateFieldInput: {
    node: { __type: "TimelineItemCreateInput!" },
  },
  TimelineItemItemsItemDeleteFieldInput: {
    delete: { __type: "TimelineItemDeleteInput" },
    where: { __type: "TimelineItemItemsItemConnectionWhere" },
  },
  TimelineItemItemsItemDisconnectFieldInput: {
    disconnect: { __type: "TimelineItemDisconnectInput" },
    where: { __type: "TimelineItemItemsItemConnectionWhere" },
  },
  TimelineItemItemsItemFieldInput: {
    connect: { __type: "TimelineItemItemsItemConnectFieldInput" },
    connectOrCreate: {
      __type: "TimelineItemItemsItemConnectOrCreateFieldInput",
    },
    create: { __type: "TimelineItemItemsItemCreateFieldInput" },
  },
  TimelineItemItemsItemNodeAggregationWhereInput: {
    AND: { __type: "[TimelineItemItemsItemNodeAggregationWhereInput!]" },
    OR: { __type: "[TimelineItemItemsItemNodeAggregationWhereInput!]" },
    endDate_EQUAL: { __type: "DateTime" },
    endDate_GT: { __type: "DateTime" },
    endDate_GTE: { __type: "DateTime" },
    endDate_LT: { __type: "DateTime" },
    endDate_LTE: { __type: "DateTime" },
    endDate_MAX_EQUAL: { __type: "DateTime" },
    endDate_MAX_GT: { __type: "DateTime" },
    endDate_MAX_GTE: { __type: "DateTime" },
    endDate_MAX_LT: { __type: "DateTime" },
    endDate_MAX_LTE: { __type: "DateTime" },
    endDate_MIN_EQUAL: { __type: "DateTime" },
    endDate_MIN_GT: { __type: "DateTime" },
    endDate_MIN_GTE: { __type: "DateTime" },
    endDate_MIN_LT: { __type: "DateTime" },
    endDate_MIN_LTE: { __type: "DateTime" },
    id_EQUAL: { __type: "ID" },
    notes_AVERAGE_EQUAL: { __type: "Float" },
    notes_AVERAGE_GT: { __type: "Float" },
    notes_AVERAGE_GTE: { __type: "Float" },
    notes_AVERAGE_LT: { __type: "Float" },
    notes_AVERAGE_LTE: { __type: "Float" },
    notes_EQUAL: { __type: "String" },
    notes_GT: { __type: "Int" },
    notes_GTE: { __type: "Int" },
    notes_LONGEST_EQUAL: { __type: "Int" },
    notes_LONGEST_GT: { __type: "Int" },
    notes_LONGEST_GTE: { __type: "Int" },
    notes_LONGEST_LT: { __type: "Int" },
    notes_LONGEST_LTE: { __type: "Int" },
    notes_LT: { __type: "Int" },
    notes_LTE: { __type: "Int" },
    notes_SHORTEST_EQUAL: { __type: "Int" },
    notes_SHORTEST_GT: { __type: "Int" },
    notes_SHORTEST_GTE: { __type: "Int" },
    notes_SHORTEST_LT: { __type: "Int" },
    notes_SHORTEST_LTE: { __type: "Int" },
    startDate_EQUAL: { __type: "DateTime" },
    startDate_GT: { __type: "DateTime" },
    startDate_GTE: { __type: "DateTime" },
    startDate_LT: { __type: "DateTime" },
    startDate_LTE: { __type: "DateTime" },
    startDate_MAX_EQUAL: { __type: "DateTime" },
    startDate_MAX_GT: { __type: "DateTime" },
    startDate_MAX_GTE: { __type: "DateTime" },
    startDate_MAX_LT: { __type: "DateTime" },
    startDate_MAX_LTE: { __type: "DateTime" },
    startDate_MIN_EQUAL: { __type: "DateTime" },
    startDate_MIN_GT: { __type: "DateTime" },
    startDate_MIN_GTE: { __type: "DateTime" },
    startDate_MIN_LT: { __type: "DateTime" },
    startDate_MIN_LTE: { __type: "DateTime" },
    timeline_AVERAGE_EQUAL: { __type: "Float" },
    timeline_AVERAGE_GT: { __type: "Float" },
    timeline_AVERAGE_GTE: { __type: "Float" },
    timeline_AVERAGE_LT: { __type: "Float" },
    timeline_AVERAGE_LTE: { __type: "Float" },
    timeline_EQUAL: { __type: "String" },
    timeline_GT: { __type: "Int" },
    timeline_GTE: { __type: "Int" },
    timeline_LONGEST_EQUAL: { __type: "Int" },
    timeline_LONGEST_GT: { __type: "Int" },
    timeline_LONGEST_GTE: { __type: "Int" },
    timeline_LONGEST_LT: { __type: "Int" },
    timeline_LONGEST_LTE: { __type: "Int" },
    timeline_LT: { __type: "Int" },
    timeline_LTE: { __type: "Int" },
    timeline_SHORTEST_EQUAL: { __type: "Int" },
    timeline_SHORTEST_GT: { __type: "Int" },
    timeline_SHORTEST_GTE: { __type: "Int" },
    timeline_SHORTEST_LT: { __type: "Int" },
    timeline_SHORTEST_LTE: { __type: "Int" },
  },
  TimelineItemItemsItemRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "TimelineItem!" },
  },
  TimelineItemItemsItemUpdateConnectionInput: {
    node: { __type: "TimelineItemUpdateInput" },
  },
  TimelineItemItemsItemUpdateFieldInput: {
    connect: { __type: "TimelineItemItemsItemConnectFieldInput" },
    connectOrCreate: {
      __type: "TimelineItemItemsItemConnectOrCreateFieldInput",
    },
    create: { __type: "TimelineItemItemsItemCreateFieldInput" },
    delete: { __type: "TimelineItemItemsItemDeleteFieldInput" },
    disconnect: { __type: "TimelineItemItemsItemDisconnectFieldInput" },
    update: { __type: "TimelineItemItemsItemUpdateConnectionInput" },
    where: { __type: "TimelineItemItemsItemConnectionWhere" },
  },
  TimelineItemItemsNodeAggregationWhereInput: {
    AND: { __type: "[TimelineItemItemsNodeAggregationWhereInput!]" },
    OR: { __type: "[TimelineItemItemsNodeAggregationWhereInput!]" },
    estimate_AVERAGE_EQUAL: { __type: "Float" },
    estimate_AVERAGE_GT: { __type: "Float" },
    estimate_AVERAGE_GTE: { __type: "Float" },
    estimate_AVERAGE_LT: { __type: "Float" },
    estimate_AVERAGE_LTE: { __type: "Float" },
    estimate_EQUAL: { __type: "Float" },
    estimate_GT: { __type: "Float" },
    estimate_GTE: { __type: "Float" },
    estimate_LT: { __type: "Float" },
    estimate_LTE: { __type: "Float" },
    estimate_MAX_EQUAL: { __type: "Float" },
    estimate_MAX_GT: { __type: "Float" },
    estimate_MAX_GTE: { __type: "Float" },
    estimate_MAX_LT: { __type: "Float" },
    estimate_MAX_LTE: { __type: "Float" },
    estimate_MIN_EQUAL: { __type: "Float" },
    estimate_MIN_GT: { __type: "Float" },
    estimate_MIN_GTE: { __type: "Float" },
    estimate_MIN_LT: { __type: "Float" },
    estimate_MIN_LTE: { __type: "Float" },
    estimate_SUM_EQUAL: { __type: "Float" },
    estimate_SUM_GT: { __type: "Float" },
    estimate_SUM_GTE: { __type: "Float" },
    estimate_SUM_LT: { __type: "Float" },
    estimate_SUM_LTE: { __type: "Float" },
    id_EQUAL: { __type: "ID" },
    location_AVERAGE_EQUAL: { __type: "Float" },
    location_AVERAGE_GT: { __type: "Float" },
    location_AVERAGE_GTE: { __type: "Float" },
    location_AVERAGE_LT: { __type: "Float" },
    location_AVERAGE_LTE: { __type: "Float" },
    location_EQUAL: { __type: "String" },
    location_GT: { __type: "Int" },
    location_GTE: { __type: "Int" },
    location_LONGEST_EQUAL: { __type: "Int" },
    location_LONGEST_GT: { __type: "Int" },
    location_LONGEST_GTE: { __type: "Int" },
    location_LONGEST_LT: { __type: "Int" },
    location_LONGEST_LTE: { __type: "Int" },
    location_LT: { __type: "Int" },
    location_LTE: { __type: "Int" },
    location_SHORTEST_EQUAL: { __type: "Int" },
    location_SHORTEST_GT: { __type: "Int" },
    location_SHORTEST_GTE: { __type: "Int" },
    location_SHORTEST_LT: { __type: "Int" },
    location_SHORTEST_LTE: { __type: "Int" },
    type_AVERAGE_EQUAL: { __type: "Float" },
    type_AVERAGE_GT: { __type: "Float" },
    type_AVERAGE_GTE: { __type: "Float" },
    type_AVERAGE_LT: { __type: "Float" },
    type_AVERAGE_LTE: { __type: "Float" },
    type_EQUAL: { __type: "String" },
    type_GT: { __type: "Int" },
    type_GTE: { __type: "Int" },
    type_LONGEST_EQUAL: { __type: "Int" },
    type_LONGEST_GT: { __type: "Int" },
    type_LONGEST_GTE: { __type: "Int" },
    type_LONGEST_LT: { __type: "Int" },
    type_LONGEST_LTE: { __type: "Int" },
    type_LT: { __type: "Int" },
    type_LTE: { __type: "Int" },
    type_SHORTEST_EQUAL: { __type: "Int" },
    type_SHORTEST_GT: { __type: "Int" },
    type_SHORTEST_GTE: { __type: "Int" },
    type_SHORTEST_LT: { __type: "Int" },
    type_SHORTEST_LTE: { __type: "Int" },
  },
  TimelineItemItemsOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[TimelineItemItemsSort]" },
  },
  TimelineItemItemsRelationInput: {
    item: { __type: "TimelineItemItemsItemCreateFieldInput" },
  },
  TimelineItemItemsRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "TimelineItemItems!" },
  },
  TimelineItemItemsSort: {
    estimate: { __type: "SortDirection" },
    id: { __type: "SortDirection" },
    location: { __type: "SortDirection" },
    type: { __type: "SortDirection" },
  },
  TimelineItemItemsTimelineItemItemAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: { __type: "TimelineItemItemsTimelineItemItemNodeAggregateSelection" },
  },
  TimelineItemItemsTimelineItemItemNodeAggregateSelection: {
    __typename: { __type: "String!" },
    endDate: { __type: "DateTimeAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    notes: { __type: "StringAggregateSelection!" },
    startDate: { __type: "DateTimeAggregateSelection!" },
    timeline: { __type: "StringAggregateSelection!" },
  },
  TimelineItemItemsUniqueWhere: { id: { __type: "ID" } },
  TimelineItemItemsUpdateConnectionInput: {
    node: { __type: "TimelineItemItemsUpdateInput" },
  },
  TimelineItemItemsUpdateFieldInput: {
    connect: { __type: "[TimelineItemItemsConnectFieldInput!]" },
    connectOrCreate: {
      __type: "[TimelineItemItemsConnectOrCreateFieldInput!]",
    },
    create: { __type: "[TimelineItemItemsCreateFieldInput!]" },
    delete: { __type: "[TimelineItemItemsDeleteFieldInput!]" },
    disconnect: { __type: "[TimelineItemItemsDisconnectFieldInput!]" },
    update: { __type: "TimelineItemItemsUpdateConnectionInput" },
    where: { __type: "TimelineItemItemsConnectionWhere" },
  },
  TimelineItemItemsUpdateInput: {
    estimate: { __type: "Float" },
    item: { __type: "TimelineItemItemsItemUpdateFieldInput" },
    location: { __type: "String" },
    type: { __type: "String" },
  },
  TimelineItemItemsWhere: {
    AND: { __type: "[TimelineItemItemsWhere!]" },
    OR: { __type: "[TimelineItemItemsWhere!]" },
    estimate: { __type: "Float" },
    estimate_GT: { __type: "Float" },
    estimate_GTE: { __type: "Float" },
    estimate_IN: { __type: "[Float]" },
    estimate_LT: { __type: "Float" },
    estimate_LTE: { __type: "Float" },
    estimate_NOT: { __type: "Float" },
    estimate_NOT_IN: { __type: "[Float]" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    item: { __type: "TimelineItemWhere" },
    itemAggregate: { __type: "TimelineItemItemsItemAggregateInput" },
    itemConnection: { __type: "TimelineItemItemsItemConnectionWhere" },
    itemConnection_NOT: { __type: "TimelineItemItemsItemConnectionWhere" },
    item_NOT: { __type: "TimelineItemWhere" },
    location: { __type: "String" },
    location_CONTAINS: { __type: "String" },
    location_ENDS_WITH: { __type: "String" },
    location_IN: { __type: "[String]" },
    location_NOT: { __type: "String" },
    location_NOT_CONTAINS: { __type: "String" },
    location_NOT_ENDS_WITH: { __type: "String" },
    location_NOT_IN: { __type: "[String]" },
    location_NOT_STARTS_WITH: { __type: "String" },
    location_STARTS_WITH: { __type: "String" },
    type: { __type: "String" },
    type_CONTAINS: { __type: "String" },
    type_ENDS_WITH: { __type: "String" },
    type_IN: { __type: "[String]" },
    type_NOT: { __type: "String" },
    type_NOT_CONTAINS: { __type: "String" },
    type_NOT_ENDS_WITH: { __type: "String" },
    type_NOT_IN: { __type: "[String]" },
    type_NOT_STARTS_WITH: { __type: "String" },
    type_STARTS_WITH: { __type: "String" },
  },
  TimelineItemOptions: {
    limit: { __type: "Int" },
    offset: { __type: "Int" },
    sort: { __type: "[TimelineItemSort]" },
  },
  TimelineItemOrganisationAggregateInput: {
    AND: { __type: "[TimelineItemOrganisationAggregateInput!]" },
    OR: { __type: "[TimelineItemOrganisationAggregateInput!]" },
    count: { __type: "Int" },
    count_GT: { __type: "Int" },
    count_GTE: { __type: "Int" },
    count_LT: { __type: "Int" },
    count_LTE: { __type: "Int" },
    node: { __type: "TimelineItemOrganisationNodeAggregationWhereInput" },
  },
  TimelineItemOrganisationConnectFieldInput: {
    connect: { __type: "HiveOrganisationConnectInput" },
    where: { __type: "HiveOrganisationConnectWhere" },
  },
  TimelineItemOrganisationConnectOrCreateFieldInput: {
    onCreate: {
      __type: "TimelineItemOrganisationConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "HiveOrganisationConnectOrCreateWhere!" },
  },
  TimelineItemOrganisationConnectOrCreateFieldInputOnCreate: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  TimelineItemOrganisationConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[TimelineItemOrganisationRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  TimelineItemOrganisationConnectionSort: {
    node: { __type: "HiveOrganisationSort" },
  },
  TimelineItemOrganisationConnectionWhere: {
    AND: { __type: "[TimelineItemOrganisationConnectionWhere!]" },
    OR: { __type: "[TimelineItemOrganisationConnectionWhere!]" },
    node: { __type: "HiveOrganisationWhere" },
    node_NOT: { __type: "HiveOrganisationWhere" },
  },
  TimelineItemOrganisationCreateFieldInput: {
    node: { __type: "HiveOrganisationCreateInput!" },
  },
  TimelineItemOrganisationDeleteFieldInput: {
    delete: { __type: "HiveOrganisationDeleteInput" },
    where: { __type: "TimelineItemOrganisationConnectionWhere" },
  },
  TimelineItemOrganisationDisconnectFieldInput: {
    disconnect: { __type: "HiveOrganisationDisconnectInput" },
    where: { __type: "TimelineItemOrganisationConnectionWhere" },
  },
  TimelineItemOrganisationFieldInput: {
    connect: { __type: "TimelineItemOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "TimelineItemOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "TimelineItemOrganisationCreateFieldInput" },
  },
  TimelineItemOrganisationNodeAggregationWhereInput: {
    AND: { __type: "[TimelineItemOrganisationNodeAggregationWhereInput!]" },
    OR: { __type: "[TimelineItemOrganisationNodeAggregationWhereInput!]" },
    id_EQUAL: { __type: "ID" },
    name_AVERAGE_EQUAL: { __type: "Float" },
    name_AVERAGE_GT: { __type: "Float" },
    name_AVERAGE_GTE: { __type: "Float" },
    name_AVERAGE_LT: { __type: "Float" },
    name_AVERAGE_LTE: { __type: "Float" },
    name_EQUAL: { __type: "String" },
    name_GT: { __type: "Int" },
    name_GTE: { __type: "Int" },
    name_LONGEST_EQUAL: { __type: "Int" },
    name_LONGEST_GT: { __type: "Int" },
    name_LONGEST_GTE: { __type: "Int" },
    name_LONGEST_LT: { __type: "Int" },
    name_LONGEST_LTE: { __type: "Int" },
    name_LT: { __type: "Int" },
    name_LTE: { __type: "Int" },
    name_SHORTEST_EQUAL: { __type: "Int" },
    name_SHORTEST_GT: { __type: "Int" },
    name_SHORTEST_GTE: { __type: "Int" },
    name_SHORTEST_LT: { __type: "Int" },
    name_SHORTEST_LTE: { __type: "Int" },
  },
  TimelineItemOrganisationRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "HiveOrganisation!" },
  },
  TimelineItemOrganisationUpdateConnectionInput: {
    node: { __type: "HiveOrganisationUpdateInput" },
  },
  TimelineItemOrganisationUpdateFieldInput: {
    connect: { __type: "TimelineItemOrganisationConnectFieldInput" },
    connectOrCreate: {
      __type: "TimelineItemOrganisationConnectOrCreateFieldInput",
    },
    create: { __type: "TimelineItemOrganisationCreateFieldInput" },
    delete: { __type: "TimelineItemOrganisationDeleteFieldInput" },
    disconnect: { __type: "TimelineItemOrganisationDisconnectFieldInput" },
    update: { __type: "TimelineItemOrganisationUpdateConnectionInput" },
    where: { __type: "TimelineItemOrganisationConnectionWhere" },
  },
  TimelineItemProjectConnectInput: {
    Estimate: { __type: "TimelineItemProjectEstimateConnectFieldInput" },
    Project: { __type: "TimelineItemProjectProjectConnectFieldInput" },
  },
  TimelineItemProjectConnectOrCreateInput: {
    Estimate: {
      __type: "TimelineItemProjectEstimateConnectOrCreateFieldInput",
    },
    Project: { __type: "TimelineItemProjectProjectConnectOrCreateFieldInput" },
  },
  TimelineItemProjectConnection: {
    __typename: { __type: "String!" },
    edges: { __type: "[TimelineItemProjectRelationship!]!" },
    pageInfo: { __type: "PageInfo!" },
    totalCount: { __type: "Int!" },
  },
  TimelineItemProjectConnectionEstimateWhere: {
    AND: { __type: "[TimelineItemProjectConnectionEstimateWhere]" },
    OR: { __type: "[TimelineItemProjectConnectionEstimateWhere]" },
    node: { __type: "EstimateWhere" },
    node_NOT: { __type: "EstimateWhere" },
  },
  TimelineItemProjectConnectionProjectWhere: {
    AND: { __type: "[TimelineItemProjectConnectionProjectWhere]" },
    OR: { __type: "[TimelineItemProjectConnectionProjectWhere]" },
    node: { __type: "ProjectWhere" },
    node_NOT: { __type: "ProjectWhere" },
  },
  TimelineItemProjectConnectionWhere: {
    Estimate: { __type: "TimelineItemProjectConnectionEstimateWhere" },
    Project: { __type: "TimelineItemProjectConnectionProjectWhere" },
  },
  TimelineItemProjectCreateFieldInput: {
    Estimate: { __type: "[TimelineItemProjectEstimateCreateFieldInput!]" },
    Project: { __type: "[TimelineItemProjectProjectCreateFieldInput!]" },
  },
  TimelineItemProjectCreateInput: {
    Estimate: { __type: "TimelineItemProjectEstimateFieldInput" },
    Project: { __type: "TimelineItemProjectProjectFieldInput" },
  },
  TimelineItemProjectDeleteInput: {
    Estimate: { __type: "TimelineItemProjectEstimateDeleteFieldInput" },
    Project: { __type: "TimelineItemProjectProjectDeleteFieldInput" },
  },
  TimelineItemProjectDisconnectInput: {
    Estimate: { __type: "TimelineItemProjectEstimateDisconnectFieldInput" },
    Project: { __type: "TimelineItemProjectProjectDisconnectFieldInput" },
  },
  TimelineItemProjectEstimateConnectFieldInput: {
    connect: { __type: "EstimateConnectInput" },
    where: { __type: "EstimateConnectWhere" },
  },
  TimelineItemProjectEstimateConnectOrCreateFieldInput: {
    onCreate: {
      __type: "TimelineItemProjectEstimateConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "EstimateConnectOrCreateWhere!" },
  },
  TimelineItemProjectEstimateConnectOrCreateFieldInputOnCreate: {
    node: { __type: "EstimateCreateInput!" },
  },
  TimelineItemProjectEstimateConnectionWhere: {
    AND: { __type: "[TimelineItemProjectEstimateConnectionWhere!]" },
    OR: { __type: "[TimelineItemProjectEstimateConnectionWhere!]" },
    node: { __type: "EstimateWhere" },
    node_NOT: { __type: "EstimateWhere" },
  },
  TimelineItemProjectEstimateCreateFieldInput: {
    node: { __type: "EstimateCreateInput!" },
  },
  TimelineItemProjectEstimateDeleteFieldInput: {
    delete: { __type: "EstimateDeleteInput" },
    where: { __type: "TimelineItemProjectEstimateConnectionWhere" },
  },
  TimelineItemProjectEstimateDisconnectFieldInput: {
    disconnect: { __type: "EstimateDisconnectInput" },
    where: { __type: "TimelineItemProjectEstimateConnectionWhere" },
  },
  TimelineItemProjectEstimateFieldInput: {
    connect: { __type: "TimelineItemProjectEstimateConnectFieldInput" },
    connectOrCreate: {
      __type: "TimelineItemProjectEstimateConnectOrCreateFieldInput",
    },
    create: { __type: "TimelineItemProjectEstimateCreateFieldInput" },
  },
  TimelineItemProjectEstimateUpdateConnectionInput: {
    node: { __type: "EstimateUpdateInput" },
  },
  TimelineItemProjectEstimateUpdateFieldInput: {
    connect: { __type: "TimelineItemProjectEstimateConnectFieldInput" },
    connectOrCreate: {
      __type: "TimelineItemProjectEstimateConnectOrCreateFieldInput",
    },
    create: { __type: "TimelineItemProjectEstimateCreateFieldInput" },
    delete: { __type: "TimelineItemProjectEstimateDeleteFieldInput" },
    disconnect: { __type: "TimelineItemProjectEstimateDisconnectFieldInput" },
    update: { __type: "TimelineItemProjectEstimateUpdateConnectionInput" },
    where: { __type: "TimelineItemProjectEstimateConnectionWhere" },
  },
  TimelineItemProjectProjectConnectFieldInput: {
    connect: { __type: "ProjectConnectInput" },
    where: { __type: "ProjectConnectWhere" },
  },
  TimelineItemProjectProjectConnectOrCreateFieldInput: {
    onCreate: {
      __type: "TimelineItemProjectProjectConnectOrCreateFieldInputOnCreate!",
    },
    where: { __type: "ProjectConnectOrCreateWhere!" },
  },
  TimelineItemProjectProjectConnectOrCreateFieldInputOnCreate: {
    node: { __type: "ProjectCreateInput!" },
  },
  TimelineItemProjectProjectConnectionWhere: {
    AND: { __type: "[TimelineItemProjectProjectConnectionWhere!]" },
    OR: { __type: "[TimelineItemProjectProjectConnectionWhere!]" },
    node: { __type: "ProjectWhere" },
    node_NOT: { __type: "ProjectWhere" },
  },
  TimelineItemProjectProjectCreateFieldInput: {
    node: { __type: "ProjectCreateInput!" },
  },
  TimelineItemProjectProjectDeleteFieldInput: {
    delete: { __type: "ProjectDeleteInput" },
    where: { __type: "TimelineItemProjectProjectConnectionWhere" },
  },
  TimelineItemProjectProjectDisconnectFieldInput: {
    disconnect: { __type: "ProjectDisconnectInput" },
    where: { __type: "TimelineItemProjectProjectConnectionWhere" },
  },
  TimelineItemProjectProjectFieldInput: {
    connect: { __type: "TimelineItemProjectProjectConnectFieldInput" },
    connectOrCreate: {
      __type: "TimelineItemProjectProjectConnectOrCreateFieldInput",
    },
    create: { __type: "TimelineItemProjectProjectCreateFieldInput" },
  },
  TimelineItemProjectProjectUpdateConnectionInput: {
    node: { __type: "ProjectUpdateInput" },
  },
  TimelineItemProjectProjectUpdateFieldInput: {
    connect: { __type: "TimelineItemProjectProjectConnectFieldInput" },
    connectOrCreate: {
      __type: "TimelineItemProjectProjectConnectOrCreateFieldInput",
    },
    create: { __type: "TimelineItemProjectProjectCreateFieldInput" },
    delete: { __type: "TimelineItemProjectProjectDeleteFieldInput" },
    disconnect: { __type: "TimelineItemProjectProjectDisconnectFieldInput" },
    update: { __type: "TimelineItemProjectProjectUpdateConnectionInput" },
    where: { __type: "TimelineItemProjectProjectConnectionWhere" },
  },
  TimelineItemProjectRelationship: {
    __typename: { __type: "String!" },
    cursor: { __type: "String!" },
    node: { __type: "TimelineProject!" },
  },
  TimelineItemProjectUpdateInput: {
    Estimate: { __type: "TimelineItemProjectEstimateUpdateFieldInput" },
    Project: { __type: "TimelineItemProjectProjectUpdateFieldInput" },
  },
  TimelineItemRelationInput: {
    items: { __type: "[TimelineItemItemsCreateFieldInput!]" },
    organisation: { __type: "TimelineItemOrganisationCreateFieldInput" },
    project: { __type: "TimelineItemProjectCreateFieldInput" },
  },
  TimelineItemSort: {
    endDate: { __type: "SortDirection" },
    id: { __type: "SortDirection" },
    notes: { __type: "SortDirection" },
    startDate: { __type: "SortDirection" },
    timeline: { __type: "SortDirection" },
  },
  TimelineItemTimelineItemItemsItemsAggregationSelection: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
    node: {
      __type: "TimelineItemTimelineItemItemsItemsNodeAggregateSelection",
    },
  },
  TimelineItemTimelineItemItemsItemsNodeAggregateSelection: {
    __typename: { __type: "String!" },
    estimate: { __type: "FloatAggregateSelection!" },
    id: { __type: "IDAggregateSelection!" },
    location: { __type: "StringAggregateSelection!" },
    type: { __type: "StringAggregateSelection!" },
  },
  TimelineItemUniqueWhere: { id: { __type: "ID" } },
  TimelineItemUpdateInput: {
    endDate: { __type: "DateTime" },
    items: { __type: "[TimelineItemItemsUpdateFieldInput!]" },
    notes: { __type: "String" },
    organisation: { __type: "TimelineItemOrganisationUpdateFieldInput" },
    project: { __type: "TimelineItemProjectUpdateInput" },
    startDate: { __type: "DateTime" },
    timeline: { __type: "String" },
  },
  TimelineItemWhere: {
    AND: { __type: "[TimelineItemWhere!]" },
    OR: { __type: "[TimelineItemWhere!]" },
    endDate: { __type: "DateTime" },
    endDate_GT: { __type: "DateTime" },
    endDate_GTE: { __type: "DateTime" },
    endDate_IN: { __type: "[DateTime]" },
    endDate_LT: { __type: "DateTime" },
    endDate_LTE: { __type: "DateTime" },
    endDate_NOT: { __type: "DateTime" },
    endDate_NOT_IN: { __type: "[DateTime]" },
    id: { __type: "ID" },
    id_CONTAINS: { __type: "ID" },
    id_ENDS_WITH: { __type: "ID" },
    id_IN: { __type: "[ID]" },
    id_NOT: { __type: "ID" },
    id_NOT_CONTAINS: { __type: "ID" },
    id_NOT_ENDS_WITH: { __type: "ID" },
    id_NOT_IN: { __type: "[ID]" },
    id_NOT_STARTS_WITH: { __type: "ID" },
    id_STARTS_WITH: { __type: "ID" },
    items: { __type: "TimelineItemItemsWhere" },
    itemsAggregate: { __type: "TimelineItemItemsAggregateInput" },
    itemsConnection: { __type: "TimelineItemItemsConnectionWhere" },
    itemsConnection_NOT: { __type: "TimelineItemItemsConnectionWhere" },
    items_NOT: { __type: "TimelineItemItemsWhere" },
    notes: { __type: "String" },
    notes_CONTAINS: { __type: "String" },
    notes_ENDS_WITH: { __type: "String" },
    notes_IN: { __type: "[String]" },
    notes_NOT: { __type: "String" },
    notes_NOT_CONTAINS: { __type: "String" },
    notes_NOT_ENDS_WITH: { __type: "String" },
    notes_NOT_IN: { __type: "[String]" },
    notes_NOT_STARTS_WITH: { __type: "String" },
    notes_STARTS_WITH: { __type: "String" },
    organisation: { __type: "HiveOrganisationWhere" },
    organisationAggregate: { __type: "TimelineItemOrganisationAggregateInput" },
    organisationConnection: {
      __type: "TimelineItemOrganisationConnectionWhere",
    },
    organisationConnection_NOT: {
      __type: "TimelineItemOrganisationConnectionWhere",
    },
    organisation_NOT: { __type: "HiveOrganisationWhere" },
    projectConnection: { __type: "TimelineItemProjectConnectionWhere" },
    projectConnection_NOT: { __type: "TimelineItemProjectConnectionWhere" },
    startDate: { __type: "DateTime" },
    startDate_GT: { __type: "DateTime" },
    startDate_GTE: { __type: "DateTime" },
    startDate_IN: { __type: "[DateTime]" },
    startDate_LT: { __type: "DateTime" },
    startDate_LTE: { __type: "DateTime" },
    startDate_NOT: { __type: "DateTime" },
    startDate_NOT_IN: { __type: "[DateTime]" },
    timeline: { __type: "String" },
    timeline_CONTAINS: { __type: "String" },
    timeline_ENDS_WITH: { __type: "String" },
    timeline_IN: { __type: "[String]" },
    timeline_NOT: { __type: "String" },
    timeline_NOT_CONTAINS: { __type: "String" },
    timeline_NOT_ENDS_WITH: { __type: "String" },
    timeline_NOT_IN: { __type: "[String]" },
    timeline_NOT_STARTS_WITH: { __type: "String" },
    timeline_STARTS_WITH: { __type: "String" },
  },
  TimelineProject: {
    __typename: { __type: "String!" },
    $on: { __type: "$TimelineProject!" },
  },
  TimelineProjectWhere: {
    Estimate: { __type: "EstimateWhere" },
    Project: { __type: "ProjectWhere" },
  },
  UpdateEquipmentMutationResponse: {
    __typename: { __type: "String!" },
    equipment: { __type: "[Equipment!]!" },
    info: { __type: "UpdateInfo!" },
  },
  UpdateEstimatesMutationResponse: {
    __typename: { __type: "String!" },
    estimates: { __type: "[Estimate!]!" },
    info: { __type: "UpdateInfo!" },
  },
  UpdateHiveAppliancesMutationResponse: {
    __typename: { __type: "String!" },
    hiveAppliances: { __type: "[HiveAppliance!]!" },
    info: { __type: "UpdateInfo!" },
  },
  UpdateHiveIntegrationInstancesMutationResponse: {
    __typename: { __type: "String!" },
    hiveIntegrationInstances: { __type: "[HiveIntegrationInstance!]!" },
    info: { __type: "UpdateInfo!" },
  },
  UpdateHiveIntegrationPathCollectionsMutationResponse: {
    __typename: { __type: "String!" },
    hiveIntegrationPathCollections: {
      __type: "[HiveIntegrationPathCollection!]!",
    },
    info: { __type: "UpdateInfo!" },
  },
  UpdateHiveIntegrationPathsMutationResponse: {
    __typename: { __type: "String!" },
    hiveIntegrationPaths: { __type: "[HiveIntegrationPath!]!" },
    info: { __type: "UpdateInfo!" },
  },
  UpdateHiveIntegrationsMutationResponse: {
    __typename: { __type: "String!" },
    hiveIntegrations: { __type: "[HiveIntegration!]!" },
    info: { __type: "UpdateInfo!" },
  },
  UpdateHiveOrganisationsMutationResponse: {
    __typename: { __type: "String!" },
    hiveOrganisations: { __type: "[HiveOrganisation!]!" },
    info: { __type: "UpdateInfo!" },
  },
  UpdateHiveServicesMutationResponse: {
    __typename: { __type: "String!" },
    hiveServices: { __type: "[HiveService!]!" },
    info: { __type: "UpdateInfo!" },
  },
  UpdateHiveTypeFieldsMutationResponse: {
    __typename: { __type: "String!" },
    hiveTypeFields: { __type: "[HiveTypeField!]!" },
    info: { __type: "UpdateInfo!" },
  },
  UpdateHiveTypesMutationResponse: {
    __typename: { __type: "String!" },
    hiveTypes: { __type: "[HiveType!]!" },
    info: { __type: "UpdateInfo!" },
  },
  UpdateHiveUsersMutationResponse: {
    __typename: { __type: "String!" },
    hiveUsers: { __type: "[HiveUser!]!" },
    info: { __type: "UpdateInfo!" },
  },
  UpdateInfo: {
    __typename: { __type: "String!" },
    bookmark: { __type: "String" },
    nodesCreated: { __type: "Int!" },
    nodesDeleted: { __type: "Int!" },
    relationshipsCreated: { __type: "Int!" },
    relationshipsDeleted: { __type: "Int!" },
  },
  UpdatePeopleMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "UpdateInfo!" },
    people: { __type: "[People!]!" },
  },
  UpdatePermissionsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "UpdateInfo!" },
    permissions: { __type: "[Permission!]!" },
  },
  UpdateProjectResultsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "UpdateInfo!" },
    projectResults: { __type: "[ProjectResult!]!" },
  },
  UpdateProjectsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "UpdateInfo!" },
    projects: { __type: "[Project!]!" },
  },
  UpdateRolesMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "UpdateInfo!" },
    roles: { __type: "[Role!]!" },
  },
  UpdateScheduleItemsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "UpdateInfo!" },
    scheduleItems: { __type: "[ScheduleItem!]!" },
  },
  UpdateTimelineItemItemsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "UpdateInfo!" },
    timelineItemItems: { __type: "[TimelineItemItems!]!" },
  },
  UpdateTimelineItemsMutationResponse: {
    __typename: { __type: "String!" },
    info: { __type: "UpdateInfo!" },
    timelineItems: { __type: "[TimelineItem!]!" },
  },
  WorkInProgress: {
    __typename: { __type: "String!" },
    end: { __type: "DateTime" },
    invoiced: { __type: "Float" },
    quoted: { __type: "Float" },
    start: { __type: "DateTime" },
  },
  mutation: {
    __typename: { __type: "String!" },
    createEquipment: {
      __type: "CreateEquipmentMutationResponse!",
      __args: { input: "[EquipmentCreateInput!]!" },
    },
    createEstimates: {
      __type: "CreateEstimatesMutationResponse!",
      __args: { input: "[EstimateCreateInput!]!" },
    },
    createHiveAppliances: {
      __type: "CreateHiveAppliancesMutationResponse!",
      __args: { input: "[HiveApplianceCreateInput!]!" },
    },
    createHiveIntegrationInstances: {
      __type: "CreateHiveIntegrationInstancesMutationResponse!",
      __args: { input: "[HiveIntegrationInstanceCreateInput!]!" },
    },
    createHiveIntegrationPathCollections: {
      __type: "CreateHiveIntegrationPathCollectionsMutationResponse!",
      __args: { input: "[HiveIntegrationPathCollectionCreateInput!]!" },
    },
    createHiveIntegrationPaths: {
      __type: "CreateHiveIntegrationPathsMutationResponse!",
      __args: { input: "[HiveIntegrationPathCreateInput!]!" },
    },
    createHiveIntegrations: {
      __type: "CreateHiveIntegrationsMutationResponse!",
      __args: { input: "[HiveIntegrationCreateInput!]!" },
    },
    createHiveOrganisations: {
      __type: "CreateHiveOrganisationsMutationResponse!",
      __args: { input: "[HiveOrganisationCreateInput!]!" },
    },
    createHiveServices: {
      __type: "CreateHiveServicesMutationResponse!",
      __args: { input: "[HiveServiceCreateInput!]!" },
    },
    createHiveTypeFields: {
      __type: "CreateHiveTypeFieldsMutationResponse!",
      __args: { input: "[HiveTypeFieldCreateInput!]!" },
    },
    createHiveTypes: {
      __type: "CreateHiveTypesMutationResponse!",
      __args: { input: "[HiveTypeCreateInput!]!" },
    },
    createHiveUsers: {
      __type: "CreateHiveUsersMutationResponse!",
      __args: { input: "[HiveUserCreateInput!]!" },
    },
    createPeople: {
      __type: "CreatePeopleMutationResponse!",
      __args: { input: "[PeopleCreateInput!]!" },
    },
    createPermissions: {
      __type: "CreatePermissionsMutationResponse!",
      __args: { input: "[PermissionCreateInput!]!" },
    },
    createProjectResults: {
      __type: "CreateProjectResultsMutationResponse!",
      __args: { input: "[ProjectResultCreateInput!]!" },
    },
    createProjects: {
      __type: "CreateProjectsMutationResponse!",
      __args: { input: "[ProjectCreateInput!]!" },
    },
    createRoles: {
      __type: "CreateRolesMutationResponse!",
      __args: { input: "[RoleCreateInput!]!" },
    },
    createScheduleItems: {
      __type: "CreateScheduleItemsMutationResponse!",
      __args: { input: "[ScheduleItemCreateInput!]!" },
    },
    createTimelineItemItems: {
      __type: "CreateTimelineItemItemsMutationResponse!",
      __args: { input: "[TimelineItemItemsCreateInput!]!" },
    },
    createTimelineItems: {
      __type: "CreateTimelineItemsMutationResponse!",
      __args: { input: "[TimelineItemCreateInput!]!" },
    },
    deleteEquipment: {
      __type: "DeleteInfo!",
      __args: { delete: "EquipmentDeleteInput", where: "EquipmentWhere" },
    },
    deleteEstimates: {
      __type: "DeleteInfo!",
      __args: { delete: "EstimateDeleteInput", where: "EstimateWhere" },
    },
    deleteHiveAppliances: {
      __type: "DeleteInfo!",
      __args: {
        delete: "HiveApplianceDeleteInput",
        where: "HiveApplianceWhere",
      },
    },
    deleteHiveIntegrationInstances: {
      __type: "DeleteInfo!",
      __args: {
        delete: "HiveIntegrationInstanceDeleteInput",
        where: "HiveIntegrationInstanceWhere",
      },
    },
    deleteHiveIntegrationPathCollections: {
      __type: "DeleteInfo!",
      __args: { where: "HiveIntegrationPathCollectionWhere" },
    },
    deleteHiveIntegrationPaths: {
      __type: "DeleteInfo!",
      __args: {
        delete: "HiveIntegrationPathDeleteInput",
        where: "HiveIntegrationPathWhere",
      },
    },
    deleteHiveIntegrations: {
      __type: "DeleteInfo!",
      __args: { where: "HiveIntegrationWhere" },
    },
    deleteHiveOrganisations: {
      __type: "DeleteInfo!",
      __args: {
        delete: "HiveOrganisationDeleteInput",
        where: "HiveOrganisationWhere",
      },
    },
    deleteHiveServices: {
      __type: "DeleteInfo!",
      __args: { where: "HiveServiceWhere" },
    },
    deleteHiveTypeFields: {
      __type: "DeleteInfo!",
      __args: { where: "HiveTypeFieldWhere" },
    },
    deleteHiveTypes: {
      __type: "DeleteInfo!",
      __args: { delete: "HiveTypeDeleteInput", where: "HiveTypeWhere" },
    },
    deleteHiveUsers: {
      __type: "DeleteInfo!",
      __args: { delete: "HiveUserDeleteInput", where: "HiveUserWhere" },
    },
    deletePeople: {
      __type: "DeleteInfo!",
      __args: { delete: "PeopleDeleteInput", where: "PeopleWhere" },
    },
    deletePermissions: {
      __type: "DeleteInfo!",
      __args: { delete: "PermissionDeleteInput", where: "PermissionWhere" },
    },
    deleteProjectResults: {
      __type: "DeleteInfo!",
      __args: {
        delete: "ProjectResultDeleteInput",
        where: "ProjectResultWhere",
      },
    },
    deleteProjects: {
      __type: "DeleteInfo!",
      __args: { delete: "ProjectDeleteInput", where: "ProjectWhere" },
    },
    deleteRoles: {
      __type: "DeleteInfo!",
      __args: { delete: "RoleDeleteInput", where: "RoleWhere" },
    },
    deleteScheduleItems: {
      __type: "DeleteInfo!",
      __args: { delete: "ScheduleItemDeleteInput", where: "ScheduleItemWhere" },
    },
    deleteTimelineItemItems: {
      __type: "DeleteInfo!",
      __args: {
        delete: "TimelineItemItemsDeleteInput",
        where: "TimelineItemItemsWhere",
      },
    },
    deleteTimelineItems: {
      __type: "DeleteInfo!",
      __args: { delete: "TimelineItemDeleteInput", where: "TimelineItemWhere" },
    },
    updateEquipment: {
      __type: "UpdateEquipmentMutationResponse!",
      __args: {
        connect: "EquipmentConnectInput",
        connectOrCreate: "EquipmentConnectOrCreateInput",
        create: "EquipmentRelationInput",
        delete: "EquipmentDeleteInput",
        disconnect: "EquipmentDisconnectInput",
        update: "EquipmentUpdateInput",
        where: "EquipmentWhere",
      },
    },
    updateEstimates: {
      __type: "UpdateEstimatesMutationResponse!",
      __args: {
        connect: "EstimateConnectInput",
        connectOrCreate: "EstimateConnectOrCreateInput",
        create: "EstimateRelationInput",
        delete: "EstimateDeleteInput",
        disconnect: "EstimateDisconnectInput",
        update: "EstimateUpdateInput",
        where: "EstimateWhere",
      },
    },
    updateHiveAppliances: {
      __type: "UpdateHiveAppliancesMutationResponse!",
      __args: {
        connect: "HiveApplianceConnectInput",
        connectOrCreate: "HiveApplianceConnectOrCreateInput",
        create: "HiveApplianceRelationInput",
        delete: "HiveApplianceDeleteInput",
        disconnect: "HiveApplianceDisconnectInput",
        update: "HiveApplianceUpdateInput",
        where: "HiveApplianceWhere",
      },
    },
    updateHiveIntegrationInstances: {
      __type: "UpdateHiveIntegrationInstancesMutationResponse!",
      __args: {
        connect: "HiveIntegrationInstanceConnectInput",
        connectOrCreate: "HiveIntegrationInstanceConnectOrCreateInput",
        create: "HiveIntegrationInstanceRelationInput",
        delete: "HiveIntegrationInstanceDeleteInput",
        disconnect: "HiveIntegrationInstanceDisconnectInput",
        update: "HiveIntegrationInstanceUpdateInput",
        where: "HiveIntegrationInstanceWhere",
      },
    },
    updateHiveIntegrationPathCollections: {
      __type: "UpdateHiveIntegrationPathCollectionsMutationResponse!",
      __args: {
        update: "HiveIntegrationPathCollectionUpdateInput",
        where: "HiveIntegrationPathCollectionWhere",
      },
    },
    updateHiveIntegrationPaths: {
      __type: "UpdateHiveIntegrationPathsMutationResponse!",
      __args: {
        connect: "HiveIntegrationPathConnectInput",
        connectOrCreate: "HiveIntegrationPathConnectOrCreateInput",
        create: "HiveIntegrationPathRelationInput",
        delete: "HiveIntegrationPathDeleteInput",
        disconnect: "HiveIntegrationPathDisconnectInput",
        update: "HiveIntegrationPathUpdateInput",
        where: "HiveIntegrationPathWhere",
      },
    },
    updateHiveIntegrations: {
      __type: "UpdateHiveIntegrationsMutationResponse!",
      __args: {
        update: "HiveIntegrationUpdateInput",
        where: "HiveIntegrationWhere",
      },
    },
    updateHiveOrganisations: {
      __type: "UpdateHiveOrganisationsMutationResponse!",
      __args: {
        connect: "HiveOrganisationConnectInput",
        connectOrCreate: "HiveOrganisationConnectOrCreateInput",
        create: "HiveOrganisationRelationInput",
        delete: "HiveOrganisationDeleteInput",
        disconnect: "HiveOrganisationDisconnectInput",
        update: "HiveOrganisationUpdateInput",
        where: "HiveOrganisationWhere",
      },
    },
    updateHiveServices: {
      __type: "UpdateHiveServicesMutationResponse!",
      __args: { update: "HiveServiceUpdateInput", where: "HiveServiceWhere" },
    },
    updateHiveTypeFields: {
      __type: "UpdateHiveTypeFieldsMutationResponse!",
      __args: {
        update: "HiveTypeFieldUpdateInput",
        where: "HiveTypeFieldWhere",
      },
    },
    updateHiveTypes: {
      __type: "UpdateHiveTypesMutationResponse!",
      __args: {
        connect: "HiveTypeConnectInput",
        connectOrCreate: "HiveTypeConnectOrCreateInput",
        create: "HiveTypeRelationInput",
        delete: "HiveTypeDeleteInput",
        disconnect: "HiveTypeDisconnectInput",
        update: "HiveTypeUpdateInput",
        where: "HiveTypeWhere",
      },
    },
    updateHiveUsers: {
      __type: "UpdateHiveUsersMutationResponse!",
      __args: {
        connect: "HiveUserConnectInput",
        connectOrCreate: "HiveUserConnectOrCreateInput",
        create: "HiveUserRelationInput",
        delete: "HiveUserDeleteInput",
        disconnect: "HiveUserDisconnectInput",
        update: "HiveUserUpdateInput",
        where: "HiveUserWhere",
      },
    },
    updatePeople: {
      __type: "UpdatePeopleMutationResponse!",
      __args: {
        connect: "PeopleConnectInput",
        connectOrCreate: "PeopleConnectOrCreateInput",
        create: "PeopleRelationInput",
        delete: "PeopleDeleteInput",
        disconnect: "PeopleDisconnectInput",
        update: "PeopleUpdateInput",
        where: "PeopleWhere",
      },
    },
    updatePermissions: {
      __type: "UpdatePermissionsMutationResponse!",
      __args: {
        connect: "PermissionConnectInput",
        connectOrCreate: "PermissionConnectOrCreateInput",
        create: "PermissionRelationInput",
        delete: "PermissionDeleteInput",
        disconnect: "PermissionDisconnectInput",
        update: "PermissionUpdateInput",
        where: "PermissionWhere",
      },
    },
    updateProjectResults: {
      __type: "UpdateProjectResultsMutationResponse!",
      __args: {
        connect: "ProjectResultConnectInput",
        connectOrCreate: "ProjectResultConnectOrCreateInput",
        create: "ProjectResultRelationInput",
        delete: "ProjectResultDeleteInput",
        disconnect: "ProjectResultDisconnectInput",
        update: "ProjectResultUpdateInput",
        where: "ProjectResultWhere",
      },
    },
    updateProjects: {
      __type: "UpdateProjectsMutationResponse!",
      __args: {
        connect: "ProjectConnectInput",
        connectOrCreate: "ProjectConnectOrCreateInput",
        create: "ProjectRelationInput",
        delete: "ProjectDeleteInput",
        disconnect: "ProjectDisconnectInput",
        update: "ProjectUpdateInput",
        where: "ProjectWhere",
      },
    },
    updateRoles: {
      __type: "UpdateRolesMutationResponse!",
      __args: {
        connect: "RoleConnectInput",
        connectOrCreate: "RoleConnectOrCreateInput",
        create: "RoleRelationInput",
        delete: "RoleDeleteInput",
        disconnect: "RoleDisconnectInput",
        update: "RoleUpdateInput",
        where: "RoleWhere",
      },
    },
    updateScheduleItems: {
      __type: "UpdateScheduleItemsMutationResponse!",
      __args: {
        connect: "ScheduleItemConnectInput",
        connectOrCreate: "ScheduleItemConnectOrCreateInput",
        create: "ScheduleItemRelationInput",
        delete: "ScheduleItemDeleteInput",
        disconnect: "ScheduleItemDisconnectInput",
        update: "ScheduleItemUpdateInput",
        where: "ScheduleItemWhere",
      },
    },
    updateTimelineItemItems: {
      __type: "UpdateTimelineItemItemsMutationResponse!",
      __args: {
        connect: "TimelineItemItemsConnectInput",
        connectOrCreate: "TimelineItemItemsConnectOrCreateInput",
        create: "TimelineItemItemsRelationInput",
        delete: "TimelineItemItemsDeleteInput",
        disconnect: "TimelineItemItemsDisconnectInput",
        update: "TimelineItemItemsUpdateInput",
        where: "TimelineItemItemsWhere",
      },
    },
    updateTimelineItems: {
      __type: "UpdateTimelineItemsMutationResponse!",
      __args: {
        connect: "TimelineItemConnectInput",
        connectOrCreate: "TimelineItemConnectOrCreateInput",
        create: "TimelineItemRelationInput",
        delete: "TimelineItemDeleteInput",
        disconnect: "TimelineItemDisconnectInput",
        update: "TimelineItemUpdateInput",
        where: "TimelineItemWhere",
      },
    },
  },
  query: {
    __typename: { __type: "String!" },
    equipment: {
      __type: "[Equipment!]!",
      __args: { options: "EquipmentOptions", where: "EquipmentWhere" },
    },
    equipmentAggregate: {
      __type: "EquipmentAggregateSelection!",
      __args: { where: "EquipmentWhere" },
    },
    equipmentCount: { __type: "Int!", __args: { where: "EquipmentWhere" } },
    estimates: {
      __type: "[Estimate!]!",
      __args: { options: "EstimateOptions", where: "EstimateWhere" },
    },
    estimatesAggregate: {
      __type: "EstimateAggregateSelection!",
      __args: { where: "EstimateWhere" },
    },
    estimatesCount: { __type: "Int!", __args: { where: "EstimateWhere" } },
    flowWorkInProgress: {
      __type: "WorkInProgress",
      __args: { endDate: "DateTime", startDate: "DateTime" },
    },
    hiveAppliances: {
      __type: "[HiveAppliance!]!",
      __args: { options: "HiveApplianceOptions", where: "HiveApplianceWhere" },
    },
    hiveAppliancesAggregate: {
      __type: "HiveApplianceAggregateSelection!",
      __args: { where: "HiveApplianceWhere" },
    },
    hiveAppliancesCount: {
      __type: "Int!",
      __args: { where: "HiveApplianceWhere" },
    },
    hiveIntegrationInstances: {
      __type: "[HiveIntegrationInstance!]!",
      __args: {
        options: "HiveIntegrationInstanceOptions",
        where: "HiveIntegrationInstanceWhere",
      },
    },
    hiveIntegrationInstancesAggregate: {
      __type: "HiveIntegrationInstanceAggregateSelection!",
      __args: { where: "HiveIntegrationInstanceWhere" },
    },
    hiveIntegrationInstancesCount: {
      __type: "Int!",
      __args: { where: "HiveIntegrationInstanceWhere" },
    },
    hiveIntegrationPathCollections: {
      __type: "[HiveIntegrationPathCollection!]!",
      __args: {
        options: "HiveIntegrationPathCollectionOptions",
        where: "HiveIntegrationPathCollectionWhere",
      },
    },
    hiveIntegrationPathCollectionsAggregate: {
      __type: "HiveIntegrationPathCollectionAggregateSelection!",
      __args: { where: "HiveIntegrationPathCollectionWhere" },
    },
    hiveIntegrationPathCollectionsCount: {
      __type: "Int!",
      __args: { where: "HiveIntegrationPathCollectionWhere" },
    },
    hiveIntegrationPaths: {
      __type: "[HiveIntegrationPath!]!",
      __args: {
        options: "HiveIntegrationPathOptions",
        where: "HiveIntegrationPathWhere",
      },
    },
    hiveIntegrationPathsAggregate: {
      __type: "HiveIntegrationPathAggregateSelection!",
      __args: { where: "HiveIntegrationPathWhere" },
    },
    hiveIntegrationPathsCount: {
      __type: "Int!",
      __args: { where: "HiveIntegrationPathWhere" },
    },
    hiveIntegrations: {
      __type: "[HiveIntegration!]!",
      __args: {
        options: "HiveIntegrationOptions",
        where: "HiveIntegrationWhere",
      },
    },
    hiveIntegrationsAggregate: {
      __type: "HiveIntegrationAggregateSelection!",
      __args: { where: "HiveIntegrationWhere" },
    },
    hiveIntegrationsCount: {
      __type: "Int!",
      __args: { where: "HiveIntegrationWhere" },
    },
    hiveOrganisations: {
      __type: "[HiveOrganisation!]!",
      __args: {
        options: "HiveOrganisationOptions",
        where: "HiveOrganisationWhere",
      },
    },
    hiveOrganisationsAggregate: {
      __type: "HiveOrganisationAggregateSelection!",
      __args: { where: "HiveOrganisationWhere" },
    },
    hiveOrganisationsCount: {
      __type: "Int!",
      __args: { where: "HiveOrganisationWhere" },
    },
    hiveServices: {
      __type: "[HiveService!]!",
      __args: { options: "HiveServiceOptions", where: "HiveServiceWhere" },
    },
    hiveServicesAggregate: {
      __type: "HiveServiceAggregateSelection!",
      __args: { where: "HiveServiceWhere" },
    },
    hiveServicesCount: {
      __type: "Int!",
      __args: { where: "HiveServiceWhere" },
    },
    hiveTypeFields: {
      __type: "[HiveTypeField!]!",
      __args: { options: "HiveTypeFieldOptions", where: "HiveTypeFieldWhere" },
    },
    hiveTypeFieldsAggregate: {
      __type: "HiveTypeFieldAggregateSelection!",
      __args: { where: "HiveTypeFieldWhere" },
    },
    hiveTypeFieldsCount: {
      __type: "Int!",
      __args: { where: "HiveTypeFieldWhere" },
    },
    hiveTypes: {
      __type: "[HiveType!]!",
      __args: { options: "HiveTypeOptions", where: "HiveTypeWhere" },
    },
    hiveTypesAggregate: {
      __type: "HiveTypeAggregateSelection!",
      __args: { where: "HiveTypeWhere" },
    },
    hiveTypesCount: { __type: "Int!", __args: { where: "HiveTypeWhere" } },
    hiveUsers: {
      __type: "[HiveUser!]!",
      __args: { options: "HiveUserOptions", where: "HiveUserWhere" },
    },
    hiveUsersAggregate: {
      __type: "HiveUserAggregateSelection!",
      __args: { where: "HiveUserWhere" },
    },
    hiveUsersCount: { __type: "Int!", __args: { where: "HiveUserWhere" } },
    people: {
      __type: "[People!]!",
      __args: { options: "PeopleOptions", where: "PeopleWhere" },
    },
    peopleAggregate: {
      __type: "PeopleAggregateSelection!",
      __args: { where: "PeopleWhere" },
    },
    peopleCount: { __type: "Int!", __args: { where: "PeopleWhere" } },
    permissions: {
      __type: "[Permission!]!",
      __args: { options: "PermissionOptions", where: "PermissionWhere" },
    },
    permissionsAggregate: {
      __type: "PermissionAggregateSelection!",
      __args: { where: "PermissionWhere" },
    },
    permissionsCount: { __type: "Int!", __args: { where: "PermissionWhere" } },
    projectResults: {
      __type: "[ProjectResult!]!",
      __args: { options: "ProjectResultOptions", where: "ProjectResultWhere" },
    },
    projectResultsAggregate: {
      __type: "ProjectResultAggregateSelection!",
      __args: { where: "ProjectResultWhere" },
    },
    projectResultsCount: {
      __type: "Int!",
      __args: { where: "ProjectResultWhere" },
    },
    projects: {
      __type: "[Project!]!",
      __args: { options: "ProjectOptions", where: "ProjectWhere" },
    },
    projectsAggregate: {
      __type: "ProjectAggregateSelection!",
      __args: { where: "ProjectWhere" },
    },
    projectsCount: { __type: "Int!", __args: { where: "ProjectWhere" } },
    roles: {
      __type: "[Role!]!",
      __args: { options: "RoleOptions", where: "RoleWhere" },
    },
    rolesAggregate: {
      __type: "RoleAggregateSelection!",
      __args: { where: "RoleWhere" },
    },
    rolesCount: { __type: "Int!", __args: { where: "RoleWhere" } },
    scheduleItems: {
      __type: "[ScheduleItem!]!",
      __args: { options: "ScheduleItemOptions", where: "ScheduleItemWhere" },
    },
    scheduleItemsAggregate: {
      __type: "ScheduleItemAggregateSelection!",
      __args: { where: "ScheduleItemWhere" },
    },
    scheduleItemsCount: {
      __type: "Int!",
      __args: { where: "ScheduleItemWhere" },
    },
    timelineItemItems: {
      __type: "[TimelineItemItems!]!",
      __args: {
        options: "TimelineItemItemsOptions",
        where: "TimelineItemItemsWhere",
      },
    },
    timelineItemItemsAggregate: {
      __type: "TimelineItemItemsAggregateSelection!",
      __args: { where: "TimelineItemItemsWhere" },
    },
    timelineItemItemsCount: {
      __type: "Int!",
      __args: { where: "TimelineItemItemsWhere" },
    },
    timelineItems: {
      __type: "[TimelineItem!]!",
      __args: { options: "TimelineItemOptions", where: "TimelineItemWhere" },
    },
    timelineItemsAggregate: {
      __type: "TimelineItemAggregateSelection!",
      __args: { where: "TimelineItemWhere" },
    },
    timelineItemsCount: {
      __type: "Int!",
      __args: { where: "TimelineItemWhere" },
    },
  },
  subscription: {},
  [SchemaUnionsKey]: { TimelineProject: ["Estimate", "Project"] },
} as const;

export interface CreateEquipmentMutationResponse {
  __typename?: "CreateEquipmentMutationResponse";
  equipment: Array<Equipment>;
  info: CreateInfo;
}

export interface CreateEstimatesMutationResponse {
  __typename?: "CreateEstimatesMutationResponse";
  estimates: Array<Estimate>;
  info: CreateInfo;
}

export interface CreateHiveAppliancesMutationResponse {
  __typename?: "CreateHiveAppliancesMutationResponse";
  hiveAppliances: Array<HiveAppliance>;
  info: CreateInfo;
}

export interface CreateHiveIntegrationInstancesMutationResponse {
  __typename?: "CreateHiveIntegrationInstancesMutationResponse";
  hiveIntegrationInstances: Array<HiveIntegrationInstance>;
  info: CreateInfo;
}

export interface CreateHiveIntegrationPathCollectionsMutationResponse {
  __typename?: "CreateHiveIntegrationPathCollectionsMutationResponse";
  hiveIntegrationPathCollections: Array<HiveIntegrationPathCollection>;
  info: CreateInfo;
}

export interface CreateHiveIntegrationPathsMutationResponse {
  __typename?: "CreateHiveIntegrationPathsMutationResponse";
  hiveIntegrationPaths: Array<HiveIntegrationPath>;
  info: CreateInfo;
}

export interface CreateHiveIntegrationsMutationResponse {
  __typename?: "CreateHiveIntegrationsMutationResponse";
  hiveIntegrations: Array<HiveIntegration>;
  info: CreateInfo;
}

export interface CreateHiveOrganisationsMutationResponse {
  __typename?: "CreateHiveOrganisationsMutationResponse";
  hiveOrganisations: Array<HiveOrganisation>;
  info: CreateInfo;
}

export interface CreateHiveServicesMutationResponse {
  __typename?: "CreateHiveServicesMutationResponse";
  hiveServices: Array<HiveService>;
  info: CreateInfo;
}

export interface CreateHiveTypeFieldsMutationResponse {
  __typename?: "CreateHiveTypeFieldsMutationResponse";
  hiveTypeFields: Array<HiveTypeField>;
  info: CreateInfo;
}

export interface CreateHiveTypesMutationResponse {
  __typename?: "CreateHiveTypesMutationResponse";
  hiveTypes: Array<HiveType>;
  info: CreateInfo;
}

export interface CreateHiveUsersMutationResponse {
  __typename?: "CreateHiveUsersMutationResponse";
  hiveUsers: Array<HiveUser>;
  info: CreateInfo;
}

export interface CreateInfo {
  __typename?: "CreateInfo";
  bookmark?: Maybe<ScalarsEnums["String"]>;
  nodesCreated: ScalarsEnums["Int"];
  relationshipsCreated: ScalarsEnums["Int"];
}

export interface CreatePeopleMutationResponse {
  __typename?: "CreatePeopleMutationResponse";
  info: CreateInfo;
  people: Array<People>;
}

export interface CreatePermissionsMutationResponse {
  __typename?: "CreatePermissionsMutationResponse";
  info: CreateInfo;
  permissions: Array<Permission>;
}

export interface CreateProjectResultsMutationResponse {
  __typename?: "CreateProjectResultsMutationResponse";
  info: CreateInfo;
  projectResults: Array<ProjectResult>;
}

export interface CreateProjectsMutationResponse {
  __typename?: "CreateProjectsMutationResponse";
  info: CreateInfo;
  projects: Array<Project>;
}

export interface CreateRolesMutationResponse {
  __typename?: "CreateRolesMutationResponse";
  info: CreateInfo;
  roles: Array<Role>;
}

export interface CreateScheduleItemsMutationResponse {
  __typename?: "CreateScheduleItemsMutationResponse";
  info: CreateInfo;
  scheduleItems: Array<ScheduleItem>;
}

export interface CreateTimelineItemItemsMutationResponse {
  __typename?: "CreateTimelineItemItemsMutationResponse";
  info: CreateInfo;
  timelineItemItems: Array<TimelineItemItems>;
}

export interface CreateTimelineItemsMutationResponse {
  __typename?: "CreateTimelineItemsMutationResponse";
  info: CreateInfo;
  timelineItems: Array<TimelineItem>;
}

export interface DateTimeAggregateSelection {
  __typename?: "DateTimeAggregateSelection";
  max?: Maybe<ScalarsEnums["DateTime"]>;
  min?: Maybe<ScalarsEnums["DateTime"]>;
}

export interface DeleteInfo {
  __typename?: "DeleteInfo";
  bookmark?: Maybe<ScalarsEnums["String"]>;
  nodesDeleted: ScalarsEnums["Int"];
  relationshipsDeleted: ScalarsEnums["Int"];
}

export interface Equipment {
  __typename?: "Equipment";
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  organisation: (args?: {
    options?: Maybe<HiveOrganisationOptions>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveOrganisation>;
  organisationAggregate: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<EquipmentHiveOrganisationOrganisationAggregationSelection>;
  organisationConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<EquipmentOrganisationConnectionSort>>;
    where?: Maybe<EquipmentOrganisationConnectionWhere>;
  }) => EquipmentOrganisationConnection;
  registration?: Maybe<ScalarsEnums["String"]>;
}

export interface EquipmentAggregateSelection {
  __typename?: "EquipmentAggregateSelection";
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  registration: StringAggregateSelection;
}

export interface EquipmentHiveOrganisationOrganisationAggregationSelection {
  __typename?: "EquipmentHiveOrganisationOrganisationAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<EquipmentHiveOrganisationOrganisationNodeAggregateSelection>;
}

export interface EquipmentHiveOrganisationOrganisationNodeAggregateSelection {
  __typename?: "EquipmentHiveOrganisationOrganisationNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface EquipmentOrganisationConnection {
  __typename?: "EquipmentOrganisationConnection";
  edges: Array<EquipmentOrganisationRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface EquipmentOrganisationRelationship {
  __typename?: "EquipmentOrganisationRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveOrganisation;
}

export interface Estimate {
  __typename?: "Estimate";
  date?: Maybe<ScalarsEnums["DateTime"]>;
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  organisation: (args?: {
    options?: Maybe<HiveOrganisationOptions>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveOrganisation>;
  organisationAggregate: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<EstimateHiveOrganisationOrganisationAggregationSelection>;
  organisationConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<EstimateOrganisationConnectionSort>>;
    where?: Maybe<EstimateOrganisationConnectionWhere>;
  }) => EstimateOrganisationConnection;
  price?: Maybe<ScalarsEnums["Float"]>;
  status?: Maybe<ScalarsEnums["String"]>;
}

export interface EstimateAggregateSelection {
  __typename?: "EstimateAggregateSelection";
  count: ScalarsEnums["Int"];
  date: DateTimeAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  price: FloatAggregateSelection;
  status: StringAggregateSelection;
}

export interface EstimateHiveOrganisationOrganisationAggregationSelection {
  __typename?: "EstimateHiveOrganisationOrganisationAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<EstimateHiveOrganisationOrganisationNodeAggregateSelection>;
}

export interface EstimateHiveOrganisationOrganisationNodeAggregateSelection {
  __typename?: "EstimateHiveOrganisationOrganisationNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface EstimateOrganisationConnection {
  __typename?: "EstimateOrganisationConnection";
  edges: Array<EstimateOrganisationRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface EstimateOrganisationRelationship {
  __typename?: "EstimateOrganisationRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveOrganisation;
}

export interface FloatAggregateSelection {
  __typename?: "FloatAggregateSelection";
  average?: Maybe<ScalarsEnums["Float"]>;
  max?: Maybe<ScalarsEnums["Float"]>;
  min?: Maybe<ScalarsEnums["Float"]>;
  sum?: Maybe<ScalarsEnums["Float"]>;
}

export interface HiveAppliance {
  __typename?: "HiveAppliance";
  description?: Maybe<ScalarsEnums["String"]>;
  id: ScalarsEnums["ID"];
  label?: Maybe<ScalarsEnums["String"]>;
  name: ScalarsEnums["String"];
  permissions: (args?: {
    options?: Maybe<PermissionOptions>;
    where?: Maybe<PermissionWhere>;
  }) => Maybe<Array<Maybe<Permission>>>;
  permissionsAggregate: (args?: {
    where?: Maybe<PermissionWhere>;
  }) => Maybe<HiveAppliancePermissionPermissionsAggregationSelection>;
  permissionsConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveAppliancePermissionsConnectionSort>>;
    where?: Maybe<HiveAppliancePermissionsConnectionWhere>;
  }) => HiveAppliancePermissionsConnection;
  services: (args?: {
    options?: Maybe<HiveServiceOptions>;
    where?: Maybe<HiveServiceWhere>;
  }) => Maybe<Array<Maybe<HiveService>>>;
  servicesAggregate: (args?: {
    where?: Maybe<HiveServiceWhere>;
  }) => Maybe<HiveApplianceHiveServiceServicesAggregationSelection>;
  servicesConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveApplianceServicesConnectionSort>>;
    where?: Maybe<HiveApplianceServicesConnectionWhere>;
  }) => HiveApplianceServicesConnection;
  types: (args?: {
    options?: Maybe<HiveTypeOptions>;
    where?: Maybe<HiveTypeWhere>;
  }) => Maybe<Array<Maybe<HiveType>>>;
  typesAggregate: (args?: {
    where?: Maybe<HiveTypeWhere>;
  }) => Maybe<HiveApplianceHiveTypeTypesAggregationSelection>;
  typesConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveApplianceTypesConnectionSort>>;
    where?: Maybe<HiveApplianceTypesConnectionWhere>;
  }) => HiveApplianceTypesConnection;
}

export interface HiveApplianceAggregateSelection {
  __typename?: "HiveApplianceAggregateSelection";
  count: ScalarsEnums["Int"];
  description: StringAggregateSelection;
  id: IDAggregateSelection;
  label: StringAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveApplianceHiveServiceServicesAggregationSelection {
  __typename?: "HiveApplianceHiveServiceServicesAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveApplianceHiveServiceServicesNodeAggregateSelection>;
}

export interface HiveApplianceHiveServiceServicesNodeAggregateSelection {
  __typename?: "HiveApplianceHiveServiceServicesNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveApplianceHiveTypeTypesAggregationSelection {
  __typename?: "HiveApplianceHiveTypeTypesAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveApplianceHiveTypeTypesNodeAggregateSelection>;
}

export interface HiveApplianceHiveTypeTypesNodeAggregateSelection {
  __typename?: "HiveApplianceHiveTypeTypesNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveAppliancePermissionPermissionsAggregationSelection {
  __typename?: "HiveAppliancePermissionPermissionsAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveAppliancePermissionPermissionsNodeAggregateSelection>;
}

export interface HiveAppliancePermissionPermissionsNodeAggregateSelection {
  __typename?: "HiveAppliancePermissionPermissionsNodeAggregateSelection";
  action: StringAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  scope: StringAggregateSelection;
}

export interface HiveAppliancePermissionsConnection {
  __typename?: "HiveAppliancePermissionsConnection";
  edges: Array<HiveAppliancePermissionsRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveAppliancePermissionsRelationship {
  __typename?: "HiveAppliancePermissionsRelationship";
  cursor: ScalarsEnums["String"];
  node: Permission;
}

export interface HiveApplianceServicesConnection {
  __typename?: "HiveApplianceServicesConnection";
  edges: Array<HiveApplianceServicesRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveApplianceServicesRelationship {
  __typename?: "HiveApplianceServicesRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveService;
}

export interface HiveApplianceTypesConnection {
  __typename?: "HiveApplianceTypesConnection";
  edges: Array<HiveApplianceTypesRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveApplianceTypesRelationship {
  __typename?: "HiveApplianceTypesRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveType;
}

export interface HiveIntegration {
  __typename?: "HiveIntegration";
  description?: Maybe<ScalarsEnums["String"]>;
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
}

export interface HiveIntegrationAggregateSelection {
  __typename?: "HiveIntegrationAggregateSelection";
  count: ScalarsEnums["Int"];
  description: StringAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveIntegrationInstance {
  __typename?: "HiveIntegrationInstance";
  appliances: (args?: {
    options?: Maybe<HiveApplianceOptions>;
    where?: Maybe<HiveApplianceWhere>;
  }) => Maybe<Array<Maybe<HiveAppliance>>>;
  appliancesAggregate: (args?: {
    where?: Maybe<HiveApplianceWhere>;
  }) => Maybe<HiveIntegrationInstanceHiveApplianceAppliancesAggregationSelection>;
  appliancesConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveIntegrationInstanceAppliancesConnectionSort>>;
    where?: Maybe<HiveIntegrationInstanceAppliancesConnectionWhere>;
  }) => HiveIntegrationInstanceAppliancesConnection;
  config?: Maybe<ScalarsEnums["String"]>;
  connections: (args?: {
    options?: Maybe<HiveIntegrationPathOptions>;
    where?: Maybe<HiveIntegrationPathWhere>;
  }) => Maybe<Array<Maybe<HiveIntegrationPath>>>;
  connectionsAggregate: (args?: {
    where?: Maybe<HiveIntegrationPathWhere>;
  }) => Maybe<HiveIntegrationInstanceHiveIntegrationPathConnectionsAggregationSelection>;
  connectionsConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveIntegrationInstanceConnectionsConnectionSort>>;
    where?: Maybe<HiveIntegrationInstanceConnectionsConnectionWhere>;
  }) => HiveIntegrationInstanceConnectionsConnection;
  id: ScalarsEnums["ID"];
  integration: (args?: {
    options?: Maybe<HiveIntegrationOptions>;
    where?: Maybe<HiveIntegrationWhere>;
  }) => Maybe<HiveIntegration>;
  integrationAggregate: (args?: {
    where?: Maybe<HiveIntegrationWhere>;
  }) => Maybe<HiveIntegrationInstanceHiveIntegrationIntegrationAggregationSelection>;
  integrationConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveIntegrationInstanceIntegrationConnectionSort>>;
    where?: Maybe<HiveIntegrationInstanceIntegrationConnectionWhere>;
  }) => HiveIntegrationInstanceIntegrationConnection;
  isRunning?: Maybe<ScalarsEnums["Boolean"]>;
  name?: Maybe<ScalarsEnums["String"]>;
  organisation: (args?: {
    options?: Maybe<HiveOrganisationOptions>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveOrganisation>;
  organisationAggregate: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveIntegrationInstanceHiveOrganisationOrganisationAggregationSelection>;
  organisationConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveIntegrationInstanceOrganisationConnectionSort>>;
    where?: Maybe<HiveIntegrationInstanceOrganisationConnectionWhere>;
  }) => HiveIntegrationInstanceOrganisationConnection;
}

export interface HiveIntegrationInstanceAggregateSelection {
  __typename?: "HiveIntegrationInstanceAggregateSelection";
  config: StringAggregateSelection;
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveIntegrationInstanceAppliancesConnection {
  __typename?: "HiveIntegrationInstanceAppliancesConnection";
  edges: Array<HiveIntegrationInstanceAppliancesRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveIntegrationInstanceAppliancesRelationship {
  __typename?: "HiveIntegrationInstanceAppliancesRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveAppliance;
}

export interface HiveIntegrationInstanceConnectionsConnection {
  __typename?: "HiveIntegrationInstanceConnectionsConnection";
  edges: Array<HiveIntegrationInstanceConnectionsRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveIntegrationInstanceConnectionsRelationship {
  __typename?: "HiveIntegrationInstanceConnectionsRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveIntegrationPath;
}

export interface HiveIntegrationInstanceHiveApplianceAppliancesAggregationSelection {
  __typename?: "HiveIntegrationInstanceHiveApplianceAppliancesAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveIntegrationInstanceHiveApplianceAppliancesNodeAggregateSelection>;
}

export interface HiveIntegrationInstanceHiveApplianceAppliancesNodeAggregateSelection {
  __typename?: "HiveIntegrationInstanceHiveApplianceAppliancesNodeAggregateSelection";
  description: StringAggregateSelection;
  id: IDAggregateSelection;
  label: StringAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveIntegrationInstanceHiveIntegrationIntegrationAggregationSelection {
  __typename?: "HiveIntegrationInstanceHiveIntegrationIntegrationAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveIntegrationInstanceHiveIntegrationIntegrationNodeAggregateSelection>;
}

export interface HiveIntegrationInstanceHiveIntegrationIntegrationNodeAggregateSelection {
  __typename?: "HiveIntegrationInstanceHiveIntegrationIntegrationNodeAggregateSelection";
  description: StringAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveIntegrationInstanceHiveIntegrationPathConnectionsAggregationSelection {
  __typename?: "HiveIntegrationInstanceHiveIntegrationPathConnectionsAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveIntegrationInstanceHiveIntegrationPathConnectionsNodeAggregateSelection>;
}

export interface HiveIntegrationInstanceHiveIntegrationPathConnectionsNodeAggregateSelection {
  __typename?: "HiveIntegrationInstanceHiveIntegrationPathConnectionsNodeAggregateSelection";
  connectionBlob: StringAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  type: StringAggregateSelection;
}

export interface HiveIntegrationInstanceHiveOrganisationOrganisationAggregationSelection {
  __typename?: "HiveIntegrationInstanceHiveOrganisationOrganisationAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveIntegrationInstanceHiveOrganisationOrganisationNodeAggregateSelection>;
}

export interface HiveIntegrationInstanceHiveOrganisationOrganisationNodeAggregateSelection {
  __typename?: "HiveIntegrationInstanceHiveOrganisationOrganisationNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveIntegrationInstanceIntegrationConnection {
  __typename?: "HiveIntegrationInstanceIntegrationConnection";
  edges: Array<HiveIntegrationInstanceIntegrationRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveIntegrationInstanceIntegrationRelationship {
  __typename?: "HiveIntegrationInstanceIntegrationRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveIntegration;
}

export interface HiveIntegrationInstanceOrganisationConnection {
  __typename?: "HiveIntegrationInstanceOrganisationConnection";
  edges: Array<HiveIntegrationInstanceOrganisationRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveIntegrationInstanceOrganisationRelationship {
  __typename?: "HiveIntegrationInstanceOrganisationRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveOrganisation;
}

export interface HiveIntegrationPath {
  __typename?: "HiveIntegrationPath";
  collections?: Maybe<Array<Maybe<HiveIntegrationPathCollection>>>;
  connectionBlob?: Maybe<ScalarsEnums["String"]>;
  id: ScalarsEnums["ID"];
  instance: (args?: {
    options?: Maybe<HiveIntegrationInstanceOptions>;
    where?: Maybe<HiveIntegrationInstanceWhere>;
  }) => Maybe<HiveIntegrationInstance>;
  instanceAggregate: (args?: {
    where?: Maybe<HiveIntegrationInstanceWhere>;
  }) => Maybe<HiveIntegrationPathHiveIntegrationInstanceInstanceAggregationSelection>;
  instanceConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveIntegrationPathInstanceConnectionSort>>;
    where?: Maybe<HiveIntegrationPathInstanceConnectionWhere>;
  }) => HiveIntegrationPathInstanceConnection;
  name?: Maybe<ScalarsEnums["String"]>;
  type?: Maybe<ScalarsEnums["String"]>;
}

export interface HiveIntegrationPathAggregateSelection {
  __typename?: "HiveIntegrationPathAggregateSelection";
  connectionBlob: StringAggregateSelection;
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  type: StringAggregateSelection;
}

export interface HiveIntegrationPathCollection {
  __typename?: "HiveIntegrationPathCollection";
  name?: Maybe<ScalarsEnums["String"]>;
}

export interface HiveIntegrationPathCollectionAggregateSelection {
  __typename?: "HiveIntegrationPathCollectionAggregateSelection";
  count: ScalarsEnums["Int"];
  name: StringAggregateSelection;
}

export interface HiveIntegrationPathHiveIntegrationInstanceInstanceAggregationSelection {
  __typename?: "HiveIntegrationPathHiveIntegrationInstanceInstanceAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveIntegrationPathHiveIntegrationInstanceInstanceNodeAggregateSelection>;
}

export interface HiveIntegrationPathHiveIntegrationInstanceInstanceNodeAggregateSelection {
  __typename?: "HiveIntegrationPathHiveIntegrationInstanceInstanceNodeAggregateSelection";
  config: StringAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveIntegrationPathInstanceConnection {
  __typename?: "HiveIntegrationPathInstanceConnection";
  edges: Array<HiveIntegrationPathInstanceRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveIntegrationPathInstanceRelationship {
  __typename?: "HiveIntegrationPathInstanceRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveIntegrationInstance;
}

export interface HiveOrganisation {
  __typename?: "HiveOrganisation";
  appliances: (args?: {
    options?: Maybe<HiveApplianceOptions>;
    where?: Maybe<HiveApplianceWhere>;
  }) => Maybe<Array<Maybe<HiveAppliance>>>;
  appliancesAggregate: (args?: {
    where?: Maybe<HiveApplianceWhere>;
  }) => Maybe<HiveOrganisationHiveApplianceAppliancesAggregationSelection>;
  appliancesConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveOrganisationAppliancesConnectionSort>>;
    where?: Maybe<HiveOrganisationAppliancesConnectionWhere>;
  }) => HiveOrganisationAppliancesConnection;
  equipment: (args?: {
    options?: Maybe<EquipmentOptions>;
    where?: Maybe<EquipmentWhere>;
  }) => Maybe<Array<Maybe<Equipment>>>;
  equipmentAggregate: (args?: {
    where?: Maybe<EquipmentWhere>;
  }) => Maybe<HiveOrganisationEquipmentEquipmentAggregationSelection>;
  equipmentConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveOrganisationEquipmentConnectionSort>>;
    where?: Maybe<HiveOrganisationEquipmentConnectionWhere>;
  }) => HiveOrganisationEquipmentConnection;
  estimates: (args?: {
    options?: Maybe<EstimateOptions>;
    where?: Maybe<EstimateWhere>;
  }) => Maybe<Array<Maybe<Estimate>>>;
  estimatesAggregate: (args?: {
    where?: Maybe<EstimateWhere>;
  }) => Maybe<HiveOrganisationEstimateEstimatesAggregationSelection>;
  estimatesConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveOrganisationEstimatesConnectionSort>>;
    where?: Maybe<HiveOrganisationEstimatesConnectionWhere>;
  }) => HiveOrganisationEstimatesConnection;
  id: ScalarsEnums["ID"];
  integrations: (args?: {
    options?: Maybe<HiveIntegrationInstanceOptions>;
    where?: Maybe<HiveIntegrationInstanceWhere>;
  }) => Maybe<Array<Maybe<HiveIntegrationInstance>>>;
  integrationsAggregate: (args?: {
    where?: Maybe<HiveIntegrationInstanceWhere>;
  }) => Maybe<HiveOrganisationHiveIntegrationInstanceIntegrationsAggregationSelection>;
  integrationsConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveOrganisationIntegrationsConnectionSort>>;
    where?: Maybe<HiveOrganisationIntegrationsConnectionWhere>;
  }) => HiveOrganisationIntegrationsConnection;
  members: (args?: {
    options?: Maybe<HiveUserOptions>;
    where?: Maybe<HiveUserWhere>;
  }) => Maybe<Array<Maybe<HiveUser>>>;
  membersAggregate: (args?: {
    where?: Maybe<HiveUserWhere>;
  }) => Maybe<HiveOrganisationHiveUserMembersAggregationSelection>;
  membersConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveOrganisationMembersConnectionSort>>;
    where?: Maybe<HiveOrganisationMembersConnectionWhere>;
  }) => HiveOrganisationMembersConnection;
  name?: Maybe<ScalarsEnums["String"]>;
  people: (args?: {
    options?: Maybe<PeopleOptions>;
    where?: Maybe<PeopleWhere>;
  }) => Maybe<Array<Maybe<People>>>;
  peopleAggregate: (args?: {
    where?: Maybe<PeopleWhere>;
  }) => Maybe<HiveOrganisationPeoplePeopleAggregationSelection>;
  peopleConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveOrganisationPeopleConnectionSort>>;
    where?: Maybe<HiveOrganisationPeopleConnectionWhere>;
  }) => HiveOrganisationPeopleConnection;
  projects: (args?: {
    options?: Maybe<ProjectOptions>;
    where?: Maybe<ProjectWhere>;
  }) => Maybe<Array<Maybe<Project>>>;
  projectsAggregate: (args?: {
    where?: Maybe<ProjectWhere>;
  }) => Maybe<HiveOrganisationProjectProjectsAggregationSelection>;
  projectsConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveOrganisationProjectsConnectionSort>>;
    where?: Maybe<HiveOrganisationProjectsConnectionWhere>;
  }) => HiveOrganisationProjectsConnection;
  roles: (args?: {
    options?: Maybe<RoleOptions>;
    where?: Maybe<RoleWhere>;
  }) => Maybe<Array<Maybe<Role>>>;
  rolesAggregate: (args?: {
    where?: Maybe<RoleWhere>;
  }) => Maybe<HiveOrganisationRoleRolesAggregationSelection>;
  rolesConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveOrganisationRolesConnectionSort>>;
    where?: Maybe<HiveOrganisationRolesConnectionWhere>;
  }) => HiveOrganisationRolesConnection;
  schedule: (args?: {
    options?: Maybe<ScheduleItemOptions>;
    where?: Maybe<ScheduleItemWhere>;
  }) => Maybe<Array<Maybe<ScheduleItem>>>;
  scheduleAggregate: (args?: {
    where?: Maybe<ScheduleItemWhere>;
  }) => Maybe<HiveOrganisationScheduleItemScheduleAggregationSelection>;
  scheduleConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveOrganisationScheduleConnectionSort>>;
    where?: Maybe<HiveOrganisationScheduleConnectionWhere>;
  }) => HiveOrganisationScheduleConnection;
  timeline: (args?: {
    options?: Maybe<TimelineItemOptions>;
    where?: Maybe<TimelineItemWhere>;
  }) => Maybe<Array<Maybe<TimelineItem>>>;
  timelineAggregate: (args?: {
    where?: Maybe<TimelineItemWhere>;
  }) => Maybe<HiveOrganisationTimelineItemTimelineAggregationSelection>;
  timelineConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveOrganisationTimelineConnectionSort>>;
    where?: Maybe<HiveOrganisationTimelineConnectionWhere>;
  }) => HiveOrganisationTimelineConnection;
}

export interface HiveOrganisationAggregateSelection {
  __typename?: "HiveOrganisationAggregateSelection";
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveOrganisationAppliancesConnection {
  __typename?: "HiveOrganisationAppliancesConnection";
  edges: Array<HiveOrganisationAppliancesRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveOrganisationAppliancesRelationship {
  __typename?: "HiveOrganisationAppliancesRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveAppliance;
}

export interface HiveOrganisationEquipmentConnection {
  __typename?: "HiveOrganisationEquipmentConnection";
  edges: Array<HiveOrganisationEquipmentRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveOrganisationEquipmentEquipmentAggregationSelection {
  __typename?: "HiveOrganisationEquipmentEquipmentAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveOrganisationEquipmentEquipmentNodeAggregateSelection>;
}

export interface HiveOrganisationEquipmentEquipmentNodeAggregateSelection {
  __typename?: "HiveOrganisationEquipmentEquipmentNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  registration: StringAggregateSelection;
}

export interface HiveOrganisationEquipmentRelationship {
  __typename?: "HiveOrganisationEquipmentRelationship";
  cursor: ScalarsEnums["String"];
  node: Equipment;
}

export interface HiveOrganisationEstimateEstimatesAggregationSelection {
  __typename?: "HiveOrganisationEstimateEstimatesAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveOrganisationEstimateEstimatesNodeAggregateSelection>;
}

export interface HiveOrganisationEstimateEstimatesNodeAggregateSelection {
  __typename?: "HiveOrganisationEstimateEstimatesNodeAggregateSelection";
  date: DateTimeAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  price: FloatAggregateSelection;
  status: StringAggregateSelection;
}

export interface HiveOrganisationEstimatesConnection {
  __typename?: "HiveOrganisationEstimatesConnection";
  edges: Array<HiveOrganisationEstimatesRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveOrganisationEstimatesRelationship {
  __typename?: "HiveOrganisationEstimatesRelationship";
  cursor: ScalarsEnums["String"];
  node: Estimate;
}

export interface HiveOrganisationHiveApplianceAppliancesAggregationSelection {
  __typename?: "HiveOrganisationHiveApplianceAppliancesAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveOrganisationHiveApplianceAppliancesNodeAggregateSelection>;
}

export interface HiveOrganisationHiveApplianceAppliancesNodeAggregateSelection {
  __typename?: "HiveOrganisationHiveApplianceAppliancesNodeAggregateSelection";
  description: StringAggregateSelection;
  id: IDAggregateSelection;
  label: StringAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveOrganisationHiveIntegrationInstanceIntegrationsAggregationSelection {
  __typename?: "HiveOrganisationHiveIntegrationInstanceIntegrationsAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveOrganisationHiveIntegrationInstanceIntegrationsNodeAggregateSelection>;
}

export interface HiveOrganisationHiveIntegrationInstanceIntegrationsNodeAggregateSelection {
  __typename?: "HiveOrganisationHiveIntegrationInstanceIntegrationsNodeAggregateSelection";
  config: StringAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveOrganisationHiveUserMembersAggregationSelection {
  __typename?: "HiveOrganisationHiveUserMembersAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveOrganisationHiveUserMembersNodeAggregateSelection>;
}

export interface HiveOrganisationHiveUserMembersNodeAggregateSelection {
  __typename?: "HiveOrganisationHiveUserMembersNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  password: StringAggregateSelection;
  username: StringAggregateSelection;
}

export interface HiveOrganisationIntegrationsConnection {
  __typename?: "HiveOrganisationIntegrationsConnection";
  edges: Array<HiveOrganisationIntegrationsRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveOrganisationIntegrationsRelationship {
  __typename?: "HiveOrganisationIntegrationsRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveIntegrationInstance;
}

export interface HiveOrganisationMembersConnection {
  __typename?: "HiveOrganisationMembersConnection";
  edges: Array<HiveOrganisationMembersRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveOrganisationMembersRelationship {
  __typename?: "HiveOrganisationMembersRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveUser;
}

export interface HiveOrganisationPeopleConnection {
  __typename?: "HiveOrganisationPeopleConnection";
  edges: Array<HiveOrganisationPeopleRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveOrganisationPeoplePeopleAggregationSelection {
  __typename?: "HiveOrganisationPeoplePeopleAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveOrganisationPeoplePeopleNodeAggregateSelection>;
}

export interface HiveOrganisationPeoplePeopleNodeAggregateSelection {
  __typename?: "HiveOrganisationPeoplePeopleNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveOrganisationPeopleRelationship {
  __typename?: "HiveOrganisationPeopleRelationship";
  cursor: ScalarsEnums["String"];
  node: People;
}

export interface HiveOrganisationProjectProjectsAggregationSelection {
  __typename?: "HiveOrganisationProjectProjectsAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveOrganisationProjectProjectsNodeAggregateSelection>;
}

export interface HiveOrganisationProjectProjectsNodeAggregateSelection {
  __typename?: "HiveOrganisationProjectProjectsNodeAggregateSelection";
  endDate: DateTimeAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  startDate: DateTimeAggregateSelection;
  status: StringAggregateSelection;
}

export interface HiveOrganisationProjectsConnection {
  __typename?: "HiveOrganisationProjectsConnection";
  edges: Array<HiveOrganisationProjectsRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveOrganisationProjectsRelationship {
  __typename?: "HiveOrganisationProjectsRelationship";
  cursor: ScalarsEnums["String"];
  node: Project;
}

export interface HiveOrganisationRoleRolesAggregationSelection {
  __typename?: "HiveOrganisationRoleRolesAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveOrganisationRoleRolesNodeAggregateSelection>;
}

export interface HiveOrganisationRoleRolesNodeAggregateSelection {
  __typename?: "HiveOrganisationRoleRolesNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveOrganisationRolesConnection {
  __typename?: "HiveOrganisationRolesConnection";
  edges: Array<HiveOrganisationRolesRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveOrganisationRolesRelationship {
  __typename?: "HiveOrganisationRolesRelationship";
  cursor: ScalarsEnums["String"];
  node: Role;
}

export interface HiveOrganisationScheduleConnection {
  __typename?: "HiveOrganisationScheduleConnection";
  edges: Array<HiveOrganisationScheduleRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveOrganisationScheduleItemScheduleAggregationSelection {
  __typename?: "HiveOrganisationScheduleItemScheduleAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveOrganisationScheduleItemScheduleNodeAggregateSelection>;
}

export interface HiveOrganisationScheduleItemScheduleNodeAggregateSelection {
  __typename?: "HiveOrganisationScheduleItemScheduleNodeAggregateSelection";
  date: DateTimeAggregateSelection;
  id: IDAggregateSelection;
}

export interface HiveOrganisationScheduleRelationship {
  __typename?: "HiveOrganisationScheduleRelationship";
  cursor: ScalarsEnums["String"];
  node: ScheduleItem;
}

export interface HiveOrganisationTimelineConnection {
  __typename?: "HiveOrganisationTimelineConnection";
  edges: Array<HiveOrganisationTimelineRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveOrganisationTimelineItemTimelineAggregationSelection {
  __typename?: "HiveOrganisationTimelineItemTimelineAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveOrganisationTimelineItemTimelineNodeAggregateSelection>;
}

export interface HiveOrganisationTimelineItemTimelineNodeAggregateSelection {
  __typename?: "HiveOrganisationTimelineItemTimelineNodeAggregateSelection";
  endDate: DateTimeAggregateSelection;
  id: IDAggregateSelection;
  notes: StringAggregateSelection;
  startDate: DateTimeAggregateSelection;
  timeline: StringAggregateSelection;
}

export interface HiveOrganisationTimelineRelationship {
  __typename?: "HiveOrganisationTimelineRelationship";
  cursor: ScalarsEnums["String"];
  node: TimelineItem;
}

export interface HiveService {
  __typename?: "HiveService";
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
}

export interface HiveServiceAggregateSelection {
  __typename?: "HiveServiceAggregateSelection";
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveType {
  __typename?: "HiveType";
  fields: (args?: {
    options?: Maybe<HiveTypeFieldOptions>;
    where?: Maybe<HiveTypeFieldWhere>;
  }) => Maybe<Array<Maybe<HiveTypeField>>>;
  fieldsAggregate: (args?: {
    where?: Maybe<HiveTypeFieldWhere>;
  }) => Maybe<HiveTypeHiveTypeFieldFieldsAggregationSelection>;
  fieldsConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveTypeFieldsConnectionSort>>;
    where?: Maybe<HiveTypeFieldsConnectionWhere>;
  }) => HiveTypeFieldsConnection;
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  usedIn: (args?: {
    options?: Maybe<HiveApplianceOptions>;
    where?: Maybe<HiveApplianceWhere>;
  }) => Maybe<Array<Maybe<HiveAppliance>>>;
  usedInAggregate: (args?: {
    where?: Maybe<HiveApplianceWhere>;
  }) => Maybe<HiveTypeHiveApplianceUsedInAggregationSelection>;
  usedInConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveTypeUsedInConnectionSort>>;
    where?: Maybe<HiveTypeUsedInConnectionWhere>;
  }) => HiveTypeUsedInConnection;
}

export interface HiveTypeAggregateSelection {
  __typename?: "HiveTypeAggregateSelection";
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveTypeField {
  __typename?: "HiveTypeField";
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  type?: Maybe<ScalarsEnums["String"]>;
}

export interface HiveTypeFieldAggregateSelection {
  __typename?: "HiveTypeFieldAggregateSelection";
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  type: StringAggregateSelection;
}

export interface HiveTypeFieldsConnection {
  __typename?: "HiveTypeFieldsConnection";
  edges: Array<HiveTypeFieldsRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveTypeFieldsRelationship {
  __typename?: "HiveTypeFieldsRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveTypeField;
}

export interface HiveTypeHiveApplianceUsedInAggregationSelection {
  __typename?: "HiveTypeHiveApplianceUsedInAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveTypeHiveApplianceUsedInNodeAggregateSelection>;
}

export interface HiveTypeHiveApplianceUsedInNodeAggregateSelection {
  __typename?: "HiveTypeHiveApplianceUsedInNodeAggregateSelection";
  description: StringAggregateSelection;
  id: IDAggregateSelection;
  label: StringAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveTypeHiveTypeFieldFieldsAggregationSelection {
  __typename?: "HiveTypeHiveTypeFieldFieldsAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveTypeHiveTypeFieldFieldsNodeAggregateSelection>;
}

export interface HiveTypeHiveTypeFieldFieldsNodeAggregateSelection {
  __typename?: "HiveTypeHiveTypeFieldFieldsNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  type: StringAggregateSelection;
}

export interface HiveTypeUsedInConnection {
  __typename?: "HiveTypeUsedInConnection";
  edges: Array<HiveTypeUsedInRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveTypeUsedInRelationship {
  __typename?: "HiveTypeUsedInRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveAppliance;
}

export interface HiveUser {
  __typename?: "HiveUser";
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  organisation: (args?: {
    options?: Maybe<HiveOrganisationOptions>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveOrganisation>;
  organisationAggregate: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveUserHiveOrganisationOrganisationAggregationSelection>;
  organisationConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveUserOrganisationConnectionSort>>;
    where?: Maybe<HiveUserOrganisationConnectionWhere>;
  }) => HiveUserOrganisationConnection;
  password?: Maybe<ScalarsEnums["String"]>;
  roles: (args?: {
    options?: Maybe<RoleOptions>;
    where?: Maybe<RoleWhere>;
  }) => Maybe<Array<Maybe<Role>>>;
  rolesAggregate: (args?: {
    where?: Maybe<RoleWhere>;
  }) => Maybe<HiveUserRoleRolesAggregationSelection>;
  rolesConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<HiveUserRolesConnectionSort>>;
    where?: Maybe<HiveUserRolesConnectionWhere>;
  }) => HiveUserRolesConnection;
  username?: Maybe<ScalarsEnums["String"]>;
}

export interface HiveUserAggregateSelection {
  __typename?: "HiveUserAggregateSelection";
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  password: StringAggregateSelection;
  username: StringAggregateSelection;
}

export interface HiveUserHiveOrganisationOrganisationAggregationSelection {
  __typename?: "HiveUserHiveOrganisationOrganisationAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveUserHiveOrganisationOrganisationNodeAggregateSelection>;
}

export interface HiveUserHiveOrganisationOrganisationNodeAggregateSelection {
  __typename?: "HiveUserHiveOrganisationOrganisationNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveUserOrganisationConnection {
  __typename?: "HiveUserOrganisationConnection";
  edges: Array<HiveUserOrganisationRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveUserOrganisationRelationship {
  __typename?: "HiveUserOrganisationRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveOrganisation;
}

export interface HiveUserRoleRolesAggregationSelection {
  __typename?: "HiveUserRoleRolesAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<HiveUserRoleRolesNodeAggregateSelection>;
}

export interface HiveUserRoleRolesNodeAggregateSelection {
  __typename?: "HiveUserRoleRolesNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface HiveUserRolesConnection {
  __typename?: "HiveUserRolesConnection";
  edges: Array<HiveUserRolesRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface HiveUserRolesRelationship {
  __typename?: "HiveUserRolesRelationship";
  cursor: ScalarsEnums["String"];
  node: Role;
}

export interface IDAggregateSelection {
  __typename?: "IDAggregateSelection";
  longest?: Maybe<ScalarsEnums["ID"]>;
  shortest?: Maybe<ScalarsEnums["ID"]>;
}

/**
 * Pagination information (Relay)
 */
export interface PageInfo {
  __typename?: "PageInfo";
  endCursor?: Maybe<ScalarsEnums["String"]>;
  hasNextPage: ScalarsEnums["Boolean"];
  hasPreviousPage: ScalarsEnums["Boolean"];
  startCursor?: Maybe<ScalarsEnums["String"]>;
}

export interface People {
  __typename?: "People";
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  organisation: (args?: {
    options?: Maybe<HiveOrganisationOptions>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveOrganisation>;
  organisationAggregate: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<PeopleHiveOrganisationOrganisationAggregationSelection>;
  organisationConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<PeopleOrganisationConnectionSort>>;
    where?: Maybe<PeopleOrganisationConnectionWhere>;
  }) => PeopleOrganisationConnection;
}

export interface PeopleAggregateSelection {
  __typename?: "PeopleAggregateSelection";
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface PeopleHiveOrganisationOrganisationAggregationSelection {
  __typename?: "PeopleHiveOrganisationOrganisationAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<PeopleHiveOrganisationOrganisationNodeAggregateSelection>;
}

export interface PeopleHiveOrganisationOrganisationNodeAggregateSelection {
  __typename?: "PeopleHiveOrganisationOrganisationNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface PeopleOrganisationConnection {
  __typename?: "PeopleOrganisationConnection";
  edges: Array<PeopleOrganisationRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface PeopleOrganisationRelationship {
  __typename?: "PeopleOrganisationRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveOrganisation;
}

export interface Permission {
  __typename?: "Permission";
  action?: Maybe<ScalarsEnums["String"]>;
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  roles: (args?: {
    options?: Maybe<RoleOptions>;
    where?: Maybe<RoleWhere>;
  }) => Maybe<Array<Maybe<Role>>>;
  rolesAggregate: (args?: {
    where?: Maybe<RoleWhere>;
  }) => Maybe<PermissionRoleRolesAggregationSelection>;
  rolesConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<PermissionRolesConnectionSort>>;
    where?: Maybe<PermissionRolesConnectionWhere>;
  }) => PermissionRolesConnection;
  scope?: Maybe<ScalarsEnums["String"]>;
}

export interface PermissionAggregateSelection {
  __typename?: "PermissionAggregateSelection";
  action: StringAggregateSelection;
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  scope: StringAggregateSelection;
}

export interface PermissionRoleRolesAggregationSelection {
  __typename?: "PermissionRoleRolesAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<PermissionRoleRolesNodeAggregateSelection>;
}

export interface PermissionRoleRolesNodeAggregateSelection {
  __typename?: "PermissionRoleRolesNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface PermissionRolesConnection {
  __typename?: "PermissionRolesConnection";
  edges: Array<PermissionRolesRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface PermissionRolesRelationship {
  __typename?: "PermissionRolesRelationship";
  cursor: ScalarsEnums["String"];
  node: Role;
}

export interface Project {
  __typename?: "Project";
  endDate?: Maybe<ScalarsEnums["DateTime"]>;
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  organisation: (args?: {
    options?: Maybe<HiveOrganisationOptions>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveOrganisation>;
  organisationAggregate: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<ProjectHiveOrganisationOrganisationAggregationSelection>;
  organisationConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<ProjectOrganisationConnectionSort>>;
    where?: Maybe<ProjectOrganisationConnectionWhere>;
  }) => ProjectOrganisationConnection;
  plan: (args?: {
    options?: Maybe<TimelineItemOptions>;
    where?: Maybe<TimelineItemWhere>;
  }) => Maybe<Array<Maybe<TimelineItem>>>;
  planAggregate: (args?: {
    where?: Maybe<TimelineItemWhere>;
  }) => Maybe<ProjectTimelineItemPlanAggregationSelection>;
  planConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<ProjectPlanConnectionSort>>;
    where?: Maybe<ProjectPlanConnectionWhere>;
  }) => ProjectPlanConnection;
  schedule: (args?: {
    options?: Maybe<ScheduleItemOptions>;
    where?: Maybe<ScheduleItemWhere>;
  }) => Maybe<Array<Maybe<ScheduleItem>>>;
  scheduleAggregate: (args?: {
    where?: Maybe<ScheduleItemWhere>;
  }) => Maybe<ProjectScheduleItemScheduleAggregationSelection>;
  scheduleConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<ProjectScheduleConnectionSort>>;
    where?: Maybe<ProjectScheduleConnectionWhere>;
  }) => ProjectScheduleConnection;
  startDate?: Maybe<ScalarsEnums["DateTime"]>;
  status?: Maybe<ScalarsEnums["String"]>;
}

export interface ProjectAggregateSelection {
  __typename?: "ProjectAggregateSelection";
  count: ScalarsEnums["Int"];
  endDate: DateTimeAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  startDate: DateTimeAggregateSelection;
  status: StringAggregateSelection;
}

export interface ProjectHiveOrganisationOrganisationAggregationSelection {
  __typename?: "ProjectHiveOrganisationOrganisationAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<ProjectHiveOrganisationOrganisationNodeAggregateSelection>;
}

export interface ProjectHiveOrganisationOrganisationNodeAggregateSelection {
  __typename?: "ProjectHiveOrganisationOrganisationNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface ProjectOrganisationConnection {
  __typename?: "ProjectOrganisationConnection";
  edges: Array<ProjectOrganisationRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface ProjectOrganisationRelationship {
  __typename?: "ProjectOrganisationRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveOrganisation;
}

export interface ProjectPlanConnection {
  __typename?: "ProjectPlanConnection";
  edges: Array<ProjectPlanRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface ProjectPlanRelationship {
  __typename?: "ProjectPlanRelationship";
  cursor: ScalarsEnums["String"];
  node: TimelineItem;
}

export interface ProjectResult {
  __typename?: "ProjectResult";
  id: ScalarsEnums["ID"];
  invoiced?: Maybe<ScalarsEnums["Float"]>;
  organisation: (args?: {
    options?: Maybe<HiveOrganisationOptions>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveOrganisation>;
  organisationAggregate: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<ProjectResultHiveOrganisationOrganisationAggregationSelection>;
  organisationConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<ProjectResultOrganisationConnectionSort>>;
    where?: Maybe<ProjectResultOrganisationConnectionWhere>;
  }) => ProjectResultOrganisationConnection;
  quoted?: Maybe<ScalarsEnums["Float"]>;
}

export interface ProjectResultAggregateSelection {
  __typename?: "ProjectResultAggregateSelection";
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  invoiced: FloatAggregateSelection;
  quoted: FloatAggregateSelection;
}

export interface ProjectResultHiveOrganisationOrganisationAggregationSelection {
  __typename?: "ProjectResultHiveOrganisationOrganisationAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<ProjectResultHiveOrganisationOrganisationNodeAggregateSelection>;
}

export interface ProjectResultHiveOrganisationOrganisationNodeAggregateSelection {
  __typename?: "ProjectResultHiveOrganisationOrganisationNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface ProjectResultOrganisationConnection {
  __typename?: "ProjectResultOrganisationConnection";
  edges: Array<ProjectResultOrganisationRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface ProjectResultOrganisationRelationship {
  __typename?: "ProjectResultOrganisationRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveOrganisation;
}

export interface ProjectScheduleConnection {
  __typename?: "ProjectScheduleConnection";
  edges: Array<ProjectScheduleRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface ProjectScheduleItemScheduleAggregationSelection {
  __typename?: "ProjectScheduleItemScheduleAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<ProjectScheduleItemScheduleNodeAggregateSelection>;
}

export interface ProjectScheduleItemScheduleNodeAggregateSelection {
  __typename?: "ProjectScheduleItemScheduleNodeAggregateSelection";
  date: DateTimeAggregateSelection;
  id: IDAggregateSelection;
}

export interface ProjectScheduleRelationship {
  __typename?: "ProjectScheduleRelationship";
  cursor: ScalarsEnums["String"];
  node: ScheduleItem;
}

export interface ProjectTimelineItemPlanAggregationSelection {
  __typename?: "ProjectTimelineItemPlanAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<ProjectTimelineItemPlanNodeAggregateSelection>;
}

export interface ProjectTimelineItemPlanNodeAggregateSelection {
  __typename?: "ProjectTimelineItemPlanNodeAggregateSelection";
  endDate: DateTimeAggregateSelection;
  id: IDAggregateSelection;
  notes: StringAggregateSelection;
  startDate: DateTimeAggregateSelection;
  timeline: StringAggregateSelection;
}

export interface Role {
  __typename?: "Role";
  appliances: (args?: {
    options?: Maybe<HiveApplianceOptions>;
    where?: Maybe<HiveApplianceWhere>;
  }) => Maybe<Array<Maybe<HiveAppliance>>>;
  appliancesAggregate: (args?: {
    where?: Maybe<HiveApplianceWhere>;
  }) => Maybe<RoleHiveApplianceAppliancesAggregationSelection>;
  appliancesConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<RoleAppliancesConnectionSort>>;
    where?: Maybe<RoleAppliancesConnectionWhere>;
  }) => RoleAppliancesConnection;
  id: ScalarsEnums["ID"];
  name?: Maybe<ScalarsEnums["String"]>;
  organisation: (args?: {
    options?: Maybe<HiveOrganisationOptions>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveOrganisation>;
  organisationAggregate: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<RoleHiveOrganisationOrganisationAggregationSelection>;
  organisationConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<RoleOrganisationConnectionSort>>;
    where?: Maybe<RoleOrganisationConnectionWhere>;
  }) => RoleOrganisationConnection;
  permissions: (args?: {
    options?: Maybe<PermissionOptions>;
    where?: Maybe<PermissionWhere>;
  }) => Maybe<Array<Maybe<Permission>>>;
  permissionsAggregate: (args?: {
    where?: Maybe<PermissionWhere>;
  }) => Maybe<RolePermissionPermissionsAggregationSelection>;
  permissionsConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<RolePermissionsConnectionSort>>;
    where?: Maybe<RolePermissionsConnectionWhere>;
  }) => RolePermissionsConnection;
}

export interface RoleAggregateSelection {
  __typename?: "RoleAggregateSelection";
  count: ScalarsEnums["Int"];
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface RoleAppliancesConnection {
  __typename?: "RoleAppliancesConnection";
  edges: Array<RoleAppliancesRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface RoleAppliancesRelationship {
  __typename?: "RoleAppliancesRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveAppliance;
}

export interface RoleHiveApplianceAppliancesAggregationSelection {
  __typename?: "RoleHiveApplianceAppliancesAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<RoleHiveApplianceAppliancesNodeAggregateSelection>;
}

export interface RoleHiveApplianceAppliancesNodeAggregateSelection {
  __typename?: "RoleHiveApplianceAppliancesNodeAggregateSelection";
  description: StringAggregateSelection;
  id: IDAggregateSelection;
  label: StringAggregateSelection;
  name: StringAggregateSelection;
}

export interface RoleHiveOrganisationOrganisationAggregationSelection {
  __typename?: "RoleHiveOrganisationOrganisationAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<RoleHiveOrganisationOrganisationNodeAggregateSelection>;
}

export interface RoleHiveOrganisationOrganisationNodeAggregateSelection {
  __typename?: "RoleHiveOrganisationOrganisationNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface RoleOrganisationConnection {
  __typename?: "RoleOrganisationConnection";
  edges: Array<RoleOrganisationRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface RoleOrganisationRelationship {
  __typename?: "RoleOrganisationRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveOrganisation;
}

export interface RolePermissionPermissionsAggregationSelection {
  __typename?: "RolePermissionPermissionsAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<RolePermissionPermissionsNodeAggregateSelection>;
}

export interface RolePermissionPermissionsNodeAggregateSelection {
  __typename?: "RolePermissionPermissionsNodeAggregateSelection";
  action: StringAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  scope: StringAggregateSelection;
}

export interface RolePermissionsConnection {
  __typename?: "RolePermissionsConnection";
  edges: Array<RolePermissionsRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface RolePermissionsRelationship {
  __typename?: "RolePermissionsRelationship";
  cursor: ScalarsEnums["String"];
  node: Permission;
}

export interface ScheduleItem {
  __typename?: "ScheduleItem";
  date?: Maybe<ScalarsEnums["DateTime"]>;
  equipment: (args?: {
    options?: Maybe<EquipmentOptions>;
    where?: Maybe<EquipmentWhere>;
  }) => Maybe<Array<Maybe<Equipment>>>;
  equipmentAggregate: (args?: {
    where?: Maybe<EquipmentWhere>;
  }) => Maybe<ScheduleItemEquipmentEquipmentAggregationSelection>;
  equipmentConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<ScheduleItemEquipmentConnectionSort>>;
    where?: Maybe<ScheduleItemEquipmentConnectionWhere>;
  }) => ScheduleItemEquipmentConnection;
  id?: Maybe<ScalarsEnums["ID"]>;
  managers: (args?: {
    options?: Maybe<HiveUserOptions>;
    where?: Maybe<HiveUserWhere>;
  }) => Maybe<Array<Maybe<HiveUser>>>;
  managersAggregate: (args?: {
    where?: Maybe<HiveUserWhere>;
  }) => Maybe<ScheduleItemHiveUserManagersAggregationSelection>;
  managersConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<ScheduleItemManagersConnectionSort>>;
    where?: Maybe<ScheduleItemManagersConnectionWhere>;
  }) => ScheduleItemManagersConnection;
  notes?: Maybe<Array<Maybe<ScalarsEnums["String"]>>>;
  organisation: (args?: {
    options?: Maybe<HiveOrganisationOptions>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveOrganisation>;
  organisationAggregate: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<ScheduleItemHiveOrganisationOrganisationAggregationSelection>;
  organisationConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<ScheduleItemOrganisationConnectionSort>>;
    where?: Maybe<ScheduleItemOrganisationConnectionWhere>;
  }) => ScheduleItemOrganisationConnection;
  owner: (args?: {
    options?: Maybe<HiveUserOptions>;
    where?: Maybe<HiveUserWhere>;
  }) => Maybe<HiveUser>;
  ownerAggregate: (args?: {
    where?: Maybe<HiveUserWhere>;
  }) => Maybe<ScheduleItemHiveUserOwnerAggregationSelection>;
  ownerConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<ScheduleItemOwnerConnectionSort>>;
    where?: Maybe<ScheduleItemOwnerConnectionWhere>;
  }) => ScheduleItemOwnerConnection;
  people: (args?: {
    options?: Maybe<PeopleOptions>;
    where?: Maybe<PeopleWhere>;
  }) => Maybe<Array<Maybe<People>>>;
  peopleAggregate: (args?: {
    where?: Maybe<PeopleWhere>;
  }) => Maybe<ScheduleItemPeoplePeopleAggregationSelection>;
  peopleConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<ScheduleItemPeopleConnectionSort>>;
    where?: Maybe<ScheduleItemPeopleConnectionWhere>;
  }) => ScheduleItemPeopleConnection;
  project: (args?: {
    options?: Maybe<ProjectOptions>;
    where?: Maybe<ProjectWhere>;
  }) => Maybe<Project>;
  projectAggregate: (args?: {
    where?: Maybe<ProjectWhere>;
  }) => Maybe<ScheduleItemProjectProjectAggregationSelection>;
  projectConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<ScheduleItemProjectConnectionSort>>;
    where?: Maybe<ScheduleItemProjectConnectionWhere>;
  }) => ScheduleItemProjectConnection;
}

export interface ScheduleItemAggregateSelection {
  __typename?: "ScheduleItemAggregateSelection";
  count: ScalarsEnums["Int"];
  date: DateTimeAggregateSelection;
  id: IDAggregateSelection;
}

export interface ScheduleItemEquipmentConnection {
  __typename?: "ScheduleItemEquipmentConnection";
  edges: Array<ScheduleItemEquipmentRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface ScheduleItemEquipmentEquipmentAggregationSelection {
  __typename?: "ScheduleItemEquipmentEquipmentAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<ScheduleItemEquipmentEquipmentNodeAggregateSelection>;
}

export interface ScheduleItemEquipmentEquipmentNodeAggregateSelection {
  __typename?: "ScheduleItemEquipmentEquipmentNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  registration: StringAggregateSelection;
}

export interface ScheduleItemEquipmentRelationship {
  __typename?: "ScheduleItemEquipmentRelationship";
  cursor: ScalarsEnums["String"];
  node: Equipment;
}

export interface ScheduleItemHiveOrganisationOrganisationAggregationSelection {
  __typename?: "ScheduleItemHiveOrganisationOrganisationAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<ScheduleItemHiveOrganisationOrganisationNodeAggregateSelection>;
}

export interface ScheduleItemHiveOrganisationOrganisationNodeAggregateSelection {
  __typename?: "ScheduleItemHiveOrganisationOrganisationNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface ScheduleItemHiveUserManagersAggregationSelection {
  __typename?: "ScheduleItemHiveUserManagersAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<ScheduleItemHiveUserManagersNodeAggregateSelection>;
}

export interface ScheduleItemHiveUserManagersNodeAggregateSelection {
  __typename?: "ScheduleItemHiveUserManagersNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  password: StringAggregateSelection;
  username: StringAggregateSelection;
}

export interface ScheduleItemHiveUserOwnerAggregationSelection {
  __typename?: "ScheduleItemHiveUserOwnerAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<ScheduleItemHiveUserOwnerNodeAggregateSelection>;
}

export interface ScheduleItemHiveUserOwnerNodeAggregateSelection {
  __typename?: "ScheduleItemHiveUserOwnerNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  password: StringAggregateSelection;
  username: StringAggregateSelection;
}

export interface ScheduleItemManagersConnection {
  __typename?: "ScheduleItemManagersConnection";
  edges: Array<ScheduleItemManagersRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface ScheduleItemManagersRelationship {
  __typename?: "ScheduleItemManagersRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveUser;
}

export interface ScheduleItemOrganisationConnection {
  __typename?: "ScheduleItemOrganisationConnection";
  edges: Array<ScheduleItemOrganisationRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface ScheduleItemOrganisationRelationship {
  __typename?: "ScheduleItemOrganisationRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveOrganisation;
}

export interface ScheduleItemOwnerConnection {
  __typename?: "ScheduleItemOwnerConnection";
  edges: Array<ScheduleItemOwnerRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface ScheduleItemOwnerRelationship {
  __typename?: "ScheduleItemOwnerRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveUser;
}

export interface ScheduleItemPeopleConnection {
  __typename?: "ScheduleItemPeopleConnection";
  edges: Array<ScheduleItemPeopleRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface ScheduleItemPeoplePeopleAggregationSelection {
  __typename?: "ScheduleItemPeoplePeopleAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<ScheduleItemPeoplePeopleNodeAggregateSelection>;
}

export interface ScheduleItemPeoplePeopleNodeAggregateSelection {
  __typename?: "ScheduleItemPeoplePeopleNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface ScheduleItemPeopleRelationship {
  __typename?: "ScheduleItemPeopleRelationship";
  cursor: ScalarsEnums["String"];
  node: People;
}

export interface ScheduleItemProjectConnection {
  __typename?: "ScheduleItemProjectConnection";
  edges: Array<ScheduleItemProjectRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface ScheduleItemProjectProjectAggregationSelection {
  __typename?: "ScheduleItemProjectProjectAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<ScheduleItemProjectProjectNodeAggregateSelection>;
}

export interface ScheduleItemProjectProjectNodeAggregateSelection {
  __typename?: "ScheduleItemProjectProjectNodeAggregateSelection";
  endDate: DateTimeAggregateSelection;
  id: IDAggregateSelection;
  name: StringAggregateSelection;
  startDate: DateTimeAggregateSelection;
  status: StringAggregateSelection;
}

export interface ScheduleItemProjectRelationship {
  __typename?: "ScheduleItemProjectRelationship";
  cursor: ScalarsEnums["String"];
  node: Project;
}

export interface StringAggregateSelection {
  __typename?: "StringAggregateSelection";
  longest?: Maybe<ScalarsEnums["String"]>;
  shortest?: Maybe<ScalarsEnums["String"]>;
}

export interface TimelineItem {
  __typename?: "TimelineItem";
  endDate?: Maybe<ScalarsEnums["DateTime"]>;
  id?: Maybe<ScalarsEnums["ID"]>;
  items: (args?: {
    options?: Maybe<TimelineItemItemsOptions>;
    where?: Maybe<TimelineItemItemsWhere>;
  }) => Maybe<Array<Maybe<TimelineItemItems>>>;
  itemsAggregate: (args?: {
    where?: Maybe<TimelineItemItemsWhere>;
  }) => Maybe<TimelineItemTimelineItemItemsItemsAggregationSelection>;
  itemsConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<TimelineItemItemsConnectionSort>>;
    where?: Maybe<TimelineItemItemsConnectionWhere>;
  }) => TimelineItemItemsConnection;
  notes?: Maybe<ScalarsEnums["String"]>;
  organisation: (args?: {
    options?: Maybe<HiveOrganisationOptions>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<HiveOrganisation>;
  organisationAggregate: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => Maybe<TimelineItemHiveOrganisationOrganisationAggregationSelection>;
  organisationConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<TimelineItemOrganisationConnectionSort>>;
    where?: Maybe<TimelineItemOrganisationConnectionWhere>;
  }) => TimelineItemOrganisationConnection;
  project: (args?: {
    options?: Maybe<QueryOptions>;
    where?: Maybe<TimelineProjectWhere>;
  }) => Maybe<TimelineProject>;
  projectConnection: (args?: {
    where?: Maybe<TimelineItemProjectConnectionWhere>;
  }) => TimelineItemProjectConnection;
  startDate?: Maybe<ScalarsEnums["DateTime"]>;
  timeline?: Maybe<ScalarsEnums["String"]>;
}

export interface TimelineItemAggregateSelection {
  __typename?: "TimelineItemAggregateSelection";
  count: ScalarsEnums["Int"];
  endDate: DateTimeAggregateSelection;
  id: IDAggregateSelection;
  notes: StringAggregateSelection;
  startDate: DateTimeAggregateSelection;
  timeline: StringAggregateSelection;
}

export interface TimelineItemHiveOrganisationOrganisationAggregationSelection {
  __typename?: "TimelineItemHiveOrganisationOrganisationAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<TimelineItemHiveOrganisationOrganisationNodeAggregateSelection>;
}

export interface TimelineItemHiveOrganisationOrganisationNodeAggregateSelection {
  __typename?: "TimelineItemHiveOrganisationOrganisationNodeAggregateSelection";
  id: IDAggregateSelection;
  name: StringAggregateSelection;
}

export interface TimelineItemItems {
  __typename?: "TimelineItemItems";
  estimate?: Maybe<ScalarsEnums["Float"]>;
  id?: Maybe<ScalarsEnums["ID"]>;
  item: (args?: {
    options?: Maybe<TimelineItemOptions>;
    where?: Maybe<TimelineItemWhere>;
  }) => Maybe<TimelineItem>;
  itemAggregate: (args?: {
    where?: Maybe<TimelineItemWhere>;
  }) => Maybe<TimelineItemItemsTimelineItemItemAggregationSelection>;
  itemConnection: (args?: {
    after?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    sort?: Maybe<Array<TimelineItemItemsItemConnectionSort>>;
    where?: Maybe<TimelineItemItemsItemConnectionWhere>;
  }) => TimelineItemItemsItemConnection;
  location?: Maybe<ScalarsEnums["String"]>;
  type?: Maybe<ScalarsEnums["String"]>;
}

export interface TimelineItemItemsAggregateSelection {
  __typename?: "TimelineItemItemsAggregateSelection";
  count: ScalarsEnums["Int"];
  estimate: FloatAggregateSelection;
  id: IDAggregateSelection;
  location: StringAggregateSelection;
  type: StringAggregateSelection;
}

export interface TimelineItemItemsConnection {
  __typename?: "TimelineItemItemsConnection";
  edges: Array<TimelineItemItemsRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface TimelineItemItemsItemConnection {
  __typename?: "TimelineItemItemsItemConnection";
  edges: Array<TimelineItemItemsItemRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface TimelineItemItemsItemRelationship {
  __typename?: "TimelineItemItemsItemRelationship";
  cursor: ScalarsEnums["String"];
  node: TimelineItem;
}

export interface TimelineItemItemsRelationship {
  __typename?: "TimelineItemItemsRelationship";
  cursor: ScalarsEnums["String"];
  node: TimelineItemItems;
}

export interface TimelineItemItemsTimelineItemItemAggregationSelection {
  __typename?: "TimelineItemItemsTimelineItemItemAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<TimelineItemItemsTimelineItemItemNodeAggregateSelection>;
}

export interface TimelineItemItemsTimelineItemItemNodeAggregateSelection {
  __typename?: "TimelineItemItemsTimelineItemItemNodeAggregateSelection";
  endDate: DateTimeAggregateSelection;
  id: IDAggregateSelection;
  notes: StringAggregateSelection;
  startDate: DateTimeAggregateSelection;
  timeline: StringAggregateSelection;
}

export interface TimelineItemOrganisationConnection {
  __typename?: "TimelineItemOrganisationConnection";
  edges: Array<TimelineItemOrganisationRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface TimelineItemOrganisationRelationship {
  __typename?: "TimelineItemOrganisationRelationship";
  cursor: ScalarsEnums["String"];
  node: HiveOrganisation;
}

export interface TimelineItemProjectConnection {
  __typename?: "TimelineItemProjectConnection";
  edges: Array<TimelineItemProjectRelationship>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums["Int"];
}

export interface TimelineItemProjectRelationship {
  __typename?: "TimelineItemProjectRelationship";
  cursor: ScalarsEnums["String"];
  node: TimelineProject;
}

export interface TimelineItemTimelineItemItemsItemsAggregationSelection {
  __typename?: "TimelineItemTimelineItemItemsItemsAggregationSelection";
  count: ScalarsEnums["Int"];
  node?: Maybe<TimelineItemTimelineItemItemsItemsNodeAggregateSelection>;
}

export interface TimelineItemTimelineItemItemsItemsNodeAggregateSelection {
  __typename?: "TimelineItemTimelineItemItemsItemsNodeAggregateSelection";
  estimate: FloatAggregateSelection;
  id: IDAggregateSelection;
  location: StringAggregateSelection;
  type: StringAggregateSelection;
}

export interface TimelineProject {
  __typename?: "Estimate" | "Project";
  $on: $TimelineProject;
}

export interface UpdateEquipmentMutationResponse {
  __typename?: "UpdateEquipmentMutationResponse";
  equipment: Array<Equipment>;
  info: UpdateInfo;
}

export interface UpdateEstimatesMutationResponse {
  __typename?: "UpdateEstimatesMutationResponse";
  estimates: Array<Estimate>;
  info: UpdateInfo;
}

export interface UpdateHiveAppliancesMutationResponse {
  __typename?: "UpdateHiveAppliancesMutationResponse";
  hiveAppliances: Array<HiveAppliance>;
  info: UpdateInfo;
}

export interface UpdateHiveIntegrationInstancesMutationResponse {
  __typename?: "UpdateHiveIntegrationInstancesMutationResponse";
  hiveIntegrationInstances: Array<HiveIntegrationInstance>;
  info: UpdateInfo;
}

export interface UpdateHiveIntegrationPathCollectionsMutationResponse {
  __typename?: "UpdateHiveIntegrationPathCollectionsMutationResponse";
  hiveIntegrationPathCollections: Array<HiveIntegrationPathCollection>;
  info: UpdateInfo;
}

export interface UpdateHiveIntegrationPathsMutationResponse {
  __typename?: "UpdateHiveIntegrationPathsMutationResponse";
  hiveIntegrationPaths: Array<HiveIntegrationPath>;
  info: UpdateInfo;
}

export interface UpdateHiveIntegrationsMutationResponse {
  __typename?: "UpdateHiveIntegrationsMutationResponse";
  hiveIntegrations: Array<HiveIntegration>;
  info: UpdateInfo;
}

export interface UpdateHiveOrganisationsMutationResponse {
  __typename?: "UpdateHiveOrganisationsMutationResponse";
  hiveOrganisations: Array<HiveOrganisation>;
  info: UpdateInfo;
}

export interface UpdateHiveServicesMutationResponse {
  __typename?: "UpdateHiveServicesMutationResponse";
  hiveServices: Array<HiveService>;
  info: UpdateInfo;
}

export interface UpdateHiveTypeFieldsMutationResponse {
  __typename?: "UpdateHiveTypeFieldsMutationResponse";
  hiveTypeFields: Array<HiveTypeField>;
  info: UpdateInfo;
}

export interface UpdateHiveTypesMutationResponse {
  __typename?: "UpdateHiveTypesMutationResponse";
  hiveTypes: Array<HiveType>;
  info: UpdateInfo;
}

export interface UpdateHiveUsersMutationResponse {
  __typename?: "UpdateHiveUsersMutationResponse";
  hiveUsers: Array<HiveUser>;
  info: UpdateInfo;
}

export interface UpdateInfo {
  __typename?: "UpdateInfo";
  bookmark?: Maybe<ScalarsEnums["String"]>;
  nodesCreated: ScalarsEnums["Int"];
  nodesDeleted: ScalarsEnums["Int"];
  relationshipsCreated: ScalarsEnums["Int"];
  relationshipsDeleted: ScalarsEnums["Int"];
}

export interface UpdatePeopleMutationResponse {
  __typename?: "UpdatePeopleMutationResponse";
  info: UpdateInfo;
  people: Array<People>;
}

export interface UpdatePermissionsMutationResponse {
  __typename?: "UpdatePermissionsMutationResponse";
  info: UpdateInfo;
  permissions: Array<Permission>;
}

export interface UpdateProjectResultsMutationResponse {
  __typename?: "UpdateProjectResultsMutationResponse";
  info: UpdateInfo;
  projectResults: Array<ProjectResult>;
}

export interface UpdateProjectsMutationResponse {
  __typename?: "UpdateProjectsMutationResponse";
  info: UpdateInfo;
  projects: Array<Project>;
}

export interface UpdateRolesMutationResponse {
  __typename?: "UpdateRolesMutationResponse";
  info: UpdateInfo;
  roles: Array<Role>;
}

export interface UpdateScheduleItemsMutationResponse {
  __typename?: "UpdateScheduleItemsMutationResponse";
  info: UpdateInfo;
  scheduleItems: Array<ScheduleItem>;
}

export interface UpdateTimelineItemItemsMutationResponse {
  __typename?: "UpdateTimelineItemItemsMutationResponse";
  info: UpdateInfo;
  timelineItemItems: Array<TimelineItemItems>;
}

export interface UpdateTimelineItemsMutationResponse {
  __typename?: "UpdateTimelineItemsMutationResponse";
  info: UpdateInfo;
  timelineItems: Array<TimelineItem>;
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
  createEquipment: (args: {
    input: Array<EquipmentCreateInput>;
  }) => CreateEquipmentMutationResponse;
  createEstimates: (args: {
    input: Array<EstimateCreateInput>;
  }) => CreateEstimatesMutationResponse;
  createHiveAppliances: (args: {
    input: Array<HiveApplianceCreateInput>;
  }) => CreateHiveAppliancesMutationResponse;
  createHiveIntegrationInstances: (args: {
    input: Array<HiveIntegrationInstanceCreateInput>;
  }) => CreateHiveIntegrationInstancesMutationResponse;
  createHiveIntegrationPathCollections: (args: {
    input: Array<HiveIntegrationPathCollectionCreateInput>;
  }) => CreateHiveIntegrationPathCollectionsMutationResponse;
  createHiveIntegrationPaths: (args: {
    input: Array<HiveIntegrationPathCreateInput>;
  }) => CreateHiveIntegrationPathsMutationResponse;
  createHiveIntegrations: (args: {
    input: Array<HiveIntegrationCreateInput>;
  }) => CreateHiveIntegrationsMutationResponse;
  createHiveOrganisations: (args: {
    input: Array<HiveOrganisationCreateInput>;
  }) => CreateHiveOrganisationsMutationResponse;
  createHiveServices: (args: {
    input: Array<HiveServiceCreateInput>;
  }) => CreateHiveServicesMutationResponse;
  createHiveTypeFields: (args: {
    input: Array<HiveTypeFieldCreateInput>;
  }) => CreateHiveTypeFieldsMutationResponse;
  createHiveTypes: (args: {
    input: Array<HiveTypeCreateInput>;
  }) => CreateHiveTypesMutationResponse;
  createHiveUsers: (args: {
    input: Array<HiveUserCreateInput>;
  }) => CreateHiveUsersMutationResponse;
  createPeople: (args: {
    input: Array<PeopleCreateInput>;
  }) => CreatePeopleMutationResponse;
  createPermissions: (args: {
    input: Array<PermissionCreateInput>;
  }) => CreatePermissionsMutationResponse;
  createProjectResults: (args: {
    input: Array<ProjectResultCreateInput>;
  }) => CreateProjectResultsMutationResponse;
  createProjects: (args: {
    input: Array<ProjectCreateInput>;
  }) => CreateProjectsMutationResponse;
  createRoles: (args: {
    input: Array<RoleCreateInput>;
  }) => CreateRolesMutationResponse;
  createScheduleItems: (args: {
    input: Array<ScheduleItemCreateInput>;
  }) => CreateScheduleItemsMutationResponse;
  createTimelineItemItems: (args: {
    input: Array<TimelineItemItemsCreateInput>;
  }) => CreateTimelineItemItemsMutationResponse;
  createTimelineItems: (args: {
    input: Array<TimelineItemCreateInput>;
  }) => CreateTimelineItemsMutationResponse;
  deleteEquipment: (args?: {
    delete?: Maybe<EquipmentDeleteInput>;
    where?: Maybe<EquipmentWhere>;
  }) => DeleteInfo;
  deleteEstimates: (args?: {
    delete?: Maybe<EstimateDeleteInput>;
    where?: Maybe<EstimateWhere>;
  }) => DeleteInfo;
  deleteHiveAppliances: (args?: {
    delete?: Maybe<HiveApplianceDeleteInput>;
    where?: Maybe<HiveApplianceWhere>;
  }) => DeleteInfo;
  deleteHiveIntegrationInstances: (args?: {
    delete?: Maybe<HiveIntegrationInstanceDeleteInput>;
    where?: Maybe<HiveIntegrationInstanceWhere>;
  }) => DeleteInfo;
  deleteHiveIntegrationPathCollections: (args?: {
    where?: Maybe<HiveIntegrationPathCollectionWhere>;
  }) => DeleteInfo;
  deleteHiveIntegrationPaths: (args?: {
    delete?: Maybe<HiveIntegrationPathDeleteInput>;
    where?: Maybe<HiveIntegrationPathWhere>;
  }) => DeleteInfo;
  deleteHiveIntegrations: (args?: {
    where?: Maybe<HiveIntegrationWhere>;
  }) => DeleteInfo;
  deleteHiveOrganisations: (args?: {
    delete?: Maybe<HiveOrganisationDeleteInput>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => DeleteInfo;
  deleteHiveServices: (args?: {
    where?: Maybe<HiveServiceWhere>;
  }) => DeleteInfo;
  deleteHiveTypeFields: (args?: {
    where?: Maybe<HiveTypeFieldWhere>;
  }) => DeleteInfo;
  deleteHiveTypes: (args?: {
    delete?: Maybe<HiveTypeDeleteInput>;
    where?: Maybe<HiveTypeWhere>;
  }) => DeleteInfo;
  deleteHiveUsers: (args?: {
    delete?: Maybe<HiveUserDeleteInput>;
    where?: Maybe<HiveUserWhere>;
  }) => DeleteInfo;
  deletePeople: (args?: {
    delete?: Maybe<PeopleDeleteInput>;
    where?: Maybe<PeopleWhere>;
  }) => DeleteInfo;
  deletePermissions: (args?: {
    delete?: Maybe<PermissionDeleteInput>;
    where?: Maybe<PermissionWhere>;
  }) => DeleteInfo;
  deleteProjectResults: (args?: {
    delete?: Maybe<ProjectResultDeleteInput>;
    where?: Maybe<ProjectResultWhere>;
  }) => DeleteInfo;
  deleteProjects: (args?: {
    delete?: Maybe<ProjectDeleteInput>;
    where?: Maybe<ProjectWhere>;
  }) => DeleteInfo;
  deleteRoles: (args?: {
    delete?: Maybe<RoleDeleteInput>;
    where?: Maybe<RoleWhere>;
  }) => DeleteInfo;
  deleteScheduleItems: (args?: {
    delete?: Maybe<ScheduleItemDeleteInput>;
    where?: Maybe<ScheduleItemWhere>;
  }) => DeleteInfo;
  deleteTimelineItemItems: (args?: {
    delete?: Maybe<TimelineItemItemsDeleteInput>;
    where?: Maybe<TimelineItemItemsWhere>;
  }) => DeleteInfo;
  deleteTimelineItems: (args?: {
    delete?: Maybe<TimelineItemDeleteInput>;
    where?: Maybe<TimelineItemWhere>;
  }) => DeleteInfo;
  updateEquipment: (args?: {
    connect?: Maybe<EquipmentConnectInput>;
    connectOrCreate?: Maybe<EquipmentConnectOrCreateInput>;
    create?: Maybe<EquipmentRelationInput>;
    delete?: Maybe<EquipmentDeleteInput>;
    disconnect?: Maybe<EquipmentDisconnectInput>;
    update?: Maybe<EquipmentUpdateInput>;
    where?: Maybe<EquipmentWhere>;
  }) => UpdateEquipmentMutationResponse;
  updateEstimates: (args?: {
    connect?: Maybe<EstimateConnectInput>;
    connectOrCreate?: Maybe<EstimateConnectOrCreateInput>;
    create?: Maybe<EstimateRelationInput>;
    delete?: Maybe<EstimateDeleteInput>;
    disconnect?: Maybe<EstimateDisconnectInput>;
    update?: Maybe<EstimateUpdateInput>;
    where?: Maybe<EstimateWhere>;
  }) => UpdateEstimatesMutationResponse;
  updateHiveAppliances: (args?: {
    connect?: Maybe<HiveApplianceConnectInput>;
    connectOrCreate?: Maybe<HiveApplianceConnectOrCreateInput>;
    create?: Maybe<HiveApplianceRelationInput>;
    delete?: Maybe<HiveApplianceDeleteInput>;
    disconnect?: Maybe<HiveApplianceDisconnectInput>;
    update?: Maybe<HiveApplianceUpdateInput>;
    where?: Maybe<HiveApplianceWhere>;
  }) => UpdateHiveAppliancesMutationResponse;
  updateHiveIntegrationInstances: (args?: {
    connect?: Maybe<HiveIntegrationInstanceConnectInput>;
    connectOrCreate?: Maybe<HiveIntegrationInstanceConnectOrCreateInput>;
    create?: Maybe<HiveIntegrationInstanceRelationInput>;
    delete?: Maybe<HiveIntegrationInstanceDeleteInput>;
    disconnect?: Maybe<HiveIntegrationInstanceDisconnectInput>;
    update?: Maybe<HiveIntegrationInstanceUpdateInput>;
    where?: Maybe<HiveIntegrationInstanceWhere>;
  }) => UpdateHiveIntegrationInstancesMutationResponse;
  updateHiveIntegrationPathCollections: (args?: {
    update?: Maybe<HiveIntegrationPathCollectionUpdateInput>;
    where?: Maybe<HiveIntegrationPathCollectionWhere>;
  }) => UpdateHiveIntegrationPathCollectionsMutationResponse;
  updateHiveIntegrationPaths: (args?: {
    connect?: Maybe<HiveIntegrationPathConnectInput>;
    connectOrCreate?: Maybe<HiveIntegrationPathConnectOrCreateInput>;
    create?: Maybe<HiveIntegrationPathRelationInput>;
    delete?: Maybe<HiveIntegrationPathDeleteInput>;
    disconnect?: Maybe<HiveIntegrationPathDisconnectInput>;
    update?: Maybe<HiveIntegrationPathUpdateInput>;
    where?: Maybe<HiveIntegrationPathWhere>;
  }) => UpdateHiveIntegrationPathsMutationResponse;
  updateHiveIntegrations: (args?: {
    update?: Maybe<HiveIntegrationUpdateInput>;
    where?: Maybe<HiveIntegrationWhere>;
  }) => UpdateHiveIntegrationsMutationResponse;
  updateHiveOrganisations: (args?: {
    connect?: Maybe<HiveOrganisationConnectInput>;
    connectOrCreate?: Maybe<HiveOrganisationConnectOrCreateInput>;
    create?: Maybe<HiveOrganisationRelationInput>;
    delete?: Maybe<HiveOrganisationDeleteInput>;
    disconnect?: Maybe<HiveOrganisationDisconnectInput>;
    update?: Maybe<HiveOrganisationUpdateInput>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => UpdateHiveOrganisationsMutationResponse;
  updateHiveServices: (args?: {
    update?: Maybe<HiveServiceUpdateInput>;
    where?: Maybe<HiveServiceWhere>;
  }) => UpdateHiveServicesMutationResponse;
  updateHiveTypeFields: (args?: {
    update?: Maybe<HiveTypeFieldUpdateInput>;
    where?: Maybe<HiveTypeFieldWhere>;
  }) => UpdateHiveTypeFieldsMutationResponse;
  updateHiveTypes: (args?: {
    connect?: Maybe<HiveTypeConnectInput>;
    connectOrCreate?: Maybe<HiveTypeConnectOrCreateInput>;
    create?: Maybe<HiveTypeRelationInput>;
    delete?: Maybe<HiveTypeDeleteInput>;
    disconnect?: Maybe<HiveTypeDisconnectInput>;
    update?: Maybe<HiveTypeUpdateInput>;
    where?: Maybe<HiveTypeWhere>;
  }) => UpdateHiveTypesMutationResponse;
  updateHiveUsers: (args?: {
    connect?: Maybe<HiveUserConnectInput>;
    connectOrCreate?: Maybe<HiveUserConnectOrCreateInput>;
    create?: Maybe<HiveUserRelationInput>;
    delete?: Maybe<HiveUserDeleteInput>;
    disconnect?: Maybe<HiveUserDisconnectInput>;
    update?: Maybe<HiveUserUpdateInput>;
    where?: Maybe<HiveUserWhere>;
  }) => UpdateHiveUsersMutationResponse;
  updatePeople: (args?: {
    connect?: Maybe<PeopleConnectInput>;
    connectOrCreate?: Maybe<PeopleConnectOrCreateInput>;
    create?: Maybe<PeopleRelationInput>;
    delete?: Maybe<PeopleDeleteInput>;
    disconnect?: Maybe<PeopleDisconnectInput>;
    update?: Maybe<PeopleUpdateInput>;
    where?: Maybe<PeopleWhere>;
  }) => UpdatePeopleMutationResponse;
  updatePermissions: (args?: {
    connect?: Maybe<PermissionConnectInput>;
    connectOrCreate?: Maybe<PermissionConnectOrCreateInput>;
    create?: Maybe<PermissionRelationInput>;
    delete?: Maybe<PermissionDeleteInput>;
    disconnect?: Maybe<PermissionDisconnectInput>;
    update?: Maybe<PermissionUpdateInput>;
    where?: Maybe<PermissionWhere>;
  }) => UpdatePermissionsMutationResponse;
  updateProjectResults: (args?: {
    connect?: Maybe<ProjectResultConnectInput>;
    connectOrCreate?: Maybe<ProjectResultConnectOrCreateInput>;
    create?: Maybe<ProjectResultRelationInput>;
    delete?: Maybe<ProjectResultDeleteInput>;
    disconnect?: Maybe<ProjectResultDisconnectInput>;
    update?: Maybe<ProjectResultUpdateInput>;
    where?: Maybe<ProjectResultWhere>;
  }) => UpdateProjectResultsMutationResponse;
  updateProjects: (args?: {
    connect?: Maybe<ProjectConnectInput>;
    connectOrCreate?: Maybe<ProjectConnectOrCreateInput>;
    create?: Maybe<ProjectRelationInput>;
    delete?: Maybe<ProjectDeleteInput>;
    disconnect?: Maybe<ProjectDisconnectInput>;
    update?: Maybe<ProjectUpdateInput>;
    where?: Maybe<ProjectWhere>;
  }) => UpdateProjectsMutationResponse;
  updateRoles: (args?: {
    connect?: Maybe<RoleConnectInput>;
    connectOrCreate?: Maybe<RoleConnectOrCreateInput>;
    create?: Maybe<RoleRelationInput>;
    delete?: Maybe<RoleDeleteInput>;
    disconnect?: Maybe<RoleDisconnectInput>;
    update?: Maybe<RoleUpdateInput>;
    where?: Maybe<RoleWhere>;
  }) => UpdateRolesMutationResponse;
  updateScheduleItems: (args?: {
    connect?: Maybe<ScheduleItemConnectInput>;
    connectOrCreate?: Maybe<ScheduleItemConnectOrCreateInput>;
    create?: Maybe<ScheduleItemRelationInput>;
    delete?: Maybe<ScheduleItemDeleteInput>;
    disconnect?: Maybe<ScheduleItemDisconnectInput>;
    update?: Maybe<ScheduleItemUpdateInput>;
    where?: Maybe<ScheduleItemWhere>;
  }) => UpdateScheduleItemsMutationResponse;
  updateTimelineItemItems: (args?: {
    connect?: Maybe<TimelineItemItemsConnectInput>;
    connectOrCreate?: Maybe<TimelineItemItemsConnectOrCreateInput>;
    create?: Maybe<TimelineItemItemsRelationInput>;
    delete?: Maybe<TimelineItemItemsDeleteInput>;
    disconnect?: Maybe<TimelineItemItemsDisconnectInput>;
    update?: Maybe<TimelineItemItemsUpdateInput>;
    where?: Maybe<TimelineItemItemsWhere>;
  }) => UpdateTimelineItemItemsMutationResponse;
  updateTimelineItems: (args?: {
    connect?: Maybe<TimelineItemConnectInput>;
    connectOrCreate?: Maybe<TimelineItemConnectOrCreateInput>;
    create?: Maybe<TimelineItemRelationInput>;
    delete?: Maybe<TimelineItemDeleteInput>;
    disconnect?: Maybe<TimelineItemDisconnectInput>;
    update?: Maybe<TimelineItemUpdateInput>;
    where?: Maybe<TimelineItemWhere>;
  }) => UpdateTimelineItemsMutationResponse;
}

export interface Query {
  __typename?: "Query";
  equipment: (args?: {
    options?: Maybe<EquipmentOptions>;
    where?: Maybe<EquipmentWhere>;
  }) => Array<Equipment>;
  equipmentAggregate: (args?: {
    where?: Maybe<EquipmentWhere>;
  }) => EquipmentAggregateSelection;
  equipmentCount: (args?: {
    where?: Maybe<EquipmentWhere>;
  }) => ScalarsEnums["Int"];
  estimates: (args?: {
    options?: Maybe<EstimateOptions>;
    where?: Maybe<EstimateWhere>;
  }) => Array<Estimate>;
  estimatesAggregate: (args?: {
    where?: Maybe<EstimateWhere>;
  }) => EstimateAggregateSelection;
  estimatesCount: (args?: {
    where?: Maybe<EstimateWhere>;
  }) => ScalarsEnums["Int"];
  flowWorkInProgress: (args?: {
    endDate?: Maybe<Scalars["DateTime"]>;
    startDate?: Maybe<Scalars["DateTime"]>;
  }) => Maybe<WorkInProgress>;
  hiveAppliances: (args?: {
    options?: Maybe<HiveApplianceOptions>;
    where?: Maybe<HiveApplianceWhere>;
  }) => Array<HiveAppliance>;
  hiveAppliancesAggregate: (args?: {
    where?: Maybe<HiveApplianceWhere>;
  }) => HiveApplianceAggregateSelection;
  hiveAppliancesCount: (args?: {
    where?: Maybe<HiveApplianceWhere>;
  }) => ScalarsEnums["Int"];
  hiveIntegrationInstances: (args?: {
    options?: Maybe<HiveIntegrationInstanceOptions>;
    where?: Maybe<HiveIntegrationInstanceWhere>;
  }) => Array<HiveIntegrationInstance>;
  hiveIntegrationInstancesAggregate: (args?: {
    where?: Maybe<HiveIntegrationInstanceWhere>;
  }) => HiveIntegrationInstanceAggregateSelection;
  hiveIntegrationInstancesCount: (args?: {
    where?: Maybe<HiveIntegrationInstanceWhere>;
  }) => ScalarsEnums["Int"];
  hiveIntegrationPathCollections: (args?: {
    options?: Maybe<HiveIntegrationPathCollectionOptions>;
    where?: Maybe<HiveIntegrationPathCollectionWhere>;
  }) => Array<HiveIntegrationPathCollection>;
  hiveIntegrationPathCollectionsAggregate: (args?: {
    where?: Maybe<HiveIntegrationPathCollectionWhere>;
  }) => HiveIntegrationPathCollectionAggregateSelection;
  hiveIntegrationPathCollectionsCount: (args?: {
    where?: Maybe<HiveIntegrationPathCollectionWhere>;
  }) => ScalarsEnums["Int"];
  hiveIntegrationPaths: (args?: {
    options?: Maybe<HiveIntegrationPathOptions>;
    where?: Maybe<HiveIntegrationPathWhere>;
  }) => Array<HiveIntegrationPath>;
  hiveIntegrationPathsAggregate: (args?: {
    where?: Maybe<HiveIntegrationPathWhere>;
  }) => HiveIntegrationPathAggregateSelection;
  hiveIntegrationPathsCount: (args?: {
    where?: Maybe<HiveIntegrationPathWhere>;
  }) => ScalarsEnums["Int"];
  hiveIntegrations: (args?: {
    options?: Maybe<HiveIntegrationOptions>;
    where?: Maybe<HiveIntegrationWhere>;
  }) => Array<HiveIntegration>;
  hiveIntegrationsAggregate: (args?: {
    where?: Maybe<HiveIntegrationWhere>;
  }) => HiveIntegrationAggregateSelection;
  hiveIntegrationsCount: (args?: {
    where?: Maybe<HiveIntegrationWhere>;
  }) => ScalarsEnums["Int"];
  hiveOrganisations: (args?: {
    options?: Maybe<HiveOrganisationOptions>;
    where?: Maybe<HiveOrganisationWhere>;
  }) => Array<HiveOrganisation>;
  hiveOrganisationsAggregate: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => HiveOrganisationAggregateSelection;
  hiveOrganisationsCount: (args?: {
    where?: Maybe<HiveOrganisationWhere>;
  }) => ScalarsEnums["Int"];
  hiveServices: (args?: {
    options?: Maybe<HiveServiceOptions>;
    where?: Maybe<HiveServiceWhere>;
  }) => Array<HiveService>;
  hiveServicesAggregate: (args?: {
    where?: Maybe<HiveServiceWhere>;
  }) => HiveServiceAggregateSelection;
  hiveServicesCount: (args?: {
    where?: Maybe<HiveServiceWhere>;
  }) => ScalarsEnums["Int"];
  hiveTypeFields: (args?: {
    options?: Maybe<HiveTypeFieldOptions>;
    where?: Maybe<HiveTypeFieldWhere>;
  }) => Array<HiveTypeField>;
  hiveTypeFieldsAggregate: (args?: {
    where?: Maybe<HiveTypeFieldWhere>;
  }) => HiveTypeFieldAggregateSelection;
  hiveTypeFieldsCount: (args?: {
    where?: Maybe<HiveTypeFieldWhere>;
  }) => ScalarsEnums["Int"];
  hiveTypes: (args?: {
    options?: Maybe<HiveTypeOptions>;
    where?: Maybe<HiveTypeWhere>;
  }) => Array<HiveType>;
  hiveTypesAggregate: (args?: {
    where?: Maybe<HiveTypeWhere>;
  }) => HiveTypeAggregateSelection;
  hiveTypesCount: (args?: {
    where?: Maybe<HiveTypeWhere>;
  }) => ScalarsEnums["Int"];
  hiveUsers: (args?: {
    options?: Maybe<HiveUserOptions>;
    where?: Maybe<HiveUserWhere>;
  }) => Array<HiveUser>;
  hiveUsersAggregate: (args?: {
    where?: Maybe<HiveUserWhere>;
  }) => HiveUserAggregateSelection;
  hiveUsersCount: (args?: {
    where?: Maybe<HiveUserWhere>;
  }) => ScalarsEnums["Int"];
  people: (args?: {
    options?: Maybe<PeopleOptions>;
    where?: Maybe<PeopleWhere>;
  }) => Array<People>;
  peopleAggregate: (args?: {
    where?: Maybe<PeopleWhere>;
  }) => PeopleAggregateSelection;
  peopleCount: (args?: { where?: Maybe<PeopleWhere> }) => ScalarsEnums["Int"];
  permissions: (args?: {
    options?: Maybe<PermissionOptions>;
    where?: Maybe<PermissionWhere>;
  }) => Array<Permission>;
  permissionsAggregate: (args?: {
    where?: Maybe<PermissionWhere>;
  }) => PermissionAggregateSelection;
  permissionsCount: (args?: {
    where?: Maybe<PermissionWhere>;
  }) => ScalarsEnums["Int"];
  projectResults: (args?: {
    options?: Maybe<ProjectResultOptions>;
    where?: Maybe<ProjectResultWhere>;
  }) => Array<ProjectResult>;
  projectResultsAggregate: (args?: {
    where?: Maybe<ProjectResultWhere>;
  }) => ProjectResultAggregateSelection;
  projectResultsCount: (args?: {
    where?: Maybe<ProjectResultWhere>;
  }) => ScalarsEnums["Int"];
  projects: (args?: {
    options?: Maybe<ProjectOptions>;
    where?: Maybe<ProjectWhere>;
  }) => Array<Project>;
  projectsAggregate: (args?: {
    where?: Maybe<ProjectWhere>;
  }) => ProjectAggregateSelection;
  projectsCount: (args?: {
    where?: Maybe<ProjectWhere>;
  }) => ScalarsEnums["Int"];
  roles: (args?: {
    options?: Maybe<RoleOptions>;
    where?: Maybe<RoleWhere>;
  }) => Array<Role>;
  rolesAggregate: (args?: {
    where?: Maybe<RoleWhere>;
  }) => RoleAggregateSelection;
  rolesCount: (args?: { where?: Maybe<RoleWhere> }) => ScalarsEnums["Int"];
  scheduleItems: (args?: {
    options?: Maybe<ScheduleItemOptions>;
    where?: Maybe<ScheduleItemWhere>;
  }) => Array<ScheduleItem>;
  scheduleItemsAggregate: (args?: {
    where?: Maybe<ScheduleItemWhere>;
  }) => ScheduleItemAggregateSelection;
  scheduleItemsCount: (args?: {
    where?: Maybe<ScheduleItemWhere>;
  }) => ScalarsEnums["Int"];
  timelineItemItems: (args?: {
    options?: Maybe<TimelineItemItemsOptions>;
    where?: Maybe<TimelineItemItemsWhere>;
  }) => Array<TimelineItemItems>;
  timelineItemItemsAggregate: (args?: {
    where?: Maybe<TimelineItemItemsWhere>;
  }) => TimelineItemItemsAggregateSelection;
  timelineItemItemsCount: (args?: {
    where?: Maybe<TimelineItemItemsWhere>;
  }) => ScalarsEnums["Int"];
  timelineItems: (args?: {
    options?: Maybe<TimelineItemOptions>;
    where?: Maybe<TimelineItemWhere>;
  }) => Array<TimelineItem>;
  timelineItemsAggregate: (args?: {
    where?: Maybe<TimelineItemWhere>;
  }) => TimelineItemAggregateSelection;
  timelineItemsCount: (args?: {
    where?: Maybe<TimelineItemWhere>;
  }) => ScalarsEnums["Int"];
}

export interface Subscription {
  __typename?: "Subscription";
}

export interface SchemaObjectTypes {
  CreateEquipmentMutationResponse: CreateEquipmentMutationResponse;
  CreateEstimatesMutationResponse: CreateEstimatesMutationResponse;
  CreateHiveAppliancesMutationResponse: CreateHiveAppliancesMutationResponse;
  CreateHiveIntegrationInstancesMutationResponse: CreateHiveIntegrationInstancesMutationResponse;
  CreateHiveIntegrationPathCollectionsMutationResponse: CreateHiveIntegrationPathCollectionsMutationResponse;
  CreateHiveIntegrationPathsMutationResponse: CreateHiveIntegrationPathsMutationResponse;
  CreateHiveIntegrationsMutationResponse: CreateHiveIntegrationsMutationResponse;
  CreateHiveOrganisationsMutationResponse: CreateHiveOrganisationsMutationResponse;
  CreateHiveServicesMutationResponse: CreateHiveServicesMutationResponse;
  CreateHiveTypeFieldsMutationResponse: CreateHiveTypeFieldsMutationResponse;
  CreateHiveTypesMutationResponse: CreateHiveTypesMutationResponse;
  CreateHiveUsersMutationResponse: CreateHiveUsersMutationResponse;
  CreateInfo: CreateInfo;
  CreatePeopleMutationResponse: CreatePeopleMutationResponse;
  CreatePermissionsMutationResponse: CreatePermissionsMutationResponse;
  CreateProjectResultsMutationResponse: CreateProjectResultsMutationResponse;
  CreateProjectsMutationResponse: CreateProjectsMutationResponse;
  CreateRolesMutationResponse: CreateRolesMutationResponse;
  CreateScheduleItemsMutationResponse: CreateScheduleItemsMutationResponse;
  CreateTimelineItemItemsMutationResponse: CreateTimelineItemItemsMutationResponse;
  CreateTimelineItemsMutationResponse: CreateTimelineItemsMutationResponse;
  DateTimeAggregateSelection: DateTimeAggregateSelection;
  DeleteInfo: DeleteInfo;
  Equipment: Equipment;
  EquipmentAggregateSelection: EquipmentAggregateSelection;
  EquipmentHiveOrganisationOrganisationAggregationSelection: EquipmentHiveOrganisationOrganisationAggregationSelection;
  EquipmentHiveOrganisationOrganisationNodeAggregateSelection: EquipmentHiveOrganisationOrganisationNodeAggregateSelection;
  EquipmentOrganisationConnection: EquipmentOrganisationConnection;
  EquipmentOrganisationRelationship: EquipmentOrganisationRelationship;
  Estimate: Estimate;
  EstimateAggregateSelection: EstimateAggregateSelection;
  EstimateHiveOrganisationOrganisationAggregationSelection: EstimateHiveOrganisationOrganisationAggregationSelection;
  EstimateHiveOrganisationOrganisationNodeAggregateSelection: EstimateHiveOrganisationOrganisationNodeAggregateSelection;
  EstimateOrganisationConnection: EstimateOrganisationConnection;
  EstimateOrganisationRelationship: EstimateOrganisationRelationship;
  FloatAggregateSelection: FloatAggregateSelection;
  HiveAppliance: HiveAppliance;
  HiveApplianceAggregateSelection: HiveApplianceAggregateSelection;
  HiveApplianceHiveServiceServicesAggregationSelection: HiveApplianceHiveServiceServicesAggregationSelection;
  HiveApplianceHiveServiceServicesNodeAggregateSelection: HiveApplianceHiveServiceServicesNodeAggregateSelection;
  HiveApplianceHiveTypeTypesAggregationSelection: HiveApplianceHiveTypeTypesAggregationSelection;
  HiveApplianceHiveTypeTypesNodeAggregateSelection: HiveApplianceHiveTypeTypesNodeAggregateSelection;
  HiveAppliancePermissionPermissionsAggregationSelection: HiveAppliancePermissionPermissionsAggregationSelection;
  HiveAppliancePermissionPermissionsNodeAggregateSelection: HiveAppliancePermissionPermissionsNodeAggregateSelection;
  HiveAppliancePermissionsConnection: HiveAppliancePermissionsConnection;
  HiveAppliancePermissionsRelationship: HiveAppliancePermissionsRelationship;
  HiveApplianceServicesConnection: HiveApplianceServicesConnection;
  HiveApplianceServicesRelationship: HiveApplianceServicesRelationship;
  HiveApplianceTypesConnection: HiveApplianceTypesConnection;
  HiveApplianceTypesRelationship: HiveApplianceTypesRelationship;
  HiveIntegration: HiveIntegration;
  HiveIntegrationAggregateSelection: HiveIntegrationAggregateSelection;
  HiveIntegrationInstance: HiveIntegrationInstance;
  HiveIntegrationInstanceAggregateSelection: HiveIntegrationInstanceAggregateSelection;
  HiveIntegrationInstanceAppliancesConnection: HiveIntegrationInstanceAppliancesConnection;
  HiveIntegrationInstanceAppliancesRelationship: HiveIntegrationInstanceAppliancesRelationship;
  HiveIntegrationInstanceConnectionsConnection: HiveIntegrationInstanceConnectionsConnection;
  HiveIntegrationInstanceConnectionsRelationship: HiveIntegrationInstanceConnectionsRelationship;
  HiveIntegrationInstanceHiveApplianceAppliancesAggregationSelection: HiveIntegrationInstanceHiveApplianceAppliancesAggregationSelection;
  HiveIntegrationInstanceHiveApplianceAppliancesNodeAggregateSelection: HiveIntegrationInstanceHiveApplianceAppliancesNodeAggregateSelection;
  HiveIntegrationInstanceHiveIntegrationIntegrationAggregationSelection: HiveIntegrationInstanceHiveIntegrationIntegrationAggregationSelection;
  HiveIntegrationInstanceHiveIntegrationIntegrationNodeAggregateSelection: HiveIntegrationInstanceHiveIntegrationIntegrationNodeAggregateSelection;
  HiveIntegrationInstanceHiveIntegrationPathConnectionsAggregationSelection: HiveIntegrationInstanceHiveIntegrationPathConnectionsAggregationSelection;
  HiveIntegrationInstanceHiveIntegrationPathConnectionsNodeAggregateSelection: HiveIntegrationInstanceHiveIntegrationPathConnectionsNodeAggregateSelection;
  HiveIntegrationInstanceHiveOrganisationOrganisationAggregationSelection: HiveIntegrationInstanceHiveOrganisationOrganisationAggregationSelection;
  HiveIntegrationInstanceHiveOrganisationOrganisationNodeAggregateSelection: HiveIntegrationInstanceHiveOrganisationOrganisationNodeAggregateSelection;
  HiveIntegrationInstanceIntegrationConnection: HiveIntegrationInstanceIntegrationConnection;
  HiveIntegrationInstanceIntegrationRelationship: HiveIntegrationInstanceIntegrationRelationship;
  HiveIntegrationInstanceOrganisationConnection: HiveIntegrationInstanceOrganisationConnection;
  HiveIntegrationInstanceOrganisationRelationship: HiveIntegrationInstanceOrganisationRelationship;
  HiveIntegrationPath: HiveIntegrationPath;
  HiveIntegrationPathAggregateSelection: HiveIntegrationPathAggregateSelection;
  HiveIntegrationPathCollection: HiveIntegrationPathCollection;
  HiveIntegrationPathCollectionAggregateSelection: HiveIntegrationPathCollectionAggregateSelection;
  HiveIntegrationPathHiveIntegrationInstanceInstanceAggregationSelection: HiveIntegrationPathHiveIntegrationInstanceInstanceAggregationSelection;
  HiveIntegrationPathHiveIntegrationInstanceInstanceNodeAggregateSelection: HiveIntegrationPathHiveIntegrationInstanceInstanceNodeAggregateSelection;
  HiveIntegrationPathInstanceConnection: HiveIntegrationPathInstanceConnection;
  HiveIntegrationPathInstanceRelationship: HiveIntegrationPathInstanceRelationship;
  HiveOrganisation: HiveOrganisation;
  HiveOrganisationAggregateSelection: HiveOrganisationAggregateSelection;
  HiveOrganisationAppliancesConnection: HiveOrganisationAppliancesConnection;
  HiveOrganisationAppliancesRelationship: HiveOrganisationAppliancesRelationship;
  HiveOrganisationEquipmentConnection: HiveOrganisationEquipmentConnection;
  HiveOrganisationEquipmentEquipmentAggregationSelection: HiveOrganisationEquipmentEquipmentAggregationSelection;
  HiveOrganisationEquipmentEquipmentNodeAggregateSelection: HiveOrganisationEquipmentEquipmentNodeAggregateSelection;
  HiveOrganisationEquipmentRelationship: HiveOrganisationEquipmentRelationship;
  HiveOrganisationEstimateEstimatesAggregationSelection: HiveOrganisationEstimateEstimatesAggregationSelection;
  HiveOrganisationEstimateEstimatesNodeAggregateSelection: HiveOrganisationEstimateEstimatesNodeAggregateSelection;
  HiveOrganisationEstimatesConnection: HiveOrganisationEstimatesConnection;
  HiveOrganisationEstimatesRelationship: HiveOrganisationEstimatesRelationship;
  HiveOrganisationHiveApplianceAppliancesAggregationSelection: HiveOrganisationHiveApplianceAppliancesAggregationSelection;
  HiveOrganisationHiveApplianceAppliancesNodeAggregateSelection: HiveOrganisationHiveApplianceAppliancesNodeAggregateSelection;
  HiveOrganisationHiveIntegrationInstanceIntegrationsAggregationSelection: HiveOrganisationHiveIntegrationInstanceIntegrationsAggregationSelection;
  HiveOrganisationHiveIntegrationInstanceIntegrationsNodeAggregateSelection: HiveOrganisationHiveIntegrationInstanceIntegrationsNodeAggregateSelection;
  HiveOrganisationHiveUserMembersAggregationSelection: HiveOrganisationHiveUserMembersAggregationSelection;
  HiveOrganisationHiveUserMembersNodeAggregateSelection: HiveOrganisationHiveUserMembersNodeAggregateSelection;
  HiveOrganisationIntegrationsConnection: HiveOrganisationIntegrationsConnection;
  HiveOrganisationIntegrationsRelationship: HiveOrganisationIntegrationsRelationship;
  HiveOrganisationMembersConnection: HiveOrganisationMembersConnection;
  HiveOrganisationMembersRelationship: HiveOrganisationMembersRelationship;
  HiveOrganisationPeopleConnection: HiveOrganisationPeopleConnection;
  HiveOrganisationPeoplePeopleAggregationSelection: HiveOrganisationPeoplePeopleAggregationSelection;
  HiveOrganisationPeoplePeopleNodeAggregateSelection: HiveOrganisationPeoplePeopleNodeAggregateSelection;
  HiveOrganisationPeopleRelationship: HiveOrganisationPeopleRelationship;
  HiveOrganisationProjectProjectsAggregationSelection: HiveOrganisationProjectProjectsAggregationSelection;
  HiveOrganisationProjectProjectsNodeAggregateSelection: HiveOrganisationProjectProjectsNodeAggregateSelection;
  HiveOrganisationProjectsConnection: HiveOrganisationProjectsConnection;
  HiveOrganisationProjectsRelationship: HiveOrganisationProjectsRelationship;
  HiveOrganisationRoleRolesAggregationSelection: HiveOrganisationRoleRolesAggregationSelection;
  HiveOrganisationRoleRolesNodeAggregateSelection: HiveOrganisationRoleRolesNodeAggregateSelection;
  HiveOrganisationRolesConnection: HiveOrganisationRolesConnection;
  HiveOrganisationRolesRelationship: HiveOrganisationRolesRelationship;
  HiveOrganisationScheduleConnection: HiveOrganisationScheduleConnection;
  HiveOrganisationScheduleItemScheduleAggregationSelection: HiveOrganisationScheduleItemScheduleAggregationSelection;
  HiveOrganisationScheduleItemScheduleNodeAggregateSelection: HiveOrganisationScheduleItemScheduleNodeAggregateSelection;
  HiveOrganisationScheduleRelationship: HiveOrganisationScheduleRelationship;
  HiveOrganisationTimelineConnection: HiveOrganisationTimelineConnection;
  HiveOrganisationTimelineItemTimelineAggregationSelection: HiveOrganisationTimelineItemTimelineAggregationSelection;
  HiveOrganisationTimelineItemTimelineNodeAggregateSelection: HiveOrganisationTimelineItemTimelineNodeAggregateSelection;
  HiveOrganisationTimelineRelationship: HiveOrganisationTimelineRelationship;
  HiveService: HiveService;
  HiveServiceAggregateSelection: HiveServiceAggregateSelection;
  HiveType: HiveType;
  HiveTypeAggregateSelection: HiveTypeAggregateSelection;
  HiveTypeField: HiveTypeField;
  HiveTypeFieldAggregateSelection: HiveTypeFieldAggregateSelection;
  HiveTypeFieldsConnection: HiveTypeFieldsConnection;
  HiveTypeFieldsRelationship: HiveTypeFieldsRelationship;
  HiveTypeHiveApplianceUsedInAggregationSelection: HiveTypeHiveApplianceUsedInAggregationSelection;
  HiveTypeHiveApplianceUsedInNodeAggregateSelection: HiveTypeHiveApplianceUsedInNodeAggregateSelection;
  HiveTypeHiveTypeFieldFieldsAggregationSelection: HiveTypeHiveTypeFieldFieldsAggregationSelection;
  HiveTypeHiveTypeFieldFieldsNodeAggregateSelection: HiveTypeHiveTypeFieldFieldsNodeAggregateSelection;
  HiveTypeUsedInConnection: HiveTypeUsedInConnection;
  HiveTypeUsedInRelationship: HiveTypeUsedInRelationship;
  HiveUser: HiveUser;
  HiveUserAggregateSelection: HiveUserAggregateSelection;
  HiveUserHiveOrganisationOrganisationAggregationSelection: HiveUserHiveOrganisationOrganisationAggregationSelection;
  HiveUserHiveOrganisationOrganisationNodeAggregateSelection: HiveUserHiveOrganisationOrganisationNodeAggregateSelection;
  HiveUserOrganisationConnection: HiveUserOrganisationConnection;
  HiveUserOrganisationRelationship: HiveUserOrganisationRelationship;
  HiveUserRoleRolesAggregationSelection: HiveUserRoleRolesAggregationSelection;
  HiveUserRoleRolesNodeAggregateSelection: HiveUserRoleRolesNodeAggregateSelection;
  HiveUserRolesConnection: HiveUserRolesConnection;
  HiveUserRolesRelationship: HiveUserRolesRelationship;
  IDAggregateSelection: IDAggregateSelection;
  Mutation: Mutation;
  PageInfo: PageInfo;
  People: People;
  PeopleAggregateSelection: PeopleAggregateSelection;
  PeopleHiveOrganisationOrganisationAggregationSelection: PeopleHiveOrganisationOrganisationAggregationSelection;
  PeopleHiveOrganisationOrganisationNodeAggregateSelection: PeopleHiveOrganisationOrganisationNodeAggregateSelection;
  PeopleOrganisationConnection: PeopleOrganisationConnection;
  PeopleOrganisationRelationship: PeopleOrganisationRelationship;
  Permission: Permission;
  PermissionAggregateSelection: PermissionAggregateSelection;
  PermissionRoleRolesAggregationSelection: PermissionRoleRolesAggregationSelection;
  PermissionRoleRolesNodeAggregateSelection: PermissionRoleRolesNodeAggregateSelection;
  PermissionRolesConnection: PermissionRolesConnection;
  PermissionRolesRelationship: PermissionRolesRelationship;
  Project: Project;
  ProjectAggregateSelection: ProjectAggregateSelection;
  ProjectHiveOrganisationOrganisationAggregationSelection: ProjectHiveOrganisationOrganisationAggregationSelection;
  ProjectHiveOrganisationOrganisationNodeAggregateSelection: ProjectHiveOrganisationOrganisationNodeAggregateSelection;
  ProjectOrganisationConnection: ProjectOrganisationConnection;
  ProjectOrganisationRelationship: ProjectOrganisationRelationship;
  ProjectPlanConnection: ProjectPlanConnection;
  ProjectPlanRelationship: ProjectPlanRelationship;
  ProjectResult: ProjectResult;
  ProjectResultAggregateSelection: ProjectResultAggregateSelection;
  ProjectResultHiveOrganisationOrganisationAggregationSelection: ProjectResultHiveOrganisationOrganisationAggregationSelection;
  ProjectResultHiveOrganisationOrganisationNodeAggregateSelection: ProjectResultHiveOrganisationOrganisationNodeAggregateSelection;
  ProjectResultOrganisationConnection: ProjectResultOrganisationConnection;
  ProjectResultOrganisationRelationship: ProjectResultOrganisationRelationship;
  ProjectScheduleConnection: ProjectScheduleConnection;
  ProjectScheduleItemScheduleAggregationSelection: ProjectScheduleItemScheduleAggregationSelection;
  ProjectScheduleItemScheduleNodeAggregateSelection: ProjectScheduleItemScheduleNodeAggregateSelection;
  ProjectScheduleRelationship: ProjectScheduleRelationship;
  ProjectTimelineItemPlanAggregationSelection: ProjectTimelineItemPlanAggregationSelection;
  ProjectTimelineItemPlanNodeAggregateSelection: ProjectTimelineItemPlanNodeAggregateSelection;
  Query: Query;
  Role: Role;
  RoleAggregateSelection: RoleAggregateSelection;
  RoleAppliancesConnection: RoleAppliancesConnection;
  RoleAppliancesRelationship: RoleAppliancesRelationship;
  RoleHiveApplianceAppliancesAggregationSelection: RoleHiveApplianceAppliancesAggregationSelection;
  RoleHiveApplianceAppliancesNodeAggregateSelection: RoleHiveApplianceAppliancesNodeAggregateSelection;
  RoleHiveOrganisationOrganisationAggregationSelection: RoleHiveOrganisationOrganisationAggregationSelection;
  RoleHiveOrganisationOrganisationNodeAggregateSelection: RoleHiveOrganisationOrganisationNodeAggregateSelection;
  RoleOrganisationConnection: RoleOrganisationConnection;
  RoleOrganisationRelationship: RoleOrganisationRelationship;
  RolePermissionPermissionsAggregationSelection: RolePermissionPermissionsAggregationSelection;
  RolePermissionPermissionsNodeAggregateSelection: RolePermissionPermissionsNodeAggregateSelection;
  RolePermissionsConnection: RolePermissionsConnection;
  RolePermissionsRelationship: RolePermissionsRelationship;
  ScheduleItem: ScheduleItem;
  ScheduleItemAggregateSelection: ScheduleItemAggregateSelection;
  ScheduleItemEquipmentConnection: ScheduleItemEquipmentConnection;
  ScheduleItemEquipmentEquipmentAggregationSelection: ScheduleItemEquipmentEquipmentAggregationSelection;
  ScheduleItemEquipmentEquipmentNodeAggregateSelection: ScheduleItemEquipmentEquipmentNodeAggregateSelection;
  ScheduleItemEquipmentRelationship: ScheduleItemEquipmentRelationship;
  ScheduleItemHiveOrganisationOrganisationAggregationSelection: ScheduleItemHiveOrganisationOrganisationAggregationSelection;
  ScheduleItemHiveOrganisationOrganisationNodeAggregateSelection: ScheduleItemHiveOrganisationOrganisationNodeAggregateSelection;
  ScheduleItemHiveUserManagersAggregationSelection: ScheduleItemHiveUserManagersAggregationSelection;
  ScheduleItemHiveUserManagersNodeAggregateSelection: ScheduleItemHiveUserManagersNodeAggregateSelection;
  ScheduleItemHiveUserOwnerAggregationSelection: ScheduleItemHiveUserOwnerAggregationSelection;
  ScheduleItemHiveUserOwnerNodeAggregateSelection: ScheduleItemHiveUserOwnerNodeAggregateSelection;
  ScheduleItemManagersConnection: ScheduleItemManagersConnection;
  ScheduleItemManagersRelationship: ScheduleItemManagersRelationship;
  ScheduleItemOrganisationConnection: ScheduleItemOrganisationConnection;
  ScheduleItemOrganisationRelationship: ScheduleItemOrganisationRelationship;
  ScheduleItemOwnerConnection: ScheduleItemOwnerConnection;
  ScheduleItemOwnerRelationship: ScheduleItemOwnerRelationship;
  ScheduleItemPeopleConnection: ScheduleItemPeopleConnection;
  ScheduleItemPeoplePeopleAggregationSelection: ScheduleItemPeoplePeopleAggregationSelection;
  ScheduleItemPeoplePeopleNodeAggregateSelection: ScheduleItemPeoplePeopleNodeAggregateSelection;
  ScheduleItemPeopleRelationship: ScheduleItemPeopleRelationship;
  ScheduleItemProjectConnection: ScheduleItemProjectConnection;
  ScheduleItemProjectProjectAggregationSelection: ScheduleItemProjectProjectAggregationSelection;
  ScheduleItemProjectProjectNodeAggregateSelection: ScheduleItemProjectProjectNodeAggregateSelection;
  ScheduleItemProjectRelationship: ScheduleItemProjectRelationship;
  StringAggregateSelection: StringAggregateSelection;
  Subscription: Subscription;
  TimelineItem: TimelineItem;
  TimelineItemAggregateSelection: TimelineItemAggregateSelection;
  TimelineItemHiveOrganisationOrganisationAggregationSelection: TimelineItemHiveOrganisationOrganisationAggregationSelection;
  TimelineItemHiveOrganisationOrganisationNodeAggregateSelection: TimelineItemHiveOrganisationOrganisationNodeAggregateSelection;
  TimelineItemItems: TimelineItemItems;
  TimelineItemItemsAggregateSelection: TimelineItemItemsAggregateSelection;
  TimelineItemItemsConnection: TimelineItemItemsConnection;
  TimelineItemItemsItemConnection: TimelineItemItemsItemConnection;
  TimelineItemItemsItemRelationship: TimelineItemItemsItemRelationship;
  TimelineItemItemsRelationship: TimelineItemItemsRelationship;
  TimelineItemItemsTimelineItemItemAggregationSelection: TimelineItemItemsTimelineItemItemAggregationSelection;
  TimelineItemItemsTimelineItemItemNodeAggregateSelection: TimelineItemItemsTimelineItemItemNodeAggregateSelection;
  TimelineItemOrganisationConnection: TimelineItemOrganisationConnection;
  TimelineItemOrganisationRelationship: TimelineItemOrganisationRelationship;
  TimelineItemProjectConnection: TimelineItemProjectConnection;
  TimelineItemProjectRelationship: TimelineItemProjectRelationship;
  TimelineItemTimelineItemItemsItemsAggregationSelection: TimelineItemTimelineItemItemsItemsAggregationSelection;
  TimelineItemTimelineItemItemsItemsNodeAggregateSelection: TimelineItemTimelineItemItemsItemsNodeAggregateSelection;
  UpdateEquipmentMutationResponse: UpdateEquipmentMutationResponse;
  UpdateEstimatesMutationResponse: UpdateEstimatesMutationResponse;
  UpdateHiveAppliancesMutationResponse: UpdateHiveAppliancesMutationResponse;
  UpdateHiveIntegrationInstancesMutationResponse: UpdateHiveIntegrationInstancesMutationResponse;
  UpdateHiveIntegrationPathCollectionsMutationResponse: UpdateHiveIntegrationPathCollectionsMutationResponse;
  UpdateHiveIntegrationPathsMutationResponse: UpdateHiveIntegrationPathsMutationResponse;
  UpdateHiveIntegrationsMutationResponse: UpdateHiveIntegrationsMutationResponse;
  UpdateHiveOrganisationsMutationResponse: UpdateHiveOrganisationsMutationResponse;
  UpdateHiveServicesMutationResponse: UpdateHiveServicesMutationResponse;
  UpdateHiveTypeFieldsMutationResponse: UpdateHiveTypeFieldsMutationResponse;
  UpdateHiveTypesMutationResponse: UpdateHiveTypesMutationResponse;
  UpdateHiveUsersMutationResponse: UpdateHiveUsersMutationResponse;
  UpdateInfo: UpdateInfo;
  UpdatePeopleMutationResponse: UpdatePeopleMutationResponse;
  UpdatePermissionsMutationResponse: UpdatePermissionsMutationResponse;
  UpdateProjectResultsMutationResponse: UpdateProjectResultsMutationResponse;
  UpdateProjectsMutationResponse: UpdateProjectsMutationResponse;
  UpdateRolesMutationResponse: UpdateRolesMutationResponse;
  UpdateScheduleItemsMutationResponse: UpdateScheduleItemsMutationResponse;
  UpdateTimelineItemItemsMutationResponse: UpdateTimelineItemItemsMutationResponse;
  UpdateTimelineItemsMutationResponse: UpdateTimelineItemsMutationResponse;
  WorkInProgress: WorkInProgress;
}
export type SchemaObjectTypesNames =
  | "CreateEquipmentMutationResponse"
  | "CreateEstimatesMutationResponse"
  | "CreateHiveAppliancesMutationResponse"
  | "CreateHiveIntegrationInstancesMutationResponse"
  | "CreateHiveIntegrationPathCollectionsMutationResponse"
  | "CreateHiveIntegrationPathsMutationResponse"
  | "CreateHiveIntegrationsMutationResponse"
  | "CreateHiveOrganisationsMutationResponse"
  | "CreateHiveServicesMutationResponse"
  | "CreateHiveTypeFieldsMutationResponse"
  | "CreateHiveTypesMutationResponse"
  | "CreateHiveUsersMutationResponse"
  | "CreateInfo"
  | "CreatePeopleMutationResponse"
  | "CreatePermissionsMutationResponse"
  | "CreateProjectResultsMutationResponse"
  | "CreateProjectsMutationResponse"
  | "CreateRolesMutationResponse"
  | "CreateScheduleItemsMutationResponse"
  | "CreateTimelineItemItemsMutationResponse"
  | "CreateTimelineItemsMutationResponse"
  | "DateTimeAggregateSelection"
  | "DeleteInfo"
  | "Equipment"
  | "EquipmentAggregateSelection"
  | "EquipmentHiveOrganisationOrganisationAggregationSelection"
  | "EquipmentHiveOrganisationOrganisationNodeAggregateSelection"
  | "EquipmentOrganisationConnection"
  | "EquipmentOrganisationRelationship"
  | "Estimate"
  | "EstimateAggregateSelection"
  | "EstimateHiveOrganisationOrganisationAggregationSelection"
  | "EstimateHiveOrganisationOrganisationNodeAggregateSelection"
  | "EstimateOrganisationConnection"
  | "EstimateOrganisationRelationship"
  | "FloatAggregateSelection"
  | "HiveAppliance"
  | "HiveApplianceAggregateSelection"
  | "HiveApplianceHiveServiceServicesAggregationSelection"
  | "HiveApplianceHiveServiceServicesNodeAggregateSelection"
  | "HiveApplianceHiveTypeTypesAggregationSelection"
  | "HiveApplianceHiveTypeTypesNodeAggregateSelection"
  | "HiveAppliancePermissionPermissionsAggregationSelection"
  | "HiveAppliancePermissionPermissionsNodeAggregateSelection"
  | "HiveAppliancePermissionsConnection"
  | "HiveAppliancePermissionsRelationship"
  | "HiveApplianceServicesConnection"
  | "HiveApplianceServicesRelationship"
  | "HiveApplianceTypesConnection"
  | "HiveApplianceTypesRelationship"
  | "HiveIntegration"
  | "HiveIntegrationAggregateSelection"
  | "HiveIntegrationInstance"
  | "HiveIntegrationInstanceAggregateSelection"
  | "HiveIntegrationInstanceAppliancesConnection"
  | "HiveIntegrationInstanceAppliancesRelationship"
  | "HiveIntegrationInstanceConnectionsConnection"
  | "HiveIntegrationInstanceConnectionsRelationship"
  | "HiveIntegrationInstanceHiveApplianceAppliancesAggregationSelection"
  | "HiveIntegrationInstanceHiveApplianceAppliancesNodeAggregateSelection"
  | "HiveIntegrationInstanceHiveIntegrationIntegrationAggregationSelection"
  | "HiveIntegrationInstanceHiveIntegrationIntegrationNodeAggregateSelection"
  | "HiveIntegrationInstanceHiveIntegrationPathConnectionsAggregationSelection"
  | "HiveIntegrationInstanceHiveIntegrationPathConnectionsNodeAggregateSelection"
  | "HiveIntegrationInstanceHiveOrganisationOrganisationAggregationSelection"
  | "HiveIntegrationInstanceHiveOrganisationOrganisationNodeAggregateSelection"
  | "HiveIntegrationInstanceIntegrationConnection"
  | "HiveIntegrationInstanceIntegrationRelationship"
  | "HiveIntegrationInstanceOrganisationConnection"
  | "HiveIntegrationInstanceOrganisationRelationship"
  | "HiveIntegrationPath"
  | "HiveIntegrationPathAggregateSelection"
  | "HiveIntegrationPathCollection"
  | "HiveIntegrationPathCollectionAggregateSelection"
  | "HiveIntegrationPathHiveIntegrationInstanceInstanceAggregationSelection"
  | "HiveIntegrationPathHiveIntegrationInstanceInstanceNodeAggregateSelection"
  | "HiveIntegrationPathInstanceConnection"
  | "HiveIntegrationPathInstanceRelationship"
  | "HiveOrganisation"
  | "HiveOrganisationAggregateSelection"
  | "HiveOrganisationAppliancesConnection"
  | "HiveOrganisationAppliancesRelationship"
  | "HiveOrganisationEquipmentConnection"
  | "HiveOrganisationEquipmentEquipmentAggregationSelection"
  | "HiveOrganisationEquipmentEquipmentNodeAggregateSelection"
  | "HiveOrganisationEquipmentRelationship"
  | "HiveOrganisationEstimateEstimatesAggregationSelection"
  | "HiveOrganisationEstimateEstimatesNodeAggregateSelection"
  | "HiveOrganisationEstimatesConnection"
  | "HiveOrganisationEstimatesRelationship"
  | "HiveOrganisationHiveApplianceAppliancesAggregationSelection"
  | "HiveOrganisationHiveApplianceAppliancesNodeAggregateSelection"
  | "HiveOrganisationHiveIntegrationInstanceIntegrationsAggregationSelection"
  | "HiveOrganisationHiveIntegrationInstanceIntegrationsNodeAggregateSelection"
  | "HiveOrganisationHiveUserMembersAggregationSelection"
  | "HiveOrganisationHiveUserMembersNodeAggregateSelection"
  | "HiveOrganisationIntegrationsConnection"
  | "HiveOrganisationIntegrationsRelationship"
  | "HiveOrganisationMembersConnection"
  | "HiveOrganisationMembersRelationship"
  | "HiveOrganisationPeopleConnection"
  | "HiveOrganisationPeoplePeopleAggregationSelection"
  | "HiveOrganisationPeoplePeopleNodeAggregateSelection"
  | "HiveOrganisationPeopleRelationship"
  | "HiveOrganisationProjectProjectsAggregationSelection"
  | "HiveOrganisationProjectProjectsNodeAggregateSelection"
  | "HiveOrganisationProjectsConnection"
  | "HiveOrganisationProjectsRelationship"
  | "HiveOrganisationRoleRolesAggregationSelection"
  | "HiveOrganisationRoleRolesNodeAggregateSelection"
  | "HiveOrganisationRolesConnection"
  | "HiveOrganisationRolesRelationship"
  | "HiveOrganisationScheduleConnection"
  | "HiveOrganisationScheduleItemScheduleAggregationSelection"
  | "HiveOrganisationScheduleItemScheduleNodeAggregateSelection"
  | "HiveOrganisationScheduleRelationship"
  | "HiveOrganisationTimelineConnection"
  | "HiveOrganisationTimelineItemTimelineAggregationSelection"
  | "HiveOrganisationTimelineItemTimelineNodeAggregateSelection"
  | "HiveOrganisationTimelineRelationship"
  | "HiveService"
  | "HiveServiceAggregateSelection"
  | "HiveType"
  | "HiveTypeAggregateSelection"
  | "HiveTypeField"
  | "HiveTypeFieldAggregateSelection"
  | "HiveTypeFieldsConnection"
  | "HiveTypeFieldsRelationship"
  | "HiveTypeHiveApplianceUsedInAggregationSelection"
  | "HiveTypeHiveApplianceUsedInNodeAggregateSelection"
  | "HiveTypeHiveTypeFieldFieldsAggregationSelection"
  | "HiveTypeHiveTypeFieldFieldsNodeAggregateSelection"
  | "HiveTypeUsedInConnection"
  | "HiveTypeUsedInRelationship"
  | "HiveUser"
  | "HiveUserAggregateSelection"
  | "HiveUserHiveOrganisationOrganisationAggregationSelection"
  | "HiveUserHiveOrganisationOrganisationNodeAggregateSelection"
  | "HiveUserOrganisationConnection"
  | "HiveUserOrganisationRelationship"
  | "HiveUserRoleRolesAggregationSelection"
  | "HiveUserRoleRolesNodeAggregateSelection"
  | "HiveUserRolesConnection"
  | "HiveUserRolesRelationship"
  | "IDAggregateSelection"
  | "Mutation"
  | "PageInfo"
  | "People"
  | "PeopleAggregateSelection"
  | "PeopleHiveOrganisationOrganisationAggregationSelection"
  | "PeopleHiveOrganisationOrganisationNodeAggregateSelection"
  | "PeopleOrganisationConnection"
  | "PeopleOrganisationRelationship"
  | "Permission"
  | "PermissionAggregateSelection"
  | "PermissionRoleRolesAggregationSelection"
  | "PermissionRoleRolesNodeAggregateSelection"
  | "PermissionRolesConnection"
  | "PermissionRolesRelationship"
  | "Project"
  | "ProjectAggregateSelection"
  | "ProjectHiveOrganisationOrganisationAggregationSelection"
  | "ProjectHiveOrganisationOrganisationNodeAggregateSelection"
  | "ProjectOrganisationConnection"
  | "ProjectOrganisationRelationship"
  | "ProjectPlanConnection"
  | "ProjectPlanRelationship"
  | "ProjectResult"
  | "ProjectResultAggregateSelection"
  | "ProjectResultHiveOrganisationOrganisationAggregationSelection"
  | "ProjectResultHiveOrganisationOrganisationNodeAggregateSelection"
  | "ProjectResultOrganisationConnection"
  | "ProjectResultOrganisationRelationship"
  | "ProjectScheduleConnection"
  | "ProjectScheduleItemScheduleAggregationSelection"
  | "ProjectScheduleItemScheduleNodeAggregateSelection"
  | "ProjectScheduleRelationship"
  | "ProjectTimelineItemPlanAggregationSelection"
  | "ProjectTimelineItemPlanNodeAggregateSelection"
  | "Query"
  | "Role"
  | "RoleAggregateSelection"
  | "RoleAppliancesConnection"
  | "RoleAppliancesRelationship"
  | "RoleHiveApplianceAppliancesAggregationSelection"
  | "RoleHiveApplianceAppliancesNodeAggregateSelection"
  | "RoleHiveOrganisationOrganisationAggregationSelection"
  | "RoleHiveOrganisationOrganisationNodeAggregateSelection"
  | "RoleOrganisationConnection"
  | "RoleOrganisationRelationship"
  | "RolePermissionPermissionsAggregationSelection"
  | "RolePermissionPermissionsNodeAggregateSelection"
  | "RolePermissionsConnection"
  | "RolePermissionsRelationship"
  | "ScheduleItem"
  | "ScheduleItemAggregateSelection"
  | "ScheduleItemEquipmentConnection"
  | "ScheduleItemEquipmentEquipmentAggregationSelection"
  | "ScheduleItemEquipmentEquipmentNodeAggregateSelection"
  | "ScheduleItemEquipmentRelationship"
  | "ScheduleItemHiveOrganisationOrganisationAggregationSelection"
  | "ScheduleItemHiveOrganisationOrganisationNodeAggregateSelection"
  | "ScheduleItemHiveUserManagersAggregationSelection"
  | "ScheduleItemHiveUserManagersNodeAggregateSelection"
  | "ScheduleItemHiveUserOwnerAggregationSelection"
  | "ScheduleItemHiveUserOwnerNodeAggregateSelection"
  | "ScheduleItemManagersConnection"
  | "ScheduleItemManagersRelationship"
  | "ScheduleItemOrganisationConnection"
  | "ScheduleItemOrganisationRelationship"
  | "ScheduleItemOwnerConnection"
  | "ScheduleItemOwnerRelationship"
  | "ScheduleItemPeopleConnection"
  | "ScheduleItemPeoplePeopleAggregationSelection"
  | "ScheduleItemPeoplePeopleNodeAggregateSelection"
  | "ScheduleItemPeopleRelationship"
  | "ScheduleItemProjectConnection"
  | "ScheduleItemProjectProjectAggregationSelection"
  | "ScheduleItemProjectProjectNodeAggregateSelection"
  | "ScheduleItemProjectRelationship"
  | "StringAggregateSelection"
  | "Subscription"
  | "TimelineItem"
  | "TimelineItemAggregateSelection"
  | "TimelineItemHiveOrganisationOrganisationAggregationSelection"
  | "TimelineItemHiveOrganisationOrganisationNodeAggregateSelection"
  | "TimelineItemItems"
  | "TimelineItemItemsAggregateSelection"
  | "TimelineItemItemsConnection"
  | "TimelineItemItemsItemConnection"
  | "TimelineItemItemsItemRelationship"
  | "TimelineItemItemsRelationship"
  | "TimelineItemItemsTimelineItemItemAggregationSelection"
  | "TimelineItemItemsTimelineItemItemNodeAggregateSelection"
  | "TimelineItemOrganisationConnection"
  | "TimelineItemOrganisationRelationship"
  | "TimelineItemProjectConnection"
  | "TimelineItemProjectRelationship"
  | "TimelineItemTimelineItemItemsItemsAggregationSelection"
  | "TimelineItemTimelineItemItemsItemsNodeAggregateSelection"
  | "UpdateEquipmentMutationResponse"
  | "UpdateEstimatesMutationResponse"
  | "UpdateHiveAppliancesMutationResponse"
  | "UpdateHiveIntegrationInstancesMutationResponse"
  | "UpdateHiveIntegrationPathCollectionsMutationResponse"
  | "UpdateHiveIntegrationPathsMutationResponse"
  | "UpdateHiveIntegrationsMutationResponse"
  | "UpdateHiveOrganisationsMutationResponse"
  | "UpdateHiveServicesMutationResponse"
  | "UpdateHiveTypeFieldsMutationResponse"
  | "UpdateHiveTypesMutationResponse"
  | "UpdateHiveUsersMutationResponse"
  | "UpdateInfo"
  | "UpdatePeopleMutationResponse"
  | "UpdatePermissionsMutationResponse"
  | "UpdateProjectResultsMutationResponse"
  | "UpdateProjectsMutationResponse"
  | "UpdateRolesMutationResponse"
  | "UpdateScheduleItemsMutationResponse"
  | "UpdateTimelineItemItemsMutationResponse"
  | "UpdateTimelineItemsMutationResponse"
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

export interface ScalarsEnums extends MakeNullable<Scalars> {
  SortDirection: SortDirection | undefined;
}
