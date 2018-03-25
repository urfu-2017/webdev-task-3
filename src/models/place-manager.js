import Place from './place';
import { BASE_API_URL } from '../config';
import { jsonGet, jsonPost, jsonDelete, jsonPatch } from '../utils/requests';

let store = [];

const filtersState = {
    query: '',
    status: 'all'
};

class PlaceManager {
    static async load() {
        const response = await jsonGet(`${BASE_API_URL}/places`);

        if (response.status !== 200) {
            throw new Error(response.message);
        }

        store = response.body.map(item => new Place(item));

        return store;
    }

    static async clear() {
        const response = await jsonDelete(`${BASE_API_URL}/places`);

        if (response.status !== 200) {
            throw new Error(response.message);
        }

        store = [];

        return store;
    }

    static async create(description) {
        const response = await jsonPost(
            `${BASE_API_URL}/places`,
            undefined,
            { description: description }
        );

        if (response.status !== 200) {
            throw new Error(response.message);
        }

        const createdPlace = new Place(response.body);
        store.push(createdPlace);

        return store;
    }

    static async edit(id, { status, description }) {
        const requestBody = {};

        if (status !== undefined) {
            requestBody.isVisited = status;
        }
        if (description !== undefined && description !== '') {
            requestBody.description = description;
        }

        const response = await jsonPatch(
            `${BASE_API_URL}/places/${id}`,
            undefined,
            requestBody
        );

        if (response.status !== 200) {
            throw new Error(response.message);
        }

        const editedPlace = new Place(response.body);
        store.splice(store.findIndex(place => place.id === editedPlace.id), 1, editedPlace);

        return editedPlace;
    }

    static async delete(id) {
        const response = await jsonDelete(`${BASE_API_URL}/places/${id}`);

        if (response.status !== 200) {
            throw new Error(response.message);
        }

        const removedPlace = new Place(response.body);
        store.splice(store.findIndex(place => place.id === removedPlace.id), 1);

        return removedPlace;
    }

    static filter({ query, status }) {
        if (query !== undefined) {
            filtersState.query = query.toLowerCase();
        }
        if (status !== undefined) {
            filtersState.status = status;
        }

        let filteredPlaces = store;

        switch (filtersState.status) {
            case 'visited':
                filteredPlaces = filteredPlaces.filter(place => place.isVisited);
                break;
            case 'not-visited':
                filteredPlaces = filteredPlaces.filter(place => !place.isVisited);
                break;
            case 'all':
            default:
        }

        filteredPlaces = filteredPlaces.filter(
            place => place.description.toLowerCase().includes(filtersState.query)
        );

        return filteredPlaces;
    }
}

export default PlaceManager;
