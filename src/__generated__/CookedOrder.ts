/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: CookedOrder
// ====================================================

export interface CookedOrder_cookedOrder_driver {
  __typename: "User";
  email: string;
}

export interface CookedOrder_cookedOrder_customer {
  __typename: "User";
  email: string;
}

export interface CookedOrder_cookedOrder_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface CookedOrder_cookedOrder {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  total: number | null;
  driver: CookedOrder_cookedOrder_driver | null;
  customer: CookedOrder_cookedOrder_customer | null;
  restaurant: CookedOrder_cookedOrder_restaurant | null;
}

export interface CookedOrder {
  cookedOrder: CookedOrder_cookedOrder;
}
