'use strict';

class SearchState {
    constructor() {
        this.all = true;
        this.toVisit = false;
        this.visited = false;
    }

    switchState(state) {
        this.all = false;
        this.toVisit = false;
        this.visited = false;
        this[state] = true;
    }
}

let searchState = new SearchState();
