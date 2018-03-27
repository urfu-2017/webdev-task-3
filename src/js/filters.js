'use strict';

import { api, filtration, messagesSearcher, visitsChanger, visitsFilters } from './globalVariables';
import { renderTravel } from './render';


export function changeVisitFilter() {
    for (let i = 0; i < visitsChanger.length; i++) {
        if (visitsChanger[i].checked) {
            filtration.checkVisit = visitsFilters[visitsChanger[i].id];
            break;
        }
    }
}

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

export function changeSearchFilter() {
    filtration.soughtForMessage = messagesSearcher.value;
}
