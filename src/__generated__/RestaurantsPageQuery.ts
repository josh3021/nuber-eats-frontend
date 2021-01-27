/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: RestaurantsPageQuery
// ====================================================

export interface RestaurantsPageQuery_categories_categories {
  __typename: "Category";
  id: string;
  name: string;
  coverImage: string | null;
  slug: string;
  restaurantCount: number;
}

export interface RestaurantsPageQuery_categories {
  __typename: "CategoriesOutput";
  result: boolean;
  error: string | null;
  categories: RestaurantsPageQuery_categories_categories[] | null;
}

export interface RestaurantsPageQuery_restaurants_results_category {
  __typename: "Category";
  name: string;
}

export interface RestaurantsPageQuery_restaurants_results {
  __typename: "Restaurant";
  id: string;
  name: string;
  coverImage: string;
  category: RestaurantsPageQuery_restaurants_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface RestaurantsPageQuery_restaurants {
  __typename: "RestaurantsOutput";
  result: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  results: RestaurantsPageQuery_restaurants_results[] | null;
}

export interface RestaurantsPageQuery {
  categories: RestaurantsPageQuery_categories;
  restaurants: RestaurantsPageQuery_restaurants;
}

export interface RestaurantsPageQueryVariables {
  restaurantsInput: RestaurantsInput;
}
