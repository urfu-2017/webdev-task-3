'use strict';

import Control from '../control';

export default class Radio extends Control {
    constructor({ className, clickHandler, name, value }) {
        super(className);
        this.clickHandler = clickHandler;
        this.name = name;
        this.value = value;
    }

    click() {
        this.elem.click();
    }

    createElement() {
        const radio = document.createElement('input');
        radio.style.display = 'none';
        radio.type = 'radio';
        radio.name = this.name;
        radio.onclick = this.clickHandler;

        const text = document.createElement('span');
        text.innerText = this.value;

        const elem = document.createElement('label');
        elem.appendChild(radio);
        elem.appendChild(text);

        return elem;
    }
}
