const getAlbum = async (parent, args, { token, dataSources: { albumAPI, userAPI } }) => {
  const album = await albumAPI.getAlbum(args.id, token);

  const fullMedia = album.media.map(async (m) => {
    const submitter = m.submitter.id ? await userAPI.getUser(m.submitter.id, token) : null;
    const lastEditor = m.lastEditor.id ? await userAPI.getUser(m.lastEditor.id, token) : null;
    return Object.assign({}, m, { submitter, lastEditor });
  });

  return Object.assign({}, album, {media: fullMedia});
};

module.exports = {
  getAlbum
};
