'use strict';

import { getIndexTravel } from './getIndexTravel';


export const apiUrl = 'https://webdev-task-2-clzvgkakug.now.sh/places';
export const visitsFilters = {
    all: () => true,
    visit: visited => visited === 'false',
    visited: visited => visited === 'true'
};
export const filtration = {
    soughtForMessage: '',
    checkVisit: visitsFilters.all
};
export const directionToNameMethod = {
    up: 'previousSibling',
    down: 'nextSibling'
};

export const placesContainer = document.querySelector('#places');
export const messagesSearcher = document.querySelector('#search-string');
export const nameAddedPlace = document.querySelector('#name-added-place');
export const visitsChanger = document.querySelectorAll('[name="visit-filter"]');
export const creatorPlaces = document.querySelector('#create-place');
export const cleanerPlaces = document.querySelector('#cleaner-places');


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
        return fetch(`${apiUrl}/${getIndexTravel(travel)}`, { method: 'DELETE' });
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
