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

        this._setAttributes(props);

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
        this.props = props;
        this._setAttributes(props);

        this._diffChildren(vNode);
    }

    /**
     * @param {Record<String, String | Boolean | Function>} attributes
     * @private
     */
    _setAttributes(attributes) {
        Array.from(this.instance.attributes).forEach(attr => {
            this.instance.removeAttribute(attr.name);
        });

        Object.entries(attributes).forEach(([name, value]) => {
            if (name.startsWith('on') || (name in this.instance)) {
                this.instance[name.toLowerCase()] = value;
            } else if (value !== false) {
                this.instance.setAttribute(name, value);
            }
        });
    }
}
