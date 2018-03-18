'use strict';

const path = require('path');

module.exports = {
    entry: './views/components/index.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public')
    },
    module: {
        rules: [
            {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!stylus-loader'
            },
            {
                test: /\.hbs$/,
                loader: 'html-loader'
            }
        ]
    }
};
