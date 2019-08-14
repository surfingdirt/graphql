const { gql } = require("apollo-server-express");

module.exports = gql`
  type Album {
      id: ID
      title: String
      description: String
      date: String
      submitter: User!
      lastEditor: User
      lastEditionDate: String
      status: String
      albumType: String
      albumAccess: String
      albumCreation: String
      media: [Media]
  }
  extend type Query {
      album(id: ID!): Album!
      listAlbums(userId: ID): [Album]
  }
`;
