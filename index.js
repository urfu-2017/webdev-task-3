'use strict';

const path = require('path');

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();

const viewsDir = path.join(__dirname, 'views');
const partialsDir = path.join(viewsDir, 'partials');
const publicDir = path.join(__dirname, 'public');

app.set('view engine', 'hbs');

app.set('views', viewsDir);

app.use(express.static(publicDir));

app.use(bodyParser.urlencoded({
    extended: true
}));

routes(app);

hbs.registerPartials(partialsDir, () => {
    const port = 8080;

    app.listen(port, () => {
        console.info(`Server started on ${port}`);
        console.info(`Open http://localhost:${port}`);
    });
});

module.exports = app;
