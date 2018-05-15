'use strict';

const path = require('path');
const express = require('express');
const hbs = require('hbs');

const viewsDir = path.join(__dirname, 'views');
const partialsDir = path.join(viewsDir, 'partials');
const publicDir = path.join(__dirname, 'public');

const controller = require('./controllers/index');

const app = express();

app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.use(express.static(publicDir));
app.get('/', controller);

hbs.registerPartials(partialsDir, () => {
    app.listen(8080, () => {
        console.info('Server had started on http://localhost:8080');
    });
});
