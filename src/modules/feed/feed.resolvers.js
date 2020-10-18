const { getItemPromise } = require('./feed.utils');

const getFeedResolvers = (tracer) => ({
  FeedQueryResolvers: {
    getPublicFeed: async (parent, { count, offset }, { token, dataSources }, { span }) => {
      const { feedAPI } = dataSources;

      const { nextOffset, items: rawItems } = await feedAPI.setParentSpan(span).getFeed(token, count, offset);
      const feedEntries = (
        await Promise.all(rawItems.map((rawItem) => getItemPromise(rawItem, token, dataSources, span)))
      ).filter((entry) => !!entry);
      return { nextOffset, feedEntries };
    },
  },
  FeedTypeResolvers: {
    FeedItemContent: {
      __resolveType(obj, context, info) {
        if (obj.albumVisibility) {
          return 'Album';
        };
        if (obj.content) {
          return 'Comment';
        };
        if (obj.mediaSubType) {
          return 'Media';
        };
        if (obj.userId) {
          return 'User';
        };
      }
    },
  },
});

module.exports = getFeedResolvers;
