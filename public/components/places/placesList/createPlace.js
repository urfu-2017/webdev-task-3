'use strict';

window.appState.function.createPlace = createPlace;
window.appState.function.hideCreate = hideCreate;

function createPlace(_this, id) {
    var containerItem = _this.parentElement;
    containerItem.style.display = 'none';
    createFunction(containerItem.parentElement, id);
}

function createFunction(containerItem, id) {
    var placeCreate = document.createElement('div');
    placeCreate.className = 'places__item-create';
    containerItem.insertBefore(placeCreate, containerItem.lastChild);
    var inputCreate = document.createElement('input');
    inputCreate.className = 'places__item-input';
    placeCreate.appendChild(inputCreate);
    addImg(placeCreate, id);
    inputCreate.addEventListener('keydown', (event) => {
        const keyCode = event.keyCode;
        if (keyCode !== 13) {
            return;
        }
        createRequest(id, inputCreate);
    });
}

function addImg(placeCreate, id) {
    var imgOk = document.createElement('img');
    imgOk.className = 'places__item-img-check';
    imgOk.setAttribute('src', '/places/placesList/check.png');
    imgOk.setAttribute('alt', 'Изменить');
    imgOk.setAttribute('onclick', `createRequest('${id}', this)`);
    placeCreate.appendChild(imgOk);
    var imgCancel = document.createElement('img');
    imgCancel.className = 'places__item-img-cancel';
    imgCancel.setAttribute('src', '/places/placesList/cancel.png');
    imgCancel.setAttribute('alt', 'Отменить');
    imgCancel.setAttribute('onclick', 'hideCreate(this)');
    placeCreate.appendChild(imgCancel);
}

function createRequest(id, createField) {
    if (createField.nodeName === 'IMG') {
        createField = createField.previousElementSibling;
    }

    return window.api.createPlace({ name: createField.value }, id).then(place => {
        for (var index = 0; index < window.appState.places.length; index++) {
            if (window.appState.places[index].id === place.id) {
                window.appState.places[index].name = place.name;
            }
        }
        window.addListPlaceInHtml();
        createField.value = '';
    });
}

function hideCreate(_this) {
    var containerItem = _this.parentElement;
    containerItem.style.display = 'none';
    containerItem.parentElement.firstChild.style.display = 'block';
}
