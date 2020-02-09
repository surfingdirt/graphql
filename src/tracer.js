const { BatchRecorder, jsonEncoder: { JSON_V2 } } = require('zipkin');
const { HttpLogger } = require('zipkin-transport-http');
const ZipkinJavascriptOpentracing = require('zipkin-javascript-opentracing');

const config = require('../config');

const { endpoint, localServiceName } = config.tracing;
const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint,
    jsonEncoder: JSON_V2,
  })
});

const localTracer = new ZipkinJavascriptOpentracing({
  serviceName: localServiceName,
  recorder,
  kind: "client",
});

const serverTracer = new ZipkinJavascriptOpentracing({
  serviceName: localServiceName,
  recorder,
  kind: "server",
});

module.exports = { localTracer, serverTracer };