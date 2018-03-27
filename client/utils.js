// eslint-disable-next-line no-invalid-this
export function debounce(fn, time, context = this) {
    let timeout;

    return function() {
        const functionCall = () => fn.apply(context, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}

// eslint-disable-next-line no-empty-function
export function stub() {}
