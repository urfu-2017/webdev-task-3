'use strict';

const Request = require('../model/request');

class Place {

    constructor(name, id, checked) {
        this.id = id;
        this.name = name;
        this.checked = checked || false;
    }

    static async create(name) {
        const requestBody = JSON.stringify({ name });
        const request = new Request('/places', 'POST', requestBody);
        const { status, body } = await request.send();
        console.info(`Статус запроса(создание нового места):${status}`);
        const place = new Place(body.name, body.id, body.visited);

        return place;
    }

    static async getPlacesList() {
        const request = new Request('/places', 'GET');
        const { status, body } = await request.send();
        console.info(`Статус запроса(получить список мест):${status}`);

        return body.map(place => {
            const newPlace = new Place(place.name, place.id, place.visited);

            return newPlace;
        });
    }

    async delete() {
        const request = new Request(`/places/${this.id}`, 'DELETE');
        const status = await request.sendAndReceiveStatus();

        return status === 204;
    }

    static async deleteAll() {
        const request = new Request('/places', 'DELETE');
        const status = await request.sendAndReceiveStatus();

        return status === 204;
    }

    async changeVisit() {
        this.checked = !this.checked;
        const request = new Request(`/places/${this.id}?visit=${this.checked}`, 'POST');
        const status = await request.sendAndReceiveStatus();
        console.info(`Статус запроса(изменить отметку посещения):${status}`);
    }

    async changeDescription(description) {
        const body = JSON.stringify({ description });
        const request = new Request(`/places/${this.id}`, 'PATCH', body);
        const status = await request.sendAndReceiveStatus();
        console.info(`Статус запроса(изменить описание):${status}`);
    }
}

module.exports = Place;
