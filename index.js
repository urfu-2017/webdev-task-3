'use strict';

const path = require('path');

const hbs = require('hbs');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config/default.json');
const router = require('./router');
const { error404 } = require('./controllers/errors');
const { serverError, bodyParseError } = require('./middlewares');

const port = process.env.PORT || config.port;
const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParseError);
app.use('/', router);
app.all('*', error404);
app.use(serverError);

hbs.registerPartials(path.join(__dirname, 'views', 'partials'), () => {
    app.listen(port, () => console.info(`listen on ${port}`));
});
