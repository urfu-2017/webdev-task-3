'use strict';

const API_URL = 'https://yourplaces.now.sh/places/';
const [NOT_FOUND, CREATED] = [404, 201];

const headers = { 'Content-Type': 'application/json' };

class PlaceApi {
    static async getAll() {
        const places = await fetch(API_URL).then(res => res.json());

        return places;
    }

    static async find(description) {
        const res = await fetch(`${API_URL}/find`, {
            body: JSON.stringify({ description }),
            headers
        });

        return res.status === NOT_FOUND ? undefined : await res.json();
    }

    static async create(description) {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ description }),
            headers
        });

        return res.status === CREATED ? await res.json() : undefined;
    }

    static async update(id, description) {
        const reqUrl = `${API_URL}/${id}`;

        await fetch(reqUrl, {
            method: 'PATCH',
            body: JSON.stringify({ description }),
            headers
        });
    }

    static async setVisitState(id, state) {
        const reqUrl = `${API_URL}/${id}/${state ? 'visited' : 'unvisited'}`;

        await fetch(reqUrl, { method: 'PUT' });
    }

    static async swap(id1, id2) {
        const reqUrl = `${API_URL}/${id1}/swap/${id2}`;

        await fetch(reqUrl, { method: 'PUT' });
    }

    static async removeAll() {
        await fetch(API_URL, { method: 'DELETE' });
    }

    static async remove(id) {
        const reqUrl = `${API_URL}/${id}`;

        await fetch(reqUrl, { method: 'DELETE' });
    }
}

class PlaceElement {
    constructor(place, list) {
        this.place = place;
        this.list = list;

        this._defaultLi = this._renderDefaultLi();
        this._editLi = this._renderEditLi();

        this.li = this._defaultLi;
        this.visitCheckbox = this._renderSubElement({
            tag: 'input',
            className: 'place__visit',
            attributes: { type: 'checkbox', id: `v${this.place.id}` }
        });
        this.visitCheckbox.checked = this.place.visited;
    }

    render() {
        this.list.element.appendChild(this.visitCheckbox);
        this.list.element.appendChild(this.li);
    }

    async setVisitState() {
        await PlaceApi.setVisitState(this.place.id, !this.visitCheckbox.checked);
    }

    async moveDown() {
        const rightCheckbox = this.li.nextElementSibling;

        if (!rightCheckbox) {
            return;
        }

        const rightLi = rightCheckbox.nextElementSibling;
        const rightId = Number(rightCheckbox.getAttribute('id').slice(1));

        this.list.element.insertBefore(rightCheckbox, this.visitCheckbox);
        this.list.element.insertBefore(rightLi, this.visitCheckbox);

        await PlaceApi.swap(this.place.id, rightId);
    }

    async moveUp() {
        const leftLi = this.visitCheckbox.previousElementSibling;

        if (!leftLi) {
            return;
        }

        const leftCheckbox = leftLi.previousElementSibling;
        const leftId = Number(leftCheckbox.getAttribute('id').slice(1));

        this.list.element.insertBefore(this.visitCheckbox, leftCheckbox);
        this.list.element.insertBefore(this.li, leftCheckbox);

        await PlaceApi.swap(this.place.id, leftId);
    }

    async remove() {
        this.list.element.removeChild(this.visitCheckbox);
        this.list.element.removeChild(this.li);
        delete this.list.placeElements[this.place.id];
        this.list.places.splice(this.list.places.findIndex(place => place.id === this.place.id), 1);

        await PlaceApi.remove(this.place.id);
    }

    setEditMode() {
        this.list.element.replaceChild(this._editLi, this.li);
        this.li = this._editLi;
    }

    cancelEdit() {
        this.list.element.replaceChild(this._defaultLi, this.li);
        this.li = this._defaultLi;
    }

    async confirmEdit() {
        const newDescription = this.li.editInput.value;

        if (newDescription === '') {
            return;
        }

        this._defaultLi.name.textContent = newDescription;

        this.cancelEdit();
        await PlaceApi.update(this.place.id, newDescription);
    }

