const { gql } = require('apollo-server-express');

// https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
const BaseTypes = gql`
  type Query {
    hello: String
  }
  type Mutation {
        toto: String
  }
`;

module.exports = { BaseTypes };
