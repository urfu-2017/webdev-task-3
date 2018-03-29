import { api } from '../../../api';
import { updateState } from '../../../state';


export function changeVisitStatus(checkbox) {
    const travel = checkbox.parentNode;
    const isVisited = !(travel.dataset.visited === 'true');
    checkbox.disabled = true;
    api.postChangeVisitStatus({ checkbox, isVisited })
        .then(() => {
            travel.dataset.visited = isVisited;
            updateState(false, { updateTravelDisplay: travel });
            checkbox.disabled = false;
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
