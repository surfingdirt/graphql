const { MediaType } = require('../constants');
const { buildThumbsAndImages } = require('./thumbs');
const { getVendorUrl, getEmbedUrl } = require('./videoUtils');

const getFullMedia = (m) => {
  let videoProps = {};
  if (m.mediaType === MediaType.VIDEO) {
    videoProps = {
      embedUrl: getEmbedUrl(m),
      vendorUrl: getVendorUrl(m),
    };
  }
  return Object.assign({}, m, buildThumbsAndImages(m, m.mediaType == MediaType.PHOTO), videoProps);
};

module.exports = { getFullMedia };