/* eslint-env node, browser */
'use strict';

const { Place } = require('../__place/places__place');

exports.PlacesList = class {
    constructor(filterCondition) {
        this.settedPlaces = [];
        this.filterCondition = filterCondition;
        this.afterDeleteHandler = null;
        this.moveUpHandler = null;
        this.moveDownHandler = null;

        this.placesList = document.createElement('section');
        this.placesList.classList.add('places__list');
    }

    get element() {
        return this.placesList;
    }

    addPlaces(places) {
        places.forEach(place => {
            this.addPlace(place);
        });
    }

    clearAndAddPlaces(places) {
        this.settedPlaces = [];
        this._removePlaces();
        this.addPlaces(places);
    }

    addPlace(place) {
        this._setPlace(place);
        this.settedPlaces.push(place);
    }

    _setPlace(place) {
        if (this.filterCondition(place)) {
            const placeBlock = new Place(place);
            const placeDiv = placeBlock.element;
            placeBlock.afterDeleteHandler = this.afterDeleteHandler;
            placeBlock.moveUpHandler = this.moveUpHandler;
            placeBlock.moveDownHandler = this.moveDownHandler;
            this.placesList.appendChild(placeDiv);
        }
    }

    rebuild() {
        this._removePlaces();
        this.settedPlaces.forEach(place => {
            this._setPlace(place);
        });
    }

    _removePlaces() {
        while (this.placesList.firstChild) {
            this.placesList.removeChild(this.placesList.firstChild);
        }
    }
};
