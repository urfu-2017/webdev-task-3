'use strict';

const path = require('path');
const express = require('express');
const app = express();
const port = 8080;

app.get('/', indexController);
app.use(express.static('public'));
app.listen(port, function () {
    console.info(`App is started on port ${port}.`);
});

function indexController(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
}
