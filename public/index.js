'use strict';

const API_URL = 'https://webdev-task-2-ksgzwcgrhm.now.sh';

class Place {
    constructor({ index, name, description, isVisited }) {
        this.id = index;
        this.name = name;
        this.place = description;
        this.visited = isVisited;
        this._createElement();
    }

    _createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('places__place');
        this.element.innerHTML = `
        <div class="places__edit-buttons">
            <button class="places__btn-edit btn-float">
                <i classs="fas fa-pencil-alt"></i>
            </button>
            <button class="places__btn-delete btn-float">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
        <div class="places__place-name">${this.name}</div>
        <div class="places__move-buttons">
            <button class="places__btn-move-up btn-float">
                <i class="fas fa-arrow-up"></i>
            </button>
            <button class="places__btn-move-down btn-float">
                <i class="fas fa-arrow-down"></i>
            </button>
        </div>
        <input class="places__is-visited" type="checkbox">`;
        this.element.querySelector('.places__is-visited').checked = this.visited;
    }
}

class PlaceList {
    constructor() {
        this.element = document.querySelector('.places__list');
        this.places = [];
    }

    async loadPlaces() {
        const response = await fetch(API_URL + '/places/list/all');
        const places = await response.json();
        console.info(places);
        for (const place of places) {
            this.createPlace(place);
        }
    }

    createPlace(info) {
        const place = new Place(info);
        this.places.push(place);
        this.element.appendChild(place.element);
    }
}

window.onload = async function () {
    const places = new PlaceList();
    places.loadPlaces();
};
