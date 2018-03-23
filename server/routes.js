'use strict';

module.exports = app => {
    app.all('/', function (req, res) {
        res.render('index', res.locals);
    });
};
