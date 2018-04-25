export default class Control {
    constructor(className) {
        this.className = className;
    }
    show() {
        this.removeClass('control_hide');
    }

    hide() {
        this.addClass('control_hide');
    }

    createElement() {
        throw Error(`createElement is not implemented ${typeof this}`);
    }

    removeClass(className) {
        let classes = this.getClasses();
        classes = classes.filter(c => c !== className);

        this.setClasses(classes);
    }

    addClass(className) {
        let classes = this.getClasses();
        if (classes.includes(className)) {
            return;
        }
        classes.push(className);
        this.setClasses(classes);
    }

    getClasses() {
        return this.elem.className.split(' ');
    }

    setClasses(classes) {
        this.elem.className = classes.join(' ');
    }

    render() {
        this.elem = this.createElement();
        if (this.className) {
            this.elem.className = this.className;
        }

        return this.elem;
    }
}
