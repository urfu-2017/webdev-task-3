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

    return window.api.addPlace({ name: input.value }).then(place => {
        window.appState.places.push(place);
        window.addListPlaceInHtml();
        input.value = '';
    });
}
