const { gql } = require("apollo-server-express");

module.exports = gql`
  type Reaction {
      itemType: String!
      itemId: ID!
      type: String
      id: ID!
      submitter: User!
      date: String
  }
  type ReactionListItem {
      type: String!
      count: Int!
      userReactionId: String
  } 
  input ReactionCreationInput {
      itemType: String!
      itemId: ID!
      type: String
  }
  extend type Query {
      listUserReactions: [Reaction]
  }
  extend type Mutation {
      createReaction(input: ReactionCreationInput!): Reaction!
      deleteReaction(id: ID!): Boolean
  }
`;
