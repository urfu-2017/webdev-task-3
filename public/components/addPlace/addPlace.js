'use strict';

var inputAdd = document.querySelector('.add-place__input');
inputAdd.addEventListener('keydown', (event) => {
    const keyCode = event.keyCode;
    if (keyCode !== 13) {
        return;
    }
    addPlace();
});

function addPlace() {
    var input = document.querySelector('.add-place__input');
    var url = urlGlobal + '/';
    var data = {};
    data.name = input.value;
    var json = JSON.stringify(data);
    var XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
        if (this.readyState !== 4) {
            return;
        }
        if (this.status !== 200 && this.status !== 201) {
            console.error('addPlace -> HTTP: ' + this.status);

            return;
        }
        placesGlobal.push(JSON.parse(this.responseText));
        addListPlaceInHtml(activeButton);
    };
    xhr.send(json);
    input.value = '';
}
