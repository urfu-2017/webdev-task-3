/* eslint-env node, browser */
'use strict';

const { apiUrl } = require('../config/api');

const { AddForm } = require('./add-form/add-form');
const { SearchForm } = require('./search-form/search-form');
const { Places } = require('./places/places');
const { Footer } = require('./footer/footer');

const addForm = new AddForm();
const searchForm = new SearchForm();
const places = new Places();
const footer = new Footer();

addForm.placeHandler = handlePlaceFromAddForm;

searchForm.placesHandler = handlePlacesFromSearchForm;

places.afterDeleteAllHandler = afterDeleteAllHandler;
places.afterDeleteHandler = afterDeleteHandler;
places.moveUpHandler = moveHandler.bind(null, -1);
places.moveDownHandler = moveHandler.bind(null, 1);


document.addEventListener('DOMContentLoaded', async () => {
    const body = document.querySelector('body');

    const allPlaces = await fetch(apiUrl)
        .then(response => response.json());

    searchForm.allPlaces = allPlaces;

    places.setPlaces(allPlaces);

    body.appendChild(addForm.element);
    body.appendChild(searchForm.element);
    body.appendChild(places.element);
    body.appendChild(footer.element);
});

function handlePlacesFromSearchForm(findedPlaces) {
    places.setPlaces(findedPlaces);
}

function handlePlaceFromAddForm(place) {
    places.setPlace(place);
    searchForm.allPlaces.push(place);
}

function afterDeleteAllHandler() {
    searchForm.allPlaces = [];
    places.setPlaces(searchForm.allPlaces);
}

function afterDeleteHandler(deletedElement) {
    const index = searchForm.allPlaces.indexOf(deletedElement);
    searchForm.allPlaces.splice(index, 1);
}

function moveHandler(offset, place) {
    const index = searchForm.allPlaces.indexOf(place);

    const options = {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ indexNumber: (index + 1) + offset })
    };

    return fetch(`${apiUrl}/${place.id}`, options)
        .then(() => swap(searchForm.allPlaces, index, index + offset));
}

function swap(array, index1, index2) {
    const temp = array[index2];
    array[index2] = array[index1];
    array[index1] = temp;
}
