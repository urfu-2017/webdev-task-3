'use strict';

const path = require('path');

const express = require('express');

const routes = require('./routes');
const { setInfo } = require('./middlewares/info-setter');
const { handleError } = require('./middlewares/error-handler');
const { port } = require('./config/default.js');

const app = express();

const viewsDir = path.join(__dirname, 'views');
const publicDir = path.join(__dirname, 'public');

app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.use(express.static(publicDir));

app.use(setInfo);

routes(app);

app.use(handleError);

app.listen(port, () => console.info(`Open http://localhost:${port}`));
