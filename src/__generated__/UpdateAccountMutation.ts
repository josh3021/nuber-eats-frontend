/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateAccountInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateAccountMutation
// ====================================================

export interface UpdateAccountMutation_updateAccount {
  __typename: "UpdateAccountOutput";
  result: boolean;
  error: string | null;
}

export interface UpdateAccountMutation {
  updateAccount: UpdateAccountMutation_updateAccount;
}

export interface UpdateAccountMutationVariables {
  updateAccountInput: UpdateAccountInput;
}
