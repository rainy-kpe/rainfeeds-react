import * as webpack from 'webpack';
import * as path from 'path';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Constant with our paths
const paths = {
    DIST: path.resolve(__dirname, 'dist'),
    SRC: path.resolve(__dirname, 'src'),
    JS: path.resolve(__dirname, 'src/js')
};

// Webpack configuration
const config: webpack.Configuration = {
    entry: {
        main: path.join(paths.SRC, 'index.tsx'),
        vendor: [
            'lodash',
            'react',
            'react-dom'
        ]
    },
    output: {
        path: paths.DIST,
        filename: '[name].[hash].js'
    }, 
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".styl"]
    },
    module: {
        rules: [
            { test: /\.styl$/, use: ['style-loader', 'typings-for-css-modules-loader?modules&namedExport', 'stylus-loader'] },
            { test: /\.tsx?$/, use: ['awesome-typescript-loader'] },
            { enforce: "pre", test: /\.js$/, use: "source-map-loader" }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([ 'dist' ]),
        new HtmlWebpackPlugin({ title: 'Rainfeeds' }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'runtime' })
        
    ],
    devtool: "source-map",
    devServer: {
        contentBase: paths.DIST
    }
};

export default config;
