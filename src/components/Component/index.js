document.components = {};
document.nextComponentId = 0;

class Component {
    constructor(props = {}) {
        this.props = props;
        this.id = document.nextComponentId;
        document.components[this.id] = this;
        document.nextComponentId++;
    }
}

export default Component;
