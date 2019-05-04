const { gql } = require("apollo-server-express");

module.exports = gql`
  enum MediaType {
      PHOTO
      VIDEO
  }
  enum MediaSubType {
      DAILYMOTION
      FACEBOOK
      INSTAGRAM
      VIMEO
      YOUTUBE
      IMG
      JPG
      PNG
      GIF
      WEBP      
  }
  enum StorageType {
      LOCAL
  }
  enum ImageSize {
      SMALL
      MEDIUM
      LARGE
  }
  enum ImageType {
      JPG
      PNG
      GIF
      WEBP
  }
  type Image {
      size: ImageSize!
      type: ImageType!
      url: String!
  }
  type Media {
      album: Album
      date: String
      description: String
      height: Int
      id: ID!
      lastEditionDate: String
      lastEditor: User
      mediaSubType: MediaSubType!
      mediaType: MediaType!
      status: String
      submitter: User!
      title: String
      thumbs: [Image]
      images: [Image]
      users: [User]
      vendorKey: String
      width: Int
  }
  input MediaCreationInput {
      title: String
      description: String
      albumId: ID!
      mediaType: MediaType!
      vendorKey: String
      imageId: String
      mediaSubType: MediaSubType!
      storageType: StorageType
      status: String
  }
  input MediaUpdateInput {
      title: String
      description: String
      status: String
  }
  extend type Query {
      media(id: String!): Media!
  }
  extend type Mutation {
      createMedia(input: MediaCreationInput!): Media!
      updateMedia(id: ID, input: MediaUpdateInput!): Media!
  }
  
`;
