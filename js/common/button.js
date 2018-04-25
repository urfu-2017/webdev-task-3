'use strict';

import Control from '../control';

export default class Button extends Control {
    constructor({ className, clickHandler }) {
        super(className);
        this.clickHandler = clickHandler;
    }

    createElement() {
        const button = document.createElement('input');
        button.type = 'button';
        button.onclick = this.clickHandler;

        return button;
    }
}
