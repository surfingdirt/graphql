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
  type Media {
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
      mediaType: MediaType!
      status: String
      submitter: User!
      title: String
      thumbs: [Image]
      images: [Image]
      users: [User]
      vendorUrl: String
      vendorKey: String
      width: Int
  }
`;
