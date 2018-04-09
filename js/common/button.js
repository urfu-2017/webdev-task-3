'use strict';

import Control from '../control';

export default class Button extends Control {
    constructor({ className, clickHandler, image }) {
        super(className);
        this.clickHandler = clickHandler;
        this.image = image;
    }

    createElement() {
        const button = document.createElement('input');
        button.type = 'button';
        button.onclick = this.clickHandler;
        if (this.image) {
            this.setupImageStyles(button);
        }

        return button;
    }

    setupImageStyles(button) {
        button.style.backgroundImage = `url('${this.image}')`;
        button.style.backgroundSize = '20px 20px';
        button.style.width = '20px';
        button.style.height = '20px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
    }
}
