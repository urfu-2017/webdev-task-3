import { apiUrl, nameAddedPlace } from './state';
import { getIndexTravel } from './utility/getIndexTravel';


export const api = {
    getPlaces() {
        return fetch(apiUrl, { method: 'GET' })
            .then(response => response.json());
    },

    postPlace() {
        return fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({ name: nameAddedPlace.value }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json());
    },

    deletePlaces() {
        return fetch(apiUrl, { method: 'DELETE' });
    },

    postChangeVisitStatus({ checkbox, isVisited }) {
        return fetch(`${apiUrl}/${checkbox.parentNode.dataset.id}/visit/${isVisited}`,
            { method: 'POST' });
    },

    postSwapPlaces({ first, second }) {
        return fetch(`${apiUrl}/swap/${getIndexTravel(first)}/${getIndexTravel(second)}`,
            { method: 'PUT' });
    },

    deletePlace(travel) {
        return fetch(`${apiUrl}/${travel.dataset.id}`, { method: 'DELETE' });
    },

    patchName({ travel, newValue }) {
        return fetch(`${apiUrl}/edit/${travel.dataset.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ name: newValue }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json());
    }
};
