'use strict';

window.addListPlaceInHtml = function () {
    var places = [];
    if (!window.appState.findPlaces.length) {
        places = window.appState.places;
    } else {
        places = window.appState.findPlaces;
    }
    var containerList = document.querySelector('.places__list');
    containerList.innerHTML = '';
    const visit = {
        visit: true,
        noVisit: false
    };
    for (var index = 0; index < places.length; index++) {
        if (window.appState.activeFilter === 'all') {
            addItem(index, containerList, places);
        }
        if (visit[window.appState.activeFilter] === places[index].isVisited) {
            addItem(index, containerList, places);
        }
    }
};

function addItem(index, containerList, places) {
    var place = document.createElement('div');
    place.className = 'places__list-item';
    place.innerHTML = '<div class="places__item-name">' + addCreateDeletePlace(places[index]) +
        places[index].name + '</div>' + addFunction(places[index]);
    containerList.appendChild(place);
}

function addFunction(place) {
    var containerFunc = '<div class="places_item-func">';
    var imgUp = '<img class="places__image-up" src="/places/placesList/up.png" alt="Вверх" ' +
        `id="${place.id}">`;
    var imgDown = '<img class="places__image-down" src="/places/placesList/down.png" alt="Вниз" ' +
        `id="${place.id}">`;
    var imgCheckbox = `<img id="${place.id}" class="places__image-checkbox"  ` +
        'onclick="placeVisit(this)" ';
    if (!place.isVisited) {
        imgCheckbox += 'src="/places/placesList/checkbox_false.png" alt="Не посещен"';
    } else {
        imgCheckbox += 'src="/places/placesList/checkbox_true.png" alt="Посещен"';
    }
    containerFunc += imgUp + imgDown + imgCheckbox + '</div>';

    return containerFunc;
}

function addCreateDeletePlace(place) {
    var imgCreate = '<img class="places__image-create" src="/places/placesList/create.png" ' +
        `alt="Вверх" onClick="createPlace(this, '${place.id}')">`;
    var imgDelete = '<img class="places__image-delete" src="/places/delete.png" alt="Вниз" ' +
        `onclick="deletePlace(this, '${place.id}')">`;

    return imgCreate + imgDelete;
}
