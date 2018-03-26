import { ElementVNode } from './element';
import { ComponentVNode } from './component';
import { PrimitiveVNode } from './primitive';

export function createVNode(type, props, ...children) {
    let vNode = null;

    if (typeof type === 'string') {
        vNode = new ElementVNode(type, props, children.reduce(parseChildren, []));
    }

    if (typeof type === 'function') {
        vNode = new ComponentVNode(type, props);
    }

    return vNode;
}

/**
 * @param {VNode[]} result
 * @param {*} child
 * @returns {VNode[]}
 */
function parseChildren(result, child) {
    if (Array.isArray(child)) {
        result.push(...child);
    } else if (typeof child === 'string' || typeof child === 'number') {
        result.push(new PrimitiveVNode(child));
    } else {
        result.push(child);
    }

    return result;
}
