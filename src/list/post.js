import { api } from '../api';
import { nameAddedPlace, updateState } from '../state';
import { createTravel } from '../createForm/addPlace';


export function postAddedTravel() {
    if (!nameAddedPlace.value) {
        return;
    }
    api.postPlace()
        .then(place => updateState(false, { addTravel: createTravel(place) }))
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
