const { MediaType } = require('../../constants');
const { buildThumbsAndImages } = require('../../utils/thumbs');

const getFullMedia = async (m) => {
  return Object.assign({}, m, buildThumbsAndImages(m, m.mediaType == MediaType.PHOTO));
};

const DEFAULT_ALBUM_ITEM_COUNT = 5;

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

      const countItems = args.countItems || DEFAULT_ALBUM_ITEM_COUNT;
      const albums = await albumAPI.listAlbums(args.userId, token, countItems);
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
    async lastEditor(parent, args, { token, dataSources: { userAPI } }) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
    },

    async submitter(parent, args, { token, dataSources: { userAPI } }) {
      if (!parent.submitter.id) {
        return null;
      }
      return await userAPI.getUser(parent.submitter.id, token);
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
