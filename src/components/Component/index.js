document.components = {};
document.nextComponentId = 0;

class Component {
    constructor(props = {}, defaultProps = {}) {
        this.props = Object.assign(props, defaultProps);
    }

    static htmlToElement(html) {
        html = html.trim();

        const template = document.createElement('template');
        template.innerHTML = html;

        return template.content.firstChild;
    }
}

export default Component;
