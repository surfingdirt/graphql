const { gql } = require("apollo-server-express");

module.exports = gql`
  enum TranslationItemType {
      ALBUM
      COMMENT
      MEDIA
      USER
  }
  type TranslatedText {
      locale: String
      text: String
      original: Boolean
  }
  input TranslatedTextInput {
      locale: String
      text: String
  }
  input TranslationChangeInput {
    itemId: ID!
    locale: String!
  }
  extend type Mutation {
    translateAlbum(input: TranslationChangeInput!): Album!
    translateComment(input: TranslationChangeInput!): Comment!
    translateMedia(input: TranslationChangeInput!): Media!
    translateUser(input: TranslationChangeInput!): User!
  }
`;
