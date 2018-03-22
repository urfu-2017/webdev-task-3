'use strict';
const baseUrl = 'https://webdev-task-2-gskvcsnjvj.now.sh';

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
    console.info('createNote');
    let name = document.getElementsByClassName('create-place__input')[0].value;
    shortFetch('POST', `/${name}`, { description: '' })
        .then(res => {
            console.info(res);
        });
}

document.getElementsByClassName('create-place__button')[0].addEventListener('click', createNote);

function deleteNotes() {
    shortFetch('DELETE', '/')
        .then(res => {
            console.info(res);
        });
}

document.getElementsByClassName('filter-places__clear')[0].addEventListener('click', deleteNotes);

function loadNotes() {
    shortFetch('GET', '/list')
        .then(res => res.json())
        .then(places => {
            console.info(places);
            Array.from(places).forEach(place => {
                if (!place) {
                    return;
                }
                let div = createPlaceDiv(place);
                let container = document.getElementsByClassName('places')[0];
                container.appendChild(div);
            });
        });
}

function createPlaceDiv(place) {
    let div = document.createElement('div');
    div.className = 'place';
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
        <input class="place__state" type="checkbox">
    `;

    return div;
}

loadNotes();
let placesElement = document.getElementsByClassName('places')[0];
let placesHandlers = {
    'place__edit': (event) => editPlace(event),
    'place__rubbish': (event) => deletePlace(event),
    'place__cancel': (event) => cancelEditPlace(event),
    'place__apply': (event) => applyEditPlace(event),
    'place__state': (event) => changeStatePlace(event)
};

function placesClickHandler(event) {
    let handler = placesHandlers[event.target.className];
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
    }).then(res => {
        console.info(res);
    });
    nameNode.removeAttribute('data-old');
}

function deletePlace(event) {
    let rubbishNode = event.target;
    let nameNode = rubbishNode.nextElementSibling;
    shortFetch('DELETE', `/${nameNode.dataset.old || nameNode.value}`)
        .then(res => {
            console.info(res);
        });
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
    if (stateNode.checked) {
        nameNode.classList.add('place__name_visited');
        shortFetch('PATCH', `/${name}/visit`)
            .then(res => console.info(res));
    } else {
        nameNode.classList.remove('place__name_visited');
        shortFetch('PATCH', `/${name}/unvisit`)
            .then(res => console.info(res));
    }
}

placesElement.addEventListener('click', placesClickHandler);


