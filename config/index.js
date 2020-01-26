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
    tracing: {
      enabled: true,
      localServiceName: 'graphql-dev',
      endpoint: 'http://localhost:9411/api/v2/spans',
    },
  },
  beta: {
    apiUrl: 'https://beta-api.surfingdirt.com',
    storageLocalDomain: 'https://apibetasurfingdirt.b-cdn.net',
    storageLocalPath: 'files',
    port: 4000,
    tmpFolder: '/tmp',
    backendSupportsWebP: false,
    galleryAlbumId: 'a3833b1c-1db0-4a93-9efc-b6659400ce9f',
    tracing: {
      enabled: false,
      localServiceName: 'graphql-beta',
      endpoint: 'http://localhost:9411/api/v2/spans',
    },
  },
  production: {
    apiUrl: 'https://api.surfingdirt.com',
    storageLocalDomain: 'https://apisurfingdirt.b-cdn.net',
    storageLocalPath: 'files',
    port: 4000,
    tmpFolder: '/tmp',
    backendSupportsWebP: false,
    galleryAlbumId: 'a3833b1c-1db0-4a93-9efc-b6659400ce9f',
    tracing: {
      enabled: false,
      localServiceName: 'graphql-prod',
      endpoint: 'http://localhost:9411/api/v2/spans',
    },
  },
};

module.exports = conf[env];