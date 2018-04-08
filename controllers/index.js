'use strict';

const { URL } = require('url');

const axios = require('axios');

function goodStatus(arr) {
    for (const el of arr.data) {
        if (el.visited === true) {
            el.visited = 'checked';
        }
    }
}

exports.notes = async (req, res) => {
    const url = new URL('https://webdev-task-2-cgybyopdlr.now.sh/places');
    try {
        const result = await axios.get(url.href);

        goodStatus(result);

        res.setHeader('content-type', 'text/html');
        res.render('index', {
            notes: result.data,
            visitedStatus: result.data
        });
    } catch (error) {
        throw error;
    }
};
