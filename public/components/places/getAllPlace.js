'use strict';

getAllPlace('all');

function getAllPlace(filter) {
    activeButton = filter;
    var buttonActiveOld = document.querySelector('.button-sort__button-active');
    buttonActiveOld.classList.remove('button-sort__button-active');
    switch (filter) {
        case 'all':
            var buttonAll = document.querySelector('.button-sort__button_all');
            buttonAll.classList.add('button-sort__button-active');
            break;
        case true:
        case false:
            var button = document.querySelector(`.button-sort__button_visit_${!filter}`);
            button.classList.add('button-sort__button-active');
            break;
        default:
            break;
    }
    if (placesGlobal.length === 0) {
        var url = urlGlobal;
        var XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        var xhr = new XHR();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status !== 200 && this.status !== 304) {
                console.error('getAllPlace -> HTTP: ' + this.status);

                return;
            }
            placesGlobal = JSON.parse(this.responseText);
            addListPlaceInHtml(filter);
        };
        xhr.send(null);
    } else {
        addListPlaceInHtml(filter);
    }
}

function addListPlaceInHtml(filter) {
    var places = [];
    if (!findPlacesGlobal.length) {
        places = placesGlobal;
    } else {
        places = findPlacesGlobal;
    }
    activeButton = filter;
    var containerList = document.querySelector('.places__list');
    containerList.innerHTML = '';
    for (var index = 0; index < places.length; index++) {
        if (filter === 'all') {
            addItem(index, containerList, places);
        }
        if (filter === places[index].isVisited) {
            addItem(index, containerList, places);
        }
    }
}

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
        `onClick="placeMove(this, '${place.id}', 'up')">`;
    var imgDown = '<img class="places__image-down" src="/places/placesList/down.png" alt="Вниз" ' +
        `onClick="placeMove(this, '${place.id}', 'down')">`;
    var imgCheckbox = `<img id="${place.id}" class="places__image-checkbox" `;
    if (!place.isVisited) {
        imgCheckbox += 'src="/places/placesList/checkbox_false.png" alt="Не посещен" ' +
            `onClick="placeVisit(this, '${place.id}')">`;
    } else {
        imgCheckbox += 'src="/places/placesList/checkbox_true.png" alt="Посещен" ' +
            `onClick="placeVisit(this, '${place.id}')">`;
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
