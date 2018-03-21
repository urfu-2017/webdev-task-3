'use strict';
const baseUrl = 'https://cors-anywhere.herokuapp.com/https://webdev-task-2-gguhuxcnsd.now.sh';
let oldName = '';
let currentSearchResult = '';

const correctArrows = () => {
    const collection = document.getElementsByClassName('location horizontal-flex visible');
    let idx = 0;
    for (const elem of collection) {
        const arrowDown = elem.getElementsByClassName('arrow-down')[0];
        const arrowUp = elem.getElementsByClassName('arrow-up')[0];
        arrowDown.style.visibility = 'visible';
        arrowUp.style.visibility = 'visible';
        if (idx === 0) {
            arrowUp.style.visibility = 'hidden';
        }
        if (idx === collection.length - 1) {
            arrowDown.style.visibility = 'hidden';
        }
        idx++;
    }
};

// toggling buttons for visited - not visited
const visited = document.getElementsByClassName('visited-flag');
const onClickHandler = event => {
    const locationName = event.target.parentElement.firstChild.nextElementSibling.textContent;
    let value = false;
    event.target.classList.toggle('visited-icon');
    event.target.classList.toggle('not-visited-icon');
    if (event.target.classList.value.indexOf('not') === -1) {
        value = true;
    }
    fetch(`${baseUrl}?place=${locationName}&param=visited&value=${value}`, { method: 'PUT' });
};
for (const elem of visited) {
    elem.addEventListener('click', onClickHandler);
}

// swap
const arrows = document.getElementsByClassName('arrow');
const onArrowClick = event => {
    const node = event.target.parentElement.parentElement;
    const locationName = node.firstChild.nextElementSibling.textContent;
    let swapNode;
    if (event.target.classList.value.indexOf('down') !== -1) {
        swapNode = node.nextElementSibling;
        swapNode.parentElement.insertBefore(swapNode, node);
    } else {
        swapNode = node.previousElementSibling;
        swapNode.parentElement.insertBefore(node, swapNode);
    }
    const secondName = swapNode.firstChild.nextElementSibling.textContent;
    correctArrows();
    fetch(`${baseUrl}?place1=${locationName}&place2=${secondName}`,
        { method: 'PUT' });
};
for (const elem of arrows) {
    elem.addEventListener('click', onArrowClick);
}

// delete single location
const trashBins = document.getElementsByClassName('hidden-options__trash');
const onTrashClick = event => {
    const node = event.target.parentElement.parentElement;
    const parent = node.parentElement;
    const locationName = node.firstChild.nextElementSibling.textContent;
    parent.removeChild(node);
    correctArrows();
    fetch(`${baseUrl}?place=${locationName}`,
        { method: 'DELETE' });
};
for (const elem of trashBins) {
    elem.addEventListener('click', onTrashClick);
}

const createNameDiv = name => {
    const locDiv = document.createElement('div');
    locDiv.className = 'location-name';
    locDiv.innerText = name;

    return locDiv;
};

const createSingleArrow = arrowType => {
    const arrowDiv = document.createElement('div');
    if (arrowType === 'arrow-up') {
        arrowDiv.setAttribute('style', 'visibility:visible;');
    } else {
        arrowDiv.setAttribute('style', 'visibility:hidden;');
    }
    arrowDiv.className = `${arrowType} button arrow`;
    arrowDiv.addEventListener('click', onArrowClick);

    return arrowDiv;
};

const createArrowDiv = () => {
    const divArrows = document.createElement('div');
    divArrows.className = 'arrows horizontal-flex';
    divArrows.appendChild(createSingleArrow('arrow-up'));
    divArrows.appendChild(createSingleArrow('arrow-down'));

    return divArrows;
};

const createNotVisitedDiv = () => {
    const divNotVisited = document.createElement('div');
    divNotVisited.className = 'not-visited-icon visited-flag';
    divNotVisited.addEventListener('click', onClickHandler);

    return divNotVisited;
};

// on pencil click
const updateName = event => {
    event.preventDefault();
    const node = document.getElementsByClassName('change-name-input')[0];
    const newName = node.value;
    const parent = node.parentElement.parentElement;
    parent.replaceChild(createNameDiv(newName), node.parentElement);
    fetch(`${baseUrl}?place=${oldName}&param=name&value=${newName}`, { method: 'PUT' });
};

