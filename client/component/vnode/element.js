import { AbstractVNode } from './abstract';
import { EMPTY_OBJECT } from './utils';

/**
 * @property {HTMLElement} instance
 */
export class ElementVNode extends AbstractVNode {

    constructor(name, props, children) {
        super(name, props);
        this.children = children;
    }

    createInstance() {
        this.instance = document.createElement(this.type);
        const { ref, ...props } = this.props || EMPTY_OBJECT;

        if (props) {
            this._setAttributes(props);
        }

        if (ref) {
            ref(this.instance);
        }
    }

    /**
     * @param {ElementVNode} vNode
     */
    patch(vNode) {
        // eslint-disable-next-line no-unused-vars
        const { ref, ...props } = vNode.props || EMPTY_OBJECT;

        if (props) {
            this._setAttributes(props);
        }

        this._diffChildren(vNode);
    }

    /**
     * @param {Record<String, String | Boolean | Function>} attributes
     * @private
     */
    _setAttributes(attributes) {
        Object.entries(attributes).forEach(([name, value]) => {
            if (name.startsWith('on')) {
                this.instance[name.toLowerCase()] = value;
            } else if (value !== false) {
                this.instance.setAttribute(name, value);
            }
        });
    }

    /**
     * @param {String[]} names
     * @private
     */
    _removeAttributes(names) {
        names.forEach(name => {
            this.instance.removeAttribute(name);
        });
    }
}
