'use strict';

import Control from '../control';

export default class Checkbox extends Control {
    constructor({ className, clickHandler, checked }) {
        super(className);
        this.clickHandler = clickHandler;
        this.checked = checked;
    }

    createElement() {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = this.checked;
        checkbox.onclick = async () => {
            this.checked = !this.checked;
            await this.clickHandler();
        };

        return checkbox;
    }
}
