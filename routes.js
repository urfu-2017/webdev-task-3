'use strict';

const { getPlaces } = require('./controllers/getPlaces');

module.exports = app => {
    app.get('/', getPlaces);

};
