'use strict';

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
    var url = urlGlobal + '/' + id;
    if (createField.nodeName === 'IMG') {
        createField = createField.previousElementSibling;
    }
    var data = {};
    data.name = createField.value;
    var json = JSON.stringify(data);
    var XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
        if (this.readyState !== 4) {
            return;
        }
        if (this.status !== 200) {
            console.error('createPlace -> HTTP: ' + this.status);

            return;
        }
        var place = JSON.parse(this.responseText);
        for (var index = 0; index < placesGlobal.length; index++) {
            if (placesGlobal[index].id === place.id) {
                placesGlobal[index].name = place.name;
            }
        }
        addListPlaceInHtml(activeButton);
    };
    xhr.send(json);
    createField.value = '';
}

function hideCreate(_this) {
    var containerItem = _this.parentElement;
    containerItem.style.display = 'none';
    containerItem.parentElement.firstChild.style.display = 'block';
}
