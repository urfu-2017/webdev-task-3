import CustomElement from '../utils/custom-element.js';
import ListItem from './list-item.js';
import { PlacesClient } from '../utils/api.js';

class FilteredList extends CustomElement {
    constructor() {
        super();
    }

    init() {
        const title = this.getAttribute('title') || 'Список';
        this.states = ['all', 'visited', 'unvisited'];
        this.setState('all');
        this.innerHTML = `
            <span class="filtered-list__title">${title}</span>
            <font-icon icon="trash" class="filtered-list__clear"></font-icon>
            <button class="filtered-list__all">Все</button>
            <button class="filtered-list__visited">Посещенные</button>
            <button class="filtered-list__unvisited">Посетить</button>
            <div class="filtered-list__items">
                ${this.innerHTML}
            </div>
        `;

        this.filters = {};
        this.getBemElement('clear').addEventListener('click', () => {
            this.clear();
        });

        this.getBemElement('items').addEventListener('update', () => {
            this.updateListVisibility();
        });
        this.registerButtonFilter('all', () => true);
        this.registerButtonFilter('visited', child => child.getIsVisited());
        this.registerButtonFilter('unvisited', child => !child.getIsVisited());

        this.loadData();
    }

    clear() {
        PlacesClient.clear()
            .then(() => {
                this.getBemElement('items').innerHTML = '';
            });
    }

    loadData() {
        PlacesClient.getAll()
            .then(items => items.forEach(item => this.addItem(item)));
    }

    /**
     * Adds new element to list
     * @param {Object} itemData
     */
    addItem(itemData) {
        const item = document.createElement('list-item');
        item.setAttribute('description', itemData.description);
        item.setAttribute('id', itemData.id);
        item.setAttribute('isVisited', itemData.isVisited);
        this.getBemElement('items').appendChild(item);
    }

    setFilter(key, predicate) {
        this.filters[key] = predicate;
        this.updateListVisibility();
    }

    updateListVisibility() {
        this.getItems()
            .forEach(child => {
                const visible = Object.values(this.filters)
                    .every(needToShow => needToShow(child));

                return child.setVisibility(visible);
            });
    }

    registerButtonFilter(name, needToShow) {
        this.getBemElement(name).addEventListener('click', () => {
            this.setState(name);
            this.setFilter('visited', needToShow);
        });
    }

    getItems() {
        return Array.from(this.getBemElement('items').children)
            .filter(child => child instanceof ListItem);
    }
}

customElements.define('filtered-list', FilteredList);

export default FilteredList;
