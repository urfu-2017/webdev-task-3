'use strict';

const config = require('./config/default.json');
const { error500 } = require('./controllers/errors');

exports.info = (req, res, next) => {
    Object.assign(res.locals, config);

    next();
};

exports.serverError = (err, req, res, next) => {
    /* eslint no-unused-vars: 0 */

    console.error(err);
    error500(req, res);
};
