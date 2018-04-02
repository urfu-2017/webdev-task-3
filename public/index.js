'use strict';

const URL = 'https://webdev-task-2-wnvhbocnde.now.sh/places';

class Place {
    constructor({ id, name, visited }) {
        this.id = id;
        this.name = name;
        this.visited = visited;
        this._createElement();
    }

    async _changeVisited() {
        this.visited = !this.visited;
        await fetch(`${URL}/${this.id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'visited': this.visited })
        });
    }

    _makeEditable() {
        this.element.querySelector('.place__edit-button').style.display = 'none';
        this.element.querySelector('.place__delete-button').style.display = 'none';
        this.element.querySelector('.place__name').style.display = 'none';
        this.element.querySelector('.edit-cancel-button').style.display = 'inline-block';
        this.element.querySelector('.edit-accept-button').style.display = 'inline-block';
        this.element.querySelector('.place__name-input').style.display = 'inline-block';
    }

    _cancelEditable() {
        this.element.querySelector('.place__edit-button').style.display = 'inline-block';
        this.element.querySelector('.place__delete-button').style.display = 'inline-block';
        this.element.querySelector('.place__name').style.display = 'inline-block';
        this.element.querySelector('.edit-cancel-button').style.display = 'none';
        this.element.querySelector('.edit-accept-button').style.display = 'none';
        this.element.querySelector('.place__name-input').style.display = 'none';
    }

    async _acceptEdit() {
        this.name = this.element.querySelector('.place__name-input').value;
        this.element.querySelector('.place__name').innerHTML = this.name;
        this._cancelEditable();
        await fetch(`${URL}/${this.id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'name': this.name })
        });
    }

    _createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('place');
        this.element.innerHTML = `
        <button class="place__edit-button">
        </button>
        <button class="place__delete-button">
        </button>
        <div class="place__name">${this.name}</div>
        <input class="place__name-input" value="${this.name}">
        <button class="edit-cancel-button">
        </button>
        <button class="edit-accept-button">
        </button>
        <div class="place-move-buttons">
            <button class="place-move-buttons__up">
            </button>
            <button class="place-move-buttons__down">
            </button>
        </div>
        <input class="place-visited" id="isVisited${this.id}" type="checkbox">
        <label for="isVisited${this.id}" class="place-visited-custom"></label>`;
        this.element.querySelector(`#isVisited${this.id}`).checked = this.visited;
        this.element.querySelector(`#isVisited${this.id}`).onclick = this._changeVisited.bind(this);
        this.element.querySelector('.place__edit-button').onclick = this._makeEditable.bind(this);
        this.element.querySelector('.edit-cancel-button').onclick = this._cancelEditable.bind(this);
        this.element.querySelector('.edit-accept-button').onclick = this._acceptEdit.bind(this);
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
        place.element.querySelector('.place-move-buttons__up')
            .onclick = () => (this._swapPlaces(place, true));
        place.element.querySelector('.place-move-buttons__down')
            .onclick = () => (this._swapPlaces(place, false));
        place.element.querySelector('.place__delete-button')
            .onclick = () => (this._deletePlace(place));
        this.places.push(place);
        this.placesElement.appendChild(place.element);
    }

    async createPlace(placeName) {
        const place = await fetch(URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'name': placeName })
        });
        const placeProperties = JSON.parse(await place.json());
        this.appendPlace(placeProperties);
    }

    async deletePlaces() {
        this.places = [];
        this.placesElement.innerHTML = '';
        await fetch(URL, { method: 'DELETE' });
    }

    async findPlace(placeName) {
        const res = await fetch(`${URL}/${placeName}`);
        const places = await res.json();
        if (places) {
            this.places = [];
            this.placesElement.innerHTML = '';
            for (const place of places) {
                this.appendPlace(place);
            }
        }
    }

    async filter(visitState) {
        this.placesElement.innerHTML = '';
        let filteredPlaces = this.places;
        switch (visitState) {
            case 'toVisit':
                filteredPlaces = filteredPlaces.filter((place) => (!place.visited));
                break;
            case 'visited':
                filteredPlaces = filteredPlaces.filter((place) => (place.visited));
                break;
            case 'all':
            default:
                break;
        }
        for (const place of filteredPlaces) {
            this.placesElement.appendChild(place.element);
        }
    }

    async _swapPlaces(place, isUp) {
        const firsIndex = this.places.indexOf(place);
        let secondIndex = firsIndex;
        if (isUp && firsIndex !== 0) {
            secondIndex --;
        }
        if (!isUp && firsIndex !== this.places.length - 1) {
            secondIndex ++;
        }
        const secondPlaceId = this.places[secondIndex].id;
        this.places[firsIndex] =
        this.places.splice(secondIndex, 1, this.places[firsIndex])[0];
        this.placesElement.innerHTML = '';
        for (const currentPlace of this.places) {
            this.placesElement.appendChild(currentPlace.element);
        }
        await fetch(`${URL}/${place.id}/${secondPlaceId}`,
            { method: 'PATCH' });
    }

    async _deletePlace(place) {
        const deletedPlaceIndex = this.places
            .findIndex((currentPlace) => (currentPlace.id === place.id));
        this.places.splice(deletedPlaceIndex, 1);
        this.placesElement.innerHTML = '';
        for (const currentPlace of this.places) {
            this.placesElement.appendChild(currentPlace.element);
        }
        await fetch(`${URL}/${place.id}`,
            { method: 'DELETE' });
    }
}


document.addEventListener('DOMContentLoaded',
    async function () {
        const places = new Places();
        await places.loadPlaces();
        document.getElementById('create_button').onclick = async () => (
            await places.createPlace(document.getElementById('create_input').value)
        );
        document.getElementById('trash').onclick = await places.deletePlaces.bind(places);
        const searchInput = document.getElementById('search');
        searchInput.oninput = async () => (
            await places.findPlace(searchInput.value)
        );
        document.getElementById('all').onclick = async () => (
            await places.filter('all')
        );
        document.getElementById('to-visit').onclick = async () => (
            await places.filter('toVisit')
        );
        document.getElementById('visited').onclick = async () => (
            await places.filter('visited')
        );
    });
