/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CategoryInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: CategoryQuery
// ====================================================

export interface CategoryQuery_category_category {
  __typename: "Category";
  id: string;
  name: string;
  coverImage: string | null;
  slug: string;
  restaurantCount: number;
}

export interface CategoryQuery_category_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface CategoryQuery_category_restaurants {
  __typename: "Restaurant";
  id: string;
  name: string;
  coverImage: string;
  category: CategoryQuery_category_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface CategoryQuery_category {
  __typename: "CategoryOutput";
  result: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  category: CategoryQuery_category_category | null;
  restaurants: CategoryQuery_category_restaurants[] | null;
}

export interface CategoryQuery {
  category: CategoryQuery_category;
}

export interface CategoryQueryVariables {
  categoryInput: CategoryInput;
}
