'use strict';

let places = [];

class Place {
    constructor({ description }) {
        this.description = description;
        this.visited = false;
        this.created = new Date();
    }

    save() {
        places.push(this);
    }

    static find(description) {
        return places.find(place => place.description === description);
    }

    static clearAll() {
        places.length = 0;
    }

    static removePlace(description) {
        places.splice(places[description], 1);
    }

    static mark(description, tick) {
        Place.find(description).visited = tick;
    }

    static edit(oldDescription, NewDescription) {
        Place.find(oldDescription).description = NewDescription;
    }

    static findAll() {
        return places;
    }

    static changeIndex(description, to) {
        let elemByDescription = Place.find(description);
        let elemByIndex = places[to];
        let from = places.indexOf(elemByDescription);
        places.splice(to, 1, elemByDescription);
        places.splice(from, 1, elemByIndex);
    }

    static dateSortAsc() {
        return places.sort(function (a, b) {
            return a.created - b.created;
        });
    }

    static dateSortDesc() {
        return places.sort(function (a, b) {
            return b.created - a.created;
        });
    }

    static abcSort() {
        return places.sort();
    }

    static paginate() {
        let pages = [];
        for (let i = 0; i < places.length; i += 3) {
            let page = places.slice(i, i + 3);
            pages.push(page);
        }

        return pages;
    }
}

module.exports = Place;
