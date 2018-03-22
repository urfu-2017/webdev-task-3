'use strict';

const express = require('express');
const path = require('path');

const app = express();

const viewsDir = path.join(__dirname, 'views');
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));
app.use(express.static(viewsDir));
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.listen(8000);
