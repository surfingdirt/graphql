// pm2 start ecosystem.config.js --env beta

const commonConfig = {
  script: 'index.js',
  error_file: 'log_error.log',
  out_file: 'log_out.log',
  log_file: 'log_combined.log',
  time: true,

  // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
  args: 'one two',
  instances: 1,
  autorestart: true,
  watch: false,
  max_memory_restart: '1G',
};

module.exports = {
  apps: [
    Object.assign({}, commonConfig, {
      name: 'SurfingDirtGraphQLBeta',
      env: {
        NODE_ENV: 'beta',
        GOOGLE_APPLICATION_CREDENTIALS: '/credentials/surfing-dirt-db51816197e6.json',
      },
    }),
    Object.assign({}, commonConfig, {
      name: 'SurfingDirtGraphQLProduction',
      env: {
        NODE_ENV: 'production',
        GOOGLE_APPLICATION_CREDENTIALS: '/credentials/surfing-dirt-db51816197e6.json',
      },
    }),
  ],
};
