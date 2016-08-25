const buble = require('rollup-plugin-buble');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonJS = require('rollup-plugin-commonjs');


module.exports = {
  frameworks: ['jasmine', 'sinon'],

  files: [
    {
      pattern: '../src/**/*.js',
      watched: process.env.CI !== 'true',
      included: false,
    },
    {
      pattern: '../spec/**/*.spec.js',
      watched: process.env.CI !== 'true',
    },
  ],

  preprocessors: {
    '../spec/**/*.spec.js': ['rollup'],
  },

  rollupPreprocessor: {
    format: 'iife',
    sourceMap: 'inline',
    plugins: [commonJS(), nodeResolve(), buble()],
  },

  plugins: [
    'karma-jasmine',
    'karma-sinon',
    'karma-rollup-plugin',
    'karma-spec-reporter',
  ],

  reporters: ['spec'],
};
