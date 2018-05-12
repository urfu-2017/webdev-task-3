'use strict';
/* eslint-disable */

const baseUrl = 'http://localhost:8080/';

class PlaceApi {
    async getAll() {
        return (await fetch(baseUrl, { method: 'GET' })).json();
    }

    create(desc) {
        const data = 'desc=' + desc;
        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        };
        fetch(baseUrl, options);
    }

    clear() {
        const options = {
            method: 'delete'
        };
        fetch(baseUrl, options);
    }

    delete(id) {
        const data = 'id=' + id;
        const options = {
            method: 'delete',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        };
        fetch(baseUrl + 'places', options);
    }

    edit(id, desc, isVisited) {
        const data = { desc, isVisited };
        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch(baseUrl + `places/${id}`, options);
    }

    insert(id, indexTo) {
        const data = { id, indexTo };
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch(baseUrl + 'places', options);
    }
}

const placeApi = new PlaceApi();
