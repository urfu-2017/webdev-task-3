import { api } from '../api';
import { createTravel } from '../createForm/addPlace';
import { updateState } from '../state';


export function getAll() {
    api.getPlaces()
        .then(places => places.forEach(place => updateState(false, {
            addTravel: createTravel(place)
        })))
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
