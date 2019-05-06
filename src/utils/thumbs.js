const { storageLocalDomain, storageLocalPath } = require("../../config");

const { StorageType, ImageType, ImageSize } = require("../constants");

const ImageSizeSuffixes = {
  [ImageSize.SMALL]: "s",
  [ImageSize.MEDIUM]: "m",
  [ImageSize.LARGE]: "m"
};

const buildThumbsAndImages = (
  { imageId, mediaType, storageType },
  buildImages = false,
  supportsWebP = false
) => {
  switch (storageType) {
    case StorageType.LOCAL:
      const thumbs = [];
      const images = [];
      const path = `${storageLocalDomain}/${storageLocalPath}`;
      const types = supportsWebP ? [ImageType.WEBP] : [ImageType.JPG];

      for (let sizeKey in ImageSize) {
        const size = ImageSize[sizeKey];
        for (let type of types) {
          if (buildImages) {
            const suffix = `_${ImageSizeSuffixes[size]}`;
            images.push({
              size,
              type,
              url: `${path}/${imageId}/img${suffix}.${type}`
            });
          }

          const thumbSuffix = `_t${ImageSizeSuffixes[size]}`;
          thumbs.push({
            size,
            type,
            url: `${path}/${imageId}/img${thumbSuffix}.${type}`
          });
        }
      }
      if (buildImages) {
        return { images, thumbs };
      }
      return { thumbs };
    default:
      throw new Error(
        `Unsupported storage type: '${storageType}' for video '${id}'`
      );
  }
};

module.exports = {
  buildThumbsAndImages
};
