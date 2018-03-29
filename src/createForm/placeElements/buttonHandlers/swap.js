import { api } from '../../../api';
import { updateState } from '../../../state';
import { getIndexTravel } from '../../../utility/getIndexTravel';


export function swapTravels(first, second) {
    api.postSwapPlaces({ firstIndex: getIndexTravel(first), secondIndex: getIndexTravel(second) })
        .then(() => updateState(false, { swapTravels: { first, second } }))
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
