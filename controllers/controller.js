'use strict';
const LocModel = require('../models/locationModel');
const frontPage = require('../mocks/index');
const formatData = require('../utils/locationFormatter');

module.exports = async (req, res) => {
    const a = new LocModel({ place: 'a' });
    const b = new LocModel({ place: 'b' });
    const locationModel = new LocModel({ place: 'all' });
    await a.post(a);
    await b.post(b);
    const response = await locationModel.get();
    res.locals.places = formatData(response.body);
    res.render('index', frontPage);
};
