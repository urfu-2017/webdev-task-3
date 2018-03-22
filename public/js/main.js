'use strict';
let placesUpdateEvent = new Event('places:update');

class UI {
    constructor (api) {
        this.api = api;
        this.createInputElement = document.querySelector(".header__create__place-input");
        this.createButtonElement = document.querySelector(".header__create__create-button");
        this.mainPlacesElement = document.querySelector(".main__places");
        this.navRecycleElement = document.querySelector(".main__nav__recycle");

        this.bindEvent();
        this.updatePlaces();
    }

    bindEvent () {
        this.createButtonElement.addEventListener('click', (e) => {
            let name = this.createInputElement.value;
            if (name.length > 0) {
                this.api.create(name).then((response) => {
                    this.mainPlacesElement.dispatchEvent(placesUpdateEvent);
                }, console.error);
            }
        });

        this.navRecycleElement.addEventListener('click', (e) => {
            this.api.clear().then((response) => {
                this.mainPlacesElement.dispatchEvent(placesUpdateEvent);
            }, console.error);
        });

        this.mainPlacesElement.addEventListener('places:update', (e) => {
            this.updatePlaces();
        });
    }

    updatePlaces () {
        while(this.mainPlacesElement.firstChild) {
            this.mainPlacesElement.removeChild(this.mainPlacesElement.firstChild);
        }
        this.api.list().then((response) => {
            let placesData = response;
            for (let placeData of placesData) {
                let placeRootElement = document.createElement('div');
                placeRootElement.className = 'main__places__instance';

                let placeNameElement = document.createElement('div');
                placeNameElement.className = 'main__places__instance__title';
                placeNameElement.innerHTML = placeData.name;
                placeRootElement.appendChild(placeNameElement);

                let placePriorityUpElement = document.createElement('div');
                placePriorityUpElement.className = 'main__places__instance__priority up';
                placePriorityUpElement.innerHTML = 'u';
                placeRootElement.appendChild(placePriorityUpElement);

                let placePriorityDownElement = document.createElement('div');
                placePriorityDownElement.className = 'main__places_instance__priority down';
                placePriorityDownElement.innerHTML = 'd';
                placeRootElement.appendChild(placePriorityDownElement);

                let placeInputSelectElement = document.createElement('input');
                placeInputSelectElement.setAttribute('type', 'radio');
                placeInputSelectElement.setAttribute('name', "place");
                placeInputSelectElement.className = "main__places__instance__select";
                placeRootElement.appendChild(placeInputSelectElement);
                this.mainPlacesElement.appendChild(placeRootElement);
            }
        }, console.error);
    }
}

function main() {
    let api = new PlacesAPI(API_URL);
    let ui = new UI(api);
}

main();