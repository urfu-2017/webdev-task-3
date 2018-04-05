'use strict';

/* eslint-disable no-undef */
// ставлю настройки хрюнделя на браузер, ругается на require
// ставлю настройки на node, ругается на fetch

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const staticContent = path.join(__dirname, './public/');
app.use(express.static(staticContent));

const controllers = path.join(__dirname, '/controllers/');
app.use(express.static(controllers));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8080);
