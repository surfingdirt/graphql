const { gql } = require('apollo-server-express');

// https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
const Query = gql`
  "Base Query type"
  type Query {
    hello: String
  }
`;

module.exports = { Query };
