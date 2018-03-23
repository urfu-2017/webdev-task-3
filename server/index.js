'use strict';
const path = require('path');

const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const hbs = require('hbs');
const morgan = require('morgan');

const routes = require('./routes');
const handleErrors = require('./middlewares/handleErrors');
const setInitialData = require('./middlewares/setInitialData');

const app = express();
const port = config.get('port') || 8080;

// Определяем директорию для хранения шаблонов
const viewsDir = path.join(__dirname, 'views');

// Определяем директорию для хранения отдельных частей шаблонов
const partialsDir = path.join(viewsDir, 'partials');

// Определяем директорию для статичных файлов (изображений, стилей и скриптов)
const publicDir = path.join(__dirname, '..', 'public', 'components');

// Подключаем шаблонизатор
app.set('view engine', 'hbs');

// Подключаем директорию с шаблонами
app.set('views', viewsDir);

// Логируем запросы к приложению в debug-режиме
if (config.get('debug')) {
    app.use(morgan('dev'));
}

app.use(express.static(publicDir));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());

app.use(setInitialData);

app.use(handleErrors);

routes(app);

// Подключаем директорию с отдельными частями шаблонов
// Этот метод асинхронный и мы запускаем сервер только после того,
// как все частичные шаблоны будут прочитаны
hbs.registerPartials(path.join(partialsDir, 'weather'), () => {
    hbs.registerPartials(partialsDir, () => {
        // Запускаем сервер на порту
        app.listen(port, () => {
            console.info(`Open http://localhost:${port}/`);
        });
    });
});

module.exports = app;
