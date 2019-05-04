const { apiUrl, storageLocalDomain, storageLocalPath } = require("../../../env");

const MEDIA_TYPE_VIDEO = 'video';
const MEDIA_TYPE_PHOTO = 'photo';

const StorageType = {
  LOCAL: "0"
};
const ImageSize = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
};

const ImageSizeSuffixes = {
  [ImageSize.SMALL]: "s",
  [ImageSize.MEDIUM]: "m",
  [ImageSize.LARGE]: "m",
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
      const path = `${storageLocalDomain}/${storageLocalPath}`

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
        `Unsupported storage type: '${storageType}' for media '${id}'`
      );
  }
};

module.exports = {
  MediaTypeResolvers: {
    MediaType: {
      PHOTO: "photo",
      VIDEO: "video"
    },
    MediaSubType: {
      DAILYMOTION: "dailymotion",
      FACEBOOK: "facebook",
      INSTAGRAM: "instagram",
      VIMEO: "vimeo",
      YOUTUBE: "youtube",
      IMG: "img",
      JPG: "jpg",
      PNG: "png",
      GIF: "gif",
      WEBP: "webp"
    },
    StorageType,
    ImageSize,
    ImageType
  },
  MediaQueryResolvers: {
    media: async (
      parent,
      args,
      { token, dataSources: { mediaAPI, userAPI } }
    ) => {
      const media = await mediaAPI.getMedia(args.id, token);
      const submitter = media.submitter.id
        ? await userAPI.getUser(media.submitter.id, token)
        : null;

      return Object.assign(
        {},
        media,
        { submitter },
        buildThumbsAndImages(media)
      );
    }
  },
  MediaMutationResolvers: {
    createMedia: async (parent, args, { token, dataSources: { mediaAPI } }) => {
      const { input } = args;
      const media = await mediaAPI.createMedia(input, token);
      return Object.assign({}, media, buildThumbsAndImages(media));
      return media;
    },

    updateMedia: async (parent, args, { token, dataSources: { mediaAPI } }) => {
      const { id, input } = args;
      const media = await mediaAPI.updateMedia(id, input, token);
      return Object.assign({}, media, buildThumbsAndImages(media));
      return media;
    }
  },
  MediaFieldResolvers: {
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
