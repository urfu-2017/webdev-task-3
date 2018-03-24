'use strict';

const baseUrl = 'https://webdev-task-2-imdqrzyysn.now.sh';
const getElemByClass = (className, root = document) => root.getElementsByClassName(className)[0];
const parentElement = getElemByClass('locations-list');
const fetchReq = (url, method) => fetch(url, { method }).then(data => data.json());

const correctArrows = () => {
    const collection = document.getElementsByClassName('location visible');
    let idx = 0;
    for (const elem of collection) {
        const arrowDown = getElemByClass('arrow-down', elem);
        const arrowUp = getElemByClass('arrow-up', elem);

        arrowUp.className = 'arrow-up button arrow visible';
        arrowDown.className = 'arrow-down button arrow visible';
        if (idx === 0) {
            arrowUp.className = 'arrow-up button arrow hidden';
        }
        if (idx === collection.length - 1) {
            arrowDown.className = 'arrow-down button arrow hidden';
        }
        idx++;
    }
};

const validateName = name => {
    const locationCollection = parentElement.children;
    for (const elem of locationCollection) {
        const elemName = getElemByClass('location-name', elem).textContent;
        if (elemName === name) {
            throw new Error('Trying to add existing element');
        }
    }
};

class EventListeners {
    constructor(params) {
        this._visited = params.visited;
        this._arrows = params.arrows; // array
        this._trash = params.trash;
        this._pencil = params.pencil;
    }

    initListeners() {
        this._visited.addEventListener('click', this._toggleVisited);
        this._arrows.forEach(arrow => {
            arrow.addEventListener('click', this._onArrowClick);
        });
        this._trash.addEventListener('click', this._onTrashClick);
        this._pencil.addEventListener('click', this._onPencilClick);
    }

    _toggleVisited(event) {
        const locationName = getElemByClass('location-name',
            event.target.parentElement).textContent;
        let value = false;
        event.target.classList.toggle('visited-icon');
        event.target.classList.toggle('not-visited-icon');
        if (event.target.classList.value.indexOf('not') === -1) {
            value = true;
        }
        fetchReq(`${baseUrl}?place=${locationName}&param=visited&value=${value}`, 'PUT');
    }

    _onArrowClick(event) {
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
        fetchReq(`${baseUrl}?place1=${locationName}&place2=${secondName}`, 'PUT');
    }

    _onTrashClick(event) {
        const node = event.target.parentElement.parentElement;
        const locationName = getElemByClass('location-name', node).textContent;
        node.parentElement.removeChild(node);
        correctArrows();
        fetchReq(`${baseUrl}?place=${locationName}`, 'DELETE');
    }

    _onPencilClick(event) {
        const node = getElemByClass('location-name', event.target.parentElement.parentElement);
        this.oldName = node.textContent;
        const input = document.createElement('input');
        const form = document.createElement('form');
        form.className = 'location-name';
        input.type = 'text';
        input.value = this.oldName;
        input.className = 'change-name-input';
        form.appendChild(input);
        form.addEventListener('submit', () => {
            event.preventDefault();
            let addedElement;
            let parent;
            try {
                const currentNode = getElemByClass('change-name-input');
                const newName = currentNode.value;
                validateName(newName);
                fetchReq(`${baseUrl}?place=${this.oldName}&param=name&value=${newName}`, 'PUT');
                parent = currentNode.parentElement.parentElement;
                addedElement = document.createElement('div');
                addedElement.className = 'location-name';
                addedElement.innerText = newName;
                parent.replaceChild(addedElement, currentNode.parentElement);
            } catch (e) {
                parent.removeChild(addedElement);
            } finally {
                correctArrows();
            }
        });
        node.parentElement.replaceChild(form, node);
    }
}

class Article {
    constructor(name) {
        this._name = name;
    }

    initialize() {
        fetchReq(`${baseUrl}?place=${this._name}`, 'POST');
        const article = document.createElement('article');
        article.className = 'location horizontal-flex visible';
        article.appendChild(this._createHiddenOpsDiv());
        article.appendChild(this._createNameDiv());
        article.appendChild(this._createArrowDiv());
        article.appendChild(this._createNotVisitedDiv());
        this.article = article;
        Article.addEventListeners(this.article);

        return this.article;
    }

    static addEventListeners(element) {
        const visited = getElemByClass('visited-flag', element);
        const arrows = Array.from(element.getElementsByClassName('arrow'));
        const trash = getElemByClass('hidden-options__trash', element);
        const pencil = getElemByClass('hidden-options__pencil', element);
        new EventListeners({ visited, arrows, trash, pencil }).initListeners();
    }

