const env = process.env.NODE_ENV || 'local';

const conf = {
  local: {
    apiUrl: 'http://api.ridedb.wrk',
    storageLocalDomain: 'http://api.ridedb.wrk',
    storageLocalPath: 'files',
    port: 4000,
    tmpFolder: '/tmp',
    backendSupportsWebP: false,
  },
  beta: {
    apiUrl: 'https://beta-api.surfingdirt.com',
    storageLocalDomain: 'https://beta-api.surfingdirt.com',
    storageLocalPath: 'files',
    port: 4000,
    tmpFolder: '/tmp',
    backendSupportsWebP: false,
  },
  production: {
    apiUrl: 'https://api.surfingdirt.com',
    storageLocalDomain: 'https://api.surfingdirt.com',
    storageLocalPath: 'files',
    port: 4000,
    tmpFolder: '/tmp',
    backendSupportsWebP: false,
  },
};

module.exports = conf[env];