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
      actions: ActionsList
      albumContributions: AlbumContributions
      albumCreation: AlbumCreation
      albumType: AlbumType
      albumVisibility: AlbumVisibility
      date: String
      description: String
      id: ID
      itemCount: Int
      lastEditionDate: String
      lastEditor: User
      media: [Media]
      status: Status
      submitter: User!
      title: String
  }
  
  input AlbumCreationInput {
      title: String
      description: String
      albumContributions: AlbumContributions
      albumVisibility: AlbumVisibility
  }
  extend type Query {
      album(id: ID!, countItems: Int): Album!
      listAlbums(userId: ID, countItems: Int, count: Int, start: Int, sort: String, dir: String): [Album]
  }
  extend type Mutation {
      createAlbum(input: AlbumCreationInput!): Album!
  }
`;
