const getImage = (parent, args, { token, dataSources: { imageAPI } }) => {
  return imageAPI.getImage(args.id, token);
};

module.exports = {
  getImage
};
