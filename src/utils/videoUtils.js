const { ApolloError } = require('apollo-server-express');

const { VideoType, ErrorCodes } = require('../constants');

const getVendorUrl = (parent) => {
  const { vendorKey, mediaSubType } = parent;
  switch (mediaSubType) {
    case VideoType.DAILYMOTION:
      return `https://www.dailymotion.com/video/${vendorKey}`;
    case VideoType.FACEBOOK:
      return `https://www.facebook.com/watch/?v=${vendorKey}`;
    case VideoType.INSTAGRAM:
      return `https://www.instagram.com/p/${vendorKey}`;
    case VideoType.VIMEO:
      return `https://vimeo.com/${vendorKey}`;
    case VideoType.YOUTUBE:
      return `https://www.youtube.com/watch?v=${vendorKey}`;
    default:
      throw new ApolloError(
        `Unsupported video type '${mediaSubType}'`,
        ErrorCodes.MEDIA_BAD_MEDIA_SUBTYPE,
      );
  }
};

const getEmbedUrl = (parent) => {
  const { vendorKey, mediaSubType } = parent;
  switch (mediaSubType) {
    case VideoType.DAILYMOTION:
      return `https://www.dailymotion.com/embed/video/${vendorKey}`;
    case VideoType.FACEBOOK:
      return `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F${vendorKey}%2F`;
    case VideoType.INSTAGRAM:
      return `https://www.instagram.com/p/${vendorKey}/embed`;
    case VideoType.VIMEO:
      return `https://player.vimeo.com/video/${vendorKey}`;
    case VideoType.YOUTUBE:
      return `https://www.youtube.com/embed/${vendorKey}`;
    default:
      throw new ApolloError(
        `Unsupported video type '${mediaSubType}'`,
        ErrorCodes.MEDIA_BAD_MEDIA_SUBTYPE,
      );
  }
};

module.exports = { getEmbedUrl, getVendorUrl };
