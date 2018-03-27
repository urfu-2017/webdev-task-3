'use strict';

const express = require('express');

const path = require('path');

const { port } = require('./config.json');

const app = express();

const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

app.listen(port, () => console.info(`localhost:${port}`));
