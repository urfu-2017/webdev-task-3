'use strict';

// const queryString = require('query-string');
const fetch = require('node-fetch');
const baseUrl = 'https://webdev-task-2-gguhuxcnsd.now.sh';
// var URLSearchParams = require('url-search-params');

const getApiResp = async (url, options) => {
    const response = await fetch(url, options);
    const body = await response.json();

    return body;
};

class LocModel {
    constructor(params) {
        this.place = params.place;
        this.sortBy = params.sortBy;
        this.findByDescr = params.findByDescr;
        this.amount = params.amount;
        this.page = params.page;
        this.param = params.param;
        this.value = params.value;
        this.place1 = params.place1;
        this.place2 = params.place2;
    }

    async get() {
        const url = `${baseUrl}`;
        // ?place=${this.place}
        const resp = await getApiResp(url);

        return resp;
    }

    async post() {
        const url = `${baseUrl}?place=${this.place}`;
        const resp = await getApiResp(url, { method: 'POST' });

        return resp;
    }
}

module.exports = LocModel;
