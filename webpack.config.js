const path = require('path');
const webpack = require('webpack');

let API_URL;
if (process.env.NODE_ENV === 'development') {
  API_URL = JSON.stringify('http://localhost:5000/api');
} else if (process.env.NODE_ENV === 'production') {
  API_URL = JSON.stringify('http://production/api');
}

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL,
    }),
  ],
  devtool: '#eval-source-map',
};
