const { MediaType } = require('../../constants');
const { buildThumbsAndImages } = require('../../utils/thumbs');

const getFullMedia = async (m) => {
  return Object.assign({}, m, buildThumbsAndImages(m, m.mediaType == MediaType.PHOTO));
};

module.exports = {
  AlbumQueryResolvers: {
    album: async (parent, args, { token, dataSources: { albumAPI } }) => {
      const album = await albumAPI.getAlbum(args.id, token);
      const fullMedia = album.media.map((m) => {
        return getFullMedia(m);
      });

      return Object.assign({}, album, { media: fullMedia });
    },

    listAlbums: async (parent, args, { token, dataSources: { albumAPI } }) => {
      const fullAlbums = [];

      const albums = await albumAPI.listAlbums(args.userId, token);
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
