'use strict';
const path = require('path');

const express = require('express');
const hbs = require('hbs');
const app = express();

const controller = require('./controllers/controller');

const publicDir = path.join(__dirname, 'public');
const viewsDir = path.join(__dirname, 'views');
const partialsDir = path.join(viewsDir, 'partials');

app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.use(express.static(publicDir));

app.get('/', controller);

hbs.registerPartials(partialsDir, () => {
    app.listen(8080, () => {
        console.info(`Server started on ${8080}`);
        console.info(`Open http://localhost:${8080}/`);
    });
});

module.exports = app;
