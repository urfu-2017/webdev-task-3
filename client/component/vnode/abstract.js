/**
 * @property {String | Function} type
 * @property {Object} props
 * @property {AbstractVNode} children
 * @property {Node | Component} instance
 */
export class AbstractVNode {
    constructor(type, props) {
        this.type = type;
        this.props = props;
    }

    /**
     * @returns {Node}
     */
    get node() {
        return this.instance;
    }

    /**
     * Рекурсивно создаём экземпляры dom элементов
     * для текущего виртуального узла
     */
    createInstance() {
        throw new Error('Not implemented');
    }

    tryCreateInstance() {
        if (!this.instance) {
            this.createInstance();
        }
    }

    /**
     * Рекурсивно монтирует узлы к корню
     * @param {Node} node
     */
    mount(node) {
        this.tryCreateInstance();

        for (const child of this.children) {
            child.mount(this.node);
        }

        node.appendChild(this.node);
    }

    patch() {
        throw new Error('Not implemented');
    }

    /**
     * Начинает процесс обновления дерева компонентов
     * @param {AbstractVNode} vNode
     */
    diff(vNode) {
        if (this.type !== vNode.type) {
            this.replace(vNode);
        }

        this.patch(vNode);
    }

    /**
     * Заменяет один узел другим в dom дереве
     * @param {AbstractVNode} vNode
     */
    replace(vNode) {
        vNode.tryCreateInstance();

        for (const child of vNode.children) {
            child.mount(vNode.node);
        }

        // Заменяем элемент в dom дереве
        const parentNode = this.node.parentNode;
        parentNode.insertBefore(vNode.node, this.node);
        this.unmount();

        // Заменяем узел в виртуальном дереве
        this.type = vNode.type;
        this.props = vNode.props;
        this.instance = vNode.instance;
        this.children = vNode.children;
    }

    /**
     * @param {AbstractVNode} vNode
     * @private
     */
    // eslint-disable-next-line max-statements
    _diffChildren(vNode) {
        const markToDelete = [];

        let n = 0;
        let oldChild = this.children[n];
        let newChild = vNode.children[n];

        while (oldChild || newChild) {
            if (oldChild && !newChild) {
                // удалить ребёнка из виртуального дерева
                markToDelete.push(oldChild);
                oldChild.unmount();
            } else if (!oldChild && newChild) {
                // добавить ребёнка к виртуальному дереву
                this.children.push(newChild);
                newChild.mount(this.node);
            } else {
                oldChild.diff(newChild);
            }

            n++;
            oldChild = this.children[n];
            newChild = vNode.children[n];
        }

        this.children = this.children.filter(child => !markToDelete.includes(child));
    }

    /**
     * Удаляет узел из dom дерева
     */
    unmount() {
        this.node.remove();
    }
}
