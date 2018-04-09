export default class Control {
    constructor(className) {
        this.className = className;
    }
    show() {
        this.elem.style.display = '';
    }

    hide() {
        this.elem.style.display = 'none';
    }

    createElement() {
        throw Error(`createElement is not implemented ${typeof this}`);
    }

    toggleClass(toggledClass) {
        if (this.elem.className !== this.className) {
            this.elem.className = this.className;
        } else {
            this.elem.className = `${this.className} ${toggledClass}`;
        }
    }

    render() {
        this.elem = this.createElement();
        if (this.className) {
            this.elem.className = this.className;
        }

        return this.elem;
    }
}
