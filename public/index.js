'use strict';

const API_URL = 'https://webdev-task-2-xdmhfckqxs.now.sh/places';

const VisitedFilterState = {
    all: 'all',
    notVisited: 'notVisited',
    visited: 'visited'
};
Object.freeze(VisitedFilterState);

let visitedFilterState = VisitedFilterState.all;

class ElementWrapper {
    _find(selector) {
        return this.element.querySelector(selector);
    }

    _forAll(selector, action) {
        return this.element.querySelectorAll(selector).forEach(action);
    }
}

class EditableField extends ElementWrapper {
    constructor(sourceElement) {
        super();
        this._sourceElement = sourceElement;
        this._createElement();
        this._findComponents();
    }

    get value() {
        return this._field.value;
    }

    set value(value) {
        this._field.value = value;
    }

    get sourceText() {
        return this._sourceElement.textContent;
    }

    set sourceText(value) {
        this._sourceElement.textContent = value;
    }

    edit(onSave) {
        this._btnCancel.onclick = () => this._endEdit();
        this._btnSave.onclick = async () => {
            try {
                if (this.value === this.sourceText) {
                    return;
                }
                await onSave(this.value);
                this.sourceText = this.value;
            } finally {
                this._endEdit();
            }
        };
        this._beginEdit();
    }

    _beginEdit() {
        this.value = this.sourceText;
        this._sourceElement.hidden = true;
        this.element.hidden = false;
    }

    _endEdit() {
        this._sourceElement.hidden = false;
        this.element.hidden = true;
    }

    _createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('edit-field');
        this.element.innerHTML = `
            <input class="edit-field__field">
            <div class="edit-field__buttons">
                <button class="edit-field__btn-cancel btn-float">
                    <i class="fas fa-times"></i>
                </button>
                <button class="edit-field__btn-save btn-float">
                    <i class="fas fa-check"></i>
                </button>
            </div>`;
        this.element.hidden = true;
        this._sourceElement.parentNode.insertBefore(
            this.element, this._sourceElement.nextSibling);
    }

    _findComponents() {
        this._field = this._find('.edit-field__field');
        this._btnCancel = this._find('.edit-field__btn-cancel');
        this._btnSave = this._find('.edit-field__btn-save');
    }
}


class Place extends ElementWrapper {
    constructor(id, name, visited) {
        super();
        this._createElement();
        this._findComponents();
        this.id = id;
        this.name = name;
        this.visited = visited;
    }

    get name() {
        return this.nameElement.textContent;
    }

    set name(value) {
        this.nameElement.textContent = value;
    }

    get visited() {
        return this.visitedElement.checked;
    }

    set visited(value) {
        this.visitedElement.checked = value;
    }

    _createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('places__place');
        this.element.innerHTML = `
            <div class="places__edit-buttons">
                <button class="places__btn-edit btn-float">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="places__btn-delete btn-float">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="places__place-name"></div>
            <div class="places__move-buttons">
                <button class="places__btn-move-up btn-float">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button class="places__btn-move-down btn-float">
                    <i class="fas fa-arrow-down"></i>
                </button>
            </div>
            <input class="places__is-visited" type="checkbox">`;
    }

    _findComponents() {
        this.nameElement = this._find('.places__place-name');
        this.visitedElement = this._find('.places__is-visited');
        this.editableField = new EditableField(this.nameElement);
        this.btnEdit = this._find('.places__btn-edit');
        this.btnDelete = this._find('.places__btn-delete');
        this.btnCancel = this._find('.edit-field__btn-cancel');
        this.btnSave = this._find('.edit-field__btn-save');
        this.btnMoveUp = this._find('.places__btn-move-up');
        this.btnMoveDown = this._find('.places__btn-move-down');
    }
}


class PlacesList extends ElementWrapper {
    constructor() {
        super();
        this.element = document.querySelector('.places__list');
        this.places = [];
    }

    async reloadPlacesFromServer() {
        let response = await fetch(API_URL);
        let places = await response.json();
        this.places = [];
        for (const place of places) {
            this.createPlace(place.id, place.description, place.visited);
        }
    }

