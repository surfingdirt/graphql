const { getFullMedia } = require('../../utils/albumUtils');
const { buildThumbsAndImages } = require('../../utils/thumbs');

const START_DATE = '1970-01-01 00:00:00';
const ALBUM_MEDIA_ITEM_COUNT = 5;

const getItemPromise = async (rawItem, token, dataSources, span) => {
  const { itemId, itemType, children } = rawItem;
  const { albumAPI, commentAPI, mediaAPI, imageAPI, userAPI } = dataSources;

  let item;
  switch(itemType) {
    case 'mediaalbum':
      const album = await albumAPI.getAlbum(itemId, token, ALBUM_MEDIA_ITEM_COUNT, 0);
      const fullMedia = album.media.map((m) => getFullMedia(m));
      item  = Object.assign({}, album, { media: fullMedia });
      break;
    case 'comment':
      item = await commentAPI.getComment(itemId);
      break;
    case 'photo':
    case 'video':
      item = await mediaAPI.getMedia(itemId);
      break;
    case 'user':
      const user = await userAPI.getUser(itemId);
      const avatarThumbs = user.avatar
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.avatar, token), true).thumbs
        : null;
      const coverThumbs = user.cover
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.cover, token), true).images
        : null;
      item = Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
      break;
    default:
      throw new Error(`Unsupported itemType '${itemType}' with id '${itemId}'`);
  }

    let date = item.date;
    if (children.length > 0) {
      date = children.reduce((acc, {date: childDate}) => {
        return acc > childDate ? acc : childDate;
      }, START_DATE);
    }

    // const subItemsPromise = getSubItemsPromise(item, children, token, dataSources);

    const result = {
      date,
      item,
      subItems: children.map(({ itemType, itemId }) => ({ itemType, itemId })),
    };
    return result;
};

// const getSubItems = (item, children, token, dataSources) => {
//   const promises = [];
//
//   children.map(({ itemType, itemId }) => ({ itemType, itemId })),
//
//   return Promise.all(promises);
// };


module.exports = {
  getItemPromise,
};