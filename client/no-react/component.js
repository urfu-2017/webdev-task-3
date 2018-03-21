/**
 * Base class for components
 */
export class Component {

    constructor(props) {
        this.props = props;
    }

    // eslint-disable-next-line
    /**
     * @returns {HTMLElement}
     */
    render() {
        throw new Error('Not implemented');
    }
}
