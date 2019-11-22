const { gql } = require("apollo-server-express");

module.exports = gql`
  input PhotoCreationInput {
      title: String
      description: String
      albumId: ID!
      mediaSubType: MediaSubType!
      status: String
  }
  input PhotoUpdateInput {
      title: String
      description: String
      status: String
  }
  extend type Mutation {
      createPhoto(input: PhotoCreationInput!, file: Upload!): Media!
      updatePhoto(id: ID, input: PhotoUpdateInput!, file: Upload): Media!
  }

`;
