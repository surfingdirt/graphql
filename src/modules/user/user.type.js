const { gql } = require("apollo-server-express");
module.exports = gql`
  type Me {
      avatar: [Image]
      bio: TranslatedText
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
      bio: TranslatedText
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
      bio: TranslatedTextInput
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
  input UserCreationOAuthInput {
      locale: String
      photoUrl: String
      timezone: String
      token: String
      username: String!
  }
  input UserUpdateInput {
      bio: TranslatedTextInput
      city: String
      confirmPassword: String
      date: String
      email: String
      firstName: String
      locale: String
      lastName: String
      userP: String
      userPC: String
      userPO: String
      site: String
      status: String
      timezone: String
  }
  input SettingsUpdateInput {
      bio: TranslatedTextInput
      city: String
      confirmPassword: String
      date: String
      email: String
      firstName: String
      locale: String
      lastName: String
      userP: String
      userPC: String
      userPO: String
      site: String
      status: String
      timezone: String
      userId: ID!
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
  type UserConfirmationStatus {
      status: Boolean
      alreadyDone: Boolean
  }
  type UserCreationOAuthResponse {
      user: User!
      token: AccessToken!
  }
  type UsernameExistsResponse {
      username: String!
      exists: Boolean!
  }
  extend type Query {
      user(userId: ID!): User!
      me: Me!
      listUsers: [User]
      emailExists(email: String!): Boolean
      usernameExists(username: String!): UsernameExistsResponse
  }
  extend type Mutation {
      createUser(input: UserCreationInput!): User!
      createUserOAuth(input: UserCreationOAuthInput!): UserCreationOAuthResponse!
      updateUser(userId: ID!, input: UserUpdateInput!): User!
      updateSettings(input: SettingsUpdateInput!): User!
      updateAvatar(file: Upload!): Me
      updateCover(file: Upload!): Me
      confirmEmail(userId: ID, input: UserConfirmationInput!): UserConfirmationStatus!
      forgotPassword(input: ForgotPasswordInput): Boolean
      activateNewPassword(userId: ID!, input: NewPasswordActivationInput!): Boolean
  }
`;
