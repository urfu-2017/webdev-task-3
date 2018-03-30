'use strict';

window.appState.function.placeVisit = placeVisit;

function placeVisit(_this) {
    const id = _this.id;

    return window.api.placeVisit(id).then(place => {
        createCheckbox(place, _this);
        if (window.appState.activeFilter !== 'all') {
            window.addListPlaceInHtml();
        }
    });
}

function createCheckbox(place, checkbox) {
    checkbox.setAttribute('src', `/places/placesList/checkbox_${place.isVisited}.png`);
    if (place.isVisited) {
        checkbox.setAttribute('alt', 'Посещен');
    } else {
        checkbox.setAttribute('alt', 'Не посещен');
    }
    for (var index = 0; index < window.appState.places.length; index++) {
        if (window.appState.places[index].id === place.id) {
            window.appState.places[index].isVisited = place.isVisited;
        }
    }
}
