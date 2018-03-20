'use strict';

let storage = [];

document.addEventListener('DOMContentLoaded', init);
let createButton = document.getElementsByClassName('create__button')[0];
createButton.addEventListener('click', createPlace);

async function init() {
    const response = await fetch('http://localhost:8080/places', {
        method: 'get'
    });
    const placesJSON = await response.json();
    console.info(placesJSON);
    placesJSON.forEach(place => addPlaceToPage(place));
}

function addPlaceToPage(place) {
    storage.push(place);
    let htmlPlace = document.createElement('li');
    let wq =
        `<input type="text" class="places-item__name" value="${place.description}" disabled>
        <input type="button" class="places-item__up-button" value="up">
        <input type="button" class="places-item__down-button" value="down">
        <input type="checkbox" name="places-item__visited" id="">`;
    htmlPlace.classList.add('places-item');
    htmlPlace.innerHTML += wq;
    let list = document.getElementsByClassName('places-list')[0];
    list.appendChild(htmlPlace);
}

async function createPlace() {
    let description = document.getElementsByClassName('create__input')[0].value;
    const data = {
        description
    };
    const response = await fetch('http://localhost:8080/places', {
        method: 'post',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(data)
    });
    const createdPlace = await response.json();
    console.info(createdPlace);
    addPlaceToPage(createdPlace);
}
