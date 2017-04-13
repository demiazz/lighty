const path = require('path');
const istanbul = require('rollup-plugin-istanbul');

const baseConfig = require('./karma.base');


function getBuild() {
  let id = `LIGHTY - TRAVIS #${process.env.TRAVIS_BUILD_NUMBER}`;

  id += ` (Branch: ${process.env.TRAVIS_BRANCH}`;

  if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
    id += ` | PR: ${process.env.TRAVIS_PULL_REQUEST}`;
  }

  id += ')';

  return id;
}

function getTunnel() {
  return process.env.TRAVIS_JOB_NUMBER;
}


module.exports = function karma(config) {
  const sauceBrowsers = {
    // Chrome (last 3 versions)

    sl_chrome_54: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '54.0',
      platform: 'Windows 10',
    },

    sl_chrome_53: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '53.0',
      platform: 'Windows 10',
    },

    sl_chrome_52: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '52.0',
      platform: 'Windows 10',
    },

    // Firefox (last 3 versions)

    sl_firefox_50: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '50.0',
      platform: 'Windows 10',
    },

    sl_firefox_49: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '49.0',
      platform: 'Windows 10',
    },

    sl_firefox_48: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '48.0',
      platform: 'Windows 10',
    },

    // Edge

    sl_edge_14: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      version: '14.14393',
      platform: 'Windows 10',
    },

    sl_edge_13: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      version: '13.10586',
      platform: 'Windows 10',
    },

    // Internet Explorer (last 3 versions)

    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11.103',
      platform: 'Windows 10',
    },

    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10.0',
      platform: 'Windows 8',
    },

    sl_ie_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '9.0',
      platform: 'Windows 7',
    },

    // Safari (last 3 versions)

    sl_safari_10: {
      base: 'SauceLabs',
      browserName: 'Safari',
      version: '10.0',
      platform: 'OS X 10.11',
    },

    sl_safari_9: {
      base: 'SauceLabs',
      browserName: 'Safari',
      version: '9.0',
      platform: 'OS X 10.11',
    },

    sl_safari_8: {
      base: 'SauceLabs',
      browserName: 'Safari',
      version: '8.0',
      platform: 'OS X 10.10',
    },

    // iOS (last 3 major versions)

    sl_ios_10: {
      base: 'SauceLabs',
      browserName: 'Safari',
      appiumVersion: '1.6.3',
      deviceName: 'iPhone Simulator',
      deviceOrientation: 'portrait',
      platformVersion: '10.0',
      platformName: 'iOS',
    },

    sl_ios_9: {
      base: 'SauceLabs',
      browserName: 'Safari',
      appiumVersion: '1.6.3',
      deviceName: 'iPhone Simulator',
      deviceOrientation: 'portrait',
      platformVersion: '9.3',
      platformName: 'iOS',
    },

    sl_ios_8: {
      base: 'SauceLabs',
      browserName: 'Safari',
      appiumVersion: '1.6.3',
      deviceName: 'iPhone Simulator',
      deviceOrientation: 'portrait',
      platformVersion: '8.4',
      platformName: 'iOS',
    },
  };

  Object.assign(baseConfig, {
    sauceLabs: {
      testName: 'lighty',
      build: getBuild(),
      tunnelIdentifier: getTunnel(),
      recordVideo: false,
      recordScreenshots: false,
      startConnect: false,
    },

    customLaunchers: sauceBrowsers,

    browsers: Object.keys(sauceBrowsers),

    reporters: ['dots', 'coverage', 'coveralls', 'saucelabs'],

    coverageReporter: {
      dir: path.join(__dirname, '../', 'coverage'),
      reporters: [
        { type: 'text' },
        { type: 'lcov' },
      ],
    },

    concurrency: 1,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 4 * 60 * 1000,
    captureTimeout: 0,

    singleRun: true,
  });

  baseConfig.rollupPreprocessor.plugins.splice(1, 1, istanbul({
    exclude: ['node_modules/**/*.js', 'spec/**/*.js'],
  }));

  baseConfig.plugins.push(
    'karma-sauce-launcher',
    'karma-coverage',
    'karma-coveralls'
  );

  config.set(baseConfig);
};
