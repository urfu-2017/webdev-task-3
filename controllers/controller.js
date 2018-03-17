'use strict';
// const LocModel = require('../models/locationModel');
const frontPage = require('../mocks/index');

module.exports = async (req, res) => {
    // const news = new LocModel(req.query);
    // const fetchedData = await Promise.all([news.get(), weather.get()]);
    const place1 = { name: 'Place1', arrowUp: false, arrowDown: true, visited: true };
    const place2 = { name: 'Place2', arrowUp: true, arrowDown: true, visited: false };
    const place3 = { name: 'Place3', arrowUp: true, arrowDown: false, visited: true };
    const arr = [];
    arr.push(place1);
    arr.push(place2);
    arr.push(place3);
    res.locals.places = arr;
    res.render('index', frontPage);
};
