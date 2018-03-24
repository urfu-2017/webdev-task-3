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
        const placeBlock = new Place(place);
        placeBlock.afterDeleteHandler = this.afterDeleteHandler;
        placeBlock.moveUpHandler = this.moveUpHandler;
        placeBlock.moveDownHandler = this.moveDownHandler;

        this._setPlaceBlock(placeBlock);

        this.settedPlaces.push(placeBlock);
    }

    _setPlaceBlock(placeBlock) {
        if (this.filterCondition(placeBlock.place)) {
            this.placesList.appendChild(placeBlock.element);
        }
    }

    rebuild() {
        this._removePlaces();
        this.settedPlaces.forEach(placeBlock => {
            this._setPlaceBlock(placeBlock);
        });
    }

    _removePlaces() {
        while (this.placesList.firstChild) {
            this.placesList.removeChild(this.placesList.firstChild);
        }
    }
};
