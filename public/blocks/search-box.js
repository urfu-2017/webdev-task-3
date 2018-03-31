import CustomElement from '../utils/custom-element.js';

class SearchBox extends CustomElement {
    constructor() {
        super();
    }


    /**
     * Registers handler on *change* event
     * @param {Function} handler
     */
    onQueryChange(handler) {
        this.addEventListener('queryChange', handler);
    }

    init() {
        this.innerHTML = `
            <font-icon icon="search" class="search-box__icon"></font-icon>
            <input type="search" class="search-box__input" placeholder="Поиск">
        `;

        this.getBemElement('input').addEventListener('keyup', () => {
            const input = this.getBemElement('input');
            const detail = { query: input.value || '' };
            this.dispatchEvent(new CustomEvent('queryChange', { detail }));
        });
    }
}

customElements.define('search-box', SearchBox);

export default SearchBox;
