const { gql } = require("apollo-server-express");

module.exports = gql`
  enum AlbumAccess {
      PUBLIC
      PRIVATE
  }
  enum AlbumType {
      SIMPLE
      AGGREGATE
  }
  enum AlbumCreation {
      AUTOMATIC
      USER
      STATIC
  }
  type Album {
      id: ID
      title: String
      description: String
      date: String
      submitter: User!
      lastEditor: User
      lastEditionDate: String
      status: Status
      albumType: AlbumType
      albumAccess: AlbumAccess
      albumCreation: AlbumCreation
      media: [Media]
      actions: ActionsList
  }
  
  input AlbumCreationInput {
      title: String
      description: String
      albumAccess: AlbumAccess
  }
  extend type Query {
      album(id: ID!): Album!
      listAlbums(userId: ID): [Album]
  }
  extend type Mutation {
      createAlbum(input: AlbumCreationInput!): Album!
  }
`;
