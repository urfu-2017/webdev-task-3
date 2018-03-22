'use strict';

const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const hbs = require('hbs');
const cors = require('cors');

const routes = require('./routes');

const app = express();

// Определяем директорию для хранения шаблонов.
// Для работы с директориями всегда используем модуль «path»
// и преобразуем относительные пути в абсолютные
const viewsDir = path.join(__dirname, 'views');

// Определяем директорию для хранения отдельных частей шаблонов
const partialsDir = path.join(viewsDir, 'partials');

const publicDir = path.join(__dirname, 'public');
const defaultValues = dotenv.config({ path: path.join(__dirname, '.env') }).parsed;

// Подключаем шаблонизатор
app.set('view engine', 'hbs');

// Подключаем директорию с шаблонами
app.set('views', viewsDir);

app.use(cors());

// Отдаём статичные файлы из соответствующей директории
app.use(express.static(publicDir));

app.use((err, req, res, next) => {
    console.error(err.stack);

    next();
});

// Собираем общие данные для всех страниц приложения
app.use((req, res, next) => {
    // Хранение в res.locals – рекомендованный способ
    // Не перезаписываем, а дополняем объект
    res.locals.meta = {
        charset: 'utf-8',
        description: 'Задача «Павел слишком занят»'
    };

    res.locals.title = 'Задача «Павел слишком занят»';

    next();
});

// Подключаем маршруты
routes(app);

// Фиксируем фатальную ошибку и отправляем ответ с кодом 500
app.use((err, req, res) => {
    console.error(err.stack);

    res.sendStatus(500);
});

hbs.registerPartials(partialsDir, () => {
    app.listen(defaultValues.PORT, () => {
        console.info(`Open http://localhost:${defaultValues.PORT}/api/places`);
    });
});
