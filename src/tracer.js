const { Tracer, ExplicitContext, BatchRecorder, jsonEncoder: { JSON_V2 } } = require('zipkin');
const { HttpLogger } = require('zipkin-transport-http');

const config = require('../config');

const { endpoint, localServiceName } = config.tracing;
const ctxImpl = new ExplicitContext();
const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint,
    jsonEncoder: JSON_V2
  })
});
const tracer = new Tracer({ ctxImpl, recorder, localServiceName });

module.exports = tracer;