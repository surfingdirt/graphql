const { AlbumContributions, AlbumVisibility, MediaType } = require('../../constants');
const { buildThumbsAndImages } = require('../../utils/thumbs');

const getFullMedia = async (m) => {
  return Object.assign({}, m, buildThumbsAndImages(m, m.mediaType == MediaType.PHOTO));
};

const DEFAULT_ALBUM_PREVIEW_ITEM_COUNT = 5;
const DEFAULT_ALBUM_ITEM_COUNT = 20;
const DEFAULT_ALBUM_COUNT = 10;
const DEFAULT_ALBUM_SORT = null;
const DEFAULT_ALBUM_DIR = 'desc';

module.exports = {
  AlbumQueryResolvers: {
    album: async (parent, args, { token, dataSources: { albumAPI } }) => {
      const countItems = args.countItems || DEFAULT_ALBUM_ITEM_COUNT;
      const album = await albumAPI.getAlbum(args.id, token, countItems);
      const fullMedia = album.media.map((m) => {
        return getFullMedia(m);
      });

      return Object.assign({}, album, { media: fullMedia });
    },

    listAlbums: async (parent, args, { token, dataSources: { albumAPI } }) => {
      const fullAlbums = [];

      const countItems = args.countItems || DEFAULT_ALBUM_PREVIEW_ITEM_COUNT;
      const count = args.count || DEFAULT_ALBUM_COUNT;
      const start = args.start || 0;
      const sort = args.sort || DEFAULT_ALBUM_SORT;
      const dir = args.dir || DEFAULT_ALBUM_DIR;
      const albums = await albumAPI.listAlbums(args.userId, token, countItems, count, start, sort, dir);
      albums.forEach((album) => {
        const fullMediaList = album.media.map(async (m) => {
          const fullMedia = await getFullMedia(m);
          return fullMedia;
        });
        fullAlbums.push(Object.assign({}, album, { media: fullMediaList }));
      });

      return fullAlbums;
    },
  },
  AlbumFieldResolvers: {
    albumContributions(parent) {
      switch (parent.albumContributions) {
        case AlbumContributions.PUBLIC:
          return 'PUBLIC';
        case AlbumContributions.PRIVATE:
          return 'PRIVATE';
        default:
          throw new Error(`Unhandled albumContributions '${parent.albumContributions}'`);
      }
    },

    albumVisibility(parent) {
      switch (parent.albumVisibility) {
        case AlbumVisibility.PRIVATE:
          return 'PRIVATE';
        case AlbumVisibility.VISIBLE:
          return 'VISIBLE';
        case AlbumVisibility.UNLISTED:
          return 'UNLISTED';
        default:
          throw new Error(`Unhandled albumVisibility '${parent.albumVisibility}'`);
      }
    },

    async lastEditor(parent, args, { token, dataSources: { userAPI } }) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
    },

    async submitter(parent, args, { token, dataSources: { imageAPI, userAPI } }) {
      if (!parent.submitter.id) {
        return null;
      }
      const user = await userAPI.getUser(parent.submitter.id, token);
      const avatarThumbs = user.avatar
        ? buildThumbsAndImages(await imageAPI.getImage(user.avatar, token), true).thumbs
        : null;

      return Object.assign({}, user, { avatar: avatarThumbs, });
    },
  },
  AlbumMutationResolvers: {
    async createAlbum(parent, args, { token, dataSources: { albumAPI } }) {
      const { input } = args;

      const album = await albumAPI.createAlbum(input, token);
      return album;
    },
  }
};