    _createNameDiv() {
        const locDiv = document.createElement('div');
        locDiv.className = 'location-name';
        locDiv.innerText = this._name;

        return locDiv;
    }

    _createSingleArrow(arrowType) {
        const arrowDiv = document.createElement('div');
        if (arrowType === 'arrow-up') {
            arrowDiv.className = 'arrow-up button arrow visible';
        } else {
            arrowDiv.className = 'arrow-up button arrow hidden';
        }
        arrowDiv.className = `${arrowType} button arrow`;

        return arrowDiv;
    }

    _createArrowDiv() {
        const divArrows = document.createElement('div');
        divArrows.className = 'arrows horizontal-flex';
        divArrows.appendChild(this._createSingleArrow('arrow-up'));
        divArrows.appendChild(this._createSingleArrow('arrow-down'));

        return divArrows;
    }

    _createNotVisitedDiv() {
        const divNotVisited = document.createElement('div');
        divNotVisited.className = 'not-visited-icon visited-flag';

        return divNotVisited;
    }

    _createHiddenOpsDiv() {
        const container = document.createElement('div');
        const pencilDiv = document.createElement('div');
        const trashDiv = document.createElement('div');

        container.className = 'hidden-options horizontal-flex';
        pencilDiv.className = 'hidden-options__pencil button';
        trashDiv.className = 'hidden-options__trash button';

        container.appendChild(pencilDiv);
        container.appendChild(trashDiv);

        return container;
    }
}

class Locations {
    constructor() {
        this.filterLocations = this.filterLocations.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
    }

    submitSearch() {
        event.preventDefault();
        this.currentSearchResult = getElemByClass('search-form__input').value;
        this._checkSearch();
    }

    filterLocations() {
        const displayParam = event.target.textContent;
        this._displayElemsByParam(displayParam);
        this._checkSearch();
        correctArrows();
    }

    delete() {
        fetchReq(baseUrl, 'DELETE');
        while (parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
        }
    }

    insert() {
        event.preventDefault();
        const input = document.getElementsByClassName('insertion-form__input')[0].value;
        let addedElement;
        try {
            validateName(input);
            addedElement = new Article(input).initialize();
            Article.addEventListeners(addedElement);
            parentElement.appendChild(addedElement);
        } catch (e) {
            parentElement.removeChild(addedElement);
        } finally {
            correctArrows();
        }
    }

    addEventListeners() {
        // insert new place by enter and button click
        const onLocationInsertion = () => this.insert();
        getElemByClass('insertion-form').addEventListener('submit', onLocationInsertion);
        getElemByClass('location-insertion__button').addEventListener('click', onLocationInsertion);

        this._addOnRealoadListener();

        // visible invisible
        const display = document.getElementsByClassName('location-menu__nav');
        for (const elem of display) {
            elem.addEventListener('click', this.filterLocations);
        }

        getElemByClass('search-form').addEventListener('submit', this.submitSearch);
        getElemByClass('location-menu__delete-button').addEventListener('click', this.delete);
    }

    _addOnRealoadListener() {
        // adding event listeners on reaload for existing elements
        const refreshEventListeners = () => {
            const collection = parentElement.getElementsByClassName('location');
            for (const elem of collection) {
                Article.addEventListeners(elem);
            }
            correctArrows();
        };
        document.addEventListener('DOMContentLoaded', () => refreshEventListeners());
    }

    _toggleVisibility(element, isVisible) {
        if (isVisible) {
            element.className = 'location horizontal-flex visible shown';
        } else {
            element.className = 'location horizontal-flex hidden not-shown';
        }

        return;
    }

    _checkSearch() {
        this.currentSearchResult = this.currentSearchResult || '';
        const children = parentElement.children;
        for (const element of children) {
            const content = getElemByClass('location-name', element).textContent;
            if (content.indexOf(this.currentSearchResult) === -1) {
                element.className = 'location horizontal-flex hidden not-shown';
            }
        }
        correctArrows();
    }

    _displayElemsByParam(displayParam) {
        const list = parentElement.children;
        switch (displayParam) {
            case 'All':
                for (const element of list) {
                    this._toggleVisibility(element, true);
                }
                break;
            case 'Not visited':
                for (const element of list) {
                    this._toggleVisibility(element,
                        element.lastElementChild.classList.value.indexOf('not') !== -1);
                }
                break;
            default:
                for (const element of list) {
                    this._toggleVisibility(element,
                        element.lastElementChild.classList.value.indexOf('not') === -1);
                }
                break;
        }
    }
}

const List = new Locations();
List.addEventListeners();
