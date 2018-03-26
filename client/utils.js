export function debounce(f, ms) {

    let timer = null;

    return function (...args) {
        const onComplete = () => {
            // eslint-disable-next-line no-invalid-this
            f.apply(this, args);
            timer = null;
        };

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(onComplete, ms);
    };
}
