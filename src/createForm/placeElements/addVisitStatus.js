import { changeVisitStatus } from './buttonHandlers/visit';


export function addVisitStatus(travel, place) {
    const statusVisit = document.createElement('input');
    statusVisit.type = 'checkbox';
    statusVisit.className = 'travel__visit-state travel__icon travel__button';
    if (place.visited) {
        statusVisit.checked = true;
    }
    statusVisit.addEventListener('click', () => changeVisitStatus(statusVisit));
    travel.appendChild(statusVisit);
}
