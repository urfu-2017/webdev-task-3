import { api } from '../api';
import { nameAddedPlace } from '../state';
import { addTravel } from '../createForm/addPlace';


export function postAddedTravel() {
    if (!nameAddedPlace.value) {
        return;
    }
    api.postPlace()
        .then(addTravel)
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
