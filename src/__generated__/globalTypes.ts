/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum OrderStatus {
  Cooked = "Cooked",
  Cooking = "Cooking",
  Delivered = "Delivered",
  Pending = "Pending",
  PickedUp = "PickedUp",
}

export enum UserRole {
  Client = "Client",
  Delivery = "Delivery",
  Owner = "Owner",
}

export interface CategoryInput {
  take?: number | null;
  page?: number | null;
  slug: string;
}

export interface CreateAccountInput {
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateDishInput {
  name: string;
  price: number;
  description: string;
  options?: DishOptionInputType[] | null;
  restaurantId: string;
}

export interface CreateOrderInput {
  restaurantId: string;
  items: CreateOrderItemInput[];
}

export interface CreateOrderItemInput {
  dishId: string;
  options?: OrderItemOptionInputType[] | null;
}

export interface CreateRestaurantInput {
  name: string;
  address: string;
  coverImage: string;
  categoryName: string;
}

export interface DishChoiceInputType {
  name: string;
  extra?: number | null;
}

export interface DishOptionInputType {
  name: string;
  choices?: DishChoiceInputType[] | null;
  extra?: number | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MyRestaurantInput {
  restaurantId: number;
}

export interface OrderItemOptionInputType {
  name: string;
  choice?: string | null;
  extra?: number | null;
}

export interface RestaurantInput {
  restaurantId: number;
}

export interface RestaurantsInput {
  take?: number | null;
  page?: number | null;
}

export interface SearchRestaurantsInput {
  take?: number | null;
  page?: number | null;
  query: string;
}

export interface TakeOrderInput {
  id: string;
}

export interface UpdateAccountInput {
  email?: string | null;
  password?: string | null;
}

export interface UpdateOrderInput {
  id: string;
  status: OrderStatus;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
