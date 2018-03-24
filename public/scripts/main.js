'use strict';

const BASE_URL = 'https://arty-mgn-travel-places.now.sh/places';

class PlacesApi {
    static deleteAll() {
        return fetch(BASE_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    static addPlace(newPlace) {
        return fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlace)
        });
    }

    static deleteById(id) {
        const requestUrl = `${BASE_URL}/${id}`;

        return fetch(requestUrl, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    static getAll() {
        return fetch(BASE_URL);
    }

    static changeDescription(id, newValue) {
        const requestUrl = `${BASE_URL}/${id}/description/${newValue}`;

        return fetch(requestUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    static changeMark(id, newValue) {
        const requestUrl = `${BASE_URL}/${id}/mark/${newValue}`;

        return fetch(requestUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

function _getFirstElement(parentElement, className) {
    return parentElement.getElementsByClassName(className)[0];
}

class PlaceEditor {
    constructor(place) {
        this.originPlace = place;
        this.element = this._createElement(place);
        this._findChilds();
        this._bindHandlers();
    }

    _createElement(place) {
        const element = document.createElement('div');
        element.classList.add('place-editor');
        element.innerHTML = `<input class="place-editor__input" type="text"
                             value="${place.description.innerHTML.trim()}">
                             <input class="place-editor__accept-button"
                            type="image" src="./icons./001-check.svg" alt="accept">
                            <input class="place-editor__cancel-button"
                            type="image" src="./icons./007-close.svg" alt="cancel">`;

        return element;
    }

    _findChilds() {
        this.textInput = _getFirstElement(this.element, 'place-editor__input');
        this.acceptButton = _getFirstElement(this.element, 'place-editor__accept-button');
        this.cancelButton = _getFirstElement(this.element, 'place-editor__cancel-button');
    }

    _bindHandlers() {
        this.acceptButton.onclick = () => this.changePlaceDescription();
        this.cancelButton.onclick = () =>
            this.element.parentElement.replaceChild(this.originPlace.element, this.element);
    }

    changePlaceDescription() {
        PlacesApi.changeDescription(this.originPlace.element.id, this.textInput.value);
        this.originPlace.description.innerHTML = this.textInput.value;
        this.element.parentElement.replaceChild(this.originPlace.element, this.element);
    }
}

class Place {
    constructor(placeModel) {
        this.element = this._createElement(placeModel);
        this._findChilds();
        this._bindHandlers();
    }

    _createElement(placeModel) {
        const element = document.createElement('div');
        element.classList.add('place');
        element.id = placeModel.id;
        const inputState = placeModel.isVisited ? 'checked' : '';
        const descriptionModificator = inputState === '' ? '' : 'place_crossed-description';

        element.innerHTML =
            `<input class="place__edit-button place__button"
            type="image" src="./icons./002-pen.svg" alt="pen">

        <input class="place__delete-button place__button"
        type="image" src="./icons./009-can.svg" alt="trash">

        <div class="place__description ${descriptionModificator}">${placeModel.description}</div>
        <input class="place__moveup-button place__button"
        type="image" src="./icons./upArrow.svg" alt="up arrow">

        <input class="place__movedown-button place__button"
        type="image" src="./icons./downArrow.svg" alt="down arrow">

        <input class="place__visit-status" type="checkbox" ${inputState}>`;

        return element;
    }

    _findChilds() {
        this.statusCheckbox = _getFirstElement(this.element, 'place__visit-status');
        this.description = _getFirstElement(this.element, 'place__description');
        this.editButton = _getFirstElement(this.element, 'place__edit-button');
        this.deleteButton = _getFirstElement(this.element, 'place__delete-button');
        this.moveUpButton = _getFirstElement(this.element, 'place__moveup-button');
        this.moveDownButton = _getFirstElement(this.element, 'place__movedown-button');
    }

    _bindHandlers() {
        this.statusCheckbox.onchange = () => this.changeMark(event);
        this.deleteButton.onclick = () => this.delete();
        this.editButton.onclick = () => this.changeDescription();
        this.moveUpButton.onclick = () => this.moveUp();
        this.moveDownButton.onclick = () => this.moveDown();
    }

    moveDown() {
        this.element.parentElement.insertBefore(this.element.nextSibling, this.element);
    }

    moveUp() {
        this.element.parentElement.insertBefore(this.element, this.element.previousSibling);
    }

    changeDescription() {
        const placeEditor = new PlaceEditor(this);
        this.element.parentElement.replaceChild(placeEditor.element, this.element);
    }

    delete() {
        PlacesApi.deleteById(this.element.id);
        this.element.parentElement.removeChild(this.element);
    }

    changeMark() {
        PlacesApi.changeMark(this.element.id, this.statusCheckbox.checked);
        this.description.classList.toggle('place_crossed-description');
    }
}

class PlacesList {
    constructor() {
        this.listElement = document.querySelector('.places-list');
        this.currentFilterName = 'all';
        this.currentSearchQuery = undefined;

        this._findChilds();
        this._bindHandlers();

    }

    _findChilds() {
        this.placeCreatorButton = document.querySelector('.place-creator__button');
        this.deleteAllButton = document.querySelector('.places-list__delete-button');
        this.filterControlls = document.querySelectorAll('.place-selectors__input');
        this.searchInput = document.querySelector('.search__input');
    }

    _bindHandlers() {
        this.placeCreatorButton.onclick = () => this.addNewPlace();
        this.deleteAllButton.onclick = () => this.clear();

        this.filterControlls.forEach(filterControll => {
            filterControll.onchange = () => {
                this.currentFilterName = filterControll.id;
                this.filter(this.currentFilterName, this.currentSearchQuery);
            };
        });

        this.searchInput.onkeydown = this.debounce((e) => {
            this.currentSearchQuery = e.target.value;
            this.filter(this.currentFilterName, this.currentSearchQuery);
        }, 300);
    }

    debounce(func, wait, immediate) {
        var timeout;

        return function () {
            // eslint-disable-next-line
            var context = this;
            var args = arguments;

            var later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };

            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }

    filter(filterName, searchQuery = undefined) {
        document.querySelectorAll('.place').forEach(element => {
            const notContainsSearchQuery = typeof searchQuery === 'string' &&
                !element.textContent.includes(searchQuery);

            element.style.display = !this._isFilteredPlace(filterName, element) ||
                notContainsSearchQuery ? 'none' : 'flex';
        });
    }

    _isFilteredPlace(filterName, element) {
        const statusCheckbox = element.getElementsByClassName('place__visit-status')[0];

        return filterName === 'all' ||
                filterName === 'not_visited' && !statusCheckbox.checked ||
                filterName === 'visited' && statusCheckbox.checked;
    }

    clear() {
        PlacesApi.deleteAll();
        this._removeAllPlaceElements();
    }

    async update() {
        this._removeAllPlaceElements();
        const response = await PlacesApi.getAll();
        let places = await response.json();
        this.append(places);
    }

    append(places) {
        places.forEach(fetchedPlace => {
            const place = new Place(fetchedPlace);
            this.listElement.appendChild(place.element);
        });
    }

    _removeAllPlaceElements() {
        document.querySelectorAll('.place').forEach(element => {
            this.listElement.removeChild(element);
        });
    }

    async addNewPlace() {
        const nameInput = document.querySelector('.place-creator__name-input');
        const newPlace = { description: nameInput.value, isVisited: false };
        PlacesApi.addPlace(newPlace);
        nameInput.value = '';
        const place = new Place(newPlace);
        this.listElement.appendChild(place.element);
    }
}

window.onload = async function () {
    const placesList = new PlacesList();
    placesList.update();
};

