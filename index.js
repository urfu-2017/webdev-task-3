'use strict';

const express = require('express');

const path = require('path');

const config = require('./config.json');

const app = express();

const publicDir = path.join(__dirname, 'public');
const entryPoint = path.join(publicDir, 'index.html');

app.use(express.static(publicDir));
app.get('/*', (req, res) => res.sendFile(entryPoint));

// eslint-disable-next-line no-console
app.listen(config.port, () => console.log(`Сервер слушает порт ${config.port}`));

module.exports = app;
