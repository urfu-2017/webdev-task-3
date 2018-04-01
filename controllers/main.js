'use strict';

exports.main = (req, res) => {
    const data = Object.assign({}, res.locals);

    res.render('index', data);
};
