'use strict';

const Place = require('../models/place');
// const { format } = require('url');
const places = Place.findAll();

exports.getPlaces = (req, res) => {
    res.render('index', { places });
};
