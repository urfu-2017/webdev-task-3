'use strict';

var Request = require('../model/request');

class PlacesList {

    constructor() {
        this.list = [];
    }

    add(place) {
        this.list.push(place);
    }

    getAll() {
        return this.list;
    }

    getVisited() {
        return this.list.filter(place => place.checked);
    }

    getUnvisited() {
        return this.list.filter(place => !place.checked);

    }

    contains(name) {
        var findedPlace = this.list.find(place => name === place.name);

        return findedPlace !== undefined;
    }

    deleteAll() {
        this.list = [];
    }

    delete(place) {
        this.list = this.list.filter(currentPlace => currentPlace !== place);
    }

    getIndex(place) {
        return this.list.indexOf(place);
    }

    getPlace(index) {
        return this.list[index];
    }

    async swap(index1, index2) {
        var place = this.list[index1];
        this.list[index1] = this.list[index2];
        this.list[index2] = place;
        var request = new Request(`/places/${ place.id }?id=${ this.list[index1].id }`, 'PUT');
        var status = await request.sendAndReceiveStatus();
        console.info(`Статус запроса(поменять местами):${status}`);
    }
}

module.exports = PlacesList;
