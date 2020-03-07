const { ApolloError } = require('apollo-server-express');
const got = require('got');
const scraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-iframe')(),
  require('metascraper-image')(),
  require('metascraper-title')(),
]);
const jsdom = require("jsdom");

const TWITTER_IMAGE_META = "twitter:image";
const VIDEO_HEIGHT_META = "og:video:height";
const VIDEO_WIDTH_META = "og:video:width";

const { VideoType, ErrorCodes } = require('../constants');
const { DAILYMOTION, FACEBOOK, INSTAGRAM, VIMEO, YOUTUBE } = VideoType;
const { JSDOM } = jsdom;

const getVendorUrl = (parent) => {
  const { vendorKey, mediaSubType } = parent;
  switch (mediaSubType) {
    case DAILYMOTION:
      return `https://www.dailymotion.com/video/${vendorKey}`;
    case FACEBOOK:
      return `https://www.facebook.com/watch/?v=${vendorKey}`;
    case INSTAGRAM:
      return `https://www.instagram.com/p/${vendorKey}`;
    case VIMEO:
      return `https://vimeo.com/${vendorKey}`;
    case YOUTUBE:
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
    case DAILYMOTION:
      return `https://www.dailymotion.com/embed/video/${vendorKey}`;
    case FACEBOOK:
      return `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F${vendorKey}%2F`;
    case INSTAGRAM:
      return `https://www.instagram.com/p/${vendorKey}/embed`;
    case VIMEO:
      return `https://player.vimeo.com/video/${vendorKey}`;
    case YOUTUBE:
      return `https://www.youtube.com/embed/${vendorKey}`;
    default:
      throw new ApolloError(
        `Unsupported video type '${mediaSubType}'`,
        ErrorCodes.MEDIA_BAD_MEDIA_SUBTYPE,
      );
  }
};

const extractKeyAndSubType = (url) => {
  let mediaSubType;
  let vendorKey;

  const tests = [
    {
      regex: /www\.dailymotion\.com\/(embed\/)?video\/([0-9a-zA-Z]+)/,
      mediaSubType: DAILYMOTION,
      vendorKeyIndex: 2,
    },
    {
      regex: /dai\.ly\/([0-9a-zA-Z]+)/,
      mediaSubType: DAILYMOTION,
      vendorKeyIndex: 1,
    },

    {
      regex: /www\.facebook\.com\/watch\?v=(\d+)/,
      mediaSubType: FACEBOOK,
      vendorKeyIndex: 1,
    },

    {
      regex: /www\.facebook\.com\/(([a-zA-z0-9.]+)\/videos\/(\d+))/,
      mediaSubType: FACEBOOK,
      vendorKeyIndex: 3,
    },

    {
      regex: /www\.instagram\.com\/p\/([0-9a-zA-Z-]+)/,
      mediaSubType: INSTAGRAM,
      vendorKeyIndex: 1,
    },

    {
      regex: /vimeo\.com\/(\d+)/,
      mediaSubType: VIMEO,
      vendorKeyIndex: 1,
    },
    {
      regex: /player\.vimeo\.com\/video\/(\d+)/,
      mediaSubType: VIMEO,
      vendorKeyIndex: 1,
    },

    {
      regex: /www\.youtube\.com\/watch\?v=([0-9a-zA-Z_-]{11})/,
      mediaSubType: YOUTUBE,
      vendorKeyIndex: 1,
    },
    {
      regex: /www\.youtube\.com\/embed\/([0-9a-zA-Z_-]{11})/,
      mediaSubType: YOUTUBE,
      vendorKeyIndex: 1,
    },
    {
      regex: /youtu\.be\/([0-9a-zA-Z_-]{11})/,
      mediaSubType: YOUTUBE,
      vendorKeyIndex: 1,
    },
    {
      regex: /m\.youtube\.com\/details\?v=([0-9a-zA-Z_-]{11})/,
      mediaSubType: YOUTUBE,
      vendorKeyIndex: 1,
    },
  ];

  for (let i = 0; i < tests.length; i++) {
    const { regex, mediaSubType: currentMediaSubType, vendorKeyIndex } = tests[i];
    const match = url.match(regex);
    if (match && match.length >= vendorKeyIndex + 1) {
      mediaSubType = currentMediaSubType;
      vendorKey = match[vendorKeyIndex];
      break;
    }
  }

  return { mediaSubType, vendorKey };
};

const buildEmbedUrl = (mediaSubType, vendorKey) => {
  let url;
  switch (mediaSubType) {
    case DAILYMOTION:
      url = `https://www.dailymotion.com/embed/video/${vendorKey}`;
      break;
    case FACEBOOK:
      url = `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F${vendorKey}%2F`;
      break;
    case INSTAGRAM:
      url = `https://www.instagram.com/p/${vendorKey}/embed`;
      break;
    case VIMEO:
      url = `https://player.vimeo.com/video/${vendorKey}`;
      break;
    case YOUTUBE:
      url = `https://www.youtube.com/embed/${vendorKey}`;
      break;
    default:
      throw new Error('Unsupported video url');
  }
  return url;
};

const getVideoInfo = async (url) => {
  /*
  The strategy here is to use a mix of metascraper and homemade scraping:
  - use the scraper to get as much data as possible (reliable)
  - use JSDom to parse the response, and:
    - for Facebook videos, grab the image out of the twitter:image meta (sort of fragile)
    - grab dimensions out of OG meta tags for all video types (reliable)
   */
  const { body: html, url: parsedUrl } = await got(url);

  const { description, image, title } = await scraper({
    html,
    url: parsedUrl,
  });

  const { mediaSubType, vendorKey } = extractKeyAndSubType(url);
  const iframeUrl = buildEmbedUrl(mediaSubType, vendorKey);

  let thumbUrl = image;
  const dom = new JSDOM(html);
  const metas = Array.from(dom.window.document.querySelectorAll('meta'));

  const heightMetaEl = metas.find((e) => {
    return e.getAttribute('property') === VIDEO_HEIGHT_META;
  });
  const height = heightMetaEl ? heightMetaEl.getAttribute('content') : null;

  const widthMetaEl = metas.find((e) => {
    return e.getAttribute('property') === VIDEO_WIDTH_META;
  });
  const width = widthMetaEl ? widthMetaEl.getAttribute('content') : null;

  return {
    description,
    height,
    iframeUrl,
    mediaSubType,
    thumbUrl,
    title,
    url,
    vendorKey,
    width
  };
};

module.exports = { buildEmbedUrl, extractKeyAndSubType, getEmbedUrl, getVendorUrl, getVideoInfo };
