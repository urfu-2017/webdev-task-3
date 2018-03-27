/* eslint-env node, browser */
'use strict';

const { apiUrl } = require('../../../config/api');
const editorInner = require('./place__editor.html');

exports.PlaceEditor = class {
    constructor(place) {
        this.place = place;
        this._hideEditor = null;

        this.editor = document.createElement('div');
        this.editor.classList.add('places__place-editor');
        this.editor.innerHTML = editorInner;

        this._init();

        this._setupCancelControl();
        this._setupAcceptControl();
    }

    get element() {
        return this.editor;
    }

    set hideEditor(hideEditor) {
        this._hideEditor = hideEditor;
    }

    _init() {
        this.editInput = this.editor.querySelector('.places__place-edit-input');
        this.cancelControl = this.editor.querySelector('.places__cancel-edit-control');
        this.acceptControl = this.editor.querySelector('.places__accept-edit-control');

        this.editInput.value = this.place.description;
    }

    _setupCancelControl() {
        this.cancelControl.onclick = () => {
            this._hideEditor();
        };
    }

    _setupAcceptControl() {
        this.acceptControl.onclick = () => {
            const inputValue = this.editInput.value;
            const options = {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: inputValue })
            };

            fetch(`${apiUrl}/${this.place.id}`, options)
                .then(response => response.json())
                .then(place => {
                    this.place.description = place.description;
                    this._hideEditor();
                });
        };
    }
};
