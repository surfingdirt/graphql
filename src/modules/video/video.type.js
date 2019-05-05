const { gql } = require("apollo-server-express");

module.exports = gql`
  type Video {
      album: Album
      date: String
      description: String
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
      width: Int
  }
  input VideoCreationInput {
      title: String
      description: String
      albumId: ID!
      vendorKey: String
      imageId: String
      mediaSubType: MediaSubType!
      storageType: StorageType
      status: String
  }
  input VideoUpdateInput {
      title: String
      description: String
      status: String
  }
  extend type Query {
      video(id: String!): Media!
  }
  extend type Mutation {
      createVideo(input: VideoCreationInput!): Video!
      updateVideo(id: ID, input: VideoUpdateInput!): Video!
  }
  
`;
