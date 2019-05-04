const {
  storageLocalDomain,
  storageLocalPath
} = require("../../../config");

const MEDIA_TYPE_PHOTO = "photo";

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

const buildThumbsAndImages = ({ imageId, mediaType, storageType }) => {
  switch (storageType) {
    case StorageType.LOCAL:
      const thumbs = [];
      const images = [];
      const path = `${storageLocalDomain}/${storageLocalPath}`;

      for (let sizeKey in ImageSize) {
        const size = ImageSize[sizeKey];
        for (let type of [ImageType.JPG, ImageType.WEBP]) {
          const suffix = `_${ImageSizeSuffixes[size]}`;
          const thumbSuffix = `_t${ImageSizeSuffixes[size]}`;
          if (mediaType === MEDIA_TYPE_PHOTO) {
            images.push({
              size,
              type,
              url: `${path}/${imageId}/img${suffix}.${type}`
            });
          }
          thumbs.push({
            size,
            type,
            url: `${path}/${imageId}/img${thumbSuffix}.${type}`
          });
        }
      }
      return { images, thumbs };
    default:
      throw new Error(
        `Unsupported storage type: '${storageType}' for video '${id}'`
      );
  }
};

module.exports = {
  PhotoTypeResolvers: {
  },
  PhotoQueryResolvers: {
    photo: async (
      parent,
      args,
      { token, dataSources: { photoAPI, userAPI } }
    ) => {
      const photo = await photoAPI.getPhoto(args.id, token);
      const submitter = photo.submitter.id
        ? await userAPI.getUser(photo.submitter.id, token)
        : null;

      return Object.assign(
        {},
        photo,
        { submitter },
        buildThumbsAndImages(photo)
      );
    }
  },
  PhotoMutationResolvers: {
    createPhoto: async (parent, args, { token, dataSources: { photoAPI } }) => {
      const { input } = args;
      const photo = await photoAPI.createPhoto(input, token);
      return Object.assign({}, photo, buildThumbsAndImages(photo));
    },

    updatePhoto: async (parent, args, { token, dataSources: { photoAPI } }) => {
      const { id, input } = args;
      const photo = await photoAPI.updatePhoto(id, input, token);
      return Object.assign({}, photo, buildThumbsAndImages(photo));
    }
  },
  PhotoFieldResolvers: {
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
