const {
  storageLocalDomain,
  storageLocalPath
} = require("../../../config");

const StorageType = {
  LOCAL: "0"
};
const ImageSize = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large"
};

const ImageSizeSuffixes = {
  [ImageSize.SMALL]: "s",
  [ImageSize.MEDIUM]: "m",
  [ImageSize.LARGE]: "m"
};

const ImageType = {
  JPG: "jpg",
  PNG: "png",
  GIF: "gif",
  WEBP: "webp"
};

const buildThumbs = ({ imageId, mediaType, storageType }) => {
  switch (storageType) {
    case StorageType.LOCAL:
      const thumbs = [];
      const path = `${storageLocalDomain}/${storageLocalPath}`;

      for (let sizeKey in ImageSize) {
        const size = ImageSize[sizeKey];
        for (let type of [ImageType.JPG, ImageType.WEBP]) {
          const suffix = `_${ImageSizeSuffixes[size]}`;
          const thumbSuffix = `_t${ImageSizeSuffixes[size]}`;
          thumbs.push({
            size,
            type,
            url: `${path}/${imageId}/img${thumbSuffix}.${type}`
          });
        }
      }
      return { thumbs };
    default:
      throw new Error(
        `Unsupported storage type: '${storageType}' for video '${id}'`
      );
  }
};

module.exports = {
  VideoTypeResolvers: {
  },
  VideoQueryResolvers: {
    video: async (
      parent,
      args,
      { token, dataSources: { videoAPI, userAPI } }
    ) => {
      const video = await videoAPI.getVideo(args.id, token);
      const submitter = video.submitter.id
        ? await userAPI.getUser(video.submitter.id, token)
        : null;

      return Object.assign(
        {},
        video,
        { submitter },
        buildThumbs(video)
      );
    }
  },
  VideoMutationResolvers: {
    createVideo: async (parent, args, { token, dataSources: { videoAPI } }) => {
      const { input } = args;
      const video = await videoAPI.createVideo(input, token);
      return Object.assign({}, video, buildThumbs(video));
    },

    updateVideo: async (parent, args, { token, dataSources: { videoAPI } }) => {
      const { id, input } = args;
      const video = await videoAPI.updateVideo(id, input, token);
      return Object.assign({}, video, buildThumbs(video));
    }
  },
  VideoFieldResolvers: {
    async album(
      parent,
      args,
      {
        token,
        dataSources: { albumAPI }
      }
    ) {
      if (!parent.album.id) {
        return null;
      }
      return await albumAPI.getAlbum(parent.album.id, token);
    },

    async lastEditor(
      parent,
      args,
      {
        token,
        dataSources: { userAPI }
      }
    ) {
      if (!parent.lastEditor.id) {
        return null;
      }
      return await userAPI.getUser(parent.lastEditor.id, token);
    },

    async users(
      parent,
      args,
      {
        token,
        dataSources: { userAPI }
      }
    ) {
      const users = [];
      for (let userId of parent.users) {
        users.push(await userAPI.getUser(userId, token));
      }
      return users;
    }
  }
};
