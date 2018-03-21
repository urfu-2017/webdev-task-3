'use strict';

const baseUrl = 'http://localhost:8080';
let storage = [];

document.addEventListener('DOMContentLoaded', init);
let searchInput = document.getElementsByClassName('search__input')[0];
searchInput.addEventListener('input', searchEvent);
let createButton = document.getElementsByClassName('create__button')[0];
createButton.addEventListener('click', createPlace);
let clearButton = document.getElementsByClassName('clear-button')[0];
clearButton.addEventListener('click', clearPlaces);

async function init() {
    const response = await fetch('http://localhost:8080/places', {
        method: 'get'
    });
    const placesJSON = await response.json();
    console.info(placesJSON);
    placesJSON.forEach(place => addPlaceToPage(place));
}

function searchEvent() {
    let els = document.getElementsByClassName('places-item');
    [].forEach.call(els, function (elem) {
        const elemName = elem.getElementsByClassName('places-item__name')[0];
        const hidden = !elemName.value.includes(searchInput.value);
        elem.hidden = hidden;
    });
}

function addPlaceToPage(place) {
    storage.push(place);
    let htmlPlace = document.createElement('li');
    htmlPlace.classList.add('places-item');
    htmlPlace.setAttribute('visited', place.visited.toString());
    htmlPlace.appendChild(getEditButton(place), htmlPlace.childNodes[0]);
    htmlPlace.appendChild(getDeleteButton(place), htmlPlace.childNodes[0]);
    htmlPlace.appendChild(getItemName(place.description));
    htmlPlace.appendChild(getUpButton(place));
    htmlPlace.appendChild(getDownButton(place));
    htmlPlace.appendChild(getVisitedCheckbox(place));
    document.getElementsByClassName('places-list')[0].appendChild(htmlPlace);
    searchEvent();
}

function getEditButton(place) {
    let editButton = document.createElement('input');
    editButton.type = 'button';
    editButton.className = 'places-item__edit-button';
    editButton.value = 'Ред.';

    return editButton;
}

function getDeleteButton(place) {
    let deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.className = 'places-item__delete-button';
    deleteButton.value = 'Удалить';
    deleteButton.addEventListener('click', async function () {
        const response = await fetch(`${baseUrl}/places/${place.id}`, {
            method: 'delete',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        });
        if (response.ok) {
            const index = storage.findIndex(qwe => qwe.id === place.id);
            storage.splice(index, 1);
            deleteButton.parentElement.remove();
        }
    });

    return deleteButton;
}

function getItemName(description) {
    let itemName = document.createElement('input');
    itemName.type = 'text';
    itemName.className = 'places-item__name';
    itemName.value = description;
    itemName.setAttribute('disabled', 'disabled');

    return itemName;
}

function getUpButton(place) {
    let upButton = document.createElement('input');
    upButton.type = 'button';
    upButton.className = 'places-item__up-button';
    upButton.value = 'up';
    upButton.addEventListener('click', async function () {
        const currentPosition = storage.findIndex(qwe => qwe.id === place.id);
        const nextPosition = currentPosition - 1;
        const response = await fetch(`${baseUrl}/order/${place.id}/${nextPosition}`, {
            method: 'put'
        });
        if (response.ok) {
            const elementToMove = storage.splice(currentPosition, 1)[0];
            storage.splice(nextPosition, 0, elementToMove);
            let par = this.parentNode;
            par.parentNode.insertBefore(par, par.previousSibling);
        }
    });

    return upButton;
}

function getDownButton(place) {
    let downButton = document.createElement('input');
    downButton.type = 'button';
    downButton.className = 'places-item__down-button';
    downButton.value = 'down';
    downButton.addEventListener('click', async function () {
        const currentPosition = storage.findIndex(qwe => qwe.id === place.id);
        const nextPosition = currentPosition + 1;
        const response = await fetch(`${baseUrl}/order/${place.id}/${nextPosition}`, {
            method: 'put'
        });
        if (response.ok) {
            const elementToMove = storage.splice(currentPosition, 1)[0];
            storage.splice(nextPosition, 0, elementToMove);
            let par = this.parentNode;
            par.parentNode.insertBefore(par.nextSibling, par);
        }
    });

    return downButton;
}

function getVisitedCheckbox(place) {
    let visitedCheckbox = document.createElement('input');
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
    let description = document.getElementsByClassName('create__input')[0].value;
    const response = await fetch(`${baseUrl}/places`, {
        method: 'post',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ description })
    });
    const createdPlace = await response.json();
    console.info(createdPlace);
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
