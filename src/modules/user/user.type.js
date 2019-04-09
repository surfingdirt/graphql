const { gql } = require("apollo-server-express");

const User = gql`
  type User {
      album: ID
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
      getUser(userId: String!): User!
  }
  
`;

module.exports = { User };
