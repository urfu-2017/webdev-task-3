import { api } from '../api';
import { addTravel } from '../createForm/addPlace';

export function getAll() {
    api.getPlaces()
        .then(places => places.forEach(addTravel))
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
