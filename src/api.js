import { apiUrl } from './state';


export const api = {
    getPlaces() {
        return fetch(apiUrl, { method: 'GET' })
            .then(response => response.json());
    },

    postPlace(name) {
        return fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({ name }),
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

    postSwapPlaces({ firstIndex, secondIndex }) {
        return fetch(`${apiUrl}/swap/${firstIndex}/${secondIndex}`,
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
