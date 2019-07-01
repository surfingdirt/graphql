const { gql } = require("apollo-server-express");

module.exports = gql`
  type AccessToken {
    uid: ID!
    accessToken: String!
    tokenType: String!
    expires: Int!
  }
  input LoginInput {
    username: String
    userP: String
  }
  extend type Mutation {
    login(input: LoginInput!): AccessToken!
    logout: Boolean
  }
`;
