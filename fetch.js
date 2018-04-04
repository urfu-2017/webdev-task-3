'use strict';

const fetch = require('node-fetch');
const url = 'https://webdev-task-2-cfndvqnpss.now.sh/notes';

const fetchResults = async () => {

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=utf-8'
        }

    });

    return response.json();
};

class Info {

    async getInfo() {
        const info = await fetchResults();

        return { info };
    }
}

module.exports = Info;
