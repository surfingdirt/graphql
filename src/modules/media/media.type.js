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
      description: TranslatedText
      embedUrl: String
      height: Int
      id: ID!
      images: [Image]
      lastEditionDate: String
      lastEditor: User
      mediaSubType: MediaSubType!
      mediaType: MediaType!
      status: String
      submitter: User!
      thumbs: [Image]
      title: TranslatedText
      users: [User]
      vendorUrl: String
      width: Int
  }
  extend type Query {
      media(id: ID!): Media
  }
`;
