const { gql } = require("apollo-server-express");

module.exports = gql`
    enum ImageSize {
        SMALL
        MEDIUM
        LARGE
    }
    enum ImageType {
        JPG
        PNG
        GIF
        WEBP
    }
    type Image {
        size: ImageSize!
        type: ImageType!
        url: String!
        height: Int!
        width: Int!
    }
    extend type Query {
      image(id: String!): Image!
  }
`;
