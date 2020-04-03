const { getFullMedia } = require('../../utils/albumUtils');
const { buildThumbsAndImages } = require('../../utils/thumbs');

const START_DATE = '1970-01-01 00:00:00';
const ALBUM_MEDIA_ITEM_COUNT = 5;

const getFeedResolvers = (tracer) => ({
  FeedQueryResolvers: {
    getPublicFeed: async (parent, args, { token, dataSources: { albumAPI, commentAPI, mediaAPI, feedAPI, imageAPI, userAPI } }, { span }) => {
      const getItemPromise = ({ itemId, itemType, children }) => {
        let p;
        switch(itemType) {
          case 'mediaalbum':
            const a = albumAPI.getAlbum(itemId, token, ALBUM_MEDIA_ITEM_COUNT, 0);
            p = a.then(async (album) => {
              const fullMedia = album.media.map((m) => getFullMedia(m));
              return Object.assign({}, album, { media: fullMedia });
            });
            break;
          case 'comment':
            p = commentAPI.getComment(itemId);
            break;
          case 'photo':
          case 'video':
            p = mediaAPI.getMedia(itemId);
            break;
          case 'user':
            const u = userAPI.getUser(itemId);
            p = u.then(async (user) => {
              const avatarThumbs = user.avatar
                ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.avatar, token), true).thumbs
                : null;
              const coverThumbs = user.cover
                ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.cover, token), true).images
                : null;
console.log({coverThumbs});
              return Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
            });
            break;
          default:
            throw new Error(`Unsupported itemType '${itemType}' with id '${itemId}'`);
        }

        return p.then((item) => {
          let date = item.date;
          if (children.length > 0) {
            date = children.reduce((acc, {date: childDate}) => {
              return acc > childDate ? acc : childDate;
            }, START_DATE);
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
