'use strict';

import { creatorPlaces, cleanerPlaces, messagesSearcher, visitsChanger } from './globalVariables';
import { getAll } from './getAll';
import { postAddedTravel } from './postAddedTravel';
import { changeSearchFilter } from './filters';
import { renderTravels } from './render';
import { clearTravels } from './clearTravels';
import { changeVisitFilter } from './filters';


window.addEventListener('load', getAll);

messagesSearcher.addEventListener('keyup', (e = window.event) => {
    // enter
    if (e.keyCode === 13) {
        changeSearchFilter();
        renderTravels();
    }
});

creatorPlaces.addEventListener('click', postAddedTravel);

cleanerPlaces.addEventListener('click', clearTravels);

visitsChanger.forEach(checkbox => checkbox.addEventListener('click', () => {
    changeVisitFilter();
    renderTravels();
}));
