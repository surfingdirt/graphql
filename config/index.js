const env = process.env.NODE_ENV || 'local';

const conf = {
  local: {
    //apiUrl: 'https://api.surfingdirt.com', // prod
    apiUrl: 'http://localhost:8007', // local
    // storageLocalDomain: 'http://localhost:8007', // local
    storageLocalDomain: 'https://apisurfingdirt.b-cdn.net',
    storageLocalPath: 'files',
    port: 4000,
    tmpFolder: '/tmp',
    backendSupportsWebP: false,
    galleryAlbumId: 'a3833b1c-1db0-4a93-9efc-b6659400ce9f',
    googleTranslationProjectId: 'Surfing Dirt',
    tracing: {
      alwaysDisabled: false,
      endpoint: 'http://localhost:9411/api/v2/spans',
      localServiceName: 'graphql-dev',
      traceAll: {
        fields: false,
        requests: false,
      },
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
    googleTranslationProjectId: 'Surfing Dirt',
    tracing: {
      alwaysDisabled: false,
      endpoint: 'https://beta-z.surfingdirt.com/api/v2/spans',
      localServiceName: 'graphql-beta',
      traceAll: {
        fields: false,
        requests: false,
      },
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
    googleTranslationProjectId: 'Surfing Dirt',
    tracing: {
      alwaysDisabled: false,
      endpoint: 'https://z.surfingdirt.com/api/v2/spans',
      localServiceName: 'graphql-prod',
      traceAll: {
        fields: false,
        requests: false,
      },
    },
  },
};

module.exports = conf[env];