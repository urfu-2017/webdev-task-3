'use strict';

const Request = require('../model/request');

class PlacesList {

    constructor() {
        this.list = [];
    }

    get visited() {
        return this.list.filter(place => place.checked);
    }

    get unvisited() {
        return this.list.filter(place => !place.checked);
    }

    add(place) {
        this.list.push(place);
    }

    getAll() {
        return this.list;
    }

    contains(name) {
        return this.list.find(place => name === place.name) !== undefined;
    }

    deleteAll() {
        this.list = [];
    }

    delete(place) {
        this.list = this.list.filter(currentPlace => currentPlace !== place);
    }

    indexOf(place) {
        return this.list.indexOf(place);
    }

    getPlace(index) {
        return this.list[index];
    }

    async swap(index1, index2) {
        const place = this.list[index1];
        this.list[index1] = this.list[index2];
        this.list[index2] = place;
        const request = new Request(`/places/${ place.id }?id=${ this.list[index1].id }`, 'PUT');
        const status = await request.sendAndReceiveStatus();
        console.info(`Статус запроса(поменять местами):${status}`);
    }
}

module.exports = PlacesList;
