const { gql } = require("apollo-server-express");

module.exports = gql`
    type VideoInfo {
        description: String
        height: Int
        iframeUrl: String
        mediaSubType: MediaSubType!
        thumbUrl: String
        title: String
        url: String!
        vendorKey: String!
        width: Int
    }
  input VideoCreationInput {
      albumId: ID!
      description: String
      height: Int
      imageId: String
      mediaSubType: MediaSubType!
      status: String
      thumbUrl: String
      title: String
      vendorKey: String!
      width: Int
  }
  input VideoUpdateInput {
      title: String
      description: String
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
