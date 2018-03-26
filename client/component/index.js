/* eslint-disable no-unused-vars */
import { createVNode } from './vnode';

/**
 * @property {VNode} __root
 */
export class Component {

    static create(type, props, ...children) {
        return createVNode(type, props, ...children);
    }

    constructor(props) {
        this.props = props;
        this.state = null;
    }

    /**
     * Обновляет состояние компонента
     * @param {Object | Function} state
     */
    setState(state) {
        this.state = { ...this.state, ...state };
        this.__root.diff(this.render());
    }

    /**
     * Вызывает, когда компонент был смонтирован
     * в какое либо DOM дерево
     */
    componentDidMount() {
        return;
    }

    /**
     * Вызывается, когда компонент будет отмонтирован
     * от какого либо DOM дерева
     */
    componentWillUnmount() {
        return;
    }

    /**
     * Вызывается, когда компоненту переданы новые свойства
     * @param {Object} newProps
     * @returns {boolean}
     */
    shouldUpdate(newProps) {
        return true;
    }

    /**
     * Генерирует виртуальное дерево компонента
     * @returns {VNode}
     */
    render() {
        return null;
    }
}
