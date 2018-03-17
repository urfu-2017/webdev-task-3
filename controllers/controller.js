'use strict';
const LocModel = require('../models/locationModel');
const frontPage = require('../mocks/index');

module.exports = async (req, res) => {
    const wtf = new LocModel({ place: 'London' });
    wtf.post();
    const anotha = new LocModel({ place: 'Paris' });
    anotha.post();
    const betterName = new LocModel({ place: 'all' });
    const response = await betterName.get();
    const data = response.body;
    const arr = [];
    if (data) {
        data.forEach((elem, idx) => {
            if (idx === 0) {
                arr.push({ name: elem.name, arrowUp: false,
                    arrowDown: true, visited: elem.visited });
            } else if (idx === data.length - 1) {
                arr.push({ name: elem.name, arrowUp: true,
                    arrowDown: false, visited: elem.visited });
            } else {
                arr.push({ name: elem.name, arrowUp: true,
                    arrowDown: true, visited: elem.visited });
            }
        });
        res.locals.places = arr;
        res.render('index', frontPage);
    }
};
