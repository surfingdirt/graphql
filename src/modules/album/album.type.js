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
      description: TranslatedText
      id: ID!
      itemCount: Int
      lastEditionDate: String
      lastEditor: User
      media: [Media]
      reactions: [ReactionListItem]
      status: Status
      submitter: User!
      title: TranslatedText
  }
  input AlbumCreationInput {
      title: TranslatedTextInput
      description: TranslatedTextInput
      albumContributions: AlbumContributions
      albumVisibility: AlbumVisibility
  }
  input AlbumUpdateInput {
      title: TranslatedTextInput
      description: TranslatedTextInput
      albumContributions: AlbumContributions
      albumVisibility: AlbumVisibility
  }
  extend type Query {
      album(id: ID!, countItems: Int, startItem: Int): Album!
      listMedia(albumId: ID!, countItems: Int, startItem: Int): [Media]
      listAlbums(userId: ID, countItems: Int, count: Int, start: Int, sort: String, dir: String, skipAlbums: [String]): [Album]
  }
  extend type Mutation {
      createAlbum(input: AlbumCreationInput!): Album!
      updateAlbum(id: ID, input: AlbumUpdateInput!): Album!
      deleteAlbum(id: ID!): Boolean
  }
`;
