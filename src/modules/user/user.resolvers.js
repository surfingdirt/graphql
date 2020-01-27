const { storeImageOnLocalAPI } = require('../../utils/RestAPI');
const { buildThumbsAndImages } = require('../../utils/thumbs');

const _updateUser = async (parent, args, { token, dataSources: { imageAPI, userAPI } }, { span }) => {
  const { userId, input } = args;
  const user = await userAPI.updateUser(userId, input, token);

  const avatarThumbs = user.avatar
    ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.avatar, token), true).thumbs
    : null;
  const coverThumbs = user.cover
    ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.cover, token), true).images
    : null;

  return Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
};

const getUserResolvers = (tracer) => ({
  UserQueryResolvers: {
    me: async (parent, args, { token, dataSources: { imageAPI, userAPI } }, { span }) => {
      const user = await userAPI.setParentSpan(span).getMe(token);
      const avatarThumbs = user.avatar
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.avatar, token), true).thumbs
        : null;
      const coverThumbs = user.cover
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.cover, token), true).images
        : null;

      return Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
    },

    user: async (parent, args, { token, dataSources: { imageAPI, userAPI } }, { span }) => {
      const user = await userAPI.setParentSpan(span).getUser(args.userId, token);
      const avatarThumbs = user.avatar
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.avatar, token), true).thumbs
        : null;
      const coverThumbs = user.cover
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.cover, token), true).images
        : null;

      return Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
    },

    listUsers: async (parent, args, { token, dataSources: { imageAPI, userAPI } }, { span }) => {
      const users = await userAPI.setParentSpan(span).listUsers(token);
      const fullUsers = users.map(async (user) => {
        const avatarThumbs = user.avatar
          ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.avatar, token), true).thumbs
          : null;
        const coverThumbs = user.cover
          ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.cover, token), true).images
          : null;

        return Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
      });

      return fullUsers;
    },

    emailExists: (parent, { email }, { token, dataSources: {userAPI } }, { span }) => {
      return userAPI.setParentSpan(span).emailExists(token, email);
    },

    usernameExists: (parent, args, { dataSources: {userAPI } }, { span }) => {
      return userAPI.setParentSpan(span).setDebugBackend(true).usernameExists(args.username);
    },
  },

  UserMutationResolvers: {
    createUser: async (parent, args, { token, dataSources: { userAPI } }) => {
      const { input } = args;
      const user = await userAPI.createUser(input, token);
      return user;
    },

    updateUser: _updateUser,

    updateSettings: (parent, args, context) => {
      const { input : { userId, ...input } } = args;
      return _updateUser(parent, {input, userId}, context);
    },

    updateAvatar: async (parent, args, { token, dataSources: { imageAPI, userAPI } }) => {
      const { userId } = await userAPI.getMe(token);

      const { file } = args;

      if (!file) {
        throw new Error('No file specified');
      }

      const imageData = await storeImageOnLocalAPI(file, token, true);

      const user = await userAPI.updateUser(userId, { avatar: imageData.key }, token);

      const avatarThumbs = user.avatar
        ? buildThumbsAndImages(await imageAPI.getImage(user.avatar, token), true).thumbs
        : null;

      const coverThumbs = user.cover
        ? buildThumbsAndImages(await imageAPI.getImage(user.cover, token), true).images
        : null;

      return Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
    },

    updateCover: async (parent, args, { token, dataSources: { imageAPI, userAPI } }) => {
      const { userId } = await userAPI.getMe(token);

      const { file } = args;

      if (!file) {
        throw new Error('No file specified');
      }

      const imageData = await storeImageOnLocalAPI(file, token, true);

      const user = await userAPI.updateUser(userId, { cover: imageData.key }, token);

      const avatarThumbs = user.avatar
        ? buildThumbsAndImages(await imageAPI.getImage(user.avatar, token), true).thumbs
        : null;

      const coverThumbs = user.cover
        ? buildThumbsAndImages(await imageAPI.getImage(user.cover, token), true).images
        : null;

      return Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
    },

    confirmEmail: async (parent, args, { dataSources: { userAPI } }) => {
      const { userId, input } = args;
      const status = await userAPI.confirmEmail(userId, input);
      return status;
    },

    forgotPassword: async (parent, args, { dataSources: { userAPI } }) => {
      const { input } = args;
      const status = await userAPI.forgotPassword(input);
      return status;
    },

    activateNewPassword: async (parent, args, { dataSources: { userAPI } }) => {
      const { userId, input } = args;
      try {
        const response = await userAPI.activateNewPassword(userId, input);
      } catch (e) {
        if (e.extensions && e.extensions.code === 13001) {
          return false;
        }
        throw e;
      }
      return true;
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
});

module.exports = getUserResolvers;
