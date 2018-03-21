'use strict';

const path = require('path');

const express = require('express');
const hbs = require('hbs');

const app = express();

const viewsDir = path.join(__dirname, 'views');

const partialsDir = path.join(viewsDir, 'partials');

const publicDir = path.join(__dirname, 'public');

app.set('view engine', 'hbs');

app.set('views', viewsDir);

app.use(express.static(publicDir));

app.get('/', (req, res) => {
    res.render('index');
});

hbs.registerPartials(partialsDir, () => {
    app.listen(8081, () => {
        console.info('Opened in localhost:8081');
    });
});

module.exports = app;
