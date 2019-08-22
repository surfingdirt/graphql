const { gql } = require("apollo-server-express");

module.exports = gql`
  type Video {
      album: Album
      actions: ActionsList
      date: String
      description: String
      embedUrl: String
      height: Int
      id: ID!
      lastEditionDate: String
      lastEditor: User
      mediaSubType: MediaSubType!
      status: String
      submitter: User!
      title: String
      thumbs: [Image]
      users: [User]
      vendorKey: String
      vendorUrl: String
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
  extend type Query {
      video(id: ID!): Video!
  }
  extend type Mutation {
      createVideo(input: VideoCreationInput!): Video!
      updateVideo(id: ID, input: VideoUpdateInput!): Video!
  }
  
`;
