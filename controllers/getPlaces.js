'use strict';

const fetch = require('node-fetch');
const BASEURL = 'https://webdev-task-2-qejgtbwicx.now.sh';
exports.getPlaces = (req, res) =>{
    fetch(BASEURL + '/place', {
        method: 'get'
    }).then(response => {
        return response.json();
    })
        .then(function (data) {
            data.forEach(element => {
                if (element.isVisited === true) {
                    element.isVisited = 'checked';
                } else {
                    element.isVisited = '';
                }
            });
            res.locals.places = data;

            res.render('index', res.locals);
        });


};
