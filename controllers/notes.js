'use strict';

exports.list = (req, res) => {
    const data = JSON.parse(JSON.stringify(res.locals));
    res.render('index', data);
};
