/* eslint-disable no-undef */
'use strict';

const apiUrl = 'https://webdev-task-2-xiufbrjvdv.now.sh/places';

class Place {
    constructor({ id, description, visited = false }) {
        this.id = id;
        this.description = description;
        this.visited = visited;
        this.createElement();
        this.getComponents();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('place');
        this.element.innerHTML = `<div class="place__item place__item_hidden place__edit">
                <span class="far fa-edit clickable"></span>
            </div>
            <div class="place__item place__item_hidden place__delete">
                <span class="far fa-trash-alt clickable"></span>
            </div>
            <span class="place__item place__description">${this.description}</span>
            <input type="text" class="place__item place__item_hidden place__edit-description">
            <div class="place__item place__order_up">
                <span class="fas fa-angle-up clickable"></span>
            </div>
            <div class="place__item place__order_down">
                <span class="fas fa-angle-down clickable"></span>
            </div>
            <div class="place__item place__save place__item_hidden">
                <span class="fas fa-check clickable"></span>
            </div>
            <div class="place__item place__cancel place__item_hidden">
                <span class="fas fa-times clickable"></span>
            </div>
            <input type="checkbox" class="place__item place__visited">
            </div>`;
    }

    getComponents() {
        this.editButton = this.element.querySelector('.place__edit');
        this.deleteButton = this.element.querySelector('.place__delete');
        this.descriptionElem = this.element.querySelector('.place__description');
        this.descriptionEditor = this.element.querySelector('.place__edit-description');
        this.upButton = this.element.querySelector('.place__order_up');
        this.downButton = this.element.querySelector('.place__order_down');
        this.saveButton = this.element.querySelector('.place__save');
        this.cancelButton = this.element.querySelector('.place__cancel');
        this.visitedCheckbox = this.element.querySelector('.place__visited');
        if (this.visited) {
            this.visitedCheckbox.checked = true;
        }

    }

    showEditButtons() {
        this.editButton.classList.remove('place__item_hidden');
        this.deleteButton.classList.remove('place__item_hidden');
    }

    hideEditButtons() {
        this.editButton.classList.add('place__item_hidden');
        this.deleteButton.classList.add('place__item_hidden');
    }

    startEditing() {
        this.descriptionEditor.value = this.description;
        this._hideComponent(this.descriptionElem);
        this._hideComponent(this.upButton);
        this._hideComponent(this.downButton);
        this._hideComponent(this.visitedCheckbox);
        this._showComponent(this.descriptionEditor);
        this._showComponent(this.cancelButton);
        this._showComponent(this.saveButton);
    }

    saveDescription() {
        this.description = this.descriptionEditor.value;
        this.descriptionElem.innerHTML = this.description;
        this.stopEditing();
    }

    stopEditing() {
        this._hideComponent(this.descriptionEditor);
        this._hideComponent(this.cancelButton);
        this._hideComponent(this.saveButton);
        this._showComponent(this.descriptionElem);
        this._showComponent(this.upButton);
        this._showComponent(this.downButton);
        this._showComponent(this.visitedCheckbox);
    }

    _showComponent(component) {
        component.classList.remove('place__item_hidden');
    }

    _hideComponent(component) {
        component.classList.add('place__item_hidden');
    }
}

class PlacesContainer {
    constructor() {
        this.element = document.querySelector('.places-list');
        this._places = [];
        this.setFilterFunc('all');
        this.searchQuery = '';
    }

    async fetchPlaces() {
        this._places = [];
        const data = await request.get(apiUrl);
        const places = data.places;
        for (const place of places) {
            this.createPlace(place);
        }
        this.rerenderList();
    }

    rerenderList() {
        this.element.innerHTML = '';
        const placesToRender = this._places
            .filter(this.filter)
            .filter((place) => this._isSearched(place));
        for (const place of placesToRender) {
            this.element.appendChild(place.element);
        }
    }

