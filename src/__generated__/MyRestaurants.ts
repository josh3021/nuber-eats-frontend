/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyRestaurants
// ====================================================

export interface MyRestaurants_myRestaurants_results_category {
  __typename: "Category";
  name: string;
}

export interface MyRestaurants_myRestaurants_results {
  __typename: "Restaurant";
  id: string;
  name: string;
  coverImage: string;
  category: MyRestaurants_myRestaurants_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface MyRestaurants_myRestaurants {
  __typename: "MyRestaurantsOutput";
  result: boolean;
  error: string | null;
  results: MyRestaurants_myRestaurants_results[] | null;
}

export interface MyRestaurants {
  myRestaurants: MyRestaurants_myRestaurants;
}
