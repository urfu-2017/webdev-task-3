'use strict';

import Control from '../control';

const ENTER_KEY_CODE = 13;

export default class Input extends Control {
    constructor({ className, enterHandler, maxLength }) {
        super(className);
        this.enterHandler = enterHandler;
        this.maxLength = maxLength;
    }

    setValue(value) {
        this.elem.value = value;
    }

    getValue() {
        return this.elem.value;
    }

    createElement() {
        const input = document.createElement('input');
        input.type = 'text';
        if (this.maxLength) {
            input.maxLength = this.maxLength;
        }
        input.onkeydown = async e => {
            if (this.enterHandler && e.keyCode === ENTER_KEY_CODE) {
                await this.enterHandler();
            }
        };

        return input;
    }
}
