import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
  credentials: 'include'
});


test('renders app', () => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
  const logo = screen.getAllByRole("img");
  expect(logo).toHaveLength(1);
  expect(logo[0].id).toBe("fire-logo");
});
