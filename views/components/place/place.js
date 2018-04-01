/* eslint-env browser */
'use strict';

const template = require('./place.hbs');

class Place {
    get name() {
        return this._name.innerHTML;
    }

    get visited() {
        return this._visited.checked;
    }

    constructor(place = {}) {
        this.div = document.createElement('div');
        this.div.innerHTML = template;
        this.div.classList.add('.place');

        this._initElements();

        this._name.innerHTML = place.name || '';

        if (place.visited) {
            this._visited.setAttribute('checked', '');
        }

        this.onChange = null;
        this._visited.onchange = () => {
            if (this.onChange) {
                this.onChange(this._visited.checked);
            }
        };

        this.onDelete = null;
        this._deleteButton.onclick = () => {
            if (this.onDelete) {
                this.onDelete();
            }
        };

        this._editButton.onclick = this._switchToEdit.bind(this);
        this._cancelButton.onclick = this._switchToNormal.bind(this);

        this.onSave = null;
        this._saveButton.onclick = this._save.bind(this);
    }

    _save() {
        const oldName = this.name;
        this._switchToNormal();
        this._name.innerHTML = this._editInput.value;

        if (this.onSave) {
            this.onSave(oldName);
        }
    }

    _switchToNormal() {
        this._normal.classList.remove('hidden');
        this._edit.classList.add('hidden');
    }

    _switchToEdit() {
        this._normal.classList.add('hidden');
        this._edit.classList.remove('hidden');

        this._editInput.value = this.name;
    }

    _initElements() {
        this._normal = this.div.querySelector('.place__normal');
        this._edit = this.div.querySelector('.place__edit');
        this._name = this.div.querySelector('.place__normal__name');
        this._visited = this.div.querySelector('.place__normal__visit > input:first-child');
        this._deleteButton = this.div.querySelector('.place__normal__delete');
        this._editButton = this.div.querySelector('.place__normal__edit');
        this._editInput = this.div.querySelector('.place__edit__name');
        this._saveButton = this.div.querySelector('.place__edit__save');
        this._cancelButton = this.div.querySelector('.place__edit__cancel');

        this.upButton = this.div.querySelector('.place__normal__swap__up');
        this.downButton = this.div.querySelector('.place__normal__swap__down');
    }
}

module.exports = Place;
