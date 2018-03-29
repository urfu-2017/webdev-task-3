import { addTitle } from './placeElements/addTitle';
import { addVisitStatus } from './placeElements/addVisitStatus';
import { addArrows } from './placeElements/addArrows';
import { addEditButton } from './placeElements/addEditButton';
import { addDeleteButton } from './placeElements/addDeleteButton';
import { addCancelButton } from './placeElements/addCancelButton';
import { addOkButton } from './placeElements/addOkButton';


export function createTravel(place) {
    const travel = createListItem(place);
    saveFields(travel, place);

    return travel;
}

function createListItem(place) {
    const travel = document.createElement('div');
    travel.className = 'places__travel';
    travel.tabIndex = -1;
    addTitle(travel, place);
    addVisitStatus(travel, place);
    addArrows(travel);
    addEditButton(travel);
    addDeleteButton(travel);
    addCancelButton(travel);
    addOkButton(travel);

    return travel;
}

function saveFields(travel, place) {
    travel.dataset.id = place.id;
    travel.dataset.visited = place.visited;
    travel.dataset.name = place.name;
}
