import Control from '../control';

export default class Footer extends Control {
    constructor() {
        super('footer');
    }

    createElement() {
        const footer = document.createElement('div');
        footer.innerText = 'Qoter 2018';

        return footer;
    }
}
