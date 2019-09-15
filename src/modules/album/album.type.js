const { gql } = require("apollo-server-express");

module.exports = gql`
  enum AlbumType {
      SIMPLE
      AGGREGATE
  }
  enum AlbumContributions {
      PUBLIC
      PRIVATE
  }
  enum AlbumCreation {
      AUTOMATIC
      USER
      STATIC
  }
  enum AlbumVisibility {
      PRIVATE
      UNLISTED
      VISIBLE
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
      albumContributions: AlbumContributions
      albumCreation: AlbumCreation
      albumVisibility: AlbumVisibility
      media: [Media]
      actions: ActionsList
  }
  
  input AlbumCreationInput {
      title: String
      description: String
      albumContributions: AlbumContributions
      albumVisibility: AlbumVisibility
  }
  extend type Query {
      album(id: ID!, countItems: Int): Album!
      listAlbums(userId: ID, countItems: Int): [Album]
  }
  extend type Mutation {
      createAlbum(input: AlbumCreationInput!): Album!
  }
`;
