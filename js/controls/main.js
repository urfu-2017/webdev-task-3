'use strict';

import Control from '../control';
import PlaceContainer from './place-container';
import Footer from './footer';
import Search from './search';
import Creator from './creator';
import Selector from './selector';
import Loader from './loader';

export default class Main extends Control {
    constructor(places) {
        super('main');

        this.loader = new Loader();
        this.search = new Search(text => this.filterSearch(text));
        this.creator = new Creator(async placeName => await this.addPlace(placeName));
        this.selector = new Selector([
            {
                value: 'all',
                clickHandler: () => this.filter(() => true)
            }, {
                value: 'visited',
                clickHandler: () => this.filter(p => p.visited)
            }, {
                value: 'unvisited',
                clickHandler: () => this.filter(p => !p.visited)
            }
        ]);
        this.places = new PlaceContainer(places, this.loader);
        this.footer = new Footer();
    }

    filterSearch(text) {
        this.places.filter(p => this.currentFilter(p) && p.title.includes(text));
    }

    filter(predicate) {
        this.currentFilter = predicate;
        this.places.filter(predicate);
    }

    async addPlace(placeTitle) {
        this.creator.clear();
        await this.places.addPlace(placeTitle);
        this.filter(() => true);
    }

    createElement() {
        const main = document.createElement('div');
        main.appendChild(this.search.render());
        main.appendChild(this.creator.render());
        main.appendChild(this.selector.render());
        main.appendChild(this.places.render());
        main.appendChild(this.footer.render());
        main.appendChild(this.loader.render());
        this.selector.items[0].click();
        this.loader.hide();

        return main;
    }
}
