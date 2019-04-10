const getMedia = async (
  parent,
  args,
  { token, dataSources: { mediaAPI, userAPI } }
) => {
  const media = await mediaAPI.getMedia(args.id, token);
  const submitter = media.submitter.id ? await userAPI.getUser(media.submitter.id, token) : null;

  return Object.assign({}, media, { submitter });
};

module.exports = {
  getMedia
};
