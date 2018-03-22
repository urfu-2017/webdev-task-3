'use strict';
/* eslint-disable max-statements */
(function () {
    const baseUrl = 'https://webdev-task-2-xnedsgkmww.now.sh';
    const placesElement = document.getElementsByClassName('places')[0];

    function shortFetch(method, path, data) {
        const options = {
            method,
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        };

        return fetch(baseUrl + path, options);
    }

    function createNote() {
        let name = document.getElementsByClassName('create-place__input')[0].value;
        shortFetch('POST', `/${name}`, { description: '' })
            .then(res => res.json())
            .then(res => {
                console.info(res);
                placesElement.appendChild(createPlaceDiv(res));
            });
    }

    function deleteNotes() {
        deletePlaceNodes();
        shortFetch('DELETE', '/')
            .then(res => console.info(res));
    }

    function deletePlaceNodes() {
        Array.from(placesElement.children).forEach(place => place.remove());
    }

    function loadNotes() {
        deletePlaceNodes();
        shortFetch('GET', '/list')
            .then(res => res.json())
            .then(places => {
                Array.from(places).forEach(place => {
                    if (!place) {
                        return;
                    }
                    let div = createPlaceDiv(place);
                    placesElement.appendChild(div);
                });
            });
    }

    function createPlaceDiv(place) {
        let div = document.createElement('div');
        div.className = 'place place_search_matched';
        div.className += place.visited ? ' place_visited' : '';
        div.dataset.index = place.index;
        div.innerHTML = `
            <label class="place__wrapper">
                <button class="place__edit"></button>
                <button class="place__rubbish"></button>
                <input type="text" class="place__name" value="${place.name}"
                    data-description="${place.description}" disabled/>
                <button class="place__cancel"></button>
                <button class="place__apply"></button>
            </label>
            <button class="place__arrow place__arrow_direction_up"></button>
            <button class="place__arrow place__arrow_direction_down"></button>
            <input class="place__state" type="checkbox" ${place.visited ? 'checked' : ''}>
        `;

        return div;
    }

    let placesHandlers = {
        'place__edit': editPlace,
        'place__rubbish': deletePlace,
        'place__cancel': cancelEditPlace,
        'place__apply': applyEditPlace,
        'place__state': changeStatePlace,
        'place__arrow_direction_up': placeToUp,
        'place__arrow_direction_down': placeToDown
    };

    function placesClickHandler(event) {
        console.info(event.target.className);
        let handler = null;
        for (let className of Object.keys(placesHandlers)) {
            if (event.target.classList.contains(className)) {
                handler = placesHandlers[className];
            }
        }
        if (handler) {
            handler(event);
        }
    }

    function editPlace(event) {
        let editNode = event.target;
        let nameNode = editNode.nextElementSibling.nextElementSibling;
        nameNode.removeAttribute('disabled');
        nameNode.setAttribute('data-old', nameNode.value);
    }

    function cancelEditPlace(event) {
        let cancelNode = event.target;
        let nameNode = cancelNode.previousElementSibling;
        nameNode.setAttribute('disabled', true);
        nameNode.value = nameNode.dataset.old;
        nameNode.removeAttribute('data-old');
    }

    function applyEditPlace(event) {
        let applyNode = event.target;
        let nameNode = applyNode.previousElementSibling
            .previousElementSibling;
        nameNode.setAttribute('disabled', true);
        let oldName = nameNode.dataset.old;
        shortFetch('PATCH', `/${oldName}`, {
            name: nameNode.value,
            description: nameNode.dataset.description
        }).then(res => console.info(res));
        nameNode.removeAttribute('data-old');
    }

    function deletePlace(event) {
        let rubbishNode = event.target;
        let nameNode = rubbishNode.nextElementSibling;
        shortFetch('DELETE', `/${nameNode.dataset.old || nameNode.value}`)
            .then(res => console.info(res));
        let placeNode = rubbishNode.parentElement.parentElement;
        placeNode.remove();
    }

    function changeStatePlace(event) {
        let stateNode = event.target;
        let nameNode = stateNode
            .parentElement
            .firstElementChild
            .children[2];
        let name = nameNode.dataset.old || nameNode.value;
        let placeNode = nameNode.parentElement.parentElement;
        if (stateNode.checked) {
            placeNode.classList.add('place_visited');
            shortFetch('PATCH', `/${name}/visit`)
                .then(res => console.info(res));
        } else {
            placeNode.classList.remove('place_visited');
            shortFetch('PATCH', `/${name}/unvisit`)
                .then(res => console.info(res));
        }
    }

    function filterPlacesHandler(event) {
        let filterPlacesNode = event.target;
        if (!Array.from(filterPlacesNode.classList)
            .some(className => className === 'filter-places__button')) {
            return;
        }
        let filter = filterPlacesNode.dataset.filter;
        placesElement.className = 'places';
        placesElement.classList.add(`places_filter_${filter}`);
        Array.from(filterPlacesNode.parentElement.children).forEach(button => {
            button.classList.remove('filter-places__button_selected');
        });
        filterPlacesNode.classList.add('filter-places__button_selected');
    }

    function searchHandler(event) {
        let searchNode = event.target;
        let placeNameNodes = Array.from(document.getElementsByClassName('place__name'));
        placeNameNodes
            .forEach(placeNameNode => {
                let placeNode = placeNameNode.parentElement.parentElement;
                placeNode.classList.remove('place_search_matched');
            });
        placeNameNodes
            .filter(placeNameNode => placeNameNode.value.indexOf(searchNode.value) !== -1)
            .forEach(placeNameNode => {
                let placeNode = placeNameNode.parentElement.parentElement;
                placeNode.classList.add('place_search_matched');
            });
    }

    function debounce(func, wait, immediate) {
        var timeout;

        return function () {
            /* eslint-disable no-invalid-this*/
            let context = this;
            let args = arguments;
            let later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }

    function placeMoving(event, getOtherElement, getReferenceInsertBefore) {
        let arrowUp = event.target;
        let placeElement = arrowUp.parentElement;
        let otherPlaceElement = getOtherElement(placeElement);
        if (!otherPlaceElement || !placeElement) {
            return;
        }
        let permutation = {
            was: Number(otherPlaceElement.dataset.index),
            become: Number(placeElement.dataset.index)
        };
        placesElement.insertBefore(otherPlaceElement.cloneNode(true),
            getReferenceInsertBefore(placeElement));
        placesElement.replaceChild(placeElement, otherPlaceElement);
        shortFetch('PATCH', '/list', { permutations: [permutation] })
            .then(res => console.info(res));
    }

    function placeToUp(event) {
        placeMoving(event, elem => elem.previousElementSibling, elem => elem);
    }

    function placeToDown(event) {
        placeMoving(event, elem => elem.nextElementSibling, elem => elem.nextElementSibling);
    }

    let filterPlacesControlElement = document.getElementsByClassName('filter-places__control')[0];
    let search = document.getElementsByClassName('search__input')[0];
    let createPlaceElement = document.getElementsByClassName('create-place__button')[0];
    let filterPlacesClearElement = document.getElementsByClassName('filter-places__clear')[0];

    createPlaceElement.addEventListener('click', createNote);
    filterPlacesClearElement.addEventListener('click', deleteNotes);

    filterPlacesControlElement.addEventListener('click', filterPlacesHandler);
    search.addEventListener('keyup', debounce(searchHandler, 50));
    placesElement.addEventListener('click', placesClickHandler);

    loadNotes();
}());