    async addPlace() {
        const field = document.querySelector('.create__title-input');
        const description = field.value;
        field.value = '';
        const data = await request.post(apiUrl, { description });
        this.createPlace(data.place);
        this.rerenderList();
    }

    createPlace(params) {
        const place = new Place(params);
        this._places.push(place);
        place.element.onmouseenter = () => place.showEditButtons();
        place.element.onmouseleave = () => place.hideEditButtons();
        place.visitedCheckbox.onchange = () => this.toggleVisited(place);
        place.editButton.onclick = () => place.startEditing();
        place.saveButton.onclick = () => this.changeDescription(place);
        place.cancelButton.onclick = () => place.stopEditing();
        place.deleteButton.onclick = () => this.deletePlace(place);
        place.upButton.onclick = () => this.movePlace(place, -1);
        place.downButton.onclick = () => this.movePlace(place, 1);
    }

    async clear() {
        try {
            const data = await request.delete(apiUrl);
            if (!data.ok) {
                throw new Error('Unable to clear list');
            }
            this._places = [];
        } catch (e) {
            console.error(e);
        }
        this.rerenderList();
    }

    async toggleVisited(place) {
        try {
            place.visited = !place.visited;
            const data = await request.patch(`${apiUrl}/${place.id}`, { visited: place.visited });
            if (!data.ok) {
                throw new Error('unable to toggle visited');
            }
        } catch (e) {
            place.visited = !place.visited;
            console.error(e);
        }
        this.rerenderList();
    }

    async deletePlace(place) {
        try {
            const index = this._places.findIndex(elem => elem === place);
            this._places.splice(index, 1);
            const data = await request.delete(`${apiUrl}/${place.id}`);
            if (!data.ok) {
                throw new Error('Unable to delete place');
            }
            this.rerenderList();
        } catch (e) {
            console.error(e);
        }
    }

    async changeDescription(place) {
        try {
            place.saveDescription();
            const data = await request.put(`${apiUrl}/${place.id}`,
                { description: place.description });
            if (!data.ok) {
                throw new Error('Unable to change description');
            }
        } catch (e) {
            console.error(e);
        }
    }

    async movePlace(place, direction) {
        try {
            const index = this._places.findIndex(elem => elem === place);
            const neighbor = this._places[index + direction];
            const data = await request.put(`${apiUrl}/${place.id}/${neighbor.id}`);
            if (!data.ok) {
                throw new Error('Unable to swap places');
            }
            place.id = data.firstId;
            neighbor.id = data.secondId;
            this._places[index] = neighbor;
            this._places[index + direction] = place;
            this.rerenderList();
        } catch (e) {
            console.error(e);
        }
    }

    changeFilter(event) {
        document.querySelector('.filter__button_active')
            .classList
            .remove('filter__button--active');
        event.target.classList.add('filter__button_active');
        const filter = event.target.dataset.filter;
        this.setFilterFunc(filter);
        this.rerenderList();
    }

    setFilterFunc(query) {
        switch (query) {
            case 'visit':
                this.filter = (place) => !place.visited;
                break;
            case 'visited':
                this.filter = place => place.visited;
                break;
            default:
                this.filter = () => true;
                break;
        }
    }

    searchByDescription(event) {
        this.searchQuery = event.target.value;
        this.rerenderList();
    }

    _isSearched(place) {
        return place.description.indexOf(this.searchQuery) !== -1;
    }

}

let placesContainer;

window.onload = async () => {
    placesContainer = new PlacesContainer();
    await placesContainer.fetchPlaces();

    document.querySelector('.create__submit').onclick = () => placesContainer.addPlace();

    document.querySelector('.places__clear').onclick = () => placesContainer.clear();

    document.querySelector('.filter').onclick =
        (e) => placesContainer.changeFilter(e);

    document.querySelector('.search__input').oninput =
        (e) => placesContainer.searchByDescription(e);
};
