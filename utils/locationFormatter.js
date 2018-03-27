'use strict';

module.exports = array => {
    const arr = [];
    if (array) {
        array.forEach(elem => {
            arr.push({ name: elem.name, visited: elem.visited === 'true' });
        });
    }

    return arr;
};
