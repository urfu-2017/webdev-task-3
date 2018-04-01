'use strict';

const path = require('path');
const pathToPublic = path.join(__dirname, 'public');
console.info(__dirname);

module.exports = {
    entry: path.join(pathToPublic, 'index.js'),
    output: {
        path: path.join(pathToPublic, 'dist'),
        filename: '[name].js'
    }
};
