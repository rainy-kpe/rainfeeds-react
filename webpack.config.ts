import * as webpack from "webpack";
import * as path from "path";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const VisualizerPlugin = require('webpack-visualizer-plugin');

// Constant with our paths
const paths = {
    DIST: path.resolve(__dirname, "dist"),
    SRC: path.resolve(__dirname, "src"),
    JS: path.resolve(__dirname, "src/js")
};

// Webpack configuration
const config: webpack.Configuration = {
    entry: {
        main: path.join(paths.SRC, "index.tsx")
    },
    output: {
        path: paths.DIST,
        filename: "[name].js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".styl"]
    },
    module: {
        rules: [
            { test: /\.(png|svg|jpg|gif)$/, loader: "file-loader" },
            { test: /\.styl$/, use: ["style-loader", "typings-for-css-modules-loader?modules&namedExport", "stylus-loader"] },
            { test: /\.tsx?$/, use: ["react-hot-loader/webpack", "awesome-typescript-loader"] },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            { enforce: "pre", test: /\.tsx?$/, loader: "tslint-loader" }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([ "dist" ]),
        new HtmlWebpackPlugin({ title: "Rainfeeds", template: "./src/template-index.html" }),
        new webpack.DefinePlugin({ "BUILD": JSON.stringify(process.env.NODE_ENV) })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    },
    devtool: "source-map"
};

if (process.env.NODE_ENV === "development") {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new VisualizerPlugin());
    config.mode = "development";
} else {
    config.optimization.minimize = true;
    config.mode = "production";
}

export default config;
