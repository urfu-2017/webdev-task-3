'use strict';
const baseUrl = 'https://cors-anywhere.herokuapp.com/https://webdev-task-2-gguhuxcnsd.now.sh';
let oldName = '';
let currentSearchResult = '';

const correctArrows = collection => {
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
    const url = `${baseUrl}?place=${locationName}&param=visited&value=${value}`;
    fetch(url, { method: 'PUT' });
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
    const list = document.getElementsByClassName('locations-list');
    const secondName = swapNode.firstChild.nextElementSibling.textContent;
    correctArrows(list[0].children);
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
    correctArrows(parent.children);

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

const createArrowDiv = () => {
    const divArrows = document.createElement('div');
    divArrows.className = 'arrows horizontal-flex';
    const divUpArrow = document.createElement('div');
    divUpArrow.className = 'arrow-up button arrow';
    divUpArrow.setAttribute('style', 'visibility:visible;');
    const divDownArrow = document.createElement('div');
    divDownArrow.className = 'arrow-down button arrow';
    divDownArrow.setAttribute('style', 'visibility:hidden;');
    divArrows.appendChild(divUpArrow);
    divArrows.appendChild(divDownArrow);
    divUpArrow.addEventListener('click', onArrowClick);
    divDownArrow.addEventListener('click', onArrowClick);

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
    const url = `${baseUrl}?place=${oldName}&param=name&value=${newName}`;
    fetch(url, { method: 'PUT' });
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
    article.className = 'location horizontal-flex';
    article.appendChild(createHiddenOpsDiv());
    article.appendChild(createNameDiv(name));
    article.appendChild(createArrowDiv());
    article.appendChild(createNotVisitedDiv());

    return article;
};

// throw error if trying to add a place with the same name
const checkNamesManually = name => {
    const locationCollection = document.getElementsByClassName('locations-list')[0].children;
    for (let elem of locationCollection) {
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
        correctArrows(parent.children);
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

// display for all, not visited, visited
const display = document.getElementsByClassName('location-menu__nav');
const onClickHandlerDisplay = event => {
    const displayParam = event.target.textContent;
    const parent = document.getElementsByClassName('locations-list');
    const children = Array.from(parent[0].children);
    if (displayParam === 'All') {
        children.forEach(element => {
            element.style.display = 'flex';
            element.className = 'location horizontal-flex visible';
        });
    } else if (displayParam === 'Not visited') {
        children.forEach(element => {
            if (element.lastElementChild.classList.value.indexOf('not') === -1) {
                element.style.display = 'none';
                element.className = 'location horizontal-flex hidden';
            } else {
                element.style.display = 'flex';
                element.className = 'location horizontal-flex visible';
            }
        });
    } else {
        children.forEach(element => {
            if (element.lastElementChild.classList.value.indexOf('not') === -1) {
                element.style.display = 'flex';
                element.className = 'location horizontal-flex visible';
            } else {
                element.style.display = 'none';
                element.className = 'location horizontal-flex hidden';
            }
        });
    }
    checkSearch();
    correctArrows(document.getElementsByClassName('location horizontal-flex visible'));
};
for (const elem of display) {
    elem.addEventListener('click', onClickHandlerDisplay);
}

// delete everything
const trashEverything = document.getElementsByClassName('location-menu__delete-button');
const onDeleteHandler = () => {
    fetch(baseUrl, { method: 'DELETE' });
    const node = document.getElementsByClassName('locations-list')[0];
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};
trashEverything[0].addEventListener('click', onDeleteHandler);

// when page is refreshed [without this it will load every location with two arrows]
const onRefresh = () => {
    const node = document.getElementsByClassName('locations-list')[0];
    correctArrows(node.children);
};
document.addEventListener('DOMContentLoaded', onRefresh);

// search form
const searchForm = document.getElementsByClassName('search-form')[0];
const onSearchSumbit = () => {
    event.preventDefault();
    const input = document.getElementsByClassName('search-form__input')[0].value;
    currentSearchResult = input;
    checkSearch();
};
searchForm.addEventListener('submit', onSearchSumbit);
