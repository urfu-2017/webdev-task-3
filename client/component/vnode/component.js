import { AbstractVNode } from './abstract';
import { ElementVNode } from './element';
import { EMPTY_OBJECT } from './utils';

export class ComponentVNode extends AbstractVNode {

    get node() {
        return this.instance.__root.instance;
    }

    get children() {
        return this.instance.__root.children;
    }

    set children(value) {
        this.instance.__root.children = value;
    }

    createInstance() {
        const { ref, ...props } = this.props || EMPTY_OBJECT;

        // eslint-disable-next-line new-cap
        this.instance = new this.type(props);
        const root = this.instance.render();

        if (!(root instanceof ElementVNode)) {
            throw new Error('Корневой узел компонента должен быть html элементом');
        }

        if (ref) {
            ref(this.instance);
        }

        root.createInstance();
        this.instance.__root = root;
    }

    /**
     * @param {ComponentVNode} vNode
     */
    patch(vNode) {
        // eslint-disable-next-line no-unused-vars
        const { ref, ...props } = vNode.props || EMPTY_OBJECT;

        if (this.instance.shouldUpdate(props)) {
            this.props = this.instance.props = props;
            const root = this.instance.render();

            this.instance.__root.patch(root);
        }
    }

    /**
     * @param {Node} node
     */
    mount(node) {
        super.mount(node);
        this.instance.componentDidMount();
    }

    unmount() {
        this.instance.componentWillUnmount();
        super.unmount();
    }
}
