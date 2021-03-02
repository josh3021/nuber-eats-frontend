/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TakeOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: TakeOrder
// ====================================================

export interface TakeOrder_takeOrder {
  __typename: "TakeOrderOutput";
  result: boolean;
  error: string | null;
}

export interface TakeOrder {
  takeOrder: TakeOrder_takeOrder;
}

export interface TakeOrderVariables {
  takeOrderInput: TakeOrderInput;
}
