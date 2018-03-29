import { api } from '../../../api';
import { updateState } from '../../../state';


export function swapTravels(first, second) {
    api.postSwapPlaces({ first, second })
        .then(() => updateState(false, { swapTravels: { first, second } }))
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
