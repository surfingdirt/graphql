const { gql } = require("apollo-server-express");

module.exports = gql`
  type Image {
  }
  extend type Query {
      image(id: String!): Image!
  }
`;
