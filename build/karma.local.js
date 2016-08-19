const baseConfig = require('./karma.base');


module.exports = function karma(config) {
  Object.assign(baseConfig, {
    browsers: ['PhantomJS'],
    logLevel: config.LOG_DEBUG,
    client: {
      captureConsole: true,
    },
  });

  baseConfig.plugins.push('karma-phantomjs-launcher');

  config.set(baseConfig);
};
