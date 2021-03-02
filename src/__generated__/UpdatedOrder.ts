/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: UpdatedOrder
// ====================================================

export interface UpdatedOrder_updatedOrder_driver {
  __typename: "User";
  email: string;
}

export interface UpdatedOrder_updatedOrder_customer {
  __typename: "User";
  email: string;
}

export interface UpdatedOrder_updatedOrder_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface UpdatedOrder_updatedOrder {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  total: number | null;
  driver: UpdatedOrder_updatedOrder_driver | null;
  customer: UpdatedOrder_updatedOrder_customer | null;
  restaurant: UpdatedOrder_updatedOrder_restaurant | null;
}

export interface UpdatedOrder {
  updatedOrder: UpdatedOrder_updatedOrder;
}

export interface UpdatedOrderVariables {
  orderId: number;
}
