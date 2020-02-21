import * as webpack from "webpack"
import * as path from "path"

const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const VisualizerPlugin = require("webpack-visualizer-plugin")

// Constant with our paths
const paths = {
  DIST: path.resolve(__dirname, "dist"),
  SRC: path.resolve(__dirname, "src")
}

// Webpack configuration
const config: webpack.Configuration = {
  target: "node",
  entry: {
    main: path.join(paths.SRC, "index.ts")
  },
  output: {
    path: paths.DIST,
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      { test: /\.ts$/, use: ["awesome-typescript-loader"] },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { enforce: "pre", test: /\.ts?$/, loader: "tslint-loader" }
    ]
  },
  plugins: [new CleanWebpackPlugin()],
  optimization: {},
  devtool: "source-map"
}

if (process.env.NODE_ENV === "development") {
  config.plugins.push(new VisualizerPlugin())
  config.mode = "development"
} else {
  config.optimization.minimize = true
  config.mode = "production"
}

export default config
