function addAttributesToElement(attrs, el) {
    for (let key in attrs) {
        if (attrs.hasOwnProperty(key)) {
            const value = attrs[key];
            el.setAttribute(key, value);
        }
    }
}

export function createAndAppendElement(elementAppendTo, elementType, className, options) {
    const el = document.createElement(elementType);
    options = Object.assign({}, options);
    el.className = className;
    if (options.html) {
        el.innerHTML = options.html;
    }
    if (options.attrs) {
        addAttributesToElement(options.attrs, el);
    }
    elementAppendTo.appendChild(el);

    return el;
}
