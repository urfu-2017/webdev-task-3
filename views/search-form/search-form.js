/* eslint-env node, browser */
'use strict';

exports.SearchForm = class {
    constructor() {
        this.allPlaces = [];

        this.form = document.createElement('div');
        this.form.classList.add('search-form');

        this.button = document.createElement('button');
        this.button.innerHTML = 'Найти';
        this.button.classList.add('search-form__button');
        this.button.setAttribute('type', 'button');

        this.input = document.createElement('input');
        this.input.classList.add('search-form__input');
        this.input.setAttribute('placeholder', 'Название места');

        this.form.insertAdjacentElement('beforeend', this.button);
        this.form.insertAdjacentElement('beforeend', this.input);
    }

    get element() {
        return this.form;
    }

    set placesHandler(placesHandler) {
        this.button.onclick = () => {
            const inputValue = this.input.value.toLowerCase();
            const findedPlaces = this.allPlaces
                .filter(place => place.description.toLowerCase().includes(inputValue));
            placesHandler(findedPlaces);
        };
    }
};
