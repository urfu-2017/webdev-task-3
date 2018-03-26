import { AbstractVNode } from './abstract';
import { EMPTY_ARRAY } from './utils';

const primitiveType = Symbol('primitive');

export class PrimitiveVNode extends AbstractVNode {

    constructor(value) {
        super(primitiveType, { value: String(value) });
        this.children = EMPTY_ARRAY;
    }

    createInstance() {
        this.instance = document.createTextNode(String(this.props.value));
    }

    /**
     * @param {PrimitiveVNode} vNode
     */
    patch(vNode) {
        if (this.props.value !== vNode.props.value) {
            this.props = vNode.props;
            this.node.nodeValue = vNode.props.value;
        }
    }
}
