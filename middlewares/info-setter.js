'use strict';

const info = require('../config/info');

exports.setInfo = (req, res, next) => {
    res.locals.meta = info.meta;
    res.locals.title = info.title;
    next();
};
