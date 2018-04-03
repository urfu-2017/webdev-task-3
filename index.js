'use strict';

const path = require('path');
const express = require('express');
const app = express();

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.get('/', function (req, res) {
    res.send('index.html');
});

app.listen(8080, () => {
    console.info('Open http://localhost:8080/');
});
