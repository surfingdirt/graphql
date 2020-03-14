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
    itemType: String!
    itemId: ID!
    fieldName: String!
    locale: String!
  }
  extend type Mutation {
    addAutoTranslation(input: TranslationChangeInput!): TranslatedText!
    updateAutoTranslation(input: TranslationChangeInput!): TranslatedText!
    removeAutoTranslation(input: TranslationChangeInput!): Boolean!
  }
`;
