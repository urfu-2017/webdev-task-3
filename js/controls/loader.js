'use strict';

import Control from '../control';

export default class Loader extends Control {
    constructor() {
        super('loader');
    }

    createElement() {
        return document.createElement('div');
    }
}
