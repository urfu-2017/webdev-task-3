import { api } from '../api';
import { placesContainer } from '../state';


export function clearTravels() {
    api.deletePlaces()
        .then(() => placesContainer.innerHTML = '')
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
