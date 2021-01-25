import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { LOCALSTORAGE_TOKEN } from './constants';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authorizedTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: 'http://192.168.1.16:3001/graphql',
});

const authorizedLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: authorizedTokenVar() || '',
    },
  };
});

export const client = new ApolloClient({
  link: authorizedLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authorizedTokenVar();
            },
          },
        },
      },
    },
  }),
  connectToDevTools: true,
});
