'use strict';

const axios = require('axios');
const { serverUrl } = require('../config');

exports.main = async (req, res, next) => {
    try {
        let list = await axios.get(serverUrl + '/places');
        // Преобразую посещенные/нет в checked/нет, чтобы сразу отображать
        list.data.forEach(el => {
            el.textDecoration = el.visited === true ? 'line-through' : 'none';
            el.visited = el.visited === true ? 'checked' : '';
        });
        res.render('main', {
            title: 'Места Билли',
            places: list.data
        });
    } catch (err) {
        next(new Error('PAGE_ERROR'));
    }
};
