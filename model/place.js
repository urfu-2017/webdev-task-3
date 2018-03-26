'use strict';

var Request = require('../model/request');


class Place {

    constructor(name, id, checked) {
        this.id = id;
        this.name = name;
        this.checked = checked || false;
    }

    static async create(name) {
        var requestBody = JSON.stringify({ name });
        var request = new Request('/places', 'POST', requestBody);
        var { status, body } = await request.send();
        console.info(`Статус запроса(создание нового места):${status}`);
        var place = new Place(body.name, body.id, body.visited);

        return place;
    }

    static async getPlacesList() {
        var request = new Request('/places', 'GET');
        var { status, body } = await request.send();
        console.info(`Статус запроса(получить список мест):${status}`);

        return body.map(place => {
            var newPlace = new Place(place.name, place.id, place.visited);

            return newPlace;
        });
    }

    async isDeleted() {
        var request = new Request(`/places/${this.id}`, 'DELETE');
        var status = await request.sendAndReceiveStatus();

        return status === 204;
    }

    static async isdeleteAll() {
        var request = new Request('/places', 'DELETE');
        var status = await request.sendAndReceiveStatus();

        return status === 204;
    }

    async changeVisit() {
        this.checked = !this.checked;
        var request = new Request(`/places/${this.id}?visit=${this.checked}`, 'POST');
        var status = await request.sendAndReceiveStatus();
        console.info(`Статус запроса(изменить отметку посещения):${status}`);
    }

    async changeDescription(description) {
        var body = JSON.stringify({ description });
        var request = new Request(`/places/${this.id}`, 'PATCH', body);
        var status = await request.sendAndReceiveStatus();
        console.info(`Статус запроса(изменить описание):${status}`);
    }

    getId() {
        return this.id;
    }
}

module.exports = Place;
