'use strict';
/*  eslint-disable no-invalid-this  */
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
    const response = await fetch(`${baseUrl}/places`, {
        method: 'get'
    });
    const placesJSON = await response.json();
    placesJSON.forEach(place => addPlaceToPage(place));
}

function searchEvent() {
    Array.from(document.getElementsByClassName('places-item'))
        .forEach(place => {
            const elemName = place.getElementsByClassName('places-item__name')[0];
            const hidden = !elemName.value.includes(searchInput.value);
            place.hidden = hidden;
        });
}

function addPlaceToPage(place) {
    storage.push(place);
    const htmlPlace = document.createElement('li');
    htmlPlace.classList.add('places-item');
    htmlPlace.setAttribute('visited', place.visited.toString());
    htmlPlace.appendChild(getEditButton());
    htmlPlace.appendChild(getDeleteButton(place));
    htmlPlace.appendChild(getPlaceName(place));
    htmlPlace.appendChild(getSaveButton(place));
    htmlPlace.appendChild(getCancelButton());
    htmlPlace.appendChild(getUpButton(place));
    htmlPlace.appendChild(getDownButton(place));
    htmlPlace.appendChild(getVisitedCheckbox(place));
    placesList.appendChild(htmlPlace);
    searchEvent();
}

function getEditButton() {
    const editButton = document.querySelector('.places-item__edit-button').cloneNode(false);
    editButton.addEventListener('click', function () {
        const input = this.parentNode.getElementsByClassName('places-item__name')[0];
        input.defaultValue = input.value;
        input.disabled = false;
        input.focus();
        this.parentNode.getElementsByClassName('places-item__save-button')[0]
            .classList.remove('hidden');
        this.parentNode.getElementsByClassName('places-item__cancel-button')[0]
            .classList.remove('hidden');
    });

    return editButton;
}

function getDeleteButton(place) {
    const deleteButton = document.querySelector('.places-item__delete-button').cloneNode(false);
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

    return deleteButton;
}

function getPlaceName(place) {
    const placeName = document.querySelector('.places-item__name').cloneNode(false);
    placeName.value = place.description;

    return placeName;
}

function getSaveButton(place) {
    const saveButton = document.querySelector('.places-item__save-button').cloneNode(false);
    saveButton.addEventListener('click', async function () {
        const input = this.parentNode.getElementsByClassName('places-item__name')[0];
        input.disabled = true;
        input.defaultValue = input.value;
        this.classList.add('hidden');
        this.nextSibling.classList.add('hidden');
        const response = await fetch(`${baseUrl}/places/${place.id}?description=${input.value}`, {
            method: 'PATCH'
        });
        if (response.ok) {
            place.description = input.value;
        }
    });

    return saveButton;
}

function getCancelButton() {
    const cancelButton = document.querySelector('.places-item__cancel-button').cloneNode(false);
    cancelButton.addEventListener('click', function () {
        const input = this.parentNode.getElementsByClassName('places-item__name')[0];
        input.disabled = true;
        input.value = input.defaultValue;
        this.classList.add('hidden');
        this.previousSibling.classList.add('hidden');
    });

    return cancelButton;
}

function getUpButton(place) {
    const upButton = document.querySelector('.places-item__up-button').cloneNode(false);
    upButton.addEventListener('click', async function () {
        const currentPosition = storage.findIndex(_place => _place.id === place.id);
        const nextPosition = currentPosition - 1;
        const response = await fetch(`${baseUrl}/order/${place.id}/${nextPosition}`, {
            method: 'put'
        });
        if (response.ok) {
            const elementToMove = storage.splice(currentPosition, 1)[0];
            storage.splice(nextPosition, 0, elementToMove);
            const parentNode = this.parentNode;
            parentNode.parentNode.insertBefore(parentNode, parentNode.previousSibling);
        }
    });

    return upButton;
}

function getDownButton(place) {
    const downButton = document.querySelector('.places-item__down-button').cloneNode(false);
    downButton.addEventListener('click', async function () {
        const currentPosition = storage.findIndex(_place => _place.id === place.id);
        const nextPosition = currentPosition + 1;
        const response = await fetch(`${baseUrl}/order/${place.id}/${nextPosition}`, {
            method: 'put'
        });
        if (response.ok) {
            const elementToMove = storage.splice(currentPosition, 1)[0];
            storage.splice(nextPosition, 0, elementToMove);
            const parentNode = this.parentNode;
            parentNode.parentNode.insertBefore(parentNode.nextSibling, parentNode);
        }
    });

    return downButton;
}

function getVisitedCheckbox(place) {
    const visitedCheckbox = document.querySelector('.places-item__visited').cloneNode(false);
    visitedCheckbox.checked = place.visited;
    visitedCheckbox.addEventListener('click', async function () {
        const method = this.checked ? 'put' : 'delete';
        const response = await fetch(`${baseUrl}/places/${place.id}/visited`, {
            method,
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        });
        if (response.ok) {
            place.visited = !place.visited;
            this.parentElement.setAttribute('visited', place.visited.toString());
        }
    });

    return visitedCheckbox;
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
    const response = await fetch(`${baseUrl}/places`, {
        method: 'delete'
    });
    if (response.ok) {
        storage = [];
        document.getElementsByClassName('places-list')[0].innerHTML = '';
    }
}
