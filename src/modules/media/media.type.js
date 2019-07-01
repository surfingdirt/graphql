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
      height: Int!
      width: Int!
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
`;
