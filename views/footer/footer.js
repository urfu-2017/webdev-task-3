/* eslint-env node, browser */
'use strict';

const footerInner = require('./footer.html');

exports.Footer = class {
    constructor() {
        this.footer = document.createElement('footer');
        this.footer.classList.add('footer');
        this.footer.innerHTML = footerInner;

        this.copyright = this.footer.getElementsByClassName('footer__copyright')[0];
        this.date = this.footer.getElementsByClassName('footer__date')[0];
    }

    get element() {
        return this.footer;
    }
};
