'use strict';

window.api = {
    addPlace: function (input) {
        input.url = window.appState.url + '/';
        input.method = 'POST';

        return request(input);
    },
    getAllPlace: function () {
        const input = { url: window.appState.url, method: 'GET' };

        return request(input);
    },
    placeVisit: function (id) {
        const input = {
            url: window.appState.url + '/visit/' + id,
            method: 'PUT'
        };

        return request(input);
    },
    deleteAll: function () {
        const input = {
            url: window.appState.url + '/all',
            method: 'DELETE'
        };

        return request(input);
    },
    deletePlace: function (id) {
        const input = {
            url: window.appState.url + '/' + id,
            method: 'DELETE'
        };

        return request(input);
    },
    createPlace: function (input, id) {
        input.url = window.appState.url + '/' + id;
        input.method = 'PUT';

        return request(input);
    },
    placeMove: function (input, id) {
        input.url = window.appState.url + '/move/' + id;
        input.method = 'PUT';
        input.func = 'placeMove';

        return request(input);
    }
};

function request(input) {

    return new Promise((resolve, reject) => {
        let json = {};
        const keys = Object.keys(input);
        keys.forEach(key => {
            if (key !== 'url' || key !== 'method') {
                json[key] = input[key];
            }
        });
        json = Object.keys(json).length === 0 ? null : JSON.stringify(json);
        const XHR = XMLHttpRequest;
        const xhr = new XHR();
        xhr.open(input.method, input.url, true);
        if (json !== null) {
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        }

        xhr.onload = function () {
            if (this.readyState !== 4) {

                return;
            }
            if (this.status !== 200 && this.status !== 201) {
                reject('api -> HTTP: ' + this.status);

                return;
            }
            resolve(JSON.parse(this.responseText));
        };
        xhr.send(json);
    });
}
