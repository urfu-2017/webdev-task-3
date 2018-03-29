import { filtration, messagesSearcher, visitsChanger, placeFilters } from '../state';


export function changeVisitFilter() {
    for (let i = 0; i < visitsChanger.length; i++) {
        if (visitsChanger[i].checked) {
            filtration.checkVisit = placeFilters[visitsChanger[i].id];
            break;
        }
    }
}

export function changeSearchFilter() {
    filtration.soughtForMessage = messagesSearcher.value;
}
