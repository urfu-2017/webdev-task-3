/* eslint-env browser */
'use strict';

class Search {
    constructor() {
        this._div = document.querySelector('.search');
        this._input = this._div.querySelector('.search__input');

        this.onType = null;
        this._input.oninput = () => {
            if (this.onType) {
                this.onType(this._input.value);
            }
        };
    }
}

module.exports = Search;
