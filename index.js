'use strict';

const express = require('express');
const path = require('path');

// const routes = require('./routes');

const app = express();

const staticContent = path.join(__dirname, './public/');
app.use(express.static(staticContent));

const controllers = path.join(__dirname, '/controllers/');
app.use(express.static(controllers));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8080);
