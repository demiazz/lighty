const webpackConfig = require('./webpack.base');


module.exports = {
  frameworks: ['jasmine', 'sinon'],

  files: [
    {
      pattern: '../src/**/*.js',
      watched: process.env.CI === 'true',
      included: false,
    },
    {
      pattern: '../spec/**/*.spec.js',
      watched: process.env.CI === 'true',
    },
  ],

  preprocessors: {
    '../spec/**/*.spec.js': ['webpack'],
  },

  webpack: webpackConfig,

  plugins: [
    'karma-jasmine',
    'karma-sinon',
    'karma-webpack',
    'karma-spec-reporter',
  ],

  reporters: ['spec'],
};
