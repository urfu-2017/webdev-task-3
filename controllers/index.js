'use strict';

const Place = require('../model/place');
const PlacesList = require('../model/placesList');

const PlaceView = require('../views/place');

const places = new PlacesList();

const placesElement = document.getElementsByClassName('places')[0];
document.addEventListener('DOMContentLoaded', loadPlacesList);

const search = document.getElementsByClassName('search')[0];
search.addEventListener('input', searchPlaces);

const button = document.getElementsByClassName('create')[0];
button.addEventListener('click', handleAddPlace);

const basket = document.getElementsByClassName('delete-All')[0];
basket.addEventListener('click', handleDeletedAll);

const visitedPlaces = document.getElementsByClassName('vizited-places')[0];
visitedPlaces.addEventListener('click', handleVisited);

const unvisitedPlaces = document.getElementsByClassName('unvizited-places')[0];
unvisitedPlaces.addEventListener('click', handleUnvisited);

const allPlaces = document.getElementsByClassName('all-places')[0];
allPlaces.addEventListener('click', handleAllPlaces);

const input = document.getElementsByClassName('place')[0];

async function loadPlacesList() {
    const placesList = await Place.getPlacesList();
    placesList.forEach(place => {
        places.add(place);
        renderPlace(place);
    });
}

async function handleAddPlace() {
    const placeName = input.value;
    if (placeName && !places.contains(placeName)) {
        const place = await Place.create(placeName);
        places.add(place);
        renderPlace(place);
    } else {
        input.focus();
    }
}

function searchPlaces() {
    const name = search.value;
    findByName(name);
}

function handleVisited() {
    const placesList = places.visited;
    renderPlaces(placesList);
}

function handleUnvisited() {
    const placesList = places.unvisited;
    renderPlaces(placesList);
}

function handleAllPlaces() {
    const placesList = places.getAll();
    renderPlaces(placesList);
}

function renderPlaces(placesList) {
    placesElement.innerHTML = '';
    placesList.forEach(renderPlace);
}

function renderPlace(place) {
    place.view = new PlaceView();
    place.view.createArticle(place.name, place.description, place.checked);
    addDeletedControl(place);
    addVisitedControl(place);
    addEditingControl(place);
    addDisplacementControll(place);

    placesElement.appendChild(place.view.htmlElement);
}

function addDeletedControl(place) {
    const control = place.view.getDeletedControl();
    control.addEventListener('click', async () => {
        if (await place.delete()) {
            places.delete(places);
            placesElement.removeChild(place.view.htmlElement);
        }
    });
}

function addVisitedControl(place) {
    const control = place.view.getVisitedControl();
    place.view.setTextStyle(control.checked);
    control.addEventListener('change', () => {
        place.changeVisit();
        place.view.setTextStyle(control.checked);
    });
}

function addEditingControl(place) {
    place.view.createEditingControl();
    let control = place.view.getSaveControl();
    control.addEventListener('click', () => {
        const changesControl = place.view.getChangesControl();
        const description = place.view.getDescription();
        place.view.hideElement(changesControl.previousElementSibling);
        place.view.showElement(changesControl);
        place.changeDescription(description);
    });
}

function addDisplacementControll(place) {
    const bottomControl = place.view.getBottomControl();
    const topControl = place.view.getTopControl();
    let index = places.indexOf(place);

    bottomControl.addEventListener('click', () => {
        const neighborIndex = index++;
        places.swap(index, neighborIndex);
        renderPlaces(places.getAll());
    });

    topControl.addEventListener('click', () => {
        const neighborIndex = index--;
        places.swap(index, neighborIndex);
        renderPlaces(places.getAll());
    });
}

function findByName(name) {
    const placesList = [...placesElement.children];
    placesList.forEach(place => {
        const textControl = place.getElementsByClassName('text')[0];
        place.style.display = !textControl.textContent.includes(name) ? 'none' : 'flex';
    });
}

function handleDeletedAll() {
    if (Place.deleteAll()) {
        places.deleteAll();
        renderPlaces([]);
    }
}
