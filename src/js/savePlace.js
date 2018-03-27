'use strict';

import { placesContainer } from './globalVariables';
import { renderTravel } from './render';
import { addTitle } from './travelElements/addTitle';
import { addVisitStatus } from './travelElements/addVisitStatus';
import { addArrows } from './travelElements/addArrows';
import { addEditButton } from './travelElements/addEditButton';
import { addDeleteButton } from './travelElements/addDeleteButton';
import { addCancelButton } from './travelElements/addCancelButton';
import { addOkButton } from './travelElements/addOkButton';


export function savePlace(place) {
    const travel = createListItem(place);
    saveFields(travel, place);
    renderTravel(travel);
    placesContainer.appendChild(travel);
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
