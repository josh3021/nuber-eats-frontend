/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchRestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchRestaurantsQuery
// ====================================================

export interface SearchRestaurantsQuery_searchRestaurants_results_category {
  __typename: "Category";
  name: string;
}

export interface SearchRestaurantsQuery_searchRestaurants_results {
  __typename: "Restaurant";
  id: string;
  name: string;
  coverImage: string;
  category: SearchRestaurantsQuery_searchRestaurants_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface SearchRestaurantsQuery_searchRestaurants {
  __typename: "SearchRestaurantsOutput";
  result: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  results: SearchRestaurantsQuery_searchRestaurants_results[] | null;
}

export interface SearchRestaurantsQuery {
  searchRestaurants: SearchRestaurantsQuery_searchRestaurants;
}

export interface SearchRestaurantsQueryVariables {
  searchRestaurantsInput: SearchRestaurantsInput;
}
