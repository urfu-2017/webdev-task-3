/* eslint-env browser */
'use strict';

class Create {
    get input() {
        return this._input.value.trim();
    }

    constructor() {
        this._button = document.querySelector('.create__button');
        this._input = document.querySelector('.create__input');
        this.onClick = null;

        this._button.onclick = () => {
            if (this.onClick) {
                this.onClick();
                this._input.value = '';
            }
        };
    }

    enable() {
        this._button.removeAttribute('disabled');
    }
}

module.exports = Create;
