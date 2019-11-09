const { gql } = require("apollo-server-express");

module.exports = gql`
  type Comment {
      content: String!
      date: String
      id: ID!
      lastEditionDate: String
      lastEditor: User
      parentId: ID!
      parentType: String!
      status: String
      submitter: User!
      tone: String
  }
  input CommentCreationInput {
      content: String!
      parentId: ID!
      status: String
      tone: String
  }
  input CommentUpdateInput {
      content: String!
      status: String
      tone: String
  }
  extend type Query {
      listComments(parentId: ID!, parentType: String!): [Comment]
      comment(id: ID!): Comment!
  }
  extend type Mutation {
      createAlbumComment(input: CommentCreationInput!): Comment!
      createPhotoComment(input: CommentCreationInput!): Comment!
      createVideoComment(input: CommentCreationInput!): Comment!
      deleteComment(id: ID!): Boolean
      updateComment(id: ID!, input: CommentUpdateInput!): Comment!
  }
`;
