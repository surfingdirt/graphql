const { gql } = require("apollo-server-express");
module.exports = gql`
  type Me {
      avatar: String
      email: String
      firstName: String
      lang: String
      status: String
      userId: ID
      username: String
  }
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
  input UserCreationInput {
      avatar: String
      city: String
      userPC: String!
      date: String
      email: String!
      firstName: String
      lang: String
      lastName: String
      userP: String!
      site: String
      username: String!
  }
  input UserUpdateInput {
      avatar: String
      city: String
      confirmPassword: String
      date: String
      email: String
      firstName: String
      lang: String
      lastName: String
      password: String
      site: String
      status: String
  }
  extend type Query {
      user(userId: String!): User!
      me: Me!
  }
  extend type Mutation {
      createUser(input: UserCreationInput!): User!
      updateUser(userId: ID, input: UserUpdateInput!): User!
  }
`;
