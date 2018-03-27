'use strict';

import { api, nameAddedPlace } from './globalVariables';
import { savePlace } from './savePlace';


export function postAddedTravel() {
    if (!nameAddedPlace.value) {
        return;
    }
    api.postPlace()
        .then(savePlace)
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
