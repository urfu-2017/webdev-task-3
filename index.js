'use strict';

const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const viewsDir = path.join(__dirname, 'views');
const partialsDir = path.join(viewsDir, 'partials');
const publicDir = path.join(__dirname, 'public');

const { listPlaces } = require('./controllers/places');
app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.use(express.static(publicDir));

app.get('/', listPlaces);

const port = 8080;
hbs.registerPartials(partialsDir, () => {
    app.listen(port, () => {
        console.info(`Listening on http://localhost:${port}`);
    });
});
