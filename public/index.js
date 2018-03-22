'use strict';

const URL = 'https://webdev-task-2-ijodxhwsqn.now.sh/places';

class Place {
    constructor({ id, name, visited }) {
        this.id = id;
        this.name = name;
        this.visited = visited;
        this._createElement();
    }

    _createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('place');
        this.element.innerHTML = `
        <div class="place-name">${this.name}</div>
        <div class="place-buttons">
            <button class="place-buttons__up">
            </button>
            <button class="place-buttons__down">
            </button>
        </div>
        <input class="place-visited" type="checkbox">`;
        this.element.querySelector('.place-visited').checked = this.visited;
    }
}


class Places {
    constructor() {
        this.places = [];
        this.placesElement = document.querySelector('.places');
    }

    async loadPlaces() {
        const res = await fetch(URL);
        const places = await res.json();
        for (const place of places) {
            this.appendPlace(place);
        }
    }

    appendPlace(placeProperties) {
        const place = new Place(placeProperties);
        this.places.push(place);
        this.placesElement.appendChild(place.element);
    }
}


document.addEventListener('DOMContentLoaded',
    async function () {
        const places = new Places();
        await places.loadPlaces();
    });

