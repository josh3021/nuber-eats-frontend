import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { LOCALSTORAGE_TOKEN } from './constants';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authorizedTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: 'http://192.168.1.15:3001/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://192.168.1.15:3001/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      authorization: authorizedTokenVar() || '',
    },
  },
});

const authorizedLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: authorizedTokenVar() || '',
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authorizedLink.concat(httpLink),
);

export const client = new ApolloClient({
  link: splitLink,
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
