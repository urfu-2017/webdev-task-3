'use strict';

// const queryString = require('query-string');
const fetch = require('node-fetch');
const baseUrl = 'https://webdev-task-2-xpnkperpwi.now.sh/?';

const getApiResp = async url => {
    const response = await fetch(url);
    const body = await response.json();
    console.info(body);

    return body;
};

class LocModel {
    constructor(place, method) {
        this.place = place;
        this.method = method;
    }

    async get() {
        const url = `${baseUrl}place=${this.place}`;
        const resp = await getApiResp(url);

        return resp;
    }
}

module.exports = LocModel;
