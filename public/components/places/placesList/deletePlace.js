'use strict';

function deletePlace(_this, id) {
    var url = urlGlobal + '/' + id;
    var XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    xhr.open('DELETE', url, true);
    xhr.onload = function () {
        if (this.readyState !== 4) {
            return;
        }
        if (this.status !== 200 && this.status !== 304) {
            console.error('deletePlace -> HTTP: ' + this.status);

            return;
        }
        var place = JSON.parse(this.responseText);
        dileteNode(_this.parentElement.parentElement);
        for (var index = 0; index < placesGlobal.length; index++) {
            if (placesGlobal[index].id === place.id) {
                placesGlobal.splice(index, 1);
            }
        }
    };
    xhr.send(null);
}

function dileteNode(child) {
    child.parentElement.removeChild(child);
}
