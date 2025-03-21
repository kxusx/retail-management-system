import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import App from './App';

// Set up Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Your GraphQL server URL
  cache: new InMemoryCache(),
});

// Create root
const container = document.getElementById('root');
const root = createRoot(container);

// Render app
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
