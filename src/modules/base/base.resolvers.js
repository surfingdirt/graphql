const alive = () => 'Server is alive';

const getBaseResolvers = (tracer) => ({
  alive,
});

module.exports = getBaseResolvers;
