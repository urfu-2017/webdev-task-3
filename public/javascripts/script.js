'use strict';
const baseUrl = 'https://webdev-task-2-gguhuxcnsd.now.sh';

// to do: why do we need search
// add more options for an article: change location name

const correctArrows = collection => {
    let idx = 0;
    for (let elem of collection) {
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

const sendReq = async (url, options) => {
    const response = await fetch(url, options);
    const body = await response.json();

    return body;
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
    sendReq(url, { method: 'PUT' });
};
for (let elem of visited) {
    elem.addEventListener('click', onClickHandler);
}

// swap
const arrows = document.getElementsByClassName('arrow');
const onArrowClick = event => {
    const node = event.target.parentElement.parentElement;
    const locationName = node.firstChild.textContent;
    let swapNode;
    if (event.target.classList.value.indexOf('down') !== -1) {
        swapNode = node.nextElementSibling;
        swapNode.parentElement.insertBefore(swapNode, node);
    } else {
        swapNode = node.previousElementSibling;
        swapNode.parentElement.insertBefore(node, swapNode);
    }
    const list = document.getElementsByClassName('locations-list');
    correctArrows(list[0].children);
    fetch(`${baseUrl}?place1=${locationName}&place2=${swapNode.firstChild.textContent}`,
        { method: 'PUT', crossDomain: true });
};
for (let elem of arrows) {
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
        { method: 'DELETE', crossDomain: true });
};
for (let elem of trashBins) {
    elem.addEventListener('click', onTrashClick);
}

const createHiddenOpsDiv = () => {
    const container = document.createElement('div');
    container.className = 'hidden-options horizontal-flex';
    const pencilDiv = document.createElement('div');
    pencilDiv.className = 'hidden-options__pencil button';
    const trashDiv = document.createElement('div');
    trashDiv.className = 'hidden-options__trash button';
    trashDiv.addEventListener('click', onTrashClick);
    container.appendChild(pencilDiv);
    container.appendChild(trashDiv);

    return container;
};

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
        sendReq(`${baseUrl}?place=${input[0].value}`, { method: 'POST' });
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
    correctArrows(document.getElementsByClassName('location horizontal-flex visible'));
};
for (let elem of display) {
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

