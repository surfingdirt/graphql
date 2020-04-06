const { MediaType } = require('../../constants');
const { getFullMedia } = require('../../utils/albumUtils');
const { buildThumbsAndImages } = require('../../utils/thumbs');

const START_DATE = '1970-01-01 00:00:00';
const ALBUM_MEDIA_ITEM_COUNT = 5;

const ALBUM = 'mediaalbum';
const COMMENT = 'comment';
const PHOTO = 'photo';
const VIDEO = 'video';
const USER = 'user';

const isPhoto = (parent) => parent.mediaType === MediaType.PHOTO;

const getItemPromise = async (rawItem, token, dataSources, span) => {
  const { itemId, itemType, children } = rawItem;
  const { albumAPI, commentAPI, mediaAPI, imageAPI, userAPI } = dataSources;

  let item;
  switch(itemType) {
    case ALBUM:
      const album = await albumAPI.getAlbum(itemId, token, ALBUM_MEDIA_ITEM_COUNT, 0);
      const fullMedia = album.media.map((m) => getFullMedia(m));
      item  = Object.assign({}, album, { media: fullMedia });
      break;
    case COMMENT:
      item = await commentAPI.getComment(itemId);
      break;
    case PHOTO:
    case VIDEO:
      item = await mediaAPI.getMedia(itemId);
      break;
    case USER:
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

    const subItems = await getSubItems(rawItem, item, token, dataSources);
    const result = { date, item, subItems };
    return result;
};

const getSubItems = async (rawItem, item, token, dataSources) => {
  const { commentAPI, mediaAPI } = dataSources;
  const { itemId: rawItemId, itemType: rawItemType, children } = rawItem;
  const promises = [];

  switch(rawItemType) {
    case ALBUM:
      children.forEach(({ itemType, itemId }) => {
        switch(itemType) {
          case PHOTO:
          case VIDEO:
            const existingChild = item.media.find(({ id }) => (id === itemId));
            const mediaPromise = existingChild ?
              Promise.resolve({itemType, itemId, item: existingChild}) :
              mediaAPI.getMedia(itemId).then((media) => {
                const full = Object.assign(
                  {},
                  media,
                  buildThumbsAndImages(media, isPhoto(media)),
                );

                return {itemType, itemId, item: full};
              });
            promises.push(mediaPromise);
            break;
          default:
            throw new Error(`Unsupported subItem type '${itemType}' with id '${itemId}' for itemType '${rawItemType}' with id '${rawItemId}'`);
            break;
        }
      });
      break;
    case COMMENT:
      // Comment subItems not supported
      break;
    case PHOTO:
    case VIDEO:
      children.forEach(({ itemType, itemId }) => {
        switch(itemType) {
          case COMMENT:
            promises.push(
              commentAPI.getComment(itemId).then((media) => {
                return {itemType, itemId, item: media};
              })
            );
            break;
          default:
            throw new Error(`Unsupported subItem type '${itemType}' with id '${itemId}' for itemType '${rawItemType}' with id '${rawItemId}'`);
            break;
        }
      });
      break;
    case USER:
      // User subItems not supported
      break;
    default:
      throw new Error(`Unsupported itemType '${rawItemType}' with id '${rawItemId}'`);
  }

  return Promise.all(promises);
};


module.exports = {
  getItemPromise,
};