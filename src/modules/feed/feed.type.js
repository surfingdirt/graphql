const { gql } = require("apollo-server-express");

module.exports = gql`
  union FeedItemContent = Album | Comment | Media | User
  
  type FeedEntry {
      date: String!
      item: FeedItemContent
      subItems: [FeedSubItem!]
  }
  
  type FeedSubItem {
      itemType: String!
      itemId: ID!
      item: FeedItemContent
  }
  
  type Feed {
      nextOffset: Int!
      feedEntries: [FeedEntry!]
  }

  extend type Query {
      getPublicFeed(count: Int, offset: Int): Feed
  }
`;
