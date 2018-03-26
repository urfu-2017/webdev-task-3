'use strict';

var config = require('../config');

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
        var response = await fetch(`${config.restApiUrl}${this.options.path}`, this.options);
        var status = await response.status;
        var body = await response.json();

        return {
            body,
            status
        };
    }

    async sendAndReceiveStatus() {
        var response = await fetch(`${config.restApiUrl}${this.options.path}`, this.options);
        var status = await response.status;

        return status;
    }
}
module.exports = Request;
