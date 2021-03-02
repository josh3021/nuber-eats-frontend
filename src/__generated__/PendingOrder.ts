/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: PendingOrder
// ====================================================

export interface PendingOrder_pendingOrder_driver {
  __typename: "User";
  email: string;
}

export interface PendingOrder_pendingOrder_customer {
  __typename: "User";
  email: string;
}

export interface PendingOrder_pendingOrder_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface PendingOrder_pendingOrder {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  total: number | null;
  driver: PendingOrder_pendingOrder_driver | null;
  customer: PendingOrder_pendingOrder_customer | null;
  restaurant: PendingOrder_pendingOrder_restaurant | null;
}

export interface PendingOrder {
  pendingOrder: PendingOrder_pendingOrder;
}
