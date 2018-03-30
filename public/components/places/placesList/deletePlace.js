'use strict';

window.appState.function.deletePlace = deletePlace;

function deletePlace(_this, id) {

    return window.api.deletePlace(id).then(place => {
        deleteNode(_this.parentElement.parentElement);
        for (var index = 0; index < window.appState.places.length; index++) {
            if (window.appState.places[index].id === place.id) {
                window.appState.places.splice(index, 1);
            }
        }
    });
}

function deleteNode(child) {
    child.parentElement.removeChild(child);
}
