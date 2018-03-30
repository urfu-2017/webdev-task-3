'use strict';

const clickDelete = document.querySelector('.places__name-header');

clickDelete.addEventListener('mousedown', () => {

    return window.api.deleteAll().then(places => {
        window.appState.places = places;
        window.addListPlaceInHtml();
    });
});
