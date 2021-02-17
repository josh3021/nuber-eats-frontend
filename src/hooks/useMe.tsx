import { gql, useQuery } from '@apollo/client';
import { MeQuery } from '../__generated__/MeQuery';

export const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<MeQuery>(ME_QUERY);
};
