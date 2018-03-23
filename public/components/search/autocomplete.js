'use strict';


var inputSearch = document.querySelector('.search__input');

function debounce(func, wait, immediate) {
    var timeout;

    return function () {
        var context = this;
        var args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

var autocomplete = debounce(function (event) {
    var value = event.target.value;
    if (value === '') {
        findPlacesGlobal = [];
        addListPlaceInHtml(activeButton);

        return;
    }
    findPlacesGlobal = placesGlobal.filter(function (place) {
        return place.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    });
    addListPlaceInHtml(activeButton);
}, 300);

inputSearch.addEventListener('keydown', autocomplete);
