const { gql } = require("apollo-server-express");

module.exports = gql`
  type AccessToken {
    uid: ID!
    accessToken: String!
    tokenType: String!
    expires: Int!
    # TODO: rename and add refreshToken here
  }
  input LoginInput {
    username: String
    userP: String
  }
  input LoginOAuthInput {
    token: String
  }
  extend type Mutation {
    login(input: LoginInput!): AccessToken!
    loginOAuth(input: LoginOAuthInput!): AccessToken!
    logout: Boolean
  }
`;
