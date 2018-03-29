'use strict';

const config = require('../config');

class Request {
    constructor(path, method, body) {
        this.options = {
            path,
            body,
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    async send() {
        const response = await fetch(`${config.restApiUrl}${this.options.path}`, this.options);
        const status = await response.status;
        const body = await response.json();

        return {
            body,
            status
        };
    }

    async sendAndReceiveStatus() {
        const response = await fetch(`${config.restApiUrl}${this.options.path}`, this.options);
        const status = await response.status;

        return status;
    }
}
module.exports = Request;
