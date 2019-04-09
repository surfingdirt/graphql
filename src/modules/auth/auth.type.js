const { gql } = require("apollo-server-express");

const Auth = gql`
  type AccessToken {
    uid: ID!
    accessToken: String!
    tokenType: String!
    exp: Int!
  }
  input LoginInput {
    username: String
    userP: String
  }
  extend type Mutation {
    login(input: LoginInput!): AccessToken!
    logout: String
  }
`;

module.exports = { Auth };
