import CustomElement from '../utils/custom-element.js';
import { PlaceClient } from '../utils/api.js';

class ListItem extends CustomElement {
    constructor() {
        super();

    }

    /**
     * Sets visibility of the block
     * @param {Boolean} visible
     */
    setVisibility(visible) {
        const state = this.getState();
        if (state === 'normal' && visible === false) {
            this.setState('hidden');
        } else if (state === 'hidden' && visible === true) {
            this.setState('normal');
        }
    }

    /**
     * Returns name of the current state
     * @returns {Boolean}
     */
    getIsVisited() {
        return this.getBemElement('checkbox').checked;
    }

    setIsVisited(isVisited) {
        const checkbox = this.getBemElement('checkbox');
        const input = this.getBemElement('input');

        if (isVisited) {
            checkbox.checked = true;
            input.style.textDecoration = 'line-through';
        } else {
            checkbox.checked = false;
            input.style.textDecoration = 'none';
        }
    }

    /**
     * Returns description of item
     * @returns {String}
     */
    getDescription() {
        return this.getBemElement('input').value;
    }

    setDescription(value, readOnly) {
        const input = this.getBemElement('input');
        input.value = value;
        input.readOnly = readOnly;
    }


    init() {
        this.placeClient = new PlaceClient(() => this.getAttribute('id'));
        const value = this.getAttribute('description') || '';
        this.innerHTML = `
            <font-icon icon="pencil-alt" class="list-item__edit"></font-icon>
            <font-icon icon="trash" class="list-item__remove"></font-icon>
            <input readonly type="text" class="list-item__input" value="${value}">
            <font-icon icon="arrow-up" class="list-item__up"></font-icon>
            <font-icon icon="arrow-down" class="list-item__down"></font-icon>
            <input type="checkbox" class="list-item__checkbox">
            <font-icon icon="check" class="list-item__accept"></font-icon>
            <font-icon icon="times" class="list-item__cancel"></font-icon>
        `;

        this.setIsVisited(this.getAttribute('isVisited') === 'true');
        this.states = ['normal', 'editing', 'hovering', 'hidden'];
        this.setState('normal');

        this.getBemElement('up').addEventListener('click', () => {
            const prev = this.previousElementSibling;
            if (prev instanceof ListItem) {
                this.placeClient.sendMove(-1).then(() => this.parentNode.insertBefore(this, prev));
            }
        });

        this.getBemElement('down').addEventListener('click', () => {
            const next = this.nextElementSibling;
            if (next instanceof ListItem) {
                this.placeClient.sendMove(1).then(() => this.parentNode.insertBefore(next, this));
            }
        });

        this.getBemElement('remove').addEventListener('click', () => {
            this.placeClient.sendRemove().then(() => this.remove());
        });

        this.getBemElement('edit').addEventListener('click', () => {
            this.setState('editing');
            this.oldValue = this.getDescription();
            this.getBemElement('input').readOnly = false;
        });

        this.getBemElement('accept').addEventListener('click', () => {
            this.placeClient.sendUpdate({ description: this.getDescription() })
                .then(item => {
                    this.setState('normal');
                    this.setDescription(item.description, true);
                });
        });

        this.getBemElement('cancel').addEventListener('click', () => {
            this.setState('normal');
            this.setDescription(this.oldValue, true);
        });

        this.addEventListener('mouseenter', () => {
            if (this.getState() === 'normal') {
                this.setState('hovering');
            }
        });

        this.addEventListener('mouseleave', () => {
            if (this.getState() === 'hovering') {
                this.setState('normal');
            }
        });

        this.getBemElement('checkbox').addEventListener('click', () => {
            this.placeClient.sendUpdate({ isVisited: this.getIsVisited() })
                .then(item => {
                    this.setIsVisited(item.isVisited);
                });

        });

    }


}

customElements.define('list-item', ListItem);

export default ListItem;
