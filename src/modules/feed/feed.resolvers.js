const { getItemPromise } = require('./feed.utils');

const getFeedResolvers = (tracer) => ({
  FeedQueryResolvers: {
    getPublicFeed: async (parent, args, { token, dataSources }, { span }) => {
      const { feedAPI } = dataSources;
      const { from, until, items: rawItems } = await feedAPI.setParentSpan(span).getFeed(token);
      const feedEntries = await Promise.all(rawItems.map((rawItem) => {
        return getItemPromise(rawItem,token, dataSources, span);
      }));
      return { from, until, feedEntries: feedEntries.filter((entry) => !!entry) };
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
