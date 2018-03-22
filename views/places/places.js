/* eslint-env node, browser */
'use strict';

const { PlacesHeader } = require('./__header/places__header');
const { PlacesList } = require('./__list/places__list');

exports.Places = class {
    constructor() {
        this.placesArticle = document.createElement('article');
        this.placesArticle.classList.add('places');

        this.placesHeader = new PlacesHeader(this);
        this.placesList = new PlacesList(() => true);

        this.placesArticle.appendChild(this.placesHeader.element);
        this.placesArticle.appendChild(this.placesList.element);
    }

    get element() {
        return this.placesArticle;
    }

    set filterCondition(filterCondition) {
        this.placesList.filterCondition = filterCondition;
    }

    set afterDeleteAllHandler(afterDeleteAllHandler) {
        this.placesHeader.afterDeleteAllHandler = afterDeleteAllHandler;
    }

    set afterDeleteHandler(afterDeleteHandler) {
        this.placesList.afterDeleteHandler = afterDeleteHandler;
    }

    set moveUpHandler(moveUpHandler) {
        this.placesList.moveUpHandler = moveUpHandler;
    }

    set moveDownHandler(moveDownHandler) {
        this.placesList.moveDownHandler = moveDownHandler;
    }

    setPlaces(places) {
        this.placesHeader.allPlacesRadio.checked = true;
        this.filterCondition = () => true;
        this.placesList.clearAndAddPlaces(places);
    }

    setPlace(place) {
        this.placesList.addPlace(place);
    }

    rebuild() {
        this.placesList.rebuild();
    }
};
