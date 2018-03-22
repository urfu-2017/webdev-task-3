'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();
app.use(express.static(config.staticDir, { redirect: false }));
app.use(bodyParser.json());

app.listen(config.port, () => {
    console.info(`Server started on ${config.port}`);
    console.info(`Open http://localhost:${config.port}/`);
});
