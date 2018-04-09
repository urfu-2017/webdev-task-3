/* eslint-disable linebreak-style */
var FILTER_ALL = 'ALL';
var FILTER_VISITED = 'VISITED';
var FILTER_NOT_VISITED = 'NOT_VISITED';
var places = [];
var filter = FILTER_ALL;
var query = '';
var apiUrl = 'https://webdev-task-2-ddpjnicrzn.now.sh/api/v1/places';

var onVisitedCheckboxClick = function () {
    var idx = this.parentNode.dataset.idx;
    markVisited(idx, this.checked);
};

var onDeleteClick = function () {
    var idx = this.parentNode.parentNode.dataset.idx;
    deletePlace(idx);
};

var onFilterChange = function () {
    var value = this.value;
    renderList(value);
};

var onQueryChange = function () {
    var value = this.value;
    renderList(null, value);
};

var onAddNewPlace = function () {
    var newPlaceInput = document.getElementsByClassName('new-place__input')[0];
    var description = newPlaceInput.value;
    createPlace(description);
    newPlaceInput.value = '';
};

var onEditClick = function () {
    var idx = this.parentNode.parentNode.dataset.idx;
    this.parentNode.parentNode.parentNode.replaceChild(renderPlaceEdit(idx),
        this.parentNode.parentNode);
};

var onEditCancel = function () {
    var idx = this.parentNode.dataset.idx;
    this.parentNode.parentNode.replaceChild(renderPlace(places[idx], idx), this.parentNode);
};

