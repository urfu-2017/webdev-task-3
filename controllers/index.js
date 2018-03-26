'use strict';

var Place = require('../model/place');
var PlacesList = require('../model/PlacesList');
var globalPlacesList = new PlacesList();


var places = document.getElementsByClassName('places')[0];

document.addEventListener('DOMContentLoaded', loadingPlacesList);
var search = document.getElementsByClassName('search')[0];
search.addEventListener('input', placesSearch);

var button = document.getElementsByClassName('place-creater__button')[0];
button.addEventListener('click', onClickAddPlace);

var basket = document.getElementsByClassName('basket__img')[0];
basket.addEventListener('click', onClickDelitedAll);

var visitedPlaces = document.getElementsByClassName('tabs__input_vizited-places')[0];
visitedPlaces.addEventListener('click', onClickVisited);

var unvisitedPlaces = document.getElementsByClassName('tabs__input_unvizited-places')[0];
unvisitedPlaces.addEventListener('click', onClickUnvisited);

var allPlaces = document.getElementsByClassName('tabs__input_all-places')[0];
allPlaces.addEventListener('click', onClickAllPlaces);


async function loadingPlacesList() {
    var placesList = await Place.getPlacesList();
    placesList.forEach(place => {
        globalPlacesList.add(place);
        renderingPlace(place);
    });
}

async function onClickAddPlace() {
    var input = document.getElementsByClassName('place-creater__input')[0];
    var placeName = input.value;
    if (placeName && !globalPlacesList.contains(placeName)) {
        var place = await Place.create(placeName);
        globalPlacesList.add(place);
        renderingPlace(place);
    } else {
        input.focus();
    }
}

function placesSearch() {
    var name = search.value;
    findByName(name);
}

function onClickVisited() {
    var placesList = globalPlacesList.getVisited();
    renderingPlaces(placesList);
}

function onClickUnvisited() {
    var placesList = globalPlacesList.getUnvisited();
    renderingPlaces(placesList);
}

function onClickAllPlaces() {
    var placesList = globalPlacesList.getAll();
    renderingPlaces(placesList);
}

function renderingPlaces(placesList) {
    places.innerHTML = '';
    placesList.forEach(place => {
        renderingPlace(place);
    });
}

function renderingPlace(place) {
    var checked = place.checked ? 'checked' : '';
    var article = createArticle(place.name, checked);
    places.appendChild(article);
    addDeletedControl(place, article);
    addVisitedControl(place, article);
    addEditingControl(place, article);
    addDisplacementControll(place, article);
}

function createArticle(name, checked) {
    var article = document.createElement('article');
    article.setAttribute('class', 'places__item');
    article.innerHTML = `<div class="places__control control">
            <div class="control__imgs">
                <img src="imgs/editing.png" 
                    alt="Изображение карандаша" class="places__editing-control"> 
                <img src="imgs/basket.png" 
                    alt="Изображение корзины" class="places__deleting-control">
            </div>
            <p class="control__text">${name}</p>
        </div>
        <div class=" places__control places__changes-control control_hidden">
            <input type="text" value=${name} class="control__text">
            <span class="save"> &#10004; </span>
            <span class="close"> &#10008; </span>
        </div>
        <div class="places__control">
            <p class="places__moving-control">
                <span class="place__arow_bottom place__arow"> &#11015; </span>
                <span class="place__arow_top place__arow"> &#11014; </span>
            </p>
            <input type="checkbox" class="places__checked-control" ${checked}>
        </div>
    `;

    return article;
}

function addDeletedControl(place, article) {
    var control = article.getElementsByClassName('places__deleting-control')[0];
    control.addEventListener('click', async () => {
        if (await place.isDeleted()) {
            globalPlacesList.delete(place);
            places.removeChild(article);
        }
    });
}

function addVisitedControl(place, article) {
    var control = article.lastElementChild.lastElementChild;
    var text = article.getElementsByClassName('control__text')[0];
    text.style.textDecoration = control.checked ? 'line-through' : 'none';
    control.addEventListener('change', () => {
        place.changeVisit();
        text.style.textDecoration = control.checked ? 'line-through' : 'none';
    });
}

function addEditingControl(place, article) {
    var editingControl = article.getElementsByClassName('places__editing-control')[0];
    editingControl.addEventListener('click', () => {
        var control = article.getElementsByClassName('control')[0];
        control.classList.add('control_hidden');
        var changesControl = article.getElementsByClassName('places__changes-control')[0];
        changesControl.classList.remove('control_hidden');
        addRevokingChangesControl(changesControl);
        addSavingChangesControl(place, changesControl);
    });
}

function addDisplacementControll(place, article) {
    var bottomControl = article.getElementsByClassName('place__arow_bottom')[0];
    var topControl = article.getElementsByClassName('place__arow_top')[0];
    var index = globalPlacesList.getIndex(place);

    bottomControl.addEventListener('click', () => {
        var neighborIndex = index++;
        globalPlacesList.swap(index, neighborIndex);
        renderingPlaces(globalPlacesList.getAll());
    });

    topControl.addEventListener('click', () => {
        var neighborIndex = index--;
        globalPlacesList.swap(index, neighborIndex);
        renderingPlaces(globalPlacesList.getAll());
    });
}

function addSavingChangesControl(place, changesControl) {
    var control = changesControl.getElementsByClassName('save')[0];
    control.addEventListener('click', () => {
        var description = changesControl.getElementsByClassName('control__text')[0].value;
        changesControl.previousElementSibling.classList.remove('control_hidden');
        changesControl.classList.add('control_hidden');
        place.changeDescription(description);
    });
}

function addRevokingChangesControl(changesControl) {
    var control = changesControl.getElementsByClassName('close')[0];
    control.addEventListener('click', () => {
        changesControl.previousElementSibling.classList.remove('control_hidden');
        changesControl.classList.add('control_hidden');
    });
}

function findByName(name) {
    var placesList = [...places.children];
    placesList.forEach(place => {
        var textControl = place.getElementsByClassName('control__text')[0];
        place.style.display = !textControl.textContent.includes(name) ? 'none' : 'flex';
    });
}

function onClickDelitedAll() {
    if (Place.isdeleteAll()) {
        globalPlacesList.deleteAll();
        renderingPlaces([]);
    }
}


