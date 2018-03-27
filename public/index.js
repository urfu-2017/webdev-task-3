'use strict';

const API_URL = 'https://webdev-task-2-vwybpuuxcw.now.sh';
const indexMap = new WeakMap();

class LoadScreen {
    static createLoadScreen() {
        const elem = document.body;
        const div = document.createElement('div');
        div.classList.add('load-screen');
        div.innerHTML = '<h3 class="load-screen__text">Loading...</h3>';
        elem.appendChild(div);
    }

    static deleteLoadScreen() {
        const elem = document.querySelector('.load-screen');
        elem.remove();
    }
}

class EditField {
    constructor(element, index) {
        this.sourceElement = element.closest('.places__place');
        this.sourceText = this.sourceElement.querySelector('.places__place-name');
        this.listElement = document.querySelector('.places__list');
        this.index = index;
        this._insertHTML();
    }

    show() {
        this.element.style.display = 'block';
        this.sourceElement.style.display = 'none';
    }

    _insertHTML() {
        this.element = document.createElement('div');
        this.element.classList.add('edit-field');
        this.element.innerHTML =
            `<input class="edit-field__field">
            <div class="edit-field__buttons">
                <button class="edit-field__btn-cancel btn-float">
                    <i class="fas fa-times"></i>
                </button>
                <button class="edit-field__btn-save btn-float">
                    <i class="fas fa-check"></i>
                </button>
            </div>`;
        this.element.style.display = 'none';
        this._getControlElements();
        this._addControlEvents();
        this.listElement.insertBefore(this.element, this.sourceElement);
    }

    _getControlElements() {
        this.btnCancel = this.element.querySelector('.edit-field__btn-cancel');
        this.btnSave = this.element.querySelector('.edit-field__btn-save');
    }

    _addControlEvents() {
        this.btnCancel.addEventListener('click', () => this._onCancel());
        this.btnSave.addEventListener('click', () => this._onSave());
    }

    async _onSave() {

        const text = this.element.querySelector('.edit-field__field').value;
        LoadScreen.createLoadScreen();
        await fetch(API_URL + `/place/${this.index}/edit`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: text })
        });
        LoadScreen.deleteLoadScreen();
        this.sourceText.innerHTML = text;
        this.element.remove();
        this.sourceElement.style = '';
    }

    _onCancel() {
        this.element.remove();
        this.sourceElement.style = '';
    }
}

class Place {
    constructor({ name, isVisited, index }) {
        this.name = name;
        this.isVisited = isVisited;
        this.index = index;
        this._insertHTML();
    }

    _insertHTML() {
        this.element = document.createElement('article');
        this.element.classList.add('places__place');
        this.element.innerHTML =
            `<div class="places__edit-buttons">
                <button class="places__btn-edit btn_type_float">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="places__btn-delete btn_type_float">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="places__place-name ${this.isVisited ? 'places__place-name_checked' : ''}">
                ${this.name}
            </div>
            <div class="places__move-buttons">
                <button class="places__btn-move-up btn_type_float">
                <i class="fas fa-arrow-up"></i>
            </button>
                <button class="places__btn-move-down btn_type_float">
                <i class="fas fa-arrow-down"></i>
            </button>
            </div>
            <input class="places__is-visited" type="checkbox" ${this.isVisited ? 'checked' : ''}>`;
        this._getControlElements();
        this._addControlEvents();
    }

    _getControlElements() {
        this.btnEdit = this.element.querySelector('.places__btn-edit');
        this.btnDelete = this.element.querySelector('.places__btn-delete');
        this.btnMoveUp = this.element.querySelector('.places__btn-move-up');
        this.btnMoveDown = this.element.querySelector('.places__btn-move-down');
        this.checkbox = this.element.querySelector('.places__is-visited');
    }

    _addControlEvents() {
        this.btnEdit.addEventListener('click', e => this._onEdit(e));
        this.btnDelete.addEventListener('click', () => this._onDelete());
        this.btnMoveUp.addEventListener('click', () => this._onMoveUp());
        this.btnMoveDown.addEventListener('click', () => this._onMoveDown());
        this.checkbox.addEventListener('change', () => this._onChangeStatus());
    }

    _onEdit(e) {
        const editField = new EditField(e.target, this.index);
        editField.show();
    }

    async _onDelete() {
        LoadScreen.createLoadScreen();
        await fetch(API_URL + `/place/${this.index}/delete`, { method: 'delete' });
        LoadScreen.deleteLoadScreen();
        this.element.remove();
    }

