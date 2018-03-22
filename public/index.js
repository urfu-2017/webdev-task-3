const apiUrl = 'https://webdev-task-2-vhbznmmjut.now.sh';
// const apiUrl = 'http://localhost:10010';

let places = [];
document.querySelector('.add-place__button').addEventListener('click', addButtonClick);
document.querySelector('.places__delete').addEventListener('click', deletePlacesClick);
document.querySelector('.search-field').addEventListener('input', drawPlaces);
for (let button of document.querySelectorAll('.visibility-selectors__button')) {
    button.addEventListener('click', selectVisitingState);
}
updatePlaces();


function selectVisitingState(event) {
    const { target } = event;
    for (let button of document.querySelectorAll('.visibility-selectors__button')) {
        button.classList.remove('visibility-selectors__button_selected');
    }
    target.classList.add('visibility-selectors__button_selected');
    drawPlaces();
}

function updatePlaces() {
    fetch(apiUrl + '/places')
        .then(response => response.json())
        .then(response => places = response)
        .then(drawPlaces);
}

function deletePlacesClick() {
    sendRequest('/places', 'DELETE');
}

function addButtonClick() {
    let textField = document.querySelector('.add-place__name');
    let placeName = textField.value;
    let placeObject = {name: placeName};
    sendRequest('/places', 'POST', placeObject);
}

function drawPlaces() {
    const filterValue = document.querySelector('.search-field').value;
    let contentDiv = document.getElementById("places__container");
    contentDiv.innerHTML = "";
    let filteredPlaces = places.filter(place => place.name.includes(filterValue));
    filteredPlaces = filteredPlaces.filter(filterByVisitedSelector);
    for (let place of filteredPlaces) {
        let placeHtml = createPlaceHtml(place);
        contentDiv.appendChild(placeHtml);
    }
}

function filterByVisitedSelector(place) {
    const selectedButtonText = document.querySelector('.visibility-selectors__button_selected').value;
    if (selectedButtonText === 'Все') {
        return true;
    } else if (selectedButtonText === 'Посещенные') {
        return place.visited;
    } else {
        return !place.visited;
    }
}

function createPlaceHtml(place) {
    let block = createHtmlElement("article", "place");
    let deleteIcon = createDeletePlaceIcon(place);
    let name = createHtmlElement("span", "place__name");
    let editBlock = createEditBlock(place);
    let editIcon = createEditIcon(place, name, editBlock);
    block.addEventListener("mouseover", () => {
        changeIconVisibility(deleteIcon);
        changeIconVisibility(editIcon);
    });
    block.addEventListener("mouseout", () => {
        changeIconVisibility(deleteIcon);
        changeIconVisibility(editIcon);
    });
    name.innerHTML = place.name;
    block.appendChild(editIcon);
    block.appendChild(deleteIcon);
    block.appendChild(name);
    block.appendChild(editBlock);
    block.appendChild(createVisitedIcon(place));

    return block;
}

function createEditBlock(place) {
    let block = createHtmlElement('span', 'place__edit');
    let input = createHtmlElement('input', 'place__edit__input');
    input.value = place.name;
    input.type = 'text';
    let cancelButton = createIcon('fas fa-times');
    let okButton = createIcon('fas fa-check');
    okButton.addEventListener('click', () => {
        sendRequest(`/places/${place.id}`, 'PATCH', {name: input.value});
    });

    block.appendChild(input);
    block.appendChild(cancelButton);
    block.appendChild(okButton);
    block.style.display = 'none';

    return block;
}

function createDeletePlaceIcon(place) {
    let icon = createTrashcanIcon();
    icon.addEventListener("click", () => {
        sendRequest(`/places/${place.id}`, 'DELETE');
    });
    icon.classList.add('place__delete');
    icon.classList.add('icon_hidden');

    return icon;
}

function createEditIcon(place, nameBlock, editBlock) {
    let icon = createIcon("fas fa-pencil-alt");
    icon.classList.add('icon_hidden');
    icon.classList.add('place__edit');
    icon.addEventListener('click', () => {
        toggle(nameBlock);
        toggle(editBlock);
    });

    return icon;
}

function toggle(element) {
    console.info(element.style);
    if (element.style.display === 'none') {
        element.style.display = 'inline-block';
    } else {
        element.style.display = 'none';
    }
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
            headers: {"Content-Type": "application/json"}
        })
        .then(updatePlaces);
}

function createVisitedIcon(place) {
    let visitedIcon = createIcon("far fa-circle place__visited");
    if (place.visited) {
        visitedIcon = createIcon("far fa-check-circle place__visited");
    }
    visitedIcon.addEventListener("click", () => {
        sendRequest(`/places/${place.id}`, "PATCH", {visited:!place.visited});
    });

    return visitedIcon;
}

function createTrashcanIcon() {
    return createIcon("fas fa-trash-alt");
}

function createIcon(classes) {
    return createHtmlElement("i", classes);
}

function createHtmlElement(tag, classes) {
    let result = document.createElement(tag);
    result.className = classes;

    return result;
}