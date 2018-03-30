'use strict';

const { notes } = require('./controllers/index');

module.exports = app => {
    app
        .route('/')
        .get(notes);

    app.all('*', (req, res) => {
        res.sendStatus(404);
    });
};
