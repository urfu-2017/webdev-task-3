/* eslint-env node, browser */
'use strict';

const headerInner = require('./places__header.html');
const { apiUrl } = require('../../../config/api');

exports.PlacesHeader = class {
    constructor(placesBlock) {
        this.placesBlock = placesBlock;
        this.afterDeleteAllHandler = null;

        this.header = document.createElement('header');
        this.header.classList.add('places__header');
        this.header.innerHTML = headerInner;

        this._init();

        this._setupDeleteControl();
        this._setupAllPlacesRadio();
        this._setupNotVisitedRadio();
        this._setupVisitedRadio();
    }

    get element() {
        return this.header;
    }

    _init() {
        this.headerText = this.header.querySelector('.places__header-text');
        this.deleteControl = this.header.querySelector('.places__header-delete-control');
        this.allPlacesRadio = this.header.querySelector('.places__all-places-radio');
        this.notVisitedRadio = this.header.querySelector('.places__not-visited-radio');
        this.visitedRadio = this.header.querySelector('.places__visited-radio');
    }

    _setupDeleteControl() {
        this.deleteControl.onclick = () => {
            const options = {
                method: 'DELETE'
            };

            fetch(`${apiUrl}`, options)
                .then((response) => {
                    if (response.ok) {
                        this.afterDeleteAllHandler();
                    }
                });
        };
    }

    _setupAllPlacesRadio() {
        this.allPlacesRadio.onclick = () => {
            this.placesBlock.filterCondition = () => true;
            this.placesBlock.rebuild();
        };
    }

    _setupNotVisitedRadio() {
        this.notVisitedRadio.onclick = () => {
            this.placesBlock.filterCondition = (place) => place.isVisited === false;
            this.placesBlock.rebuild();
        };
    }

    _setupVisitedRadio() {
        this.visitedRadio.onclick = () => {
            this.placesBlock.filterCondition = (place) => place.isVisited === true;
            this.placesBlock.rebuild();
        };
    }
};
