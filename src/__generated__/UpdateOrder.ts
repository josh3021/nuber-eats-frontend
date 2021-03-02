/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateOrder
// ====================================================

export interface UpdateOrder_updateOrder {
  __typename: "UpdateOrderOutput";
  result: boolean;
  error: string | null;
}

export interface UpdateOrder {
  updateOrder: UpdateOrder_updateOrder;
}

export interface UpdateOrderVariables {
  updateOrderInput: UpdateOrderInput;
}
