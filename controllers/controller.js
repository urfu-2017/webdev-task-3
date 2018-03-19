'use strict';
const LocModel = require('../models/locationModel');
const frontPage = require('../mocks/index');
const formatData = require('../utils/locationFormatter');

module.exports = async (req, res) => {
    const locationModel = new LocModel({ place: 'all' });
    const response = await locationModel.get();
    res.locals.places = formatData(response.body);
    res.render('index', frontPage);
};
