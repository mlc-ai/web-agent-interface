const path = require('path');
const webpack = require('webpack');
const { IgnorePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    library: {
      type: 'commonjs2',
    },
    clean: true,
    sourceMapFilename: '[file].map',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.json'],
    fallback: {
      fs: false,
      path: false,
      crypto: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /^fs$|^path$|^crypto$/,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  devtool: 'source-map',
  mode: 'production',
  externals: {
    // Prevent bundling of certain imported packages
    // (e.g., libraries already available as external scripts)
  },
};
