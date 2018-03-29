import { api } from '../../../api';
import { renderTravel } from '../../../state';


export function changeVisitStatus(checkbox) {
    const isVisited = !(checkbox.parentNode.dataset.visited === 'true');
    checkbox.disabled = true;
    api.postChangeVisitStatus({ checkbox, isVisited })
        .then(() => {
            checkbox.parentNode.dataset.visited = isVisited;
            renderTravel(checkbox.parentNode);
            checkbox.disabled = false;
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
