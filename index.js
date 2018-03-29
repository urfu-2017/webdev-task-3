'use strict';
const path = require('path');
const express = require('express');
const { port } = require('./config');

const app = express();
const publicDir = path.join(__dirname, './public');
const entryPoint = path.join(__dirname, 'index.html');

app.use(express.static(publicDir));
app.get('/*', (req, res) => res.sendFile(entryPoint));

app.listen(port, () => {
    console.info(`Server started on ${port}`);
    console.info(`Open http://localhost:${port}/`);
});

module.exports = app;
