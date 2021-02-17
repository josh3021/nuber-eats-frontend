/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DishOptionParts
// ====================================================

export interface DishOptionParts_choices {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface DishOptionParts {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: DishOptionParts_choices[] | null;
}
