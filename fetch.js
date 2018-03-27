'use strict';

const fetch = require('node-fetch');
const url = 'https://webdev-task-2-cfndvqnpss.now.sh/notes';

const fetchResults = async () => {

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Custom-Header': 'ProcessThisImmediately',
            'Content-type': 'application/json; charset=utf-8'
        }

    });

    return response.json();
};

class Info {

    async getInfo() {
        const info = await fetchResults();
        const data = { info };

        return data;
    }
}

module.exports = Info;
