'use strict';

import Control from '../control';
import Input from '../common/input';
import Button from '../common/button';

export default class Search extends Control {
    constructor(searchHandler) {
        super('search');

        this.input = new Input({
            className: 'search__input',
            inputHandler: () => searchHandler(this.input.getValue())
        });
        this.button = new Button({
            className: 'search__button btn btn_search',
            clickHandler: () => searchHandler(this.input.getValue())
        });
    }

    createElement() {
        const search = document.createElement('div');
        search.appendChild(this.input.render());
        search.appendChild(this.button.render());

        return search;
    }
}
