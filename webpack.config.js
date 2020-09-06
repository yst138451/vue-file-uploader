const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'vue-file-uploader.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}