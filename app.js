'use strict';

import morgan from 'morgan';
import express from 'express';
import hbs from 'hbs';
import lessMiddleware from 'less-middleware';
import path from 'path';

import routes from './routes';

const app = express();

app.set('view engine', 'hbs');
app.use(lessMiddleware(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(morgan('dev'));
routes(app);

app.listen(8080);

module.exports = app;
