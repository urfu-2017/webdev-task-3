'use strict';

/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */

const apiUrl = 'https://webdev-task-2-clzvgkakug.now.sh/places';
const visitsFilters = {
    all: () => true,
    visit: visited => visited === 'false',
    visited: visited => visited === 'true'
};
const filtration = {
    soughtForMessage: '',
    checkVisit: visitsFilters.all
};
const directionToNameMethod = {
    up: 'previousSibling',
    down: 'nextSibling'
};

const placesContainer = document.querySelector('#places');
const messagesSearcher = document.querySelector('#search-string');
const nameAddedPlace = document.querySelector('#name-added-place');
const visitsChanger = document.querySelectorAll('[name="visit-filter"]');
const creatorPlaces = document.querySelector('#create-place');
const cleanerPlaces = document.querySelector('#cleaner-places');


const api = {
    getPlaces() {
        return fetch(apiUrl, { method: 'GET' })
            .then(response => response.json());
    },

    postPlace() {
        return fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({ name: nameAddedPlace.value }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json());
    },

    deletePlaces() {
        return fetch(apiUrl, { method: 'DELETE' });
    },

    postChangeVisitStatus({ checkbox, isVisited }) {
        return fetch(`${apiUrl}/${checkbox.parentNode.dataset.id}/visit/${isVisited}`,
            { method: 'POST' });
    },

    postSwapPlaces({ first, second }) {
        return fetch(`${apiUrl}/swap/${getIndexTravel(first)}/${getIndexTravel(second)}`,
            { method: 'PUT' });
    },

    deletePlace(travel) {
        return fetch(`${apiUrl}/${getIndexTravel(travel)}`, { method: 'DELETE' });
    },

    patchName({ travel, newValue }) {
        return fetch(`${apiUrl}/edit/${travel.dataset.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ name: newValue }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json());
    }
};


window.addEventListener('load', getAll);

messagesSearcher.addEventListener('keyup', (e = window.event) => {
    // enter
    if (e.keyCode === 13) {
        changeSearchFilter();
        renderTravels();
    }
});

creatorPlaces.addEventListener('click', postAddedTravel);

cleanerPlaces.addEventListener('click', clearTravels);

visitsChanger.forEach(checkbox => checkbox.addEventListener('click', () => {
    changeVisitFilter();
    renderTravels();
}));


function getAll() {
    api.getPlaces()
        .then(places => places.forEach(SavePlace))
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}

function SavePlace(place) {
    const travel = createListItem(place);
    saveFields(travel, place);
    updateDisplayTravel(travel);
    placesContainer.appendChild(travel);
}


function postAddedTravel() {
    if (!nameAddedPlace.value) {
        return;
    }
    api.postPlace()
        .then(SavePlace)
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}

function clearTravels() {
    api.deletePlaces()
        .then(() => placesContainer.innerHTML = '')
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}

function changeSearchFilter() {
    filtration.soughtForMessage = messagesSearcher.value;
}

function changeVisitFilter() {
    for (let i = 0; i < visitsChanger.length; i++) {
        if (visitsChanger[i].checked) {
            filtration.checkVisit = visitsFilters[visitsChanger[i].id];
            break;
        }
    }
}

function renderTravels() {
    for (let i = 0; i < placesContainer.childNodes.length; i++) {
        let travel = placesContainer.childNodes[i];
        updateDisplayTravel(travel);
    }
}

function updateDisplayTravel(travel) {
    if (travelIncludesMessage(travel.dataset, messagesSearcher.value) &&
        filtration.checkVisit(travel.dataset.visited)) {
        travel.style.display = 'flex';
    } else {
        travel.style.display = 'none';
    }
}

function travelIncludesMessage(place, message) {
    return place.name.includes(message);
}

function saveFields(travel, place) {
    travel.dataset.id = place.id;
    travel.dataset.visited = place.visited;
    travel.dataset.name = place.name;
}

function createListItem(place) {
    const travel = document.createElement('div');
    travel.className = 'places__travel';
    travel.tabIndex = -1;
    addTitle(travel, place);
    addStatusVisit(travel, place);
    addArrows(travel);
    addEditButton(travel);
    addDeleteButton(travel);
    addCancelButton(travel);
    addOkButton(travel);

    return travel;
}

function addTitle(travel, place) {
    const title = document.createElement('input');
    title.type = 'text';
    title.value = place.name;
    title.disabled = true;
    title.className = 'travel__title';
    travel.appendChild(title);
}

function addStatusVisit(travel, place) {
    const statusVisit = document.createElement('input');
    statusVisit.type = 'checkbox';
    statusVisit.className = 'travel__visit-state travel__icon travel__button';
    if (place.visited) {
        statusVisit.checked = true;
    }
    statusVisit.addEventListener('click', () => changeStatusVisit(statusVisit));
    travel.appendChild(statusVisit);
}

function addArrows(travel) {
    const arrowUp = document.createElement('img');
    arrowUp.src = 'pictures/arrow_up.ico';
    arrowUp.alt = 'Передвинуть вверх';
    arrowUp.className = 'travel__arrow-up travel__icon travel__button';
    arrowUp.addEventListener('click', () => moveInDirection(travel, 'up'));
    travel.appendChild(arrowUp);

    const arrowDown = document.createElement('img');
    arrowDown.src = 'pictures/arrow_down.ico';
    arrowDown.alt = 'Передвинуть вниз';
    arrowDown.className = 'travel__arrow-down travel__icon travel__button';
    arrowDown.addEventListener('click', () => moveInDirection(travel, 'down'));
    travel.appendChild(arrowDown);
}

function changeStatusVisit(checkbox) {
    const isVisited = !(checkbox.parentNode.dataset.visited === 'true');
    checkbox.disabled = true;
    api.postChangeVisitStatus({ checkbox, isVisited })
        .then(() => {
            checkbox.parentNode.dataset.visited = isVisited;
            updateDisplayTravel(checkbox.parentNode);
            checkbox.disabled = false;
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}

/**
 * @param {Object} travel - вершина dom дерева
 * @param {String} direction - направление (up/down)
 */
function moveInDirection(travel, direction) {
    let otherTravel = travel[directionToNameMethod[direction]];
    while (otherTravel) {
        if (otherTravel.style.display !== 'none') {
            swapTravels(travel, otherTravel);

            return;
        }
        otherTravel = otherTravel[directionToNameMethod[direction]];
    }
}

function swapTravels(first, second) {
    api.postSwapPlaces({ first, second })
        .then(() => {
            const parent = first.parentNode;
            let tempForSecond = first.cloneNode(true);
            parent.insertBefore(tempForSecond, first);
            parent.insertBefore(first, second);
            parent.insertBefore(second, tempForSecond);
            parent.removeChild(tempForSecond);
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}

function getIndexTravel(travel) {
    return Array.from(travel.parentNode.children).indexOf(travel);
}

function addEditButton(travel) {
    const editButton = document.createElement('img');
    editButton.src = 'pictures/pencil.ico';
    editButton.className = 'travel__change-button travel__icon travel__button';
    editButton.addEventListener('click', () => showEditMenu(travel));
    travel.appendChild(editButton);
}

function addDeleteButton(travel) {
    const deleteButton = document.createElement('img');
    deleteButton.src = 'pictures/can.ico';
    deleteButton.className = 'travel__delete-button travel__icon travel__button';
    deleteButton.addEventListener('click', () => removeTravel(travel));
    travel.appendChild(deleteButton);
}

function addCancelButton(travel) {
    const cancelButton = document.createElement('img');
    cancelButton.src = 'pictures/cross.ico';
    cancelButton.className = 'travel__cancel-button travel__icon travel__button';
    cancelButton.addEventListener('click', () => cancelRename(travel));
    travel.appendChild(cancelButton);
}

function addOkButton(travel) {
    const okButton = document.createElement('img');
    okButton.src = 'pictures/check_mark.ico';
    okButton.className = 'travel__ok-button travel__icon travel__button';
    okButton.addEventListener('click', () => changeName(travel));
    travel.appendChild(okButton);
}

function removeTravel(travel) {
    api.deletePlace(travel)
        .then(() => travel.parentNode.removeChild(travel))
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}

function showEditMenu(travel) {
    const cancelButton = travel.querySelector('.travel__cancel-button');
    cancelButton.style.display = 'block';
    const okButton = travel.querySelector('.travel__ok-button');
    okButton.style.display = 'block';
    const title = travel.querySelector('.travel__title');
    title.disabled = false;
    title.style.border = 'solid 1px #000';
    travel.addEventListener('mouseover', processTravelOnMouseOver);
    travel.addEventListener('mouseout', processTravelOnMouseOut);
}

function processTravelOnMouseOver() {
    const cancelButton = this.querySelector('.travel__cancel-button');
    const okButton = this.querySelector('.travel__ok-button');
    const title = this.querySelector('.travel__title');
    okButton.style.display = 'block';
    cancelButton.style.display = 'block';
    title.disabled = false;
    title.style.border = 'solid 1px #000';
}

function processTravelOnMouseOut() {
    const cancelButton = this.querySelector('.travel__cancel-button');
    const okButton = this.querySelector('.travel__ok-button');
    const title = this.querySelector('.travel__title');
    cancelButton.style.display = 'none';
    okButton.style.display = 'none';
    title.style.border = 'none';
}

function cancelRename(travel) {
    travel.removeEventListener('mouseover', processTravelOnMouseOver);
    travel.removeEventListener('mouseout', processTravelOnMouseOut);
    const title = travel.querySelector('.travel__title');
    title.disabled = true;
    title.style.border = 'none';
    title.value = travel.dataset.name;
    const cancelButton = travel.querySelector('.travel__cancel-button');
    cancelButton.style.display = 'none';
    const okButton = travel.querySelector('.travel__ok-button');
    okButton.style.display = 'none';
}

function changeName(travel) {
    const newValue = travel.querySelector('.travel__title').value;
    cancelRename(travel);
    const title = travel.querySelector('.travel__title');
    title.value = newValue;
    api.patchName({ travel, newValue })
        .then(place => {
            title.value = place.name;
            travel.dataset.name = place.name;
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