    async _onMoveUp() {
        const parentElement = this.element.parentElement;
        const currentElementClone = this.element.cloneNode(true);
        const previousElement = this.element.previousElementSibling;
        const previousElementClone = previousElement.cloneNode(true);
        await this._changeIndexes(this.element, previousElement);
        parentElement.replaceChild(previousElementClone, this.element);
        parentElement.replaceChild(currentElementClone, previousElement);
        // возвращаем eventlistener
        parentElement.replaceChild(this.element, currentElementClone);
        parentElement.replaceChild(previousElement, previousElementClone);
    }

    async _onMoveDown() {
        const parentElement = this.element.parentElement;
        const currentElementClone = this.element.cloneNode(true);
        const nextElement = this.element.nextElementSibling;
        const nextElementClone = nextElement.cloneNode(true);
        await this._changeIndexes(this.element, nextElement);
        parentElement.replaceChild(nextElementClone, this.element);
        parentElement.replaceChild(currentElementClone, nextElement);
        // возвращаем eventlistener
        parentElement.replaceChild(this.element, currentElementClone);
        parentElement.replaceChild(nextElement, nextElementClone);
    }

    async _changeIndexes(elem1, elem2) {
        const place1 = indexMap.get(elem1);
        const place2 = indexMap.get(elem2);
        const index1 = place1.index;
        const index2 = place2.index;
        LoadScreen.createLoadScreen();
        await fetch(API_URL + '/places/switch', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ index1, index2 })
        });
        LoadScreen.deleteLoadScreen();
        place1.index = index2;
        place2.index = index1;
    }

    async _onChangeStatus() {
        this.isVisited = !this.isVisited;
        const nameField = this.element.querySelector('.places__place-name');
        LoadScreen.createLoadScreen();
        await fetch(API_URL + `/place/${this.index}/toggle`, {
            method: 'PATCH'
        });
        LoadScreen.deleteLoadScreen();
        nameField.classList.toggle('places__place-name_checked');
    }
}

class PlaceList {
    constructor() {
        this.text = '';
        this.filterStatus = 'all';
        this.element = document.querySelector('.places__list');
        this.createElement = document.querySelector('.create-place');
        this.places = [];
        this._getControlElements();
    }

    async loadPlaces() {
        LoadScreen.createLoadScreen();
        const response = await fetch(API_URL + '/places/list/all');
        const places = await response.json();
        LoadScreen.deleteLoadScreen();
        for (const place of places) {
            this.createPlace(place);
        }
    }

    createPlace(info) {
        const place = new Place(info);
        this.places.push(place);
        indexMap.set(place.element, place);
        this.element.appendChild(place.element);
    }

    _getControlElements() {
        this.inputField = this.createElement.querySelector('.create-place__name');
        this.searchField = document.querySelector('.search__field');
        this.btnCreate = this.createElement.querySelector('.create-place__btn-create');
        this.btnClear = document.querySelector('.places__btn-clear');
        this.btnAll = document.querySelector('.places__inp-all');
        this.btnNotVisisted = document.querySelector('.places__inp-not-visited');
        this.btnVisited = document.querySelector('.places__inp-visited');
        this._addControlEvents();
    }

    _addControlEvents() {
        this.btnCreate.addEventListener('click', () => this._onCreate());
        this.btnClear.addEventListener('click', () => this._onClear());
        this.searchField.addEventListener('input', () => this._onFilter());
        this.btnAll.addEventListener('change', () => this._onShowAll());
        this.btnNotVisisted.addEventListener('change', () => this._onShowNotVisited());
        this.btnVisited.addEventListener('change', () => this._onShowVisited());
    }

    async _onCreate() {
        const text = this.inputField.value;
        if (!text) {
            return;
        }
        LoadScreen.createLoadScreen();
        const response = await fetch(API_URL + '/places/add', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: text })
        });
        const place = await response.json();
        LoadScreen.deleteLoadScreen();
        this.createPlace(place);
    }

    async _onClear() {
        LoadScreen.createLoadScreen();
        await fetch(API_URL + '/places/clear', {
            method: 'delete'
        });
        LoadScreen.deleteLoadScreen();
        this.element.innerHTML = '';
    }

    _onFilter() {
        this.text = this.searchField.value;
        this._showFilter();
    }

    _onShowAll() {
        this.filterStatus = 'all';
        this._showFilter();
    }

    _onShowNotVisited() {
        this.filterStatus = false;
        this._showFilter();
    }

    _onShowVisited() {
        this.filterStatus = true;
        this._showFilter();
    }

    _showFilter() {
        this.places.forEach(place => {
            if (place.name.startsWith(this.text) &&
            (place.isVisited === this.filterStatus || this.filterStatus === 'all')) {
                place.element.style = '';
            } else {
                place.element.style.display = 'none';
            }
        });
    }
}

window.addEventListener('load', async function () {
    await fetch(API_URL + '/register', {
        method: 'POST'
    });
    const placeList = new PlaceList();
    await placeList.loadPlaces();

});
