const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    alive: String
  }
  type Mutation {
    toto: String
  }
  enum Status {
      VALID
      INVALID
  }
  type ActionsList {
      add: Boolean
      delete: Boolean
      edit: Boolean
  }
`;
