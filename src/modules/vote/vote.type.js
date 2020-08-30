const { gql } = require("apollo-server-express");

module.exports = gql`
  type Vote {
      surveyId: ID
      choice: String
  }
  input VoteInput {
      surveyId: ID!
      choice: String
  }
  extend type Query {
      getSurveyVote(surveyId: ID!): Vote
  }
  extend type Mutation {
      castVote(input: VoteInput!): Vote
  }
`;
