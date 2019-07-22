const { storeImageOnLocalAPI } = require('../../utils/RestAPI');
const { buildThumbsAndImages } = require('../../utils/thumbs');

module.exports = {
  UserQueryResolvers: {
    me: async (parent, args, { token, dataSources: { imageAPI, userAPI } }) => {
      const user = await userAPI.getMe(token);
      const avatarThumbs = user.avatar
        ? buildThumbsAndImages(await imageAPI.getImage(user.avatar, token), true).thumbs
        : null;
      const coverThumbs = user.cover
        ? buildThumbsAndImages(await imageAPI.getImage(user.cover, token), true).images
        : null;

      return Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
    },

    user: async (parent, args, { token, dataSources: { imageAPI, userAPI } }) => {
      const user = await userAPI.getUser(args.userId, token);
      const avatarThumbs = user.avatar
        ? buildThumbsAndImages(await imageAPI.getImage(user.avatar, token), true).thumbs
        : null;
      const coverThumbs = user.cover
        ? buildThumbsAndImages(await imageAPI.getImage(user.cover, token), true).images
        : null;

      return Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
    },
  },

  UserMutationResolvers: {
    createUser: async (parent, args, { token, dataSources: { userAPI } }) => {
      const { input } = args;
      const user = await userAPI.createUser(input, token);
      return user;
    },

    updateUser: async (parent, args, { token, dataSources: { userAPI } }) => {
      const { userId, input } = args;
      const user = await userAPI.updateUser(userId, input, token);
      return user;
    },

    updateAvatar: async (parent, args, {token, dataSources: {imageAPI, userAPI }}) => {
      const { userId } = await userAPI.getMe(token);

      const imageData = await storeImageOnLocalAPI(args.file, token, true);

      const user = await userAPI.updateUser(userId, {avatar: imageData.key}, token);

      const thumbs = user.avatar
        ? buildThumbsAndImages(await imageAPI.getImage(user.avatar, token), true).thumbs
        : null;

      return thumbs;
    },

    updateCover: async (parent, args, {token, dataSources: {imageAPI, userAPI }}) => {
      const { userId } = await userAPI.getMe(token);

      const imageData = await storeImageOnLocalAPI(args.file, token, true);

      const user = await userAPI.updateUser(userId, {cover: imageData.key}, token);

      const thumbs = user.cover
        ? buildThumbsAndImages(await imageAPI.getImage(user.cover, token), true).thumbs
        : null;

      return thumbs;
    },
  },

  UserFieldResolvers: {
    async album(parent, args, { token, dataSources: { albumAPI } }) {
      if (!parent.album || !parent.album.id) {
        return null;
      }
      return await albumAPI.getAlbum(parent.album.id, token);
    },
  },
};
