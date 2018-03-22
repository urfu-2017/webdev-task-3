'use strict';

const { list } = require('./controllers/notes');
const { error404 } = require('./controllers/error');

module.exports = app => {
    app.get('/', list);
    app.all('*', error404);
};
