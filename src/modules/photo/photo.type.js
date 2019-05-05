const { gql } = require("apollo-server-express");

module.exports = gql`
  type Photo {
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
      images: [Image]
      users: [User]
      width: Int
  }
  input PhotoCreationInput {
      title: String
      description: String
      albumId: ID!
      imageId: String
      mediaSubType: MediaSubType!
      storageType: StorageType
      status: String
  }
  input PhotoUpdateInput {
      title: String
      description: String
      status: String
  }
  extend type Query {
      photo(id: String!): Media!
  }
  extend type Mutation {
      createPhoto(input: PhotoCreationInput!, file: Upload!): Photo!
      updatePhoto(id: ID, input: PhotoUpdateInput!): Photo!
  }
  
`;
