'use strict';

const fetch = require('node-fetch');


const method = async () => {

    const response = await fetch('https://webdev-task-2-cfndvqnpss.now.sh/notes', {
        method: 'GET',
        headers: {
            'X-Custom-Header': 'ProcessThisImmediately',
            'Content-type': 'application/json; charset=utf-8'
        }

    });

    return response.json();
};

class model {

    async Get() {
        const info = await method();
        let data = {};
        Object.assign(data, {
            info
        });

        return data;
    }
}

module.exports = model;
