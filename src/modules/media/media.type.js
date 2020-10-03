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
      reactions: [ReactionListItem]
      status: String
      submitter: User!
      thumbs: [Image]
      thumbHeight: Int
      thumbWidth: Int
      title: TranslatedText
      users: [User]
      vendorKey: String
      vendorUrl: String
      width: Int
  }
  extend type Query {
      media(id: ID!): Media
  }
  extend type Mutation {
      deleteMedia(id: ID!): Boolean
  }
`;
