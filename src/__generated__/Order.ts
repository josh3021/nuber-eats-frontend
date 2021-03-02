/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: Order
// ====================================================

export interface Order_order_order_driver {
  __typename: "User";
  email: string;
}

export interface Order_order_order_customer {
  __typename: "User";
  email: string;
}

export interface Order_order_order_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface Order_order_order {
  __typename: "Order";
  id: string;
  status: OrderStatus;
  total: number | null;
  driver: Order_order_order_driver | null;
  customer: Order_order_order_customer | null;
  restaurant: Order_order_order_restaurant | null;
}

export interface Order_order {
  __typename: "OrderOutput";
  result: boolean;
  error: string | null;
  order: Order_order_order | null;
}

export interface Order {
  order: Order_order;
}

export interface OrderVariables {
  orderId: number;
}
