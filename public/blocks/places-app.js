import CustomElement from '../utils/custom-element.js';

class PlacesApp extends CustomElement {
    constructor() {
        super();

    }

    init() {
        this.innerHTML = `
            <search-box class="places-app__search"></search-box>
            <add-box class="places-app__add" placeholder="Название места"></add-box>
            <list-filter title="Места" class="places-app__list"></list-filter>
            <app-footer class="places-app__footer"></app-footer>
        `;

        this.getBemElement('add').onCreate((data) => {
            this.getBemElement('list').addItem(data.detail);
        });

        this.getBemElement('search').onQueryChange((data) => {
            this.getBemElement('list').setFilter('search', (child) => {
                const query = data.detail.query.toLowerCase();
                if (query === '') {
                    return true;
                }
                const description = child.getDescription().toLowerCase();

                return description.indexOf(query) >= 0;
            });
        });
    }
}

customElements.define('places-app', PlacesApp);

export default PlacesApp;
