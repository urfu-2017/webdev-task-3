'use strict';

function placeMove(_this, id, when) {
    var item = _this.parentElement.parentElement;
    if (when === 'up') {
        item.parentElement.insertBefore(item, item.previousElementSibling);
    } else {
        item.parentElement.insertBefore(item.nextElementSibling, item);
    }
    requestForMove(id, when);
}

function requestForMove(id, when) {
    var url = urlGlobal + '/move/' + id;
    var data = {};
    data.when = when;
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
            console.error('placeMove -> HTTP: ' + this.status);

            return;
        }
        placesGlobal = JSON.parse(this.responseText);
    };
    xhr.send(json);
}
