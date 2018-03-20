import CustomElement from '../utils/custom-element.js';
import { PlacesClient } from '../utils/api.js';

class AddBox extends CustomElement {
    constructor() {
        super();
    }


    /**
     * Registers handler on *create* event
     * @param {Function} handler
     */
    onCreate(handler) {
        this.addEventListener('create', handler);
    }

    init() {
        const placeholder = this.getAttribute('placeholder') || '';
        this.innerHTML = `
            <input type="text" class="add-box__input" placeholder="${placeholder}">
            <button class="add-box__add">Создать</button>
        `;

        this.getBemElement('add').addEventListener('click', () => {
            const input = this.getBemElement('input');
            PlacesClient.create({ description: input.value })
                .then(item => {
                    const event = new CustomEvent('create', { detail: item });
                    this.dispatchEvent(event);
                    input.value = '';
                });

        });
    }
}

customElements.define('add-box', AddBox);

export default AddBox;
