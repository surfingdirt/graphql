const { MediaType } = require('../../constants');
const { buildThumbsAndImages } = require('../../utils/thumbs');

const getFullMedia = async (m, userAPI, token) => {
  const submitter = m.submitter.id ? await userAPI.getUser(m.submitter.id, token) : null;
  const lastEditor = m.lastEditor.id ? await userAPI.getUser(m.lastEditor.id, token) : null;
  return Object.assign(
    {},
    m,
    { submitter, lastEditor },
    buildThumbsAndImages(m, m.mediaType == MediaType.PHOTO),
  );
};

module.exports = {
  AlbumQueryResolvers: {
    album: async (parent, args, { token, dataSources: { albumAPI, userAPI } }) => {
      const album = await albumAPI.getAlbum(args.id, token);
      const fullMedia = album.media.map((m) => {
        return getFullMedia(m, userAPI, token);
      });

      return Object.assign({}, album, { media: fullMedia });
    },

    listAlbums: async (parent, args, { token, dataSources: { albumAPI, userAPI } }) => {
      const fullAlbums = [];

      const albums = await albumAPI.listAlbums(args.userId, token);
      albums.forEach((album) => {
        const fullMediaList = album.media.map(async (m) => {
          const fullMedia = await getFullMedia(m, userAPI, token);
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
};
