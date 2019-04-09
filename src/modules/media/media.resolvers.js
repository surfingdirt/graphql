const getMedia = (parent, args, { token, dataSources: { mediaAPI } }) => {
  return mediaAPI.getMedia(args.id, token);
};

module.exports = {
  getMedia
};
