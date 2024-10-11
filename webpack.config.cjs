const path = require("path");
const webpack = require("webpack");
const { IgnorePlugin } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "index.js",
    library: {
      type: "commonjs2",
    },
    clean: true,
    sourceMapFilename: "[file].map",
  },
  target: "web",
  resolve: {
    extensions: [".ts", ".js", ".json"],
    fallback: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      os: require.resolve("os-browserify/browser"),
      url: require.resolve("url/"),
      path: require.resolve("path-browserify"),
      zlib: require.resolve("browserify-zlib"),
      process: require.resolve("process/browser"),
      querystring: require.resolve("querystring-es3"), // Add this line for querystring
      net: false,  // Disable modules not available in browser
      tls: false,  // Disable modules not available in browser
      child_process: false,  // Disable modules not available in browser
      http2: false, // Disable modules not available in browser
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /^fs$|^path$|^crypto$/,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  devtool: "source-map",
  mode: "production",
  externals: {
    // Prevent bundling of certain imported packages
    // (e.g., libraries already available as external scripts)
  },
};
