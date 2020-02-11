const { gql } = require("apollo-server-express");

module.exports = gql`
  type VideoInfo {
      description: TranslatedText
      height: Int
      iframeUrl: String
      mediaSubType: MediaSubType!
      thumbUrl: String
      title: TranslatedText
      url: String!
      vendorKey: String!
      width: Int
  }
  input VideoCreationInput {
      albumId: ID!
      description: TranslatedTextInput
      height: Int
      imageId: String
      mediaSubType: MediaSubType!
      status: String
      thumbUrl: String
      title: TranslatedTextInput
      vendorKey: String!
      width: Int
  }
  input VideoUpdateInput {
      title: TranslatedTextInput
      description: TranslatedTextInput
      status: String
      vendorKey: String
      imageId: String
      mediaSubType: MediaSubType
  }
  extend type Mutation {
      createVideo(input: VideoCreationInput!): Media!
      updateVideo(id: ID, input: VideoUpdateInput!): Media!
  }
  extend type Query {
      getVideoInfo(url: String!): VideoInfo!
  }
`;
