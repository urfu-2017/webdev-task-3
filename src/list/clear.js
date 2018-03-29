import { api } from '../api';
import { updateState } from '../state';


export function clearTravels() {
    api.deletePlaces()
        .then(() => updateState(false, { clear: true }))
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
