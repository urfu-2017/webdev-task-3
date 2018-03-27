'use strict';

import { api } from './globalVariables';


export function swapTravels(first, second) {
    api.postSwapPlaces({ first, second })
        .then(() => {
            const parent = first.parentNode;
            let tempForSecond = first.cloneNode(true);
            parent.insertBefore(tempForSecond, first);
            parent.insertBefore(first, second);
            parent.insertBefore(second, tempForSecond);
            parent.removeChild(tempForSecond);
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
