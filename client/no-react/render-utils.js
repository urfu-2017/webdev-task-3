/**
 * @param {HTMLElement} el
 * @param {String} name
 * @param {String | Boolean | Function} value
 */

export function setAttribute(el, name, value) {
    if (name === 'ref' && typeof value === 'function') {
        value(el);
    } else if (name.startsWith('on') && typeof value === 'function') {
        const eventName = name.slice(2).toLowerCase();
        el.addEventListener(eventName, value);
    } else {
        el.setAttribute(name, value);
    }
}

/**
 * @param {HTMLElement } el
 * @param {String | HTMLElement} children
 */
export function appendChildren(el, ...children) {
    for (let child of children) {
        child = typeof child === 'string' ? document.createTextNode(child) : child;
        el.appendChild(child);
    }
}

/**
 * @param {Function} Component
 * @param {Function} ref
 * @param {Object} props
 * @returns {HTMLElement}
 */
function createComponent(Component, { ref, ...props }) {
    const component = new Component(props);

    if (ref) {
        ref(component);
    }

    return component.render();
}

/**
 * @param {String | Function} element
 * @param {Object} attrs
 * @param {HTMLElement | String} children
 * @returns {HTMLElement}
 */
export function createElement(element, attrs, ...children) {
    if (typeof element === 'function') {
        return createComponent(element, { ...attrs, children });
    }

    const el = document.createElement(element);

    if (attrs) {
        Object.entries(attrs).forEach(([key, value]) => setAttribute(el, key, value));
    }

    if (children.length) {
        appendChildren(el, ...children);
    }

    return el;
}
