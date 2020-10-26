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
const FACEBOOK_GRAPH_API_URL = 'https://graph.facebook.com/v8.0';

const CHROME_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

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
      regex: /src="https:\/\/www\.facebook\.com\/plugins(.*)videos%2F(\d+)%2F/,
      mediaSubType: FACEBOOK,
      vendorKeyIndex: 2,
    },

    {
      regex: /www\.instagram\.com\/p\/([0-9a-zA-Z-_]+)/,
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

const getInstagramVideoThumb = async (videoUrl) => {
  const url = `${FACEBOOK_GRAPH_API_URL}/instagram_oembed?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}&url=${encodeURI(videoUrl)}`;
  const { body } = await got(url);
  const videoInfo = JSON.parse(body);
  return videoInfo.thumbnail_url;
};

const getVideoInfo = async (input) => {
  /*
  The strategy here is to use a mix of metascraper and homemade scraping:
  - use the scraper to get as much data as possible (reliable)
  - use JSDom to parse the response, and:
    - for Facebook videos, grab the image out of the twitter:image meta (sort of fragile)
    - grab dimensions out of OG meta tags for all video types (reliable)
   */

  const { mediaSubType, vendorKey } = extractKeyAndSubType(input);
  const iframeUrl = buildEmbedUrl(mediaSubType, vendorKey);

  // Extract the url in case someone submitted an embed code:
  const regex = /<iframe src="([^"]*)"/i;
  const matches = input.match(regex);
  const url = matches ? matches[1] : input;

  const headers = { 'user-agent': CHROME_USER_AGENT };
  const response = await got(url, {headers});
  const { body: html, statusCode, redirectUrls, url: parsedUrl, request: originalRequest } = response;
  const { description, image, title } = await scraper({
    html,
    url: parsedUrl,
  });

  if (mediaSubType === INSTAGRAM) {
    console.log('getVideoInfo INSTAGRAM');
    console.log('statusCode');
    console.log(statusCode);
    console.log('request headers');
    console.log(JSON.stringify(originalRequest.gotOptions.headers, null, 2));
    console.log('redirectUrls');
    console.log(JSON.stringify(redirectUrls, null, 2));
    console.log('body');
    console.log(html);
  }

  const dom = new JSDOM(html);
  const metas = Array.from(dom.window.document.querySelectorAll('meta'));

  const heightMetaEl = metas.find((e) => {
    return e.getAttribute('property') === VIDEO_HEIGHT_META;
  });
  let height = heightMetaEl ? heightMetaEl.getAttribute('content') : null;

  const widthMetaEl = metas.find((e) => {
    return e.getAttribute('property') === VIDEO_WIDTH_META;
  });
  let width = widthMetaEl ? widthMetaEl.getAttribute('content') : null;

  // It may happen that we won't find metas for video dimensions. In that case look for the first video element
  if (!width || !height) {
    const videos = Array.from(dom.window.document.querySelectorAll('video'));
    if (videos.length >= 1) {
      const videoEl = videos[0];
      width = videoEl.getAttribute('width');
      height = videoEl.getAttribute('height');
    }
  }

  let thumbUrl = image;
  if (mediaSubType === INSTAGRAM) {
    thumbUrl = await getInstagramVideoThumb(url);
  }

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