const renameLocation = document.getElementsByClassName('hidden-options__pencil');
const onPencilClick = event => {
    const node = event.target.parentElement.parentElement.firstChild.nextElementSibling;
    oldName = node.textContent;
    const input = document.createElement('input');
    const form = document.createElement('form');
    input.type = 'text';
    input.value = oldName;
    input.className = 'change-name-input';
    form.className = 'location-name';
    form.appendChild(input);
    node.parentElement.replaceChild(form, node);
    form.addEventListener('submit', updateName);
};
for (const elem of renameLocation) {
    elem.addEventListener('click', onPencilClick);
}

const createHiddenOpsDiv = () => {
    const container = document.createElement('div');
    container.className = 'hidden-options horizontal-flex';
    const pencilDiv = document.createElement('div');
    pencilDiv.className = 'hidden-options__pencil button';
    const trashDiv = document.createElement('div');
    trashDiv.className = 'hidden-options__trash button';
    trashDiv.addEventListener('click', onTrashClick);
    pencilDiv.addEventListener('click', onPencilClick);
    container.appendChild(pencilDiv);
    container.appendChild(trashDiv);

    return container;
};

const createArticle = name => {
    const article = document.createElement('article');
    article.className = 'location horizontal-flex visible';
    article.appendChild(createHiddenOpsDiv());
    article.appendChild(createNameDiv(name));
    article.appendChild(createArrowDiv());
    article.appendChild(createNotVisitedDiv());

    return article;
};

// throw error if trying to add a place with the same name
const checkNamesManually = name => {
    const locationCollection = document.getElementsByClassName('locations-list')[0].children;
    for (const elem of locationCollection) {
        const elemName = elem.firstChild.nextElementSibling.textContent;
        if (elemName === name) {
            throw new Error('Trying to add existing element');
        }
    }
};

// insert new place by enter and button click
const addForm = document.getElementsByClassName('insertion-form')[0];
const addButton = document.getElementsByClassName('location-insertion__button')[0];
const onLocationInsertion = () => {
    event.preventDefault();
    const input = document.getElementsByClassName('insertion-form__input');
    let addedElement;
    let parent;
    try {
        fetch(`${baseUrl}?place=${input[0].value}`, { method: 'POST' });
        checkNamesManually(input[0].value);
        parent = document.getElementsByClassName('locations-list')[0];
        addedElement = createArticle(input[0].value);
        parent.appendChild(addedElement);
    } catch (e) {
        parent.removeChild(addedElement);
    } finally {
        correctArrows();
    }
};
addForm.addEventListener('submit', onLocationInsertion);
addButton.addEventListener('click', onLocationInsertion);

const checkSearch = () => {
    const parent = document.getElementsByClassName('locations-list');
    const children = Array.from(parent[0].children);
    children.forEach(element => {
        const content = element.firstElementChild.nextElementSibling.textContent;
        if (content.indexOf(currentSearchResult) === -1) {
            element.style.display = 'none';
            element.className = 'location horizontal-flex hidden';
        }
    });
};

const toggleVisibility = (element, isVisible) => {
    if (isVisible) {
        element.style.display = 'flex';
        element.className = 'location horizontal-flex visible';
    } else {
        element.style.display = 'none';
        element.className = 'location horizontal-flex hidden';
    }
};

// display for all, not visited, visited
const display = document.getElementsByClassName('location-menu__nav');
const onClickHandlerDisplay = event => {
    const displayParam = event.target.textContent;
    const list = document.getElementsByClassName('locations-list')[0].children;
    switch (displayParam) {
        case 'All':
            for (const element of list) {
                toggleVisibility(element, true);
            }
            break;
        case 'Not visited':
            for (const element of list) {
                toggleVisibility(element,
                    element.lastElementChild.classList.value.indexOf('not') !== -1);
            }
            break;
        default:
            for (const element of list) {
                toggleVisibility(element,
                    element.lastElementChild.classList.value.indexOf('not') === -1);
            }
            break;
    }
    checkSearch();
    correctArrows();
};
for (const elem of display) {
    elem.addEventListener('click', onClickHandlerDisplay);
}

// delete everything
const deleteButton = document.getElementsByClassName('location-menu__delete-button')[0];
const onDeleteHandler = () => {
    fetch(baseUrl, { method: 'DELETE' });
    const list = document.getElementsByClassName('locations-list')[0];
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
};
deleteButton.addEventListener('click', onDeleteHandler);

// when page is refreshed [without this it will load every location with two arrows]
document.addEventListener('DOMContentLoaded', () => correctArrows());

// search form
const searchForm = document.getElementsByClassName('search-form')[0];
const onSearchSumbit = () => {
    event.preventDefault();
    const input = document.getElementsByClassName('search-form__input')[0].value;
    currentSearchResult = input;
    checkSearch();
};
searchForm.addEventListener('submit', onSearchSumbit);
