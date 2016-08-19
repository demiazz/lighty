const webpack = require('webpack');


module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
  ],
};
