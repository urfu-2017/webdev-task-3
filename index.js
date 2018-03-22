'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const config = require('./config.json');
const { error404 } = require('./middlewares/notFound');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

require('./routes')(app);

app.use(error404);

// eslint-disable-next-line no-console
app.listen(config.port, () => console.log(`Сервер слушает порт ${config.port}`));

module.exports = app;
