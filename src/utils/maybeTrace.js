const { tracing } = require("../../config");

const { enabled: tracingEnabled} = tracing;

module.exports = (tracer, name, operation) => tracingEnabled ? tracer.local(name, operation) : operation();
