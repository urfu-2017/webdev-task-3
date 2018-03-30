'use strict';

window.appState.function.placeMove = placeMove;

function placeMove(_this, id, when) {
    var item = _this.parentElement.parentElement;
    if (when === 'up') {
        item.parentElement.insertBefore(item, item.previousElementSibling);
    } else {
        item.parentElement.insertBefore(item.nextElementSibling, item);
    }

    return window.api.placeMove({ when: when }, id).then(places => {
        window.appState.places = places;
    });
}
