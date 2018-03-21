'use strict';

const API_URL = 'https://wdt2-grib.now.sh/places';
let filterState = 'all';

class PlaceControl {
    constructor(placeJson) {
        this._createElement();
        this.id = placeJson.id;
        this.description = placeJson.description;
        this.visited = placeJson.visited;
        this.root.setAttribute('data-place-id', this.id);

        if (this.visited) {
            this.visitCheckbox.checked = true;
        }

        this.editButton.onclick = this._makeEditable.bind(this);

        this.cancelButton.onclick = this._cancel.bind(this);
        this.saveButton.onclick = this._save.bind(this);
        this.visitCheckbox.onclick = this._markVisited.bind(this);
    }

    _markVisited() {
        this.visited = !this.visited;

        return fetch(
            `${API_URL}/${this.id}/visited`,
            {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
    }

    get description() {
        return this.descriptionElement.innerHTML;
    }

    set description(value) {
        this.descriptionElement.innerHTML = value;
    }

    _save() {
        this.saveButton.onclick = async () => {
            this.description = this.editTitle.value;

            await fetch(`${API_URL}/${this.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ description: this.description })
                });

            this.notEditable.style.display = 'flex';
            this.edit.style.display = 'none';
        };
    }

    _cancel() {
        this.notEditable.style.display = 'flex';
        this.edit.style.display = 'none';
    }

    _createElement() {
        this.root = document.createElement('div');
        this.root.classList.add('places__place');
        this.root.classList.add('place');
        this.root.innerHTML = PlaceControl._getInnerHtml();

        this._createInner();
        this.edit.style.display = 'none';
    }

    static _getInnerHtml() {
        return `
                <div class="place__not-editable">
                    <div class="place__edit-controls">
                        <button class="place__button place__button_edit">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="place__button place__button_delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div class="place__content">
                        <p class="place__description">Альтаир</p>
                    </div>
                    <div class="place__move-controls">
                        <button class="place__button place__button_up">
                            <i class="fas fa-long-arrow-alt-up"></i>
                        </button>
                        <button class="place__button place__button_down">
                            <i class="fas fa-long-arrow-alt-down"></i>
                        </button>
                        <input type="checkbox" class="place__visit_checkbox">
                    </div>
                </div>
                <div class="place__edit">
                    <input type="text" class="place__edit-title" title="">
                    <button class="place__button place__button_save">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="place__button place__button_cancel">
                        <i class="fas fa-undo"></i>
                    </button>
                </div>`;
    }

    _createInner() {
        this.notEditable = this.root.querySelector('.place__not-editable');
        this.editControls = this.notEditable.querySelector('.place__edit-controls');
        this.editButton = this.editControls.querySelector('.place__button_edit');
        this.deleteButton = this.editControls.querySelector('.place__button_delete');

        this.content = this.root.querySelector('.place__content');
        this.descriptionElement = this.content.querySelector('.place__description');

        this.moveControls = this.notEditable.querySelector('.place__move-controls');
        this.upButton = this.moveControls.querySelector('.place__button_up');
        this.downButton = this.moveControls.querySelector('.place__button_down');
        this.visitCheckbox = this.moveControls.querySelector('.place__visit_checkbox');

        this.edit = this.root.querySelector('.place__edit');
        this.editTitle = this.edit.querySelector('.place__edit-title');
        this.saveButton = this.edit.querySelector('.place__button_save');
        this.cancelButton = this.edit.querySelector('.place__button_cancel');
    }

    _makeEditable() {
        this.notEditable.style.display = 'none';
        this.edit.style.display = 'block';
        this.editTitle.value = this.description;
    }
}

class PlacesListControl {
    constructor() {
        this.root = document.querySelector('.places');
        this.placesListElement = document.querySelector('.places__list');
        this.places = [];

        this._clearButton = this.root.querySelector('.places__clear-all');

        this._clearButton.onclick = async () => {
            await fetch(API_URL, { method: 'DELETE' });
            this.places = [];
            this.redraw();
        };
    }

    static get search() {
        return document.querySelector('.search__input').value;
    }

    async reloadPlaces() {
        const places = await fetch(API_URL).then(resp => resp.json());
        this.places = [];
        places.forEach(place => this.createPlace(place));
        this.redraw();
    }

    static async savePlace(description) {
        return await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description })
        }).then(resp => resp.json());

    }

    createPlace(json) {
        const place = new PlaceControl(json);
        this.places.push(place);

        place.deleteButton.onclick = this.deletePlace.bind(place, this);
        place.upButton.onclick = this._onChangeIndex.bind(place, this, -1);
        place.downButton.onclick = this._onChangeIndex.bind(place, this, 1);
        this.redraw();
    }

    redraw() {
        this.placesListElement.innerHTML = '';
        this.places.filter(place => filterState === 'all' ||
            filterState === 'not-vis' && !place.visited ||
            filterState === 'vis' && place.visited)
            .filter(place => place.description.includes(PlacesListControl.search))
            .forEach(place => {
                this.placesListElement.appendChild(place.root);
            });
    }

    async _onChangeIndex(placesList, d) {
        const currIndex = placesList.places.indexOf(this);
        const placeToSwap = placesList.places[currIndex + d];
        await fetch(`${API_URL}/swap/${this.id}/${placeToSwap.id}`, { method: 'PATCH' });
        placesList.places[currIndex + d] = this;
        placesList.places[currIndex] = placeToSwap;
        placesList.redraw();
    }

    async deletePlace(placesList) {
        await fetch(`${API_URL}/${this.id}`, {
            method: 'DELETE'
        });
        placesList.places = placesList.places.filter(item => item !== this);
        placesList.redraw();
    }
}

let placesList;

window.onload = async function () {
    placesList = new PlacesListControl();
    await placesList.reloadPlaces();

    document.querySelector('.search__input').oninput = () => placesList.redraw();

    document.querySelectorAll('.places__filter button')
        .forEach(btn => {
            btn.onclick = e => {
                const selected = e.target;
                filterState = selected.value;
                document.querySelectorAll('.places__filter button')
                    .forEach(b => b.classList.remove('places__label_checked'));
                selected.classList.add('places__label_checked');
                placesList.redraw();
            };
        });

    document.querySelector('.add-place__button').onclick = async () => {
        let description = document.querySelector('.add-place__input').value;
        document.querySelector('.add-place__input').value = '';
        placesList.createPlace(await PlacesListControl.savePlace(description));
    };
};

