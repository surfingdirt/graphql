const getFeedResolvers = (tracer) => ({
  FeedQueryResolvers: {
    getPublicFeed: async (parent, args, { token, dataSources: { albumAPI, commentAPI, mediaAPI, feedAPI, userAPI } }, { span }) => {
      const getItemPromise = ({ itemId, itemType, children }) => {
        let p;
        switch(itemType) {
          case 'mediaalbum':
            p = albumAPI.getAlbum(itemId);
            break;
          case 'comment':
            p = commentAPI.getComment(itemId);
            break;
          case 'photo':
          case 'video':
            p = mediaAPI.getMedia(itemId);
            break;
          case 'user':
            p = userAPI.getUser(itemId);
            break;
          default:
            p = Promise.resolve();
        }
        return p.then((item) => {
          let date = item.date;
          if (children.length > 0) {
            date = children.reduce((acc, {date: childDate}) => {
              return acc > childDate ? acc : childDate;
            }, '1970-01-01 00:00:00');
          }
          const result = {
            date,
            item,
            subItems: children.map(({ itemType, itemId }) => ({ itemType, itemId })),
          }
          return result;
        });
      };
      const {from, until, items} = await feedAPI.setParentSpan(span).getFeed(token);
      const feedEntries = await Promise.all(items.map(getItemPromise));

      return {from, until, feedEntries};
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
