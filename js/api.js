'use strict';

const API_URL = 'https://qoter.now.sh/places';

async function createPlace(title) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: title,
            description: ''
        })
    });

    return await res.json();
}

async function updatePlace(place) {
    await fetch(API_URL + `/${place.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(place)
    });
}

async function deletePlace(place) {
    await fetch(API_URL + `/${place.id}`, { method: 'DELETE' });
}

async function getAllPlaces() {
    const res = await fetch(API_URL);

    return await res.json();
}

async function deleteAllPlaces() {
    await fetch(API_URL, { method: 'DELETE' });
}

async function reorder(draggedId, droppedId) {
    await fetch(API_URL + '/order', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draggedId, droppedId })
    });
}

export default {
    createPlace,
    updatePlace,
    deletePlace,
    getAllPlaces,
    deleteAllPlaces,
    reorder
};
