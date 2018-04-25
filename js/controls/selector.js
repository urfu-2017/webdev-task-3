'use strict';

import Control from '../control';
import Radio from '../common/radio';

export default class Selector extends Control {
    constructor(slectorItems) {
        super('selector');

        this.items = slectorItems.map(item => {
            return new Radio({
                className: 'selector__item',
                clickHandler: item.clickHandler,
                name: 'switch',
                value: item.value
            });
        });
    }

    createElement() {
        const selector = document.createElement('div');
        this.items.forEach(item => selector.appendChild(item.render()));

        return selector;
    }
}
