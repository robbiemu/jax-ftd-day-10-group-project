'use strict'

const path = require('path')

module.exports = {

  debug: false,

  entry: {
    main: ['babel-polyfill', './src/main.js'],
    test: ['babel-polyfill', './src/test/test.js']
  },

  target: 'async-node',

  devtool: 'source-map',

  output: {
    path: './dist',
    filename: '[name].js'
  },

  resolve: {
    modulesDirectories: [
      'node_modules'
    ]
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  }

}
