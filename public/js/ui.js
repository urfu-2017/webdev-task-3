import { placesUpdateEvent } from './events';
import { createAndAppendElement } from './utils';

export class UI {
    constructor(api) {
        this.api = api;
        this.createInputElement = document.querySelector('.header__create__place-input');
        this.createButtonElement = document.querySelector('.header__create__create-button');
        this.mainPlacesElement = document.querySelector('.main__places');
        this.navRecycleElement = document.querySelector('.main__nav__recycle');
    }

    bindEvent() {
        this.createButtonElement.addEventListener('click', () => {
            let name = this.createInputElement.value;
            if (name.length > 0) {
                this.api.create(name).then(() => {
                    this.mainPlacesElement.dispatchEvent(placesUpdateEvent);
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
    }

    updatePlaces() {
        while (this.mainPlacesElement.firstChild) {
            this.mainPlacesElement.removeChild(this.mainPlacesElement.firstChild);
        }
        this.api.list().then((response) => {
            let placesData = response;
            for (let placeData of placesData) {
                const placeRootElement = createAndAppendElement(this.mainPlacesElement, 'div',
                    'main__places__instance');
                createAndAppendElement(placeRootElement, 'div', 'main__places__instance__title', {
                    html: placeData.name
                });
                createAndAppendElement(placeRootElement, 'div',
                    'main__places__instance__priority up', { html: 'u' });
                createAndAppendElement(placeRootElement, 'div',
                    'main__places__instance__priority down', { html: 'd' });
                createAndAppendElement(placeRootElement, 'input',
                    'main__places__instance__select', {
                        attrs: {
                            type: 'checkbox',
                            name: 'places'
                        }
                    });
            }
        }, console.error);
    }

    run() {
        this.bindEvent();
        this.updatePlaces();
    }
}
