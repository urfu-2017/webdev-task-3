'use strict';

/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable no-empty-function */

const PLACES_ADDRESS = 'https://webdev-task-2-clzvgkakug.now.sh/places';
const idButtonToFilter = {
    all: () => true,
    visit: visited => visited === 'false',
    visited: visited => visited === 'true'
};
const filtration = {
    searchMessage: '',
    checkVisit: idButtonToFilter.all
};
const directionToNameMethod = {
    up: 'previousSibling',
    down: 'nextSibling'
};


getAll();


document.onkeyup = function (e) {
    e = e || window.event;
    // enter
    if (e.keyCode === 13) {
        changeSearchFilter();
        search();
    }
};

function getAll() {
    fetch(PLACES_ADDRESS, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(places => {
            const divPlaces = document.getElementById('places');
            places.forEach(place => {
                const note = createListItem(place);
                saveFields(note, place);
                updateDisplayNote(note, filtration.searchMessage);
                divPlaces.appendChild(note);
            });
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}


function addNote() {
    const placeName = document.getElementById('place-name').value;
    if (!placeName) {
        return;
    }
    fetch(PLACES_ADDRESS, {
        method: 'POST',
        body: JSON.stringify({ name: placeName }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(place => {
            const divPlaces = document.getElementById('places');
            const note = createListItem(place);
            saveFields(note, place);
            updateDisplayNote(note, filtration.searchMessage);
            divPlaces.appendChild(note);
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}

function clearNotes() {
    fetch(PLACES_ADDRESS, { method: 'DELETE' })
        .then(() => {
            const divPlaces = document.getElementById('places');
            while (divPlaces.firstChild) {
                divPlaces.removeChild(divPlaces.firstChild);
            }
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}

function changeSearchFilter() {
    filtration.searchMessage = document.getElementById('search-string').value;
}

function changeVisitFilter() {
    const radioBoxes = document.getElementsByName('visitFilter');
    for (let i = 0; i < radioBoxes.length; i++) {
        if (radioBoxes[i].checked) {
            filtration.checkVisit = idButtonToFilter[radioBoxes[i].id];
            break;
        }
    }
    search();
}

function search() {
    const divPlaces = document.getElementById('places');
    const searchString = document.getElementById('search-string').value;
    if (!divPlaces.hasChildNodes()) {
        return;
    }
    for (let i = 0; i < divPlaces.childNodes.length; i++) {
        let note = divPlaces.childNodes[i];
        updateDisplayNote(note, searchString);
    }
}

function updateDisplayNote(note, searchString) {
    if (noteIncludesMessage(note.dataset, searchString) &&
        filtration.checkVisit(note.dataset.visited)) {
        note.style.display = 'flex';
    } else {
        note.style.display = 'none';
    }
}

function noteIncludesMessage(place, message) {
    return place.name.includes(message);
}

function saveFields(note, place) {
    note.dataset.id = place.id;
    note.dataset.visited = place.visited;
    note.dataset.name = place.name;
}

function createListItem(place) {
    const note = document.createElement('div');
    note.className = 'places__element';
    note.tabIndex = -1;
    addTitle(note, place);
    addStatusVisit(note, place);
    addArrows(note);
    addEditButton(note);
    addDeleteButton(note);
    addCancelButton(note);
    addOkButton(note);

    return note;
}

function addTitle(note, place) {
    const title = document.createElement('input');
    title.type = 'text';
    title.value = place.name;
    title.disabled = true;
    title.className = 'places__element-title';
    note.appendChild(title);
}

function addStatusVisit(note, place) {
    const statusVisit = document.createElement('input');
    statusVisit.type = 'checkbox';
    statusVisit.className = 'places__element-visit-state places__icon places__element-button';
    if (place.visited) {
        statusVisit.checked = true;
    }
    statusVisit.onclick = () => changeStatusVisit(statusVisit);
    note.appendChild(statusVisit);
}

function addArrows(note) {
    const arrowUp = document.createElement('img');
    arrowUp.src = 'pictures/arrow_up.ico';
    arrowUp.alt = 'Передвинуть вверх';
    arrowUp.className = 'places__element-arrow-up places__icon places__element-button';
    arrowUp.onclick = () => moveInDirection(note, 'up');
    note.appendChild(arrowUp);

    const arrowDown = document.createElement('img');
    arrowDown.src = 'pictures/arrow_down.ico';
    arrowDown.alt = 'Передвинуть вниз';
    arrowDown.className = 'places__element-arrow-down places__icon places__element-button';
    arrowDown.onclick = () => moveInDirection(note, 'down');
    note.appendChild(arrowDown);
}

function changeStatusVisit(checkbox) {
    const isVisited = !(checkbox.parentNode.dataset.visited === 'true');
    checkbox.disabled = true;
    fetch(`${PLACES_ADDRESS}/${checkbox.parentNode.dataset.id}/visit/${isVisited}`,
        { method: 'POST' })
        .then(() => {
            checkbox.parentNode.dataset.visited = isVisited;
            updateDisplayNote(checkbox.parentNode, filtration.searchMessage);
            checkbox.disabled = false;
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}

/**
 * @param {Object} note - вершина dom дерева
 * @param {String} direction - направление (up/down)
 */
function moveInDirection(note, direction) {
    let otherNote = note[directionToNameMethod[direction]];
    while (otherNote) {
        if (otherNote.style.display !== 'none') {
            swapNotes(note, otherNote);

            return;
        }
        otherNote = otherNote[directionToNameMethod[direction]];
    }
}

function swapNotes(first, second) {
    fetch(`${PLACES_ADDRESS}/swap/${getIndexNote(first)}/${getIndexNote(second)}`,
        { method: 'PUT' })
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

function getIndexNote(note) {
    return Array.from(note.parentNode.children).indexOf(note);
}

function addEditButton(note) {
    const editButton = document.createElement('img');
    editButton.src = 'pictures/pencil.ico';
    editButton.className = 'places__element-change-button places__icon places__element-button';
    editButton.onclick = () => showEditMenu(note);
    note.appendChild(editButton);
}

function addDeleteButton(note) {
    const deleteButton = document.createElement('img');
    deleteButton.src = 'pictures/can.ico';
    deleteButton.className = 'places__element-delete-button places__icon places__element-button';
    deleteButton.onclick = () => removeNote(note);
    note.appendChild(deleteButton);
}

function addCancelButton(note) {
    const cancelButton = document.createElement('img');
    cancelButton.src = 'pictures/cross.ico';
    cancelButton.className = 'places__element-cancel-button places__icon places__element-button';
    cancelButton.onclick = () => cancelRename(note);
    note.appendChild(cancelButton);
}

function addOkButton(note) {
    const okButton = document.createElement('img');
    okButton.src = 'pictures/check_mark.ico';
    okButton.className = 'places__element-ok-button places__icon places__element-button';
    okButton.onclick = () => changeName(note);
    note.appendChild(okButton);
}

function removeNote(note) {
    fetch(`${PLACES_ADDRESS}/${getIndexNote(note)}`,
        { method: 'DELETE' })
        .then(() => {
            note.parentNode.removeChild(note);
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}

function showEditMenu(note) {
    const cancelButton = note.querySelector('.places__element-cancel-button');
    cancelButton.style.display = 'block';
    const okButton = note.querySelector('.places__element-ok-button');
    okButton.style.display = 'block';
    note.querySelector('.places__element-title').disabled = false;
    note.querySelector('.places__element-title').style.border = 'solid 1px #000';
    note.onmouseover = function () {
        note.querySelector('.places__element-ok-button').style.display = 'block';
        note.querySelector('.places__element-cancel-button').style.display = 'block';
        note.querySelector('.places__element-title').disabled = false;
        note.querySelector('.places__element-title').style.border = 'solid 1px #000';
    };
    note.onmouseout = function () {
        note.querySelector('.places__element-cancel-button').style.display = 'none';
        note.querySelector('.places__element-ok-button').style.display = 'none';
        note.querySelector('.places__element-title').style.border = 'none';
    };
}

function cancelRename(note) {
    note.onmouseover = () => {};
    note.onmouseout = () => {};
    note.querySelector('.places__element-title').disabled = true;
    note.querySelector('.places__element-title').style.border = 'none';
    note.querySelector('.places__element-title').value = note.dataset.name;
    const cancelButton = note.querySelector('.places__element-cancel-button');
    cancelButton.style.display = 'none';
    const okButton = note.querySelector('.places__element-ok-button');
    okButton.style.display = 'none';
}

function changeName(note) {
    const newValue = note.querySelector('.places__element-title').value;
    cancelRename(note);
    note.querySelector('.places__element-title').value = newValue;
    fetch(`${PLACES_ADDRESS}/edit/${note.dataset.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: newValue }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(place => {
            note.querySelector('.places__element-title').value = place.name;
            note.dataset.name = place.name;
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
