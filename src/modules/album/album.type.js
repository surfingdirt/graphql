const { gql } = require("apollo-server-express");

const Album = gql`
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
      getAlbum(id: String!): Album!
  }
`;

module.exports = { Album };
