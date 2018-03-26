'use strict';

var path = require('path');

module.exports = {
    entry: './controllers/index.js',
    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, 'public')
    }
};
