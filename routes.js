'use strict';

const { error404 } = require('./controllers/errors');
const { getPlaces } = require('./controllers/places');

module.exports = app => {
    app.get('/', getPlaces);

    app.all('*', error404);
};
