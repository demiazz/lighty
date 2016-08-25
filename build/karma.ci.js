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
    // Chrome (last 2 versions)

    sl_chrome_51: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '51.0',
      platform: 'Windows 10',
    },

    sl_chrome_50: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '50.0',
      platform: 'Windows 10',
    },

    // Firefox (last 2 versions)

    sl_firefox_47: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '47.0',
      platform: 'Windows 10',
    },

    sl_firefox_46: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '46.0',
      platform: 'Windows 10',
    },

    // Edge

    sl_edge: {
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

    // Safari (last 2 versions)

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

    // iOS (last 2 major versions)

    sl_ios_9: {
      base: 'SauceLabs',
      browserName: 'Safari',
      appiumVersion: '1.5.3',
      deviceName: 'iPhone Simulator',
      deviceOrientation: 'portrait',
      platformVersion: '9.3',
      platformName: 'iOS',
    },

    sl_ios_8: {
      base: 'SauceLabs',
      browserName: 'Safari',
      appiumVersion: '1.5.3',
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
      startConnect: true,
    },

    customLaunchers: sauceBrowsers,

    browsers: Object.keys(sauceBrowsers),

    reporters: ['dots', 'saucelabs'],

    concurrency: 1,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 4 * 60 * 1000,
    captureTimeout: 0,

    singleRun: true,
  });

  baseConfig.plugins.push('karma-sauce-launcher');

  config.set(baseConfig);
};
