const webpack = require('webpack');
const config = require('./webpack.base');


config.output = {
  library: 'lighty',
  libraryTarget: 'umd',
};

config.externals = {
  jquery: {
    root: '$',
    amd: 'jquery',
    commonjs: 'jquery',
    commonjs2: 'jquery',
  },
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  );
}


module.exports = config;
