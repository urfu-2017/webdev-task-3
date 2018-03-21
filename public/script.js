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

async function loadData() {
    const response = await fetch(`${baseUrl}/places`, {
        method: 'get'
    });
    const placesJSON = await response.json();
    placesJSON.forEach(place => addPlaceToPage(place));
}

function searchEvent() {
    const places = document.getElementsByClassName('places-item');
    [].forEach.call(places, function (place) {
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
    htmlPlace.appendChild(getEditButton(), htmlPlace.childNodes[0]);
    htmlPlace.appendChild(getDeleteButton(place), htmlPlace.childNodes[0]);
    htmlPlace.appendChild(getPlaceName(place.description));
    htmlPlace.appendChild(getSaveButton(place));
    htmlPlace.appendChild(getCancelButton());
    htmlPlace.appendChild(getUpButton(place));
    htmlPlace.appendChild(getDownButton(place));
    htmlPlace.appendChild(getVisitedCheckbox(place));
    document.getElementsByClassName('places-list')[0].appendChild(htmlPlace);
    searchEvent();
}

function getEditButton() {
    const editButton = document.createElement('input');
    editButton.type = 'button';
    editButton.className = 'places-item__edit-button';
    editButton.value = '✎';
    editButton.addEventListener('click', function () {
        const input = this.parentNode.getElementsByClassName('places-item__name')[0];
        input.defaultValue = input.value;
        input.disabled = false;
        input.focus();
        this.parentNode.getElementsByClassName('places-item__save-button')[0]
            .style.visibility = 'visible';
        this.parentNode.getElementsByClassName('places-item__cancel-button')[0]
            .style.visibility = 'visible';
    });

    return editButton;
}

function getDeleteButton(place) {
    const deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.className = 'places-item__delete-button';
    deleteButton.value = '❌';
    deleteButton.addEventListener('click', async function () {
        const response = await fetch(`${baseUrl}/places/${place.id}`, {
            method: 'delete',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        });
        if (response.ok) {
            const index = storage.findIndex(_place => _place.id === place.id);
            storage.splice(index, 1);
            deleteButton.parentElement.remove();
        }
    });

    return deleteButton;
}

function getPlaceName(description) {
    const placeName = document.createElement('input');
    placeName.type = 'text';
    placeName.className = 'places-item__name';
    placeName.value = description;
    placeName.disabled = true;

    return placeName;
}

function getSaveButton(place) {
    const saveButton = document.createElement('input');
    saveButton.type = 'button';
    saveButton.className = 'places-item__save-button';
    saveButton.value = '✓';
    saveButton.style.visibility = 'hidden';
    saveButton.addEventListener('click', async function () {
        const input = this.parentNode.getElementsByClassName('places-item__name')[0];
        input.disabled = true;
        input.defaultValue = input.value;
        this.style.visibility = 'hidden';
        this.nextSibling.style.visibility = 'hidden';
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
    const cancelButton = document.createElement('input');
    cancelButton.type = 'button';
    cancelButton.className = 'places-item__cancel-button';
    cancelButton.value = '✗';
    cancelButton.style.visibility = 'hidden';
    cancelButton.addEventListener('click', function () {
        const input = this.parentNode.getElementsByClassName('places-item__name')[0];
        input.disabled = true;
        input.value = input.defaultValue;
        this.style.visibility = 'hidden';
        this.previousSibling.style.visibility = 'hidden';
    });

    return cancelButton;
}

function getUpButton(place) {
    const upButton = document.createElement('input');
    upButton.type = 'button';
    upButton.className = 'places-item__up-button';
    upButton.value = '↑';
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
    const downButton = document.createElement('input');
    downButton.type = 'button';
    downButton.className = 'places-item__down-button';
    downButton.value = '↓';
    downButton.addEventListener('click', async function () {
        const currentPosition = storage.findIndex(_place => _place.id === place.id);
        const nextPosition = currentPosition + 1;
        const response = await fetch(`${baseUrl}/order/${place.id}/${nextPosition}`, {
            method: 'put'
        });
        if (response.ok) {
            const elementToMove = storage.splice(currentPosition, 1)[0];
            storage.splice(nextPosition, 0, elementToMove);
            const par = this.parentNode;
            par.parentNode.insertBefore(par.nextSibling, par);
        }
    });

    return downButton;
}

function getVisitedCheckbox(place) {
    const visitedCheckbox = document.createElement('input');
    visitedCheckbox.type = 'checkbox';
    visitedCheckbox.className = 'places-item__visited';
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
