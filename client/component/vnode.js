const primitiveType = Symbol('primitive');

/**
 * @property {String | Function} type
 * @property {Object} props
 * @property {VNode} children
 * @property {Node | Component} instance
 */
export class VNode {
    constructor(type, props, ...children) {
        this.type = type;
        this.props = props;
        this.children = type !== primitiveType && children.length
            ? children.reduce(parseChildren, []) : children;
    }

    /**
     * @returns {boolean}
     */
    get isComponent() {
        return typeof this.type === 'function';
    }

    /**
     * @returns {boolean}
     */
    get isElement() {
        return typeof this.type === 'string';
    }

    /**
     * @returns {boolean}
     */
    get isPrimitive() {
        return this.type === primitiveType;
    }

    get realChildren() {
        return this.isComponent ? this.instance.__root.children : this.children;
    }

    set realChildren(value) {
        if (this.isComponent) {
            this.instance.__root.children = value;
        } else {
            this.children = value;
        }

    }

    /**
     * @returns {Node}
     */
    get node() {
        if (this.isComponent) {
            return this.instance.__root.instance;
        }

        return this.instance;
    }

    /**
     * Рекурсивно создаём экземпляры dom элементов
     * для текущего виртуального узла
     */
    createInstance() {
        let instance = null;
        const { ref, ...props } = this.props || {};
        if (this.isPrimitive) {
            this.instance = document.createTextNode(props.value);
            return;
        }

        if (this.isComponent) {
            instance = createComponent(this.type, props);
            instance.__root.createInstance();
        } else if (this.isElement) {
            instance = createElement(this.type, props);
        }

        if (ref) {
            ref(instance);
        }

        this.instance = instance;
    }

    /**
     * Рекурсивно монтирует узлы к корню
     * @param {Node} node
     */
    mount(node) {
        if (!this.instance) {
            this.createInstance();
        }

        for (const child of this.realChildren) {
            child.mount(this.node);
        }

        node.appendChild(this.node);

        if (this.isComponent) {
            this.instance.componentDidMount();
        }
    }

    /**
     * Начинает процесс обновления дерева компонентов
     * @param {VNode} newVNode
     */
    diff(newVNode) {
        if (this.type !== newVNode.type) {
            // Полная замена узла
            this.replace(newVNode);
        } else if (this.isPrimitive) {
            // Изменить примитивную ноду
            this._tryPatchPrimitive(newVNode);
        } else if (this.isElement) {
            // Изменить html элемент
            this._tryPatchElement(newVNode);
        } else if (this.isComponent) {
            // Изменить компонент
            this._tryPatchComponent(newVNode);
        } else {
            throw new Error('');
        }
    }

    /**
     * Заменяет один узел другим в dom дереве
     * @param {VNode} vNode
     */
    replace(vNode) {
        vNode.createInstance();

        for (const child of vNode.realChildren) {
            child.mount(vNode.node);
        }

        // Заменяем элемент в dom дереве
        const parentNode = this.node.parentNode;
        parentNode.insertBefore(vNode.node, this.node);
        this.node.remove();

        // Заменяем узел в виртуальном дереве
        this.type = vNode.type;
        this.props = vNode.props;
        this.instance = vNode.instance;
        this.children = vNode.children;
    }

    /**
     * @param {VNode} newVNode
     * @private
     */
    // eslint-disable-next-line max-statements
    _diffChildren(newVNode) {
        const oldChildren = this.realChildren;
        const newChildren = newVNode.realChildren;
        const markToDeleted = [];

        let n = 0;
        let oldChild = oldChildren[n];
        let newChild = newChildren[n];

        while (oldChild || newChild) {
            if (oldChild && !newChild) {
                // удалить ребёнка из виртуального дерева
                markToDeleted.push(oldChild);
                oldChild.unmount();
            } else if (!oldChild && newChild) {
                // добавить ребёнка к виртуальному дереву
                oldChildren.push(newChild);
                newChild.mount(this.node);
            } else {
                oldChild.diff(newChild);
            }

            n++;
            oldChild = oldChildren[n];
            newChild = newChildren[n];
        }

        this.realChildren = oldChildren.filter(child => !markToDeleted.includes(child));
    }

    /**
     * Удаляет узел из dom дерева
     */
    unmount() {
        if (this.isComponent) {
            this.instance.componentWillUnmount();
        }

        this.node.remove();
    }

    /**
     * @param {VNode} vNode
     * @private
     */
    _tryPatchPrimitive(vNode) {
        if (this.props.value !== vNode.props.value) {
            this.props = vNode.props;
            this.node.nodeValue = vNode.props.value;
        }
    }

    /**
     * @param {VNode} vNode
     * @private
     */
    _tryPatchElement(vNode) {
        if (vNode.props) {
            // eslint-disable-next-line no-unused-vars
            const { ref, ...props } = vNode.props;

            setAttributes(this.node, props);
        }

        this._diffChildren(vNode);
    }

    /**
     * @param {VNode} vNode
     * @private
     */
    _tryPatchComponent(vNode) {
        if (this.instance.shouldUpdate(vNode.props)) {
            this.props = this.instance.props = vNode.props;
            const root = this.instance.render();

            this._diffChildren(root);
        }
    }
}

/**
 * @param {Component} Component
 * @param {Object} props
 * @returns {*}
 */
function createComponent(Component, props) {
    const component = new Component(props);
    const root = component.render();

    if (!root.isElement) {
        throw new Error('Корневой узел компонента должен быть html элементом');
    }

    component.__root = root;

    return component;
}

/**
 * @param {String} name
 * @param {Object} props
 * @returns {Node}
 */
function createElement(name, props) {
    const element = document.createElement(name);

    if (props) {
        setAttributes(element, props);
    }

    return element;
}

function parseChildren(result, child) {
    if (Array.isArray(child)) {
        result.push(...child);
    } else if (typeof child === 'string' || typeof child === 'number') {
        result.push(new VNode(primitiveType, { value: String(child) }));
    } else {
        result.push(child);
    }

    return result;
}

/**
 * @param {HTMLElement} el
 * @param {Object} attrs
 */
function setAttributes(el, attrs) {
    const oldAttrs = Array.from(el.attributes);
    const newAttrs = Object.keys(attrs);

    if (oldAttrs.length === 0 && newAttrs.length === 0) {
        return;
    }

    oldAttrs.forEach(attr => {
        el.removeAttribute(attr.name);
    });

    newAttrs.forEach(attrName => {
        if (attrName.startsWith('on')) {
            const evtName = attrName.toLowerCase();
            el[evtName] = attrs[attrName];
        } else if (attrs[attrName] !== false) {
            el.setAttribute(attrName, attrs[attrName]);
        }
    });
}
