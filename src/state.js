export const apiUrl = 'https://webdev-task-2-clzvgkakug.now.sh/places';
export const placeFilters = {
    all: () => true,
    visit: visited => visited === 'false',
    visited: visited => visited === 'true'
};
export const filtration = {
    soughtForMessage: '',
    checkVisit: placeFilters.all
};
export const directionToNameMethod = {
    up: 'previousSibling',
    down: 'nextSibling'
};

export const placesContainer = document.querySelector('#places');
export const messagesSearcher = document.querySelector('#search-string');
export const nameAddedPlace = document.querySelector('#name-added-place');
export const visitsChanger = document.querySelectorAll('[name="visit-filter"]');
export const creatorPlaces = document.querySelector('#create-place');
export const cleanerPlaces = document.querySelector('#cleaner-places');

export const editState = {
    addTravel(travel) {
        placesContainer.appendChild(travel);
        renderTravel(travel);
    },

    clear() {
        placesContainer.innerHTML = '';
    },

    updateTravelDisplay(travel) {
        renderTravel(travel);
    },

    swapTravels({ first, second }) {
        let tempForSecond = first.cloneNode(true);
        placesContainer.insertBefore(tempForSecond, first);
        placesContainer.insertBefore(first, second);
        placesContainer.insertBefore(second, tempForSecond);
        placesContainer.removeChild(tempForSecond);
    },

    deleteTravel(travel) {
        placesContainer.removeChild(travel);
    }
};


export function updateState(isFullRendering, changes) {
    if (changes) {
        // changes[method] === value
        Object.keys(changes).forEach(method => editState[method](changes[method]));
    }
    if (isFullRendering) {
        renderTravels();
    }
}


export function renderTravels() {
    for (let i = 0; i < placesContainer.childNodes.length; i++) {
        let travel = placesContainer.childNodes[i];
        renderTravel(travel);
    }
}

function renderTravel(travel) {
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
