const env = process.env.NODE_ENV || 'local';

const conf = {
  local: {
    apiUrl: 'http://dev.ridedb.wrk',
    storageLocalDomain: 'http://dev.ridedb.wrk',
    storageLocalPath: 'files',
    port: 4000,
    tmpFolder: '/tmp',
    backendSupportsWebP: false,
    galleryAlbumId: 'a3833b1c-1db0-4a93-9efc-b6659400ce9f',
  },
  beta: {
    apiUrl: 'https://beta-api.surfingdirt.com',
    storageLocalDomain: 'https://beta-api.surfingdirt.com',
    storageLocalPath: 'files',
    port: 4000,
    tmpFolder: '/tmp',
    backendSupportsWebP: false,
    galleryAlbumId: 'a3833b1c-1db0-4a93-9efc-b6659400ce9f',
  },
  production: {
    apiUrl: 'https://api.surfingdirt.com',
    storageLocalDomain: 'https://api.surfingdirt.com',
    storageLocalPath: 'files',
    port: 4000,
    tmpFolder: '/tmp',
    backendSupportsWebP: false,
    galleryAlbumId: 'a3833b1c-1db0-4a93-9efc-b6659400ce9f',
  },
};

module.exports = conf[env];