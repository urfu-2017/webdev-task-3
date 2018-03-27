'use strict';

import { filtration, messagesSearcher, placesContainer } from './globalVariables';


export function renderTravels() {
    for (let i = 0; i < placesContainer.childNodes.length; i++) {
        let travel = placesContainer.childNodes[i];
        renderTravel(travel);
    }
}

export function renderTravel(travel) {
    if (travelIncludesMessage(travel.dataset, messagesSearcher.value) &&
        filtration.checkVisit(travel.dataset.visited)) {
        travel.style.display = 'flex';
    } else {
        travel.style.display = 'none';
    }
}

function travelIncludesMessage(place, message) {
    return place.name.includes(message);
}
