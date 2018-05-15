const apiUrl = 'https://sites-api.now.sh/api/v1.0';

const ofClass = cls => document.querySelector(`.${cls}`);
const allOfClass = cls => document.querySelectorAll(`.${cls}`);

const appendChildrenTo = (parent, children) => {
    for (const child of children) {
        parent.appendChild(child);
    }
};

const buttons = allOfClass('visibility-selectors__button');
// eslint-disable-next-line no-return-assign
buttons.forEach(b => b.onclick = selectVisitingState);

const searchField = ofClass('search__field');
const placesContainer = ofClass('places__container');

let places = [];
updatePlaces();

searchField.oninput = filterOnSearch;
ofClass('add-place__button').onclick = addPlace;
ofClass('places__delete').onclick = deletePlaces;
ofClass('add-place__name').onkeyup = (e) => {
    if (e.keyCode === 13) {
        addPlace();
    }
};

function sendRequest(relativeUrl, method, body, shouldUpdate = true) {
    return fetch(apiUrl + relativeUrl, {
        method,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    }).then(data => shouldUpdate ? updatePlaces(data) : data);
}


function updatePlaces() {
    fetch(apiUrl + '/sites')
        .then(response => response.json())
        .then(response => {
            places = response;
        })
        .then(renderPlaces);
}

function selectVisitingState(event) {
    const { target } = event;
    for (const button of buttons) {
        button.classList.remove('visibility-selectors__button_selected');
    }
    target.classList.add('visibility-selectors__button_selected');
    renderPlaces();
}

function filterOnSearch() {
    const filterValue = searchField.value;
    const placesHtml = allOfClass('place');
    const filteredPlaces = places.filter(filterByVisitedSelector);

    for (let i = 0; i < filteredPlaces.length; i++) {
        const place = filteredPlaces[i];
        const placeHtml = placesHtml[i];

        if (place.name.match(new RegExp(filterValue, 'i'))) {
            placeHtml.classList.remove('place_hidden');
        } else {
            placeHtml.classList.add('place_hidden');
        }
    }
}

function deletePlaces() {
    sendRequest('/sites', 'DELETE');
}

function addPlace() {
    const textField = ofClass('add-place__name');
    const placeName = textField.value;
    if (!placeName) {
        return;
    }
    textField.value = '';
    const place = { name: placeName };
    sendRequest('/sites', 'POST', place);
}

function renderPlaces() {
    placesContainer.innerHTML = '';

    const filteredPlaces = places.filter(filterByVisitedSelector);
    for (let i = 0; i < filteredPlaces.length; i++) {
        const place = filteredPlaces[i];
        const placeNode = createPlaceHtml(place, i);
        placesContainer.appendChild(placeNode);
        if (i === 0) {
            placeNode.querySelector('.place-swap-up').classList.add('place-swap-arrow_hidden');
        }
        if (i === filteredPlaces.length - 1) {
            placeNode.querySelector('.place-swap-down').classList.add('place-swap-arrow_hidden');
        }
    }
}

function filterByVisitedSelector(place) {
    const selectedButtonText = ofClass('visibility-selectors__button_selected').value;
    switch (selectedButtonText) {
        case 'Посещенные':
            return place.isVisited;
        case 'Посетить':
            return !place.isVisited;
        default:
            return true;
    }
}

function createPlaceHtml(place) {
    const block = createHtmlElement('article', 'place');
    const deleteIcon = createDeletePlaceIcon(place);
    const name = createPlaceNameHtml(place);
    const editBlock = createEditBlock(place, name);
    const editIcon = createEditIcon(place, name, editBlock);

    const onPlaceOver = () => {
        changeIconVisibility(editIcon);
        changeIconVisibility(deleteIcon);
    };
    block.onmouseover = onPlaceOver;
    block.onmouseout = onPlaceOver;

    appendChildrenTo(block, [
        editIcon,
        deleteIcon,
        name,
        editBlock,
        createVisitedIcon(place, block),
        createSwapArrows(place)
    ]);

    return block;
}

function createSwapArrows(place) {
    const block = createHtmlElement('span', 'place__swap');
    const upIcon = createIcon('fas fa-long-arrow-alt-up place-swap-up');
    upIcon.onclick = () => {
        sendRequest(`/sites/${place.id}/move?delta=-1`, 'PUT');
    };
    const downIcon = createIcon('fas fa-long-arrow-alt-down place-swap-down');
    downIcon.onclick = () => {
        sendRequest(`/sites/${place.id}/move?delta=1`, 'PUT');
    };
    appendChildrenTo(block, [upIcon, downIcon]);

    return block;
}

function createPlaceNameHtml(place) {
    const name = createHtmlElement('span', 'place__name');
    name.textContent = place.name;
    if (place.isVisited) {
        name.classList.add('place__name_visited');
    }

    return name;
}

function createEditBlock(place, nameBlock) {
    const block = createHtmlElement('span', 'place-edit place-edit_hidden');
    const input = createHtmlElement('input', 'place-edit__input');
    input.value = place.name;
    input.type = 'text';

    const cancelButton = createIcon('fas fa-times place-edit__cancel');
    cancelButton.onclick = () => {
        nameBlock.classList.remove('place__name_hidden');
        block.classList.add('place-edit_hidden');
    };

    const okButton = createIcon('fas fa-check');
    okButton.onclick = () => {
        sendRequest(`/sites/${place.id}`, 'PATCH', { name: input.value }, false);
        place.name = input.value;
        updatePlace(place, nameBlock.closest('.place'));
    };

    appendChildrenTo(block, [input, cancelButton, okButton]);

    return block;
}

function createDeletePlaceIcon(place) {
    const icon = createIcon('fas fa-trash-alt place__delete icon_hidden');
    icon.onClick = () => sendRequest(`/sites/${place.id}`, 'DELETE');

    return icon;
}

function createEditIcon(place, nameBlock, editBlock) {
    const icon = createIcon('fas fa-pencil-alt place__edit icon_hidden');
    icon.onClick = () => {
        nameBlock.classList.add('place__name_hidden');
        editBlock.classList.remove('place-edit_hidden');
    };

    return icon;
}

function changeIconVisibility(icon) {
    icon.classList.toggle('icon_hidden');
}

function createVisitedIcon(place, placeHtmlElement) {
    const iconClass = place.isVisited ? 'fa-check-circle' : 'fa-circle';
    const visitedIcon = createIcon(`far ${iconClass} place__visited`);

    visitedIcon.onclick = () => {
        sendRequest(`/sites/${place.id}`, 'PATCH', { isVisited: !place.isVisited }, false);
        place.isVisited = !place.isVisited;
        updatePlace(place, placeHtmlElement);
    };

    return visitedIcon;
}

function updatePlace(place, oldPlace) {
    const newPlace = createPlaceHtml(place, place.id);
    placesContainer.insertBefore(newPlace, oldPlace);
    oldPlace.remove();
}

function createIcon(classes) {
    return createHtmlElement('i', classes);
}

function createHtmlElement(tag, classes) {
    const element = document.createElement(tag);
    element.className = classes;

    return element;
}
