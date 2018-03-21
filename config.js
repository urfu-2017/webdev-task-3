'use strict';
const path = require('path');

module.exports = {
    port: 8080,
    staticDir: path.resolve(__dirname, 'static'),
    apiUrl: 'http://localhost:3000/api/v1'
};
