'use strict';
const baseUrl = 'https://cors-anywhere.herokuapp.com/https://webdev-task-2-gguhuxcnsd.now.sh';
let oldName = '';
let currentSearchResult = '';

const getElemByClass = (className, root = document) => root.getElementsByClassName(className)[0];

const correctArrows = () => {
    const collection = document.getElementsByClassName('location visible');
    let idx = 0;
    for (const elem of collection) {
        const arrowDown = getElemByClass('arrow-down', elem);
        const arrowUp = getElemByClass('arrow-up', elem);

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
    const locationName = getElemByClass('location-name', event.target.parentElement).textContent;
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
    const article = event.target.parentElement.parentElement;
    const locationName = getElemByClass('location-name', article).textContent;
    let swapNode;
    if (event.target.classList.value.indexOf('down') !== -1) {
        swapNode = article.nextElementSibling;
        swapNode.parentElement.insertBefore(swapNode, article);
    } else {
        swapNode = article.previousElementSibling;
        swapNode.parentElement.insertBefore(article, swapNode);
    }
    const secondName = getElemByClass('location-name', swapNode).textContent;
    correctArrows();
    fetch(`${baseUrl}?place1=${locationName}&place2=${secondName}`,
        { method: 'PUT' });
};
for (const elem of arrows) {
    elem.addEventListener('click', onArrowClick);
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

// delete single location
const trashBins = document.getElementsByClassName('hidden-options__trash');
const onTrashClick = event => {
    const node = event.target.parentElement.parentElement;
    const locationName = getElemByClass('location-name', node).textContent;
    node.parentElement.removeChild(node);
    correctArrows();
    fetch(`${baseUrl}?place=${locationName}`,
        { method: 'DELETE' });
};
for (const elem of trashBins) {
    elem.addEventListener('click', onTrashClick);
}


// throw error if trying to add a place with the same name
const checkNamesManually = name => {
    const locationCollection = getElemByClass('locations-list').children;
    for (const elem of locationCollection) {
        const elemName = getElemByClass('location-name', elem).textContent;
        if (elemName === name) {
            throw new Error('Trying to add existing element');
        }
    }
};

// on pencil click
const updateName = event => {
    event.preventDefault();
    let addedElement;
    let parent;
    try {
        const node = getElemByClass('change-name-input');
        const newName = node.value;
        checkNamesManually(newName);
        fetch(`${baseUrl}?place=${oldName}&param=name&value=${newName}`, { method: 'PUT' });
        parent = node.parentElement.parentElement;
        addedElement = createNameDiv(newName);
        parent.replaceChild(addedElement, node.parentElement);
    } catch (e) {
        parent.removeChild(addedElement);
    } finally {
        correctArrows();
    }
};

const renameLocation = document.getElementsByClassName('hidden-options__pencil');
const onPencilClick = event => {
    const node = getElemByClass('location-name', event.target.parentElement.parentElement);
    oldName = node.textContent;
    const input = document.createElement('input');
    const form = document.createElement('form');
    form.className = 'location-name';
    input.type = 'text';
    input.value = oldName;
    input.className = 'change-name-input';
    form.appendChild(input);
    form.addEventListener('submit', updateName);
    node.parentElement.replaceChild(form, node);
};
for (const elem of renameLocation) {
    elem.addEventListener('click', onPencilClick);
}

const createHiddenOpsDiv = () => {
    const container = document.createElement('div');
    const pencilDiv = document.createElement('div');
    const trashDiv = document.createElement('div');

    container.className = 'hidden-options horizontal-flex';
    pencilDiv.className = 'hidden-options__pencil button';
    trashDiv.className = 'hidden-options__trash button';

    pencilDiv.addEventListener('click', onPencilClick);
    trashDiv.addEventListener('click', onTrashClick);

    container.appendChild(pencilDiv);
    container.appendChild(trashDiv);

    return container;
};

// create location element in dom
const createArticle = name => {
    const article = document.createElement('article');
    article.className = 'location horizontal-flex visible';
    article.appendChild(createHiddenOpsDiv());
    article.appendChild(createNameDiv(name));
    article.appendChild(createArrowDiv());
    article.appendChild(createNotVisitedDiv());

    return article;
};

// insert new place by enter and button click
const addForm = getElemByClass('insertion-form');
const addButton = getElemByClass('location-insertion__button');
const onLocationInsertion = () => {
    event.preventDefault();
    const input = document.getElementsByClassName('insertion-form__input');
    let addedElement;
    let parent;
    try {
        fetch(`${baseUrl}?place=${input[0].value}`, { method: 'POST' });
        checkNamesManually(input[0].value);
        parent = getElemByClass('locations-list');
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

// displays elements containing required search string
const checkSearch = () => {
    const children = getElemByClass('locations-list').children;
    for (const element of children) {
        const content = getElemByClass('location-name', element).textContent;
        if (content.indexOf(currentSearchResult) === -1) {
            element.style.display = 'none';
            element.className = 'location horizontal-flex hidden';
        }
    }
};

// visible/hidden
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
    const list = getElemByClass('locations-list').children;
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
const deleteButton = getElemByClass('location-menu__delete-button');
const onDeleteHandler = () => {
    fetch(baseUrl, { method: 'DELETE' });
    const list = getElemByClass('locations-list');
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
};
deleteButton.addEventListener('click', onDeleteHandler);

// when page is refreshed [without this it will load every location with two arrows]
document.addEventListener('DOMContentLoaded', () => correctArrows());

// search form
const searchForm = getElemByClass('search-form');
const onSearchSumbit = () => {
    event.preventDefault();
    const input = getElemByClass('search-form__input').value;
    currentSearchResult = input;
    checkSearch();
};
searchForm.addEventListener('submit', onSearchSumbit);
