const apiUrl = 'https://places.now.sh';
// const apiUrl = 'http://localhost:10010';

let places = [];
document.querySelector('.add-place__button').addEventListener('click', addButtonClick);
document.querySelector('.places__delete').addEventListener('click', deletePlacesClick);
document.querySelector('.search-field').addEventListener('input', filterOnSearch);
document.querySelector('.add-place__name').addEventListener('keyup', enterInField);
for (const button of document.querySelectorAll('.visibility-selectors__button')) {
    button.addEventListener('click', selectVisitingState);
}
updatePlaces();


function selectVisitingState(event) {
    const { target } = event;
    for (const button of document.querySelectorAll('.visibility-selectors__button')) {
        button.classList.remove('visibility-selectors__button_selected');
    }
    target.classList.add('visibility-selectors__button_selected');
    drawPlaces();
}

function updatePlaces() {
    fetch(apiUrl + '/places')
        .then(response => response.json())
        .then(response => {
            places = response;
        })
        .then(drawPlaces);
}

function filterOnSearch() {
    const filterValue = document.querySelector('.search-field').value;
    const placesHtml = document.querySelector('.places__container').querySelectorAll('.place');

    for (let i = 0; i < places.length; i++) {
        const place = places[i];
        const placeHtml = placesHtml[i];
        if (place.name.includes(filterValue)) {
            placeHtml.classList.remove('place_hidden');
        } else {
            placeHtml.classList.add('place_hidden');
        }
    }
}

function deletePlacesClick() {
    sendRequest('/places', 'DELETE');
}

function addButtonClick() {
    const textField = document.querySelector('.add-place__name');
    const placeName = textField.value;
    if (placeName === '') {
        return;
    }
    textField.value = '';
    const placeObject = { name: placeName };
    sendRequest('/places', 'POST', placeObject);
}

function drawPlaces() {
    const contentDiv = document.querySelector('.places__container');

    contentDiv.innerHTML = '';
    const filteredPlaces = places.filter(filterByVisitedSelector);
    for (let i = 0; i < filteredPlaces.length; i++) {
        const place = filteredPlaces[i];
        const placeHtml = createPlaceHtml(place, i);
        contentDiv.appendChild(placeHtml);
        if (i === 0) {
            placeHtml.querySelector('.place-swap-up').classList.add('place-swap-arrow_hidden');
        }
        if (i === filteredPlaces.length - 1) {
            placeHtml.querySelector('.place-swap-down').classList.add('place-swap-arrow_hidden');
        }
    }
}

function filterByVisitedSelector(place) {
    const selectedClass = '.visibility-selectors__button_selected';
    const selectedButtonText = document.querySelector(selectedClass).value;
    if (selectedButtonText === 'Все') {
        return true;
    }
    if (selectedButtonText === 'Посещенные') {
        return place.visited;
    }

    return !place.visited;
}

function createPlaceHtml(place, index) {
    const block = createHtmlElement('article', 'place');
    const deleteIcon = createDeletePlaceIcon(place);
    const name = createPlaceNameHtml(place);
    const editBlock = createEditBlock(place, name);
    const editIcon = createEditIcon(place, name, editBlock);
    block.addEventListener('mouseover', () => {
        changeIconVisibility(deleteIcon);
        changeIconVisibility(editIcon);
    });
    block.addEventListener('mouseout', () => {
        changeIconVisibility(deleteIcon);
        changeIconVisibility(editIcon);
    });
    block.appendChild(editIcon);
    block.appendChild(deleteIcon);
    block.appendChild(name);
    block.appendChild(editBlock);
    block.appendChild(createVisitedIcon(place, block));
    block.appendChild(createSwapArrows(place, index));

    return block;
}

function createSwapArrows(place, index) {
    const block = createHtmlElement('span', 'place__swap');
    const upIcon = createIcon('fas fa-long-arrow-alt-up place-swap-up');
    upIcon.addEventListener('click', () => {
        sendRequest(`/places/${place.id}`, 'PATCH', { moveTo: index - 1 });
    });
    const downIcon = createIcon('fas fa-long-arrow-alt-down place-swap-down');
    downIcon.addEventListener('click', () => {
        sendRequest(`/places/${place.id}`, 'PATCH', { moveTo: index + 1 });
    });
    block.appendChild(upIcon);
    block.appendChild(downIcon);

    return block;
}

function createPlaceNameHtml(place) {
    const name = createHtmlElement('span', 'place__name');
    name.innerHTML = place.name;
    if (place.visited) {
        name.classList.add('place__name_visited');
    }

    return name;
}

function createEditBlock(place, nameBlock) {
    const block = createHtmlElement('span', 'place-edit');
    const input = createHtmlElement('input', 'place-edit__input');
    input.value = place.name;
    input.type = 'text';
    const cancelButton = createIcon('fas fa-times');
    cancelButton.addEventListener('click', () => {
        nameBlock.classList.remove('place__name_hidden');
        block.classList.add('place-edit_hidden');
    });
    cancelButton.classList.add('place-edit__cancel');
    const okButton = createIcon('fas fa-check');
    okButton.addEventListener('click', () => {
        sendRequest(`/places/${place.id}`, 'PATCH', { name: input.value });
        place.name = input.value;
        updatePlace(place, nameBlock.closest('.place'));
    });

    block.appendChild(input);
    block.appendChild(cancelButton);
    block.appendChild(okButton);
    block.classList.add('place-edit_hidden');

    return block;
}

function enterInField(e) {
    if (e.keyCode === 13) {
        addButtonClick();
    }
}

function createDeletePlaceIcon(place) {
    const icon = createTrashcanIcon();
    icon.addEventListener('click', () => {
        sendRequest(`/places/${place.id}`, 'DELETE');
    });
    icon.classList.add('place__delete');
    icon.classList.add('icon_hidden');

    return icon;
}

function createEditIcon(place, nameBlock, editBlock) {
    const icon = createIcon('fas fa-pencil-alt');
    icon.classList.add('icon_hidden');
    icon.classList.add('place__edit');
    icon.addEventListener('click', () => {
        nameBlock.classList.add('place__name_hidden');
        editBlock.classList.remove('place-edit_hidden');
    });

    return icon;
}

function changeIconVisibility(icon) {
    if (icon.classList.contains('icon_hidden')) {
        icon.classList.remove('icon_hidden');
        icon.classList.add('icon_visible');
    } else {
        icon.classList.add('icon_hidden');
        icon.classList.remove('icon_visible');
    }
}

function sendRequest(relativeUrl, method, body) {
    return fetch(apiUrl + relativeUrl, {
        method,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    }).then(updatePlaces);
}

function createVisitedIcon(place, placeHtmlElement) {
    let visitedIcon = createIcon('far fa-circle place__visited');
    if (place.visited) {
        visitedIcon = createIcon('far fa-check-circle place__visited');
    }
    visitedIcon.addEventListener('click', () => {
        place.visited = !place.visited;
        sendRequest(`/places/${place.id}`, 'PATCH', { visited: place.visited });
        updatePlace(place, placeHtmlElement);
    });

    return visitedIcon;
}

function updatePlace(place, placeHtmlElement) {
    const newPlaceHtml = createPlaceHtml(place, place.id);
    document.querySelector('.places__container').insertBefore(newPlaceHtml, placeHtmlElement);
    placeHtmlElement.remove();
}

function createTrashcanIcon() {
    return createIcon('fas fa-trash-alt');
}

function createIcon(classes) {
    return createHtmlElement('i', classes);
}

function createHtmlElement(tag, classes) {
    const result = document.createElement(tag);
    result.className = classes;

    return result;
}
