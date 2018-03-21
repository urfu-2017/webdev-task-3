'use strict';

const fetch = require('node-fetch');
const baseUrl = 'https://webdev-task-2-gguhuxcnsd.now.sh';

const getApiResp = async (url, options) => {
    const response = await fetch(url, options);
    const body = await response.json();

    return body;
};

class LocModel {
    constructor(params) {
        this.place = params.place;
    }

    async get() {
        const url = `${baseUrl}`;
        const resp = await getApiResp(url);

        return resp;
    }
}

module.exports = LocModel;
