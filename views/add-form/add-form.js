/* eslint-env node, browser */
'use strict';

const { apiUrl } = require('../../config/api');

exports.AddForm = class {
    constructor() {
        this.form = document.createElement('div');
        this.form.classList.add('add-form');

        this.input = document.createElement('input');
        this.input.classList.add('add-form__input');
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('placeholder', 'Название места');

        this.button = document.createElement('button');
        this.button.innerHTML = 'Создать';
        this.button.classList.add('add-form__button');
        this.button.setAttribute('type', 'button');

        this.form.appendChild(this.input);
        this.form.appendChild(this.button);
    }

    get element() {
        return this.form;
    }

    set placeHandler(placeHandler) {
        this.button.onclick = () => {
            const inputValue = this.input.value;
            if (!inputValue) {
                return;
            }

            this.button.disabled = true;

            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: inputValue })
            };

            fetch(apiUrl, options)
                .then(response => response.json())
                .then(place => {
                    placeHandler(place);
                    this.button.disabled = false;
                })
                .catch(() => {
                    this.button.disabled = false;
                });
        };
    }
};
