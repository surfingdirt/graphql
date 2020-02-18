const { gql } = require("apollo-server-express");

module.exports = gql`
  input PhotoCreationInput {
      title: TranslatedTextInput
      description: TranslatedTextInput
      albumId: ID!
      mediaSubType: MediaSubType!
      status: String
  }
  input PhotoUpdateInput {
      title: TranslatedTextInput
      description: TranslatedTextInput
      status: String
  }
  extend type Mutation {
      createPhoto(input: PhotoCreationInput!, file: Upload!): Media!
      updatePhoto(id: ID, input: PhotoUpdateInput!, file: Upload): Media!
  }

`;
