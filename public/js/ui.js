import { placesUpdateEvent } from './events';
import { createAndAppendElement } from './utils';

export class UI {
    constructor(api) {
        this.api = api;
        this.createInputElement = document.querySelector('.header__create__place-input');
        this.createButtonElement = document.querySelector('.header__create__create-button');
        this.mainPlacesElement = document.querySelector('.main__places');
        this.navRecycleElement = document.querySelector('.main__nav__recycle');
        this.navSearchElement = document.querySelector('.header__search-input');
        this.updateInProgress = false;
        this.filterIsVisited = document.querySelector('.main__nav__filters__visited');
        this.filterVisit = document.querySelector('.main__nav__filters__visit');
        this.filterAll = document.querySelector('.main__nav__filters__all');
        this.currentFilter = 'all';
    }

    bindEvent() {
        this.createButtonElement.addEventListener('click', () => {
            let name = this.createInputElement.value;
            if (name.length > 0) {
                this.api.create(name).then(() => {
                    this.mainPlacesElement.dispatchEvent(placesUpdateEvent);
                    this.createInputElement.value = '';
                }, console.error);
            }
        });

        this.navRecycleElement.addEventListener('click', () => {
            this.api.clear().then(() => {
                this.mainPlacesElement.dispatchEvent(placesUpdateEvent);
            }, console.error);
        });

        this.mainPlacesElement.addEventListener('places:update', () => {
            this.updatePlaces();
        });

        this.navSearchElement.addEventListener('input', () => {
            this.updatePlaces();
        });

        this.filterIsVisited.addEventListener('click', () => {
            this.currentFilter = 'visited';
            this.updatePlaces();
        });

        this.filterAll.addEventListener('click', () => {
            this.currentFilter = 'all';
            this.updatePlaces();
        });

        this.filterVisit.addEventListener('click', () => {
            this.currentFilter = 'visit';
            this.updatePlaces();
        });
    }

    clearPlaces() {
        while (this.mainPlacesElement.firstChild) {
            this.mainPlacesElement.removeChild(this.mainPlacesElement.firstChild);
        }
    }

    search(placesData, searchValue, currentFilter) {
        if (searchValue.length > 0) {
            placesData = placesData
                .filter(item => item.name.toLowerCase().indexOf(searchValue) !== -1);
        }
        if (currentFilter !== 'all') {
            const visited = currentFilter === 'visited';
            placesData = placesData.filter(item => item.visited === visited);
        }

        return placesData;
    }

    updatePlaces() {
        if (!this.updateInProgress) {
            this.updateInProgress = true;
            this.clearPlaces();
            this.api.list().then((response) => {
                let placesData = response;
                const searchValue = this.navSearchElement.value.toLowerCase();
                for (let placeData of this.search(placesData, searchValue, this.currentFilter)) {
                    const placeRootElement = createAndAppendElement(this.mainPlacesElement, 'div',
                        'main__places__instance');
                    createAndAppendElement(placeRootElement, 'div',
                        'main__places__instance__title', { html: placeData.name });
                    createAndAppendElement(placeRootElement, 'div',
                        'main__places__instance__priority up', { html: '&#8593;' });
                    createAndAppendElement(placeRootElement, 'div',
                        'main__places__instance__priority down', { html: '&#8595;' });
                    const visitedAttrs = {
                        type: 'checkbox',
                        name: 'places'
                    };
                    if (placeData.visited) {
                        visitedAttrs.checked = '';
                    }
                    const checkBoxElement = createAndAppendElement(placeRootElement, 'input',
                        'main__places__instance__select', {
                            attrs: visitedAttrs
                        });
                    checkBoxElement.addEventListener('click', (event) => {
                        const isVisited = event.target.checked;
                        this.api.setVisited(placeData.id, isVisited);
                    });
                }
            }, console.error)
                .finally(() => {
                    this.updateInProgress = false;
                });
        }
    }

    run() {
        this.bindEvent();
        this.updatePlaces();
    }
}
