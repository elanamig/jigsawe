'use strict'

const { resolve } = require ('path');

module.exports = {
    entry: './frontend/index',
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    },
    context: __dirname,
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader'
              }, {
                test: /\.css$/,
                loader: 'css-loader',
                query: {
                  modules: true,
                  localIdentName: '[name]__[local]___[hash:base64:5]'
                }
              },
            {
                test: /jsx?$/,
                include: resolve(__dirname, './frontend'),
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'env']
                }
            }
        ]
    }
}