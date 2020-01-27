const { buildThumbsAndImages } = require('./thumbs');

const submitterResolver = async (parent, args, { token, dataSources: { imageAPI, userAPI } }, span) => {
  if (!parent.submitter.id) {
    return null;
  }
  const user = await userAPI.setParentSpan(span).getUser(parent.submitter.id, token);
  const avatarThumbs = user.avatar
    ? buildThumbsAndImages(await imageAPI.getImage(user.avatar, token), true).thumbs
    : null;

  return Object.assign({}, user, { avatar: avatarThumbs });
};

module.exports = {
  submitterResolver,
};