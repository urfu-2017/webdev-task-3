class CustomElement extends HTMLElement {
    constructor() {
        super();
    }

    // eslint-disable-next-line no-empty-function
    init() {
    }

    connectedCallback() {
        if (!this.isInitialized) {
            this.elementsCache = new Map();
            this.bemBlockName = this.tagName.toLowerCase();
            this.classList.add(this.bemBlockName);
            this.init();
            this.isInitialized = true;
        }

    }

    /**
     * Sets state modifier on current block
     * @param {String} state
     */
    setState(state) {
        const statesClasses = this.states.map(x => `${this.bemBlockName}_state_` + x);
        this.classList.remove(...statesClasses);
        this.classList.add(`${this.bemBlockName}_state_${state}`);
    }

    /**
     * Returns name of the current state
     * @returns {String} state
     */
    getState() {
        return Array.from(this.classList)
            .filter(x => x.startsWith(`${this.bemBlockName}_state_`))[0]
            .slice(`${this.bemBlockName}_state_`.length);
    }

    /**
     * Returns BEM element of the current block
     * @returns {HTMLElement}
     * @param {String} bemElementName
     */
    getBemElement(bemElementName) {
        if (this.elementsCache.has(bemElementName)) {
            return this.elementsCache.get(bemElementName);
        }
        const selector = `.${this.bemBlockName}__${bemElementName}`;
        const element = this.querySelector(selector);
        this.elementsCache.set(bemElementName, element);

        return element;
    }
}

export default CustomElement;
