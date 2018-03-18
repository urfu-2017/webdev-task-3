/* eslint-env node, browser */
'use strict';

require('./index.styl');

const Create = require('./create/create.js');
const Places = require('./places/places.js');
const Place = require('./place/place.js');
const Search = require('./search/search.js');

const createControl = new Create();
const placesControl = new Places();
const searchControl = new Search();

createControl.onClick = async () => {
    if (createControl.input.length && !/^\s+$/.test(createControl.input)) {
        const result = await createPlace(createControl.input);

        addPlace(result);
    }
};
placesControl.onClear = async () => {
    await fetch('http://localhost:2223/place/clear');
    placesControl.clear();
};

document.addEventListener('DOMContentLoaded', async () => {
    const places = await loadPlaces();

    places.forEach(addPlace);
    searchControl.onType = placesControl.filter.bind(placesControl);
    placesControl.onSwap = swapPlaces;

    createControl.enable();

});

function addPlace(place) {
    const placeControl = new Place(place);

    placeControl.onChange = visit.bind(null, placeControl);
    placeControl.onDelete = deletePlace.bind(null, placeControl);
    placeControl.onSave = editPlace.bind(null, placeControl);

    placesControl.add(placeControl);
}

async function swapPlaces(name1, name2) {
    const formData = {
        name1,
        name2
    };

    await fetch(
        `${window.apiUrl}place/swap`,
        {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
}

async function editPlace(control, oldName) {
    const formData = {
        find: {
            name: oldName
        },
        data: {
            name: control.name
        }
    };

    await fetch(
        `${window.apiUrl}place`,
        {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
}

async function deletePlace(control) {
    const formData = {
        name: control.name
    };

    await fetch(
        `${window.apiUrl}place`,
        {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(resp => resp.json())
        .then(placesControl.remove.bind(placesControl));
}

async function visit(control, checked) {
    const formData = {
        name: control.name
    };

    return fetch(
        `${window.apiUrl}place/${checked ? 'visit' : 'unVisit'}`,
        {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
}

function loadPlaces() {
    return fetch(`${window.apiUrl}place`)
        .then(response => response.json());
}

function createPlace(name) {
    const formData = {
        description: true,
        name
    };

    return fetch(
        `${window.apiUrl}place`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json());
}
