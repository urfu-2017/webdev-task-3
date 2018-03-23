'use strict';

function deleteAll() {
    var url = urlGlobal + '/all';
    var XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    xhr.open('DELETE', url, true);
    xhr.onload = function () {
        if (this.readyState !== 4) {
            return;
        }
        if (this.status !== 200 && this.status !== 304) {
            console.error('deleteAll -> HTTP: ' + this.status);

            return;
        }
        placesGlobal = JSON.parse(this.responseText);
        addListPlaceInHtml(activeButton);
    };
    xhr.send(null);
}