    _renderDefaultLi() {
        const li = document.createElement('li');
        li.className = 'place';

        li.visitLabel = this._renderSubElement({
            tag: 'label',
            className: 'place__visit',
            attributes: { for: `v${this.place.id}` },
            clickCallback: () => this.setVisitState()
        });

        li.arrowDownButton = this._renderSubElement({
            tag: 'button',
            className: 'place__arrow btn-place down',
            textContent: '↓',
            attributes: { type: 'button' },
            clickCallback: () => this.moveDown()
        });

        li.arrowUpButton = this._renderSubElement({
            tag: 'button',
            className: 'place__arrow btn-place up',
            textContent: '↑',
            attributes: { type: 'button' },
            clickCallback: () => this.moveUp()
        });

        li.name = this._renderSubElement({
            tag: 'h3',
            className: 'place__name',
            textContent: this.place.description
        });

        li.removeButton = this._renderSubElement({
            tag: 'button',
            className: 'place__delete btn-hidden btn-place',
            attributes: { type: 'button' },
            clickCallback: () => this.remove()
        });

        li.editButton = this._renderSubElement({
            tag: 'button',
            className: 'place__edit btn-hidden btn-place',
            attributes: { type: 'button' },
            clickCallback: () => this.setEditMode()
        });

        li.appendChild(li.visitLabel);
        li.appendChild(li.arrowDownButton);
        li.appendChild(li.arrowUpButton);
        li.appendChild(li.name);
        li.appendChild(li.removeButton);
        li.appendChild(li.editButton);

        return li;
    }

    _renderEditLi() {
        const li = document.createElement('li');
        li.className = 'place';

        li.cancelButton = this._renderSubElement({
            tag: 'button',
            className: 'place-edit__cancel place-edit__confirm btn-place',
            textContent: '❌',
            attributes: { type: 'button' },
            clickCallback: () => this.cancelEdit()
        });

        li.confirmButton = this._renderSubElement({
            tag: 'button',
            className: 'place-edit__confirm btn-place',
            textContent: '✔',
            attributes: { type: 'button' },
            clickCallback: () => this.confirmEdit()
        });

        li.editInput = this._renderSubElement({
            tag: 'input',
            className: 'place-edit__ipt',
            attributes: { type: 'text', value: this.place.description }
        });

        li.appendChild(li.cancelButton);
        li.appendChild(li.confirmButton);
        li.appendChild(li.editInput);

        return li;
    }

    _renderSubElement({ tag, className, textContent = '', attributes = {}, clickCallback }) {
        const child = document.createElement(tag);
        child.className = className;
        child.textContent = textContent;
        child.onclick = clickCallback ? clickCallback : child.onclick;

        for (let attribute of Object.keys(attributes)) {
            child.setAttribute(attribute, attributes[attribute]);
        }

        return child;
    }
}

class PlaceList {
    constructor(places) {
        this.places = places;
        this.placeElements = {};
        this.element = document.querySelector('.places__list');

        this._searchInput = document.querySelector('.search__ipt');
        this._placeCreatorInput = document.querySelector('.place-creator__ipt');
    }

    render() {
        this.places.forEach(place => this._renderPlace(place));
    }

    filter() {
        const searchPrefix = this._searchInput.value;

        if (searchPrefix === '') {
            return;
        }

        this.element.innerHTML = '';

        this.places
            .filter(place => place.description.startsWith(searchPrefix))
            .forEach(place => this.placeElements[place.id].render());
    }

    async add() {
        const description = this._placeCreatorInput.value;

        if (description === '' || this.places.some(place => place.description === description)) {
            return;
        }

        const searchPrefix = this._searchInput.value;
        const place = await PlaceApi.create(description);
        this.places.push(place);

        if (searchPrefix === '' || place.description.startsWith(searchPrefix)) {
            this._renderPlace(place);
        }
    }

    async clear() {
        this.places = [];
        this.placeElements = {};
        this.element.innerHTML = '';

        await PlaceApi.removeAll();
    }

    static async create() {
        const places = await PlaceApi.getAll();
        const placeList = new PlaceList(places);

        placeList.render();
        placeList._registerActions();
    }

    _renderPlace(place) {
        const placeElement = new PlaceElement(place, this);
        this.placeElements[place.id] = placeElement;

        placeElement.render();
    }

    _registerActions() {
        const searchButton = document.querySelector('.search__btn');
        const placeCreatorButton = document.querySelector('.place-creator__btn');
        const listCleanerButton = document.querySelector('.place__delete[name="cleaner"]');

        searchButton.onclick = () => this.filter();
        placeCreatorButton.onclick = () => this.add();
        listCleanerButton.onclick = () => this.clear();
    }
}

window.onload = () => {
    PlaceList.create();
};
