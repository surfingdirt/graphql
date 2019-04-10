const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
      album: Album
      avatar: String
      city: String
      date: String
      email: String
      firstName: String
      lang: String
      lastName: String
      site: String
      status: String
      userId: ID
      username: String
  }
  extend type Query {
      user(userId: String!): User!
  }
`;
