'use strict';

window.onload = getAllPlace();

function getAllPlace() {
    stateButton();
    if (window.appState.places.length !== 0) {
        window.addListPlaceInHtml();

        return;
    }

    return window.api.getAllPlace().then(places => {
        window.appState.places = places;
        window.addListPlaceInHtml();
    });
}

function stateButton() {
    var buttonActiveOld = document.querySelector('.button-sort__button-active');
    buttonActiveOld.classList.remove('button-sort__button-active');
    var button;
    switch (window.appState.activeFilter) {
        case 'all':
            button = document.querySelector('.button-sort__button_all');
            break;
        case 'visit':
            button = document.querySelector('.button-sort__button_visit_false');
            break;
        case 'noVisit':
            button = document.querySelector('.button-sort__button_visit_true');
            break;
        default:
            break;
    }
    button.classList.add('button-sort__button-active');
}
