const { extractKeyAndSubType } = require('./videoUtils');
const { VideoType, ErrorCodes } = require('../constants');
const { DAILYMOTION, FACEBOOK, INSTAGRAM, VIMEO, YOUTUBE } = VideoType;

describe('Extracting key and subtype from url', () => {
  test('DailyMotion', () => {
    const videoId = 'ab12CD345789';
    const videoData = { vendorKey: videoId, mediaSubType: DAILYMOTION};

    expect(extractKeyAndSubType(`https://www.dailymotion.com/video/${videoId}`)).toEqual(videoData);
    expect(extractKeyAndSubType(`https://www.dailymotion.com/embed/video/${videoId}`)).toEqual(videoData);
    expect(extractKeyAndSubType(`https://dai.ly/${videoId}`)).toEqual(videoData);
  });

  test('Facebook', () => {
    const username = 'abCD01.23';
    const videoId = '123456789';
    const videoData = { vendorKey: videoId, mediaSubType: FACEBOOK};

    expect(extractKeyAndSubType(`https://www.facebook.com/watch?v=${videoId}`)).toEqual(videoData);
    expect(extractKeyAndSubType(`https://www.facebook.com/${username}/videos/${videoId}`)).toEqual(videoData);
  });

  test('Instagram', () => {
    const videoId = '12345-7_9';
    const videoData = { vendorKey: videoId, mediaSubType: INSTAGRAM};

    expect(extractKeyAndSubType(`https://www.instagram.com/p/${videoId}`)).toEqual(videoData);
  });

  test('Vimeo', () => {
    const videoId = '123456789';
    const videoData = { vendorKey: videoId, mediaSubType: VIMEO};

    expect(extractKeyAndSubType(`https://vimeo.com/${videoId}`)).toEqual(videoData);
    expect(extractKeyAndSubType(`https://player.vimeo.com/video/${videoId}`)).toEqual(videoData);
  });

  test('YouTube', () => {
    const videoId = '0-23456789_';
    const videoData = { vendorKey: videoId, mediaSubType: YOUTUBE};

    expect(extractKeyAndSubType(`https://www.youtube.com/watch?v=${videoId}`)).toEqual(videoData);
    expect(extractKeyAndSubType(`https://www.youtube.com/embed/${videoId}`)).toEqual(videoData);
    expect(extractKeyAndSubType(`https://youtu.be/${videoId}`)).toEqual(videoData);
    expect(extractKeyAndSubType(`https://m.youtube.com/details?v=${videoId}`)).toEqual(videoData);
  });
});