const { storageLocalDomain, storageLocalPath, backendSupportsWebP } = require('../../config');

const { StorageType, ImageType, ImageSize } = require('../constants');

const ImageSizeSuffixes = {
  [ImageSize.SMALL]: 's',
  [ImageSize.MEDIUM]: 'm',
  [ImageSize.LARGE]: 'l',
};

const StandardImageDimensions = {
  [ImageSize.SMALL]: { w: 800, h: 450 },
  [ImageSize.MEDIUM]: { w: 1280, h: 720 },
  [ImageSize.LARGE]: { w: 1920, h: 1080 },
};

const StandardThumbDimensions = {
  [ImageSize.SMALL]: { w: 240, h: 135 },
  [ImageSize.MEDIUM]: { w: 400, h: 225 },
  [ImageSize.LARGE]: { w: 640, h: 360 },
};

// It's unfortunate that we don't store all image size dimensions, because we now have to do all these calculations:
const calculateWidthAndHeight = (standardDimensions, size, imageWidth, imageHeight) => {
  const aspectRatio = imageWidth / imageHeight;
  let thisSizeHeight, thisSizeWidth;

  const { w: widthLimit, h: heightLimit } = standardDimensions[size];
  if (imageWidth === widthLimit) {
    // Resized because width was too big
    thisSizeWidth = imageWidth;
    thisSizeHeight = Math.floor(imageWidth / aspectRatio);
  } else if (imageHeight === heightLimit) {
    // Resized because height was too big
    thisSizeWidth = Math.floor(imageHeight * aspectRatio);
    thisSizeHeight = imageHeight;
  } else {
    if (aspectRatio > 1) {
      if (imageWidth > widthLimit) {
        thisSizeWidth = widthLimit;
      } else {
        thisSizeWidth = imageWidth;
      }
      thisSizeHeight = Math.floor(thisSizeWidth / aspectRatio);
    } else {
      if (imageHeight > heightLimit) {
        thisSizeHeight = heightLimit;
      } else {
        thisSizeHeight = imageHeight;
      }
      thisSizeWidth = Math.floor(thisSizeHeight * aspectRatio);
    }
  }

  return {
    height: thisSizeHeight,
    width: thisSizeWidth,
  };
};

const buildThumbsAndImages = (
  { height: stringHeight, imageId, storageType, width: stringWidth },
  buildImages = false,
) => {
  const height = parseInt(stringHeight, 10);
  const width = parseInt(stringWidth, 10);

  switch (storageType) {
    case StorageType.LOCAL:
      const thumbs = [];
      const images = [];
      const path = `${storageLocalDomain}/${storageLocalPath}`;
      const types = [ImageType.JPG];
      if (backendSupportsWebP) {
        types.push(ImageType.WEBP);
      }

      for (let sizeKey in ImageSize) {
        const size = ImageSize[sizeKey];
        const { width: imageWidth, height: imageHeight } = calculateWidthAndHeight(
          StandardImageDimensions,
          size,
          width,
          height,
        );
        const { width: thumbWidth, height: thumbHeight } = calculateWidthAndHeight(
          StandardThumbDimensions,
          size,
          width,
          height,
        );

        for (let type of types) {
          if (buildImages) {
            const suffix = `_${ImageSizeSuffixes[size]}`;
            images.push({
              height: imageHeight,
              width: imageWidth,
              size,
              type,
              url: `${path}/${imageId}/img${suffix}.${type}`,
            });
          }

          const thumbSuffix = `_t${ImageSizeSuffixes[size]}`;
          thumbs.push({
            height: thumbHeight,
            width: thumbWidth,
            size,
            type,
            url: `${path}/${imageId}/img${thumbSuffix}.${type}`,
          });
        }
      }
      if (buildImages) {
        return { images, thumbs };
      }
      return { thumbs };
    default:
      throw new Error(`Unsupported storage type: '${storageType}' for video '${id}'`);
  }
};

module.exports = {
  buildThumbsAndImages,
};
