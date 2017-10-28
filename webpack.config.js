// We are using node's native package 'path'
// https://nodejs.org/api/path.html
const path = require('path');

// Constant with our paths
const paths = {
    DIST: path.resolve(__dirname, 'dist'),
    SRC: path.resolve(__dirname, 'src'),
    JS: path.resolve(__dirname, 'src/js')
};

// Webpack configuration
module.exports = {
    entry: [
        path.join(paths.SRC, 'index.tsx')
    ],
    output: {
        path: paths.DIST,
        filename: 'app.bundle.js'
    }, 
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".styl"]
    },
    module: {
        rules: [
            { test: /\.styl$/, loader: 'css-loader!stylus-loader' },
            { test: /\.tsx?$/, loaders: ['awesome-typescript-loader'] },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    devtool: "source-map",
    devServer: {
        contentBase: paths.DIST
    }
};