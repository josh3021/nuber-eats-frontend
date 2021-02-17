import { gql } from '@apollo/client';

export const ORDER_FRAGMENT = gql`
  fragment OrderParts on Order {
    id
    createdAt
    total
  }
`;
