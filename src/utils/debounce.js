/* eslint-disable no-invalid-this */

function debounce(func, delay = 200, callback) {
    let timer = null;

    return function (...args) {
        const onComplete = () => {
            timer = null;
            const result = func.apply(this, args);

            if (callback) {
                callback(result);
            }
        };

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(onComplete, delay);
    };
}

export default debounce;
