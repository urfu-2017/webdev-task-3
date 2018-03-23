'use strict';

function placeVisit(_this, id) {
    var url = urlGlobal + '/visit/' + id;
    var XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    xhr.open('PUT', url, true);
    xhr.onload = function () {
        if (this.readyState !== 4) {
            return;
        }
        if (this.status !== 200 && this.status !== 304) {
            console.error('placeVisit -> HTTP: ' + this.status);

            return;
        }
        var place = JSON.parse(this.responseText);
        createCheckbox(place, _this);
        if (activeButton !== 'all') {
            addListPlaceInHtml(activeButton);
        }
    };
    xhr.send(null);
}

function createCheckbox(place, checkbox) {
    checkbox.setAttribute('src', `/places/placesList/checkbox_${place.isVisited}.png`);
    checkbox.setAttribute('onclick', `placeVisit(this, '${place.id}')`);
    if (place.isVisited) {
        checkbox.setAttribute('alt', 'Посещен');
    } else {
        checkbox.setAttribute('alt', 'Не посещен');
    }
    for (var index = 0; index < placesGlobal.length; index++) {
        if (placesGlobal[index].id === place.id) {
            placesGlobal[index].isVisited = place.isVisited;
        }
    }
}
