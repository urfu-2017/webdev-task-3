'use strict';

const baseUrl = 'http://localhost:8080/';

class PlaceApi {
    async getAll() {
        const _places = await fetch(baseUrl, { method: 'GET' }).then(res => res.json());

        return _places;
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
        fetch(baseUrl, options)
            .then(res => res);
    }

    clear() {
        const options = {
            method: 'delete'
        };
        fetch(baseUrl, options)
            .then(res => res);
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
        fetch(baseUrl + 'places', options)
            .then(res => res);
    }

    edit({ id, desc, isVisited }) {
        const data = 'id=' + id + 'desc=' + desc + 'isVisited' + isVisited;
        const options = {
            method: 'patch',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        };
        fetch(baseUrl + 'places', options)
            .then(res => res);
    }

    insert({ id, indexTo }) {
        const data = 'id=' + id + 'indexTo' + indexTo;
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        };
        fetch(baseUrl + 'places', options)
            .then(res => res);
    }
}

const placeApi = new PlaceApi();
