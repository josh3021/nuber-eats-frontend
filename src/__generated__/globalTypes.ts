/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

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

export interface LoginInput {
  email: string;
  password: string;
}

export interface RestaurantInput {
  restaurantId: string;
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

export interface UpdateAccountInput {
  email?: string | null;
  password?: string | null;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
