const getAlbum = (parent, args, { token, dataSources: { albumAPI } }) => {
  return albumAPI.getAlbum(args.id, token);
};

module.exports = {
  getAlbum
};
