const { gql } = require("apollo-server-express");

module.exports = gql`
    type VideoInfo {
        description: String
        height: Int
        iframeUrl: String
        thumbUrl: String
        title: String
        width: Int
    }
  input VideoCreationInput {
      title: String
      description: String
      albumId: ID!
      vendorKey: String
      imageId: String
      mediaSubType: MediaSubType!
      status: String
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
