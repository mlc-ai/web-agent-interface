const path = require("path");
const { IgnorePlugin } = require("webpack");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "index.js",
    library: {
      type: "commonjs2",
    },
    clean: {
      keep: /\.d\.ts$/,
    },
    sourceMapFilename: "[file].map",
  },
  target: "web",
  resolve: {
    extensions: [".ts", ".js", ".json"],
    fallback: {
      fs: false,
      path: false,
      crypto: false,
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
    ],
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /^fs$|^path$|^crypto$/,
    }),
  ],
  devtool: "source-map",
  mode: "production",
  externals: {
    // Prevent bundling of certain imported packages
    // (e.g., libraries already available as external scripts)
  },
};
