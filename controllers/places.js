'use strict';


exports.listPlaces = async (req, res) => {
    res.render('index', { meta: { title: 'Места' } });
};
