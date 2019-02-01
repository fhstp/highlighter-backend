const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    plugins: [
        // new UglifyJsPlugin({
        //     uglifyOptions: {
        //         warnings: false
        //     },
        //     sourceMap: true
        // })
    ],
    entry: './src/index.ts',
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'build')
    },
    target: "node",
    externals: [nodeExternals()]
};