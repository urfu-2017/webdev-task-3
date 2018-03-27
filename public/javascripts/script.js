'use strict';

const baseUrl = 'https://webdev-task-2-imdqrzyysn.now.sh';
const getElemByClass = (className, root = document) => root.getElementsByClassName(className)[0];
const parentElement = getElemByClass('locations-list');
const loadIcon = getElemByClass('loader');

const throwErr = e => {
    const errDiv = getElemByClass('error-message');
    errDiv.className = 'error-message visible';
    errDiv.innerHTML = e;
    setTimeout(() => {
        errDiv.className = 'error-message hidden';
    }, 3000);
};

const fetchReq = (url, method) => {
    getElemByClass('loader').className = 'loader visible';

    return fetch(url, { method })
        .then(data => {
            loadIcon.className = 'loader hidden';

            return data.json();
        })
        .then(data => {
            if (data.code >= 400) {
                throw new Error(data.message);
            }
        })
        .catch(err => {
            console.info(err);
            throwErr(err);

            return Promise.reject('error');
        });
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

const correctArrows = () => {
    const collection = document.getElementsByClassName('location visible');
    let idx = 0;
    for (const elem of collection) {
        const arrowDown = getElemByClass('arrow-down', elem);
        const arrowUp = getElemByClass('arrow-up', elem);

        arrowUp.className = 'arrow-up location__button button arrow visible';
        arrowDown.className = 'arrow-down location__button button arrow visible';
        if (idx === 0) {
            arrowUp.className = 'arrow-up location__button button arrow hidden';
        }
        if (idx === collection.length - 1) {
            arrowDown.className = 'arrow-down location__button button arrow hidden';
        }
        idx++;
    }
};

class ArticleList {
    constructor() {
        this.hide = this.hide.bind(this);
        this.filterBySearch = this.filterBySearch.bind(this);
    }

    add(event) {
        event.preventDefault();
        const input = document.getElementsByClassName('insertion-form__input')[0].value;
        createArticle(input);
    }

    hide(event) {
        const displayParam = event.target.className;
        this.filterBySearch(event);
        this._filterByVisited(displayParam);
        correctArrows();
    }

    deleteAll() {
        fetchReq(baseUrl, 'DELETE').then(() => {
            while (parentElement.firstChild) {
                parentElement.removeChild(parentElement.firstChild);
            }
        });
    }

    _makeElementsVisible() {
        const children = parentElement.children;
        for (const element of children) {
            element.className = 'location horizontal-flex visible shown';
        }
    }

    _toggleVisibility(element, isVisible) {
        if (!isVisible) {
            element.className = 'location horizontal-flex hidden not-shown';
        }
        correctArrows();
    }

    _filterByVisited(displayParam) {
        const list = parentElement.children;
        if (displayParam.indexOf('show-all-button') !== -1) {
            for (const element of list) {
                this._toggleVisibility(element, true);
            }
        } else if (displayParam.indexOf('show-not-visited-button') !== -1) {
            for (const element of list) {
                this._toggleVisibility(element,
                    element.lastElementChild.classList.value.indexOf('not') !== -1);
            }
        } else {
            for (const element of list) {
                this._toggleVisibility(element,
                    element.lastElementChild.classList.value.indexOf('not') === -1);
            }
        }
    }

    filterBySearch(event) {
        this.currentSearchResult = event.target.value || '';
        const children = parentElement.children;
        this._makeElementsVisible();
        for (const element of children) {
            const content = getElemByClass('location-name', element).textContent;
            if (content.indexOf(this.currentSearchResult) === -1) {
                element.className = 'location horizontal-flex hidden not-shown';
            }
        }
        correctArrows();
    }
}

const list = new ArticleList();
getElemByClass('search-form').addEventListener('keyup', list.filterBySearch);
getElemByClass('search-form').addEventListener('submit', event => event.preventDefault());

class Button {
    constructor(type, div, fullName) {
        this._type = type;
        this._button = document.createElement(div);
        this._className = fullName;
    }

    createButton(eventListener) {
        this._button.className = this._className;
        this._button.addEventListener('click', eventListener);

        return this._button;
    }

    initialize(eventListener) {
        this._button = getElemByClass(this._className);
        this._button.addEventListener('click', eventListener);

        return this._button;
    }
}

class LocationInsertionButton extends Button {
    constructor(type, div, fullName) {
        super(type, div, fullName);
    }

    initializeSubClass() {
        return super.initialize(list.add);
    }
}

class DeletionButton extends Button {
    constructor(type, div, fullName) {
        super(type, div, fullName);
    }

    createButtonSubClass() {
        return super.createButton(list.deleteAll);
    }

    initializeSubClass() {
        return super.initialize(list.deleteAll);
    }
}

class SwitchButton extends Button {
    constructor(type, div, fullName) {
        super(type, div, fullName);
    }

    createButtonSubClass() {
        return super.createButton(list.hide);
    }

    initializeSubClass() {
        return super.initialize(list.hide);
    }
}

class PencilButton extends Button {
    constructor(type, div, fullName) {
        super(type, div, fullName);
    }

    createButtonSubClass() {
        return this.createButton(this._rename);
    }

    refresh(article) {
        getElemByClass('hidden-options__pencil', article).addEventListener('click', this._rename);
    }

    _rename(event) {
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
                const current = getElemByClass('change-name-input');
                const newName = current.value;
                fetchReq(`${baseUrl}?place=${this.oldName}&param=name&value=${newName}`, 'PUT');
                validateName(newName);
                addedElement = document.createElement('div');
                addedElement.className = 'location-name';
                addedElement.innerText = newName;
                current.parentElement.parentElement
                    .replaceChild(addedElement, current.parentElement);
            } catch (e) {
                throwErr(e);
                parent.removeChild(addedElement);
            } finally {
                correctArrows();
            }
        });
        node.parentElement.replaceChild(form, node);
    }
}

class TrashButton extends Button {
    constructor(type, div, fullName) {
        super(type, div, fullName);
    }

    createButtonSubClass() {
        return this.createButton(this._delete);
    }

    refresh(article) {
        getElemByClass('hidden-options__trash', article).addEventListener('click', this._delete);
    }

    _delete(event) {
        const node = event.target.parentElement.parentElement;
        const locationName = getElemByClass('location-name', node).textContent;
        fetchReq(`${baseUrl}?place=${locationName}`, 'DELETE').then(() => {
            node.parentElement.removeChild(node);
            correctArrows();
        });
    }
}

class ArrowUpButton extends Button {
    constructor(type, div, fullName) {
        super(type, div, fullName);
    }

    createButtonSubClass() {
        return this.createButton(this._swapUp);
    }

    refresh(article) {
        getElemByClass('arrow-up', article).addEventListener('click', this._swapUp);
    }

    _swapUp(event) {
        const article = event.target.parentElement.parentElement;
        const locationName = getElemByClass('location-name', article).textContent;
        const swapNode = article.previousElementSibling;
        const secondName = getElemByClass('location-name', swapNode).textContent;
        fetchReq(`${baseUrl}?place1=${locationName}&place2=${secondName}`, 'PUT').then(() => {
            swapNode.parentElement.insertBefore(article, swapNode);
            correctArrows();
        });
    }
}

class ArrowDownButton extends Button {
    constructor(type, div, fullName) {
        super(type, div, fullName);
    }

    createButtonSubClass() {
        return this.createButton(this._swapDown);
    }

    refresh(article) {
        getElemByClass('arrow-down', article).addEventListener('click', this._swapDown);
    }

    _swapDown(event) {
        const article = event.target.parentElement.parentElement;
        const locationName = getElemByClass('location-name', article).textContent;
        const swapNode = article.nextElementSibling;
        const secondName = getElemByClass('location-name', swapNode).textContent;
        fetchReq(`${baseUrl}?place1=${locationName}&place2=${secondName}`, 'PUT').then(() => {
            swapNode.parentElement.insertBefore(swapNode, article);
            correctArrows();
        });
    }
}

class VisitButton extends Button {
    constructor(type, div, fullName) {
        super(type, div, fullName);
    }

    createButtonSubClass() {
        return this.createButton(this._toggleVisited);
    }

    refresh(article) {
        getElemByClass('visited-flag', article).addEventListener('click', this._toggleVisited);
    }

    _toggleVisited(event) {
        const locationName = getElemByClass('location-name',
            event.target.parentElement).textContent;
        let value = false;
        if (event.target.classList.value.indexOf('not') !== -1) {
            value = true;
        }
        fetchReq(`${baseUrl}?place=${locationName}&param=visited&value=${value}`, 'PUT')
            .then(() => {
                event.target.classList.toggle('visited-icon');
                event.target.classList.toggle('not-visited-icon');
            });
    }
}

class Article {
    constructor(name) {
        this._name = name;
    }

    create() {
        fetchReq(`${baseUrl}?place=${this._name}`, 'POST').then(() => {
            const article = document.createElement('article');
            article.className = 'location horizontal-flex visible';
            article.appendChild(this._createHiddenOpsDiv());
            article.appendChild(this._createNameDiv());
            article.appendChild(this._createArrowDiv());
            article.appendChild(this._createNotVisitedDiv());
            this.article = article;
            parentElement.appendChild(this.article);
            correctArrows();
        });
    }

    _createNameDiv() {
        const locDiv = document.createElement('div');
        locDiv.className = 'location-name';
        locDiv.innerText = this._name;

        return locDiv;
    }

    _createSingleArrow(arrowType) {
        const visibility = arrowType === 'arrow-up' ? 'visible' : 'hidden';
        if (arrowType === 'arrow-up') {
            return new ArrowUpButton(arrowType, 'div',
                `${arrowType} location__button button arrow ${visibility}`).createButtonSubClass();
        }

        return new ArrowUpButton(arrowType, 'div',
            `${arrowType} location__button button arrow ${visibility}`).createButtonSubClass();

    }

    _createArrowDiv() {
        const divArrows = document.createElement('div');
        divArrows.className = 'arrows horizontal-flex';
        divArrows.appendChild(this._createSingleArrow('arrow-up'));
        divArrows.appendChild(this._createSingleArrow('arrow-down'));

        return divArrows;
    }

    _createNotVisitedDiv() {

        return new VisitButton('visited-flag',
            'div', 'not-visited-icon location__button visited-flag').createButtonSubClass();
    }

    _createHiddenOpsDiv() {
        const container = document.createElement('div');
        container.className = 'hidden-options horizontal-flex';

        container.appendChild(new PencilButton('hidden-options__pencil',
            'div', 'hidden-options__pencil location__button button').createButtonSubClass());
        container.appendChild(new TrashButton('hidden-options__trash',
            'div', 'hidden-options__trash location__button button').createButtonSubClass());

        return container;
    }
}

function createArticle(name) {
    return new Article(name).create();
}

new LocationInsertionButton('location-insertion__button', 'div',
    'location-insertion__button button').initializeSubClass();
new DeletionButton('location-menu__delete-button', 'div',
    'location-menu__delete-button button').initializeSubClass();
new SwitchButton('location-menu__switch', 'div',
    'location-menu__switch show-all-button button').initializeSubClass();
new SwitchButton('location-menu__switch', 'div',
    'location-menu__switch show-not-visited-button button').initializeSubClass();
new SwitchButton('location-menu__switch', 'div',
    'location-menu__switch show-visited-button button').initializeSubClass();

const refreshEventListeners = () => {
    const collection = parentElement.getElementsByClassName('location');
    for (const elem of collection) {
        new TrashButton().refresh(elem);
        new PencilButton().refresh(elem);
        new ArrowUpButton().refresh(elem);
        new ArrowDownButton().refresh(elem);
        new VisitButton().refresh(elem);
    }
    correctArrows();
};
document.addEventListener('DOMContentLoaded', () => refreshEventListeners());

