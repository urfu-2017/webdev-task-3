'use strict';

module.exports = array => {
    const arr = [];
    if (array) {
        array.forEach((elem, idx) => {
            if (idx === 0) {
                arr.push({ name: elem.name, arrowUp: false,
                    arrowDown: true, visited: elem.visited === 'true' });
            } else if (idx === array.length - 1) {
                arr.push({ name: elem.name, arrowUp: true,
                    arrowDown: false, visited: elem.visited === 'true' });
            } else {
                arr.push({ name: elem.name, arrowUp: true,
                    arrowDown: true, visited: elem.visited === 'true' });
            }
        });
    }

    return arr;
};
