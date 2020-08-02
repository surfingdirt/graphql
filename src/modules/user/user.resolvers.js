const jwt = require("jsonwebtoken");

const { storeImageOnLocalAPI } = require('../../utils/RestAPI');
const { findContentVersionForLocale } = require('../../utils/language');
const { buildThumbsAndImages, saveRemoteImageToDisk } = require('../../utils/thumbs');

const _updateUser = async (parent, args, { token, dataSources: { imageAPI, userAPI } }, { span }) => {
  const { userId, input } = args;
  const user = await userAPI.setParentSpan(span).updateUser(userId, input, token);

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
      return userAPI.setParentSpan(span).usernameExists(args.username);
    },
  },

  UserMutationResolvers: {
    createUser: async (parent, args, { dataSources: { userAPI } }, { span }) => {
      const { input } = args;

      const user = await userAPI.setParentSpan(span).createUser(input);
      return user;
    },

    createUserOAuth: async (parent, args, { dataSources: { userAPI } }, { span }) => {
      const { input } = args;

      const { locale, photoUrl, timezone, token: firebaseToken, username } = input;
      const userCreationData = {locale, timezone, token: firebaseToken, username};
      const api = userAPI.setParentSpan(span);
      const { user: newUser, token: { accessToken: token } } = await api.createUserOAuth(userCreationData);

      const updatedUser = await api.updateUser(newUser.userId, { avatarUrl: photoUrl }, token);
      const { uid, exp } = jwt.decode(token);
      return {
        user: updatedUser,
        token: {
          uid,
          accessToken: token,
          tokenType: "Bearer",
          expires: exp,
        }
      };
    },

    updateUser: _updateUser,

    updateSettings: (parent, args, context, { span }) => {
      const { input : { userId, ...input } } = args;
      return _updateUser(parent, {input, userId}, context, { span } );
    },

    updateAvatar: async (parent, args, { token, dataSources: { imageAPI, userAPI } }, { span }) => {
      const { userId } = await userAPI.setParentSpan(span).getMe(token);

      const { file } = args;

      if (!file) {
        throw new Error('No file specified');
      }

      const imageData = await storeImageOnLocalAPI(file, token, false);

      const user = await userAPI.setParentSpan(span).updateUser(userId, { avatar: imageData.key }, token);

      const avatarThumbs = user.avatar
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.avatar, token), true).thumbs
        : null;

      const coverThumbs = user.cover
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.cover, token), true).images
        : null;

      return Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
    },

    updateCover: async (parent, args, { token, dataSources: { imageAPI, userAPI } }, { span }) => {
      const { userId } = await userAPI.setParentSpan(span).getMe(token);

      const { file } = args;

      if (!file) {
        throw new Error('No file specified');
      }

      const imageData = await storeImageOnLocalAPI(file, token, true);

      const user = await userAPI.setParentSpan(span).updateUser(userId, { cover: imageData.key }, token);

      const avatarThumbs = user.avatar
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.avatar, token), true).thumbs
        : null;

      const coverThumbs = user.cover
        ? buildThumbsAndImages(await imageAPI.setParentSpan(span).getImage(user.cover, token), true).images
        : null;

      return Object.assign({}, user, { avatar: avatarThumbs, cover: coverThumbs });
    },

    confirmEmail: async (parent, args, { dataSources: { userAPI } }, { span }) => {
      const { userId, input } = args;
      const status = await userAPI.setParentSpan(span).confirmEmail(userId, input);
      return status;
    },

    forgotPassword: async (parent, args, { dataSources: { userAPI } }, { span }) => {
      const { input } = args;
      const status = await userAPI.setParentSpan(span).forgotPassword(input);
      return status;
    },

    activateNewPassword: async (parent, args, { dataSources: { userAPI } }, { span }) => {
      const { userId, input } = args;
      try {
        const response = await userAPI.setParentSpan(span).activateNewPassword(userId, input);
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
    async album(parent, args, { token, dataSources: { albumAPI } }, { span }) {
      if (!parent.album || !parent.album.id) {
        return null;
      }
      return await albumAPI.setParentSpan(span).getAlbum(parent.album.id, token);
    },

    bio(parent, args, { locale }) {
      const translated = findContentVersionForLocale(parent.bio, locale);
      return translated;
    }
  },
});

module.exports = getUserResolvers;
