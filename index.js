module.exports = process.env.READFILELINES_COV
  ? require('./lib-cov')
  : require('./lib');
