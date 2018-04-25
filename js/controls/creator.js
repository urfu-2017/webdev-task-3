import Control from '../control';
import Input from '../common/input';
import Button from '../common/button';

export default class Creator extends Control {
    constructor(createHandler) {
        super('creator');

        this.input = new Input({
            className: 'creator__input',
            enterHandler: async () => await createHandler(this.input.getValue()),
            maxLength: 22
        });
        this.button = new Button({
            className: 'creator__button btn btn_add',
            clickHandler: async () => await createHandler(this.input.getValue())
        });
    }

    clear() {
        this.input.setValue('');
    }

    createElement() {
        const creator = document.createElement('div');
        creator.appendChild(this.input.render());
        creator.appendChild(this.button.render());

        return creator;
    }
}
