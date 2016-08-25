const baseConfig = require('./karma.base');


module.exports = function karma(config) {
  Object.assign(baseConfig, {
    browsers: ['PhantomJS'],
  });

  baseConfig.plugins.push('karma-phantomjs-launcher');

  config.set(baseConfig);
};
