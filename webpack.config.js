const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const JS_PATH = "./src/frontend/js/";

module.exports = {
  entry: {
    main: JS_PATH + "main.js",
    videoPlayer: JS_PATH + "videoPlayer.js",
    commentSection: JS_PATH + "commentSection.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
