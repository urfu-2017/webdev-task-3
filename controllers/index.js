'use strict';
const frontPage = require('../data.json');

module.exports = async (req, res) => {
    res.render('index', frontPage);
};
