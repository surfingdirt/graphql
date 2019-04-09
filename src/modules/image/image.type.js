const { gql } = require("apollo-server-express");

const Image = gql`
  type Image {
  }
  extend type Query {
      getImage(id: String!): Image!
  }
`;

module.exports = { Image };