    createPlace(id, name, visited = false) {
        const place = new Place(id, name, visited);
        this.places.push(place);
        place.btnEdit.onclick = (e) => this._onEditPlaceName(e);
        place.btnDelete.onclick = (e) => this._onDeletePlace(e);
        place.btnMoveUp.onclick = (e) => this._onChangeIndex(e, -1);
        place.btnMoveDown.onclick = (e) => this._onChangeIndex(e, 1);
        place.visitedElement.onchange = (e) => this._onChangePlaceVisited(e);
        this.reloadListView();
    }

    reloadListView() {
        const searchQuery = document.querySelector('.search__field').value;
        this.element.innerHTML = '';
        for (const place of this.places) {
            if (place.name.includes(searchQuery) && matchesVisitedFilter(place)) {
                this.element.appendChild(place.element);
            }
        }
        const moveAllowed = !searchQuery && visitedFilterState === VisitedFilterState.all;
        this._forAll('.places__btn-move-up, .places__btn-move-down', btn => {
            btn.hidden = !moveAllowed;
        });
    }

    async _onEditPlaceName(event) {
        const place = this._getPlace(event);
        place.editableField.edit(async (editedValue) => {
            const response = await fetch(`${API_URL}/${place.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: editedValue })
            });
            if (response.status !== 204) {
                throw new Error('Cannot update place.');
            }
        });
    }

    async _onChangePlaceVisited(event) {
        const place = this._getPlace(event);
        const response = await fetch(`${API_URL}/${place.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ visited: place.visited })
        });
        if (response.status !== 204) {
            throw new Error('Cannot update place.');
        }
        this.reloadListView();
    }

    async _onChangeIndex(event, delta) {
        const place = this._getPlace(event);
        const placeIndex = this.places.indexOf(place);
        const response = await fetch(`${API_URL}/${place.id}/index`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(placeIndex + delta)
        });
        if (response.status !== 204) {
            throw new Error('Cannot change place index.');
        }
        this.places.splice(placeIndex, 1);
        this.places.splice(placeIndex + delta, 0, place);
        this.reloadListView();
    }

    async _onDeletePlace(event) {
        const place = this._getPlace(event);
        const response = await fetch(`${API_URL}/${place.id}`, {
            method: 'DELETE'
        });
        if (response.status !== 204) {
            throw new Error('Cannot delete place.');
        }
        this.places = this.places.filter(item => item !== place);
        this.reloadListView();
    }

    async deleteAllPlaces() {
        const response = await fetch(API_URL, {
            method: 'DELETE'
        });
        if (response.status !== 204) {
            throw new Error('Cannot delete all places.');
        }
        this.places = [];
        this.reloadListView();
    }

    _getPlace(event) {
        return this.places.find(place =>
            place.element === event.target.closest('.places__place'));
    }
}

let placesList;

window.onload = async function () {
    placesList = new PlacesList();
    await placesList.reloadPlacesFromServer();

    document.querySelector('.search__field')
        .oninput = () => placesList.reloadListView();

    document.querySelectorAll('.places__filter button')
        .forEach(btn => {
            btn.onclick = (e) => {
                visitedFilterState = e.target.dataset.filterState;
                document.querySelectorAll('.places__filter button')
                    .forEach(b => b.classList.remove('btn-filter-selected'));
                e.target.classList.add('btn-filter-selected');
                placesList.reloadListView();
            };
        });

    document.querySelector('.create-place__btn-create')
        .onclick = createPlace;

    document.querySelector('.create-place__name')
        .onkeydown = e => {
            if (e.keyCode === 13) {
                createPlace();
            }
        };

    document.querySelector('.places__btn-delete-all')
        .onclick = () => placesList.deleteAllPlaces();
};

async function createPlace() {
    const placeName = document.querySelector('.create-place__name').value;
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: placeName })
    });
    if (response.status !== 200) {
        throw new Error('Cannot create place.');
    }

    const [placeId] = response.url.split('/').slice(-1);
    placesList.createPlace(placeId, placeName);
}

function matchesVisitedFilter(place) {
    return visitedFilterState === VisitedFilterState.all ||
        (visitedFilterState === VisitedFilterState.notVisited && !place.visited) ||
        (visitedFilterState === VisitedFilterState.visited && place.visited);
}
