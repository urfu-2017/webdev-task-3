/* eslint-env node, browser */
'use strict';

const placeInner = require('./places__place.html');
const { apiUrl } = require('../../../config/api');
const { PlaceEditor } = require('../__editor/place__editor');

exports.Place = class {
    constructor(place) {
        this.place = place;

        this.afterDeleteHandler = null;
        this.moveUpHandler = null;
        this.moveDownHandler = null;

        this.placeDiv = document.createElement('div');
        this.placeDiv.classList.add('places__place');
        this.placeDiv.innerHTML = placeInner;


        this._init();

        this._setupDeleteControl();
        this._setupEditControl();
        this._setupCheckbox();
        this._setupUpArrow();
        this._setupDownArrow();
        this.hideEditor();

        this._setupMouseOverAndOut();
    }

    get element() {
        return this.placeDiv;
    }

    set afterDeleteHandler(afterDeleteHandler) {
        this._afterDeleteHandler = afterDeleteHandler;
    }

    _init() {
        this.infoWrapper = this.placeDiv.querySelector('.places__place-info_wrapper');
        this.deleteControl = this.placeDiv.querySelector('.places__place-delete-control');
        this.editControl = this.placeDiv.querySelector('.places__place-edit-control');

        this.description = this.placeDiv.querySelector('.places__place-description');
        this.description.innerHTML = this.place.description;

        this.upArrow = this.placeDiv.querySelector('.places__place-up-arrow');
        this.downArrow = this.placeDiv.querySelector('.places__place-down-arrow');
        this.isVisitedCheckbox = this.placeDiv.querySelector('.places__place-isVisited-checkbox');

        this.placeEditor = new PlaceEditor(this.place);
        this.placeEditor.hideEditor = this.hideEditor.bind(this);
        this.placeDiv.appendChild(this.placeEditor.element);
    }

    hideEditor() {
        this.placeEditor.element.setAttribute('hidden', '');
        this.description.innerHTML = this.place.description;
        this.infoWrapper.removeAttribute('hidden');
    }

    showEditor() {
        this.infoWrapper.setAttribute('hidden', '');
        this.placeEditor.element.removeAttribute('hidden');
    }

    _setupMouseOverAndOut() {
        this.element.onmouseover = () => {
            this.deleteControl.hidden = false;
            this.editControl.hidden = false;
        };

        this.element.onmouseout = () => {
            this.deleteControl.hidden = true;
            this.editControl.hidden = true;
        };
    }

    _setupCheckbox() {
        if (this.place.isVisited) {
            this.isVisitedCheckbox.checked = true;
        }

        this.isVisitedCheckbox.onclick = () => {
            this.isVisitedCheckbox.disabled = true;
            const oldChecked = !this.isVisitedCheckbox.checked;

            const options = {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isVisited: this.isVisitedCheckbox.checked })
            };

            fetch(`${apiUrl}/${this.place.id}`, options)
                .then(response => response.json())
                .then(place => {
                    this.place.isVisited = place.isVisited;
                    this.isVisitedCheckbox.disabled = false;
                })
                .catch(() => {
                    this.isVisitedCheckbox.checked = oldChecked;
                    this.isVisitedCheckbox.disabled = false;
                });
        };
    }

    _setupDeleteControl() {
        this.deleteControl.onclick = () => {
            const options = {
                method: 'DELETE'
            };

            fetch(`${apiUrl}/${this.place.id}`, options)
                .then(response => {
                    if (response.ok) {
                        this.element.parentElement.removeChild(this.element);
                        this._afterDeleteHandler();
                    }
                });
        };
    }

    _setupEditControl() {
        this.editControl.onclick = () => {
            this.showEditor();
        };
    }

    _setupUpArrow() {
        this.upArrow.onclick = async () => {
            const placesList = document.querySelector('.places__list');
            let stopProp = (e) => e.stopPropagation();

            placesList.addEventListener('click', stopProp, true);

            let prev = this.element.previousElementSibling;
            await this.moveUpHandler(this.place);
            swapDomElements(prev, this.element);

            placesList.removeEventListener('click', stopProp, true);
        };
    }

    _setupDownArrow() {
        this.downArrow.onclick = async () => {
            const placesList = document.querySelector('.places__list');
            let stopProp = (e) => e.stopPropagation();

            placesList.addEventListener('click', stopProp, true);

            let next = this.element.nextElementSibling;
            await this.moveDownHandler(this.place);
            swapDomElements(next, this.element);

            placesList.removeEventListener('click', stopProp, true);
        };
    }
};

function swapDomElements(obj1, obj2) {
    if (obj2.nextSibling === obj1) {
        obj1.parentNode.insertBefore(obj2, obj1.nextSibling);

        return;
    }
    obj1.parentNode.insertBefore(obj2, obj1);
}
