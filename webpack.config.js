'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        home: [
            './views',
            './views/styles.scss'
        ]
    },

    output: {
        filename: 'script.js',
        path: path.join(__dirname, 'public/')
    },

    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader' },
            { test: /\.html$/, loader: 'html-loader' },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!sass-loader'
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css')
    ]
};
