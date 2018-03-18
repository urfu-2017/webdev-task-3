/* eslint-env browser */
'use strict';

class Places {
    constructor() {
        this.list = [];

        this._div = document.querySelector('.places');
        this._listDiv = this._div.querySelector('.places__list');
        this._removeButton = this._div.querySelector('.places__top__remove-button');

        this.onClear = null;
        this.onSwap = null;

        this._initSwitch();

        this._removeButton.onclick = () => {
            if (this.onClear) {
                this.onClear();
            }
        };

        this._filterStr = '';
    }

    _initSwitch() {
        this._div
            .querySelectorAll('.places__top__switch > div')
            .forEach((div, index) => {
                div.onclick = () => {
                    this._div
                        .querySelector('.places__top__switch > div.active')
                        .classList
                        .remove('active');

                    div.classList.add('active');
                    this._switchList(index);
                };
            });
    }

    _switchList(type) {
        this._listDiv.innerHTML = '';

        let list = [];
        switch (type) {
            case 1:
                list = this.list.filter(place => !place.visited);
                break;
            case 2:
                list = this.list.filter(place => place.visited);
                break;
            default:
                list = this.list;
        }

        list.forEach(place => {
            this._listDiv.append(place.div);
        });
    }

    _swap(direction, index) {
        const first = index === 0 && direction === 'up';
        const last = index === this.list.length - 1 && direction === 'down';

        if (!first && !last) {
            if (this.onSwap) {
                const secondIndex = index + (direction === 'up' ? -1 : 1);

                this.onSwap(this.list[index].name, this.list[secondIndex].name);
                [this.list[index], this.list[secondIndex]] =
                    [this.list[secondIndex], this.list[index]];

                this.list[index].upButton.onclick = this._swap.bind(this, 'up', index);
                this.list[index].downButton.onclick = this._swap.bind(this, 'down', index);

                this.list[secondIndex].upButton.onclick = this._swap.bind(this, 'up', secondIndex);
                this.list[secondIndex].downButton.onclick =
                    this._swap.bind(this, 'down', secondIndex);

                this.filter(this._filterStr);
            }
        }
    }

    add(place) {
        this.list.push(place);
        this._listDiv.append(place.div);

        place.upButton.onclick = this._swap.bind(this, 'up', this.list.length - 1);
        place.downButton.onclick = this._swap.bind(this, 'down', this.list.length - 1);
    }

    filter(str) {
        this._filterStr = str;

        this._listDiv.innerHTML = '';
        this.list
            .filter(place => place.name.startsWith(str))
            .forEach(place => this._listDiv.append(place.div));
    }

    remove(places) {
        const names = places.map(place => place.name);

        this._listDiv.innerHTML = '';
        this.list = this.list.filter(place => names.indexOf(place.name) === -1);
        this.list.forEach(this.add.bind(this));
    }

    clear() {
        this.list = [];
        this._listDiv.innerHTML = '';
    }
}

module.exports = Places;
