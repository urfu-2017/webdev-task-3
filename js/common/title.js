import Control from '../control';

export default class Title extends Control {
    constructor({ className, value }) {
        super(className);
        this.value = value;
    }

    getValue() {
        return this.elem.innerText;
    }

    setValue(value) {
        this.elem.innerText = value;
    }

    createElement() {
        const title = document.createElement('span');
        title.innerText = this.value;

        return title;
    }
}
