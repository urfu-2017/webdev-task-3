'use strict';

import { api } from './globalVariables';
import { savePlace } from './savePlace';

export function getAll() {
    api.getPlaces()
        .then(places => places.forEach(savePlace))
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