var onEditSave = function () {
    var idx = this.parentNode.dataset.idx;
    var newDescription = this.parentNode.getElementsByClassName('place__edit')[0].value;
    var xhr = new XMLHttpRequest();
    xhr.open('PATCH', apiUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onerror = function () {
        console.error('Error!');
        renderList();
    };
    xhr.onload = function () {
        places[idx].description = newDescription;
        renderList();
    };
    var place = Object.assign(places[idx], { description: newDescription });
    xhr.send(JSON.stringify(place));
};

var onArrowUpClick = function () {
    var idx = this.parentNode.parentNode.dataset.idx;
    changeOrder(idx, parseInt(idx) - 1);
};

var onArrowDownClick = function () {
    var idx = this.parentNode.parentNode.dataset.idx;
    changeOrder(idx, parseInt(idx) + 1);
};

getAll(renderList);

document.getElementsByClassName('filters__delete-delete')[0].addEventListener('click', deleteAll);
document.getElementsByClassName('new-place__submit')[0].addEventListener('click', onAddNewPlace);

var searches = document.getElementsByClassName('search__input');
searches[0].addEventListener('change', onQueryChange);
var visitedFilters = document.querySelectorAll('.filters-visited input');
for (var i = 0; i < visitedFilters.length; i += 1) {
    visitedFilters[i].addEventListener('change', onFilterChange);
}

function getAll(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
    xhr.onerror = function () {
        console.error('Error!');

        return [];
    };
    xhr.onload = function () {
        places = JSON.parse(this.responseText);
        if (callback) {
            callback();
        }
    };
    xhr.send();
}

function renderList(newFilter, newQuery) {
    filter = newFilter || filter;
    query = newQuery !== '' ? (newQuery || query).toLowerCase() : '';
    var oldList = document.getElementsByClassName('places')[0];
    var newList = document.createElement('main');
    newList.className = 'places';
    places
        .filter(function (place) {
            switch (filter) {
                case FILTER_VISITED:
                    return place.visited && place.description.toLowerCase().includes(query);
                case FILTER_NOT_VISITED:
                    return !place.visited && place.description.toLowerCase().includes(query);
                default:
                    return place.description.toLowerCase().includes(query);
            }
        })
        .forEach(function (place, idx) {
            newList.appendChild(renderPlace(place, idx));
        });
    document.getElementsByTagName('body')[0].replaceChild(newList, oldList);
}

function changeOrder(idx, order) {
    var xhr = new XMLHttpRequest();
    xhr.open('PATCH', apiUrl + '/' + order, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onerror = function () {
        console.error('Error!');
    };
    xhr.onload = function () {
        getAll(renderList);
    };
    var place = Object.assign(places[idx]);
    xhr.send(JSON.stringify(place));
}

function markVisited(placeIdx, visited) {
    var xhr = new XMLHttpRequest();
    xhr.open('PATCH', apiUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onerror = function () {
        console.error('Error!');
    };
    xhr.onload = function () {
        places[placeIdx].visited = visited;
        renderList();
    };
    var place = Object.assign(places[placeIdx], { visited: visited });
    xhr.send(JSON.stringify(place));
}

function createPlace(description) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', apiUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onerror = function () {
        console.error('Error!');
    };
    var place = { description: description, visited: false, id: -1 };
    xhr.onload = function () {
        place.id = JSON.parse(this.responseText).id;
        places.push(place);
        renderList();
    };
    xhr.send(JSON.stringify(place));
}

function deletePlace(placeIdx) {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', apiUrl + '/' + places[placeIdx].id, true);
    xhr.onerror = function () {
        console.error('Error!');
    };
    xhr.onload = function () {
        places.splice(placeIdx, 1);
        renderList();
    };
    xhr.send();
}

function deleteAll() {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', apiUrl, true);
    xhr.onerror = function () {
        console.error('Error!');
    };
    xhr.onload = function () {
        places = [];
        renderList();
    };
    xhr.send();
}

function renderPlace(place, idx) {
    var placeElement = document.createElement('article');
    placeElement.className = 'place';
    placeElement.dataset.idx = idx;
    var titleElement = document.createElement('div');
    titleElement.className = 'place__title';
    titleElement.innerHTML = place.description;
    placeElement.appendChild(createControlsElement());
    placeElement.appendChild(titleElement);
    placeElement.appendChild(createArrowsElement(place, idx));
    placeElement.appendChild(createVisitedElement(place));

    return placeElement;
}

function createVisitedElement(place) {
    var visitedElement = document.createElement('input');
    visitedElement.className = 'place__visited';
    visitedElement.setAttribute('type', 'checkbox');
    visitedElement.addEventListener('click', onVisitedCheckboxClick);
    if (place.visited) {
        visitedElement.setAttribute('checked', 'checked');
    }

    return visitedElement;
}

function createArrowsElement(place, idx) {
    var arrowsElement = document.createElement('div');
    arrowsElement.className = 'arrows';
    var arrowUp = document.createElement('span');
    arrowUp.className = 'arrows__up';
    arrowUp.addEventListener('click', onArrowUpClick);
    var arrowDown = document.createElement('span');
    arrowDown.className = 'arrows__down';
    arrowDown.addEventListener('click', onArrowDownClick);
    if (idx > 0) {
        arrowsElement.appendChild(arrowUp);
    }
    if (idx < places.length - 1) {
        arrowsElement.appendChild(arrowDown);
    }

    return arrowsElement;
}

function createControlsElement() {
    var controlsElement = document.createElement('div');
    controlsElement.className = 'controls';
    var editButton = document.createElement('button');
    editButton.className = 'controls__edit';
    editButton.innerHTML = 'Edit';
    editButton.addEventListener('click', onEditClick);
    var deleteButton = document.createElement('button');
    deleteButton.className = 'controls__delete';
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', onDeleteClick);
    controlsElement.appendChild(editButton);
    controlsElement.appendChild(deleteButton);

    return controlsElement;
}

function renderPlaceEdit(idx) {
    var place = places[idx];
    var placeElement = document.createElement('article');
    placeElement.className = 'place';
    placeElement.dataset.idx = idx;
    var titleElement = document.createElement('input');
    titleElement.className = 'place__edit';
    titleElement.value = place.description;
    placeElement.appendChild(titleElement);
    placeElement.appendChild(createSaveEditButton());
    placeElement.appendChild(createCancelEditButton());

    return placeElement;
}

function createSaveEditButton() {
    var saveButton = document.createElement('button');
    saveButton.innerHTML = 'Save';
    saveButton.addEventListener('click', onEditSave);

    return saveButton;
}

function createCancelEditButton() {
    var cancelButton = document.createElement('button');
    cancelButton.innerHTML = 'Cancel';
    cancelButton.addEventListener('click', onEditCancel);

    return cancelButton;
}
