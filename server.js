'use strict';

const path = require('path');

const express = require('express');

const port = require('./public/config').port;

const publicDir = path.join(__dirname, 'public');

const app = express();
app.use(express.static(publicDir));

app.listen(port, () => {
    console.info(`http://localhost:${port}/`);
});
