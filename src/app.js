import { cleanerPlaces, creatorPlaces, messagesSearcher, visitsChanger, updateState }
    from './state';
import { changeSearchFilter, changeVisitFilter } from './search/filters';
import { clearTravels } from './list/clear';
import { getAll } from './list/getAll';
import { postAddedTravel } from './list/post';


window.addEventListener('load', getAll);

messagesSearcher.addEventListener('keyup', (e = window.event) => {
    // enter
    if (e.keyCode === 13) {
        changeSearchFilter();
        updateState(true);
    }
});

creatorPlaces.addEventListener('click', postAddedTravel);

cleanerPlaces.addEventListener('click', clearTravels);

visitsChanger.forEach(checkbox => checkbox.addEventListener('click', () => {
    changeVisitFilter();
    updateState(true);
}));
