'use strict';

import { api, placesContainer } from './globalVariables';


export function clearTravels() {
    api.deletePlaces()
        .then(() => placesContainer.innerHTML = '')
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
