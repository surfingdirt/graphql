const { gql } = require("apollo-server-express");
module.exports = gql`
  type Me {
      avatar: [Image]
      bio: String
      cover: [Image]
      email: String
      firstName: String
      locale: String
      status: String
      timezone: String
      userId: ID
      username: String
  }
  type User {
      actions: ActionsList
      album: Album
      avatar: [Image]
      bio: String
      city: String
      cover: [Image]
      date: String
      email: String
      firstName: String
      locale: String
      lastName: String
      site: String
      status: String
      timezone: String
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
      locale: String
      lastName: String
      site: String
      timezone: String
      username: String!
      userP: String!
  }
  input UserUpdateInput {
      bio: String
      city: String
      confirmPassword: String
      date: String
      email: String
      firstName: String
      locale: String
      lastName: String
      password: String
      site: String
      status: String
      timezone: String
  }
  input UserConfirmationInput {
      aK: String
  }
  input ForgotPasswordInput {
      username: String!
  }
  input NewPasswordActivationInput {
      activationKey: String!
  }
  type userConfirmationStatus {
      status: Boolean
      alreadyDone: Boolean
  }
  extend type Query {
      user(userId: ID!): User!
      me: Me!
      listUsers: [User]
      emailExists(email: String!): Boolean
      usernameExists(username: String!): Boolean
  }
  extend type Mutation {
      createUser(input: UserCreationInput!): User!
      updateUser(userId: ID!, input: UserUpdateInput!): User!
      updateAvatar(file: Upload!): Me
      updateCover(file: Upload!): Me
      confirmEmail(userId: ID, input: UserConfirmationInput!): userConfirmationStatus!
      forgotPassword(input: ForgotPasswordInput): Boolean
      activateNewPassword(userId: ID!, input: NewPasswordActivationInput!): Boolean
  }
`;
