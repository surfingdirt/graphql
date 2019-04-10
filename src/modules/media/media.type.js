const { gql } = require("apollo-server-express");

module.exports = gql`
  type Media {
      album: Album
      date: String
      description: String
      height: Int
      id: ID
      imageId: String
      lastEditionDate: String
      lastEditor: User
      mediaSubType: String
      mediaType: String
      status: String
      submitter: User!
      title: String
      users: [User]
      vendorKey: String
      width: Int
  }
  extend type Query {
      media(id: String!): Media!
  }
`;
