const { gql } = require("apollo-server-express");
module.exports = gql`
  type Me {
      avatar: [Image]
      bio: String
      cover: [Image]
      email: String
      firstName: String
      lang: String
      status: String
      userId: ID
      username: String
  }
  type User {
      album: Album
      avatar: [Image]
      bio: String
      city: String
      cover: [Image]
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
      bio: String
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
      bio: String
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
      user(userId: ID!): User!
      me: Me!
      listUsers: [User]
  }
  extend type Mutation {
      createUser(input: UserCreationInput!): User!
      updateUser(userId: ID, input: UserUpdateInput!): User!
      updateAvatar(file: Upload!): Me
      updateCover(file: Upload!): Me
  }
`;
