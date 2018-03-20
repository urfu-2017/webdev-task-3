import CustomElement from '../utils/custom-element.js';

class FontIcon extends CustomElement {
    constructor() {
        super();

    }

    init() {
        this.classList.add('fas', `fa-${this.getAttribute('icon')}`);
    }

}

customElements.define('font-icon', FontIcon);

export default FontIcon;
