import CustomElement from '../utils/custom-element.js';

class AppFooter extends CustomElement {
    constructor() {
        super();
    }

    init() {
        this.innerHTML = `
            <footer class="app-footer">
                <span class="app-footer__caption">&copy;kvas</span>
                <span class="app-footer__year">2018</span>
            </footer>
        `;
    }

}

customElements.define('app-footer', AppFooter);

export default AppFooter;
