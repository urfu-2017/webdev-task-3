'use strict';
/*  eslint-disable no-invalid-this  */
/*  eslint-disable max-statements */
const baseUrl = 'https://webdev-task-2-plbqdvszqj.now.sh';
let storage = [];

document.addEventListener('DOMContentLoaded', loadData);
const searchInput = document.getElementsByClassName('search__input')[0];
searchInput.addEventListener('input', searchEvent);
const createButton = document.getElementsByClassName('create__button')[0];
createButton.addEventListener('click', createPlace);
const clearButton = document.getElementsByClassName('clear-button')[0];
clearButton.addEventListener('click', clearPlaces);
const placesList = document.getElementsByClassName('places-list')[0];

async function loadData() {
    const response = await fetch(`${baseUrl}/places`, { method: 'get' });
    const placesJSON = await response.json();
    placesJSON.forEach(place => addPlaceToPage(place));
}

function searchEvent() {
    Array.from(document.getElementsByClassName('places-item'))
        .forEach(place => {
            const placeName = place.getElementsByClassName('places-item__name')[0];
            place.hidden = !placeName.value.includes(searchInput.value);
        });
}

function addPlaceToPage(place) {
    storage.push(place);

    const placeItem = document.querySelector('.places-item').cloneNode(true);
    placeItem.setAttribute('visited', place.visited.toString());
    const editButton = placeItem.querySelector('.places-item__edit-button');
    const deleteButton = placeItem.querySelector('.places-item__delete-button');
    const placeName = placeItem.querySelector('.places-item__name');
    placeName.value = place.description;
    const saveButton = placeItem.querySelector('.places-item__save-button');
    const cancelButton = placeItem.querySelector('.places-item__cancel-button');
    const upButton = placeItem.querySelector('.places-item__up-button');
    const downButton = placeItem.querySelector('.places-item__down-button');
    const visitedCheckbox = placeItem.querySelector('.places-item__visited');
    visitedCheckbox.checked = place.visited;

    editButton.addEventListener('click', function () {
        placeName.defaultValue = placeName.value;
        placeName.disabled = false;
        placeName.focus();
        saveButton.classList.remove('hidden');
        cancelButton.classList.remove('hidden');
    });
    deleteButton.addEventListener('click', async function () {
        const response = await fetch(`${baseUrl}/places/${place.id}`, {
            method: 'delete',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        });
        if (response.ok) {
            storage = storage.filter(_place => _place.id !== place.id);
            deleteButton.parentElement.remove();
        }
    });
    saveButton.addEventListener('click', async function () {
        placeName.disabled = true;
        placeName.defaultValue = placeName.value;
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');
        const response = await fetch(`${baseUrl}/places/${place.id}?description=${placeName.value}`,
            { method: 'PATCH' });
        if (response.ok) {
            place.description = placeName.value;
        }
    });
    cancelButton.addEventListener('click', function () {
        placeName.disabled = true;
        placeName.value = placeName.defaultValue;
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');
    });
    upButton.addEventListener('click', async function () {
        const currentPosition = storage.findIndex(_place => _place.id === place.id);
        const nextPosition = currentPosition - 1;
        const response = await fetch(`${baseUrl}/order/${place.id}/${nextPosition}`,
            { method: 'put' });
        if (response.ok) {
            const elementToMove = storage.splice(currentPosition, 1)[0];
            storage.splice(nextPosition, 0, elementToMove);
            placeItem.parentNode.insertBefore(placeItem, placeItem.previousSibling);
        }
    });
    downButton.addEventListener('click', async function () {
        const currentPosition = storage.findIndex(_place => _place.id === place.id);
        const nextPosition = currentPosition + 1;
        const response = await fetch(`${baseUrl}/order/${place.id}/${nextPosition}`,
            { method: 'put' });
        if (response.ok) {
            const elementToMove = storage.splice(currentPosition, 1)[0];
            storage.splice(nextPosition, 0, elementToMove);
            placeItem.parentNode.insertBefore(placeItem.nextSibling, placeItem);
        }
    });
    visitedCheckbox.addEventListener('click', async function () {
        const method = visitedCheckbox.checked ? 'put' : 'delete';
        const response = await fetch(`${baseUrl}/places/${place.id}/visited`, {
            method,
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        });
        if (response.ok) {
            place.visited = !place.visited;
            placeItem.setAttribute('visited', place.visited.toString());
        }
    });

    placesList.appendChild(placeItem);
    searchEvent();
}

async function createPlace() {
    const description = document.getElementsByClassName('create__input')[0].value;
    const response = await fetch(`${baseUrl}/places`, {
        method: 'post',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ description })
    });
    const createdPlace = await response.json();
    addPlaceToPage(createdPlace);
}

async function clearPlaces() {
    const response = await fetch(`${baseUrl}/places`, { method: 'delete' });
    if (response.ok) {
        storage = [];
        document.getElementsByClassName('places-list')[0].innerHTML = '';
    }
}
