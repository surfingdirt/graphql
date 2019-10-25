const { buildThumbsAndImages } = require('./thumbs');

const submitterResolver = async (parent, args, { token, dataSources: { imageAPI, userAPI } }) => {
  if (!parent.submitter.id) {
    return null;
  }
  const user = await userAPI.getUser(parent.submitter.id, token);
  const avatarThumbs = user.avatar
    ? buildThumbsAndImages(await imageAPI.getImage(user.avatar, token), true).thumbs
    : null;

  return Object.assign({}, user, { avatar: avatarThumbs });
};

module.exports = {
  submitterResolver,
};