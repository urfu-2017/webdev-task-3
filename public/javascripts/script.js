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
    const result = fetch(url, { method })
        .then(data => {
            loadIcon.className = 'loader hidden';

            return data.json();
        })
        .catch(throwErr);

    return result;
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

const validateName = name => {
    const locationCollection = parentElement.children;
    for (const elem of locationCollection) {
        const elemName = getElemByClass('location-name', elem).textContent;
        if (elemName === name) {
            throw new Error('Trying to add existing element');
        }
    }
};

class ArticleList {
    constructor() {
        this.hide = this.hide.bind(this);
    }

    add(event) {
        event.preventDefault();
        const input = document.getElementsByClassName('insertion-form__input')[0].value;
        let addedElement;
        try {
            validateName(input);
            addedElement = createArticle(input);
            parentElement.appendChild(addedElement);
        } catch (e) {
            throwErr(e);
            parentElement.removeChild(addedElement);
        } finally {
            correctArrows();
        }
    }

    hide(event) {
        const displayParam = event.target.textContent;
        this._filterBySearch();
        this._filterByVisited(displayParam);
        correctArrows();
    }

    deleteAll() {
        fetchReq(baseUrl, 'DELETE').then();
        while (parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
        }
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

    _filterBySearch() {
        this.currentSearchResult = this.currentSearchResult || '';
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

class Button {
    constructor(type, div, fullName) {
        this._type = type;
        this._button = document.createElement(div);
        this._className = fullName;
        this._delete = this._delete.bind(this);
    }

    createButton() {
        this._button.className = this._className;
        this._checkMainType();

        return this._button;
    }

    initialize() {
        this._button = getElemByClass(this._className);
        this._checkMainType();

        return this._button;
    }

    refreshButtons(article) {
        getElemByClass('hidden-options__pencil', article).addEventListener('click', this._rename);
        getElemByClass('hidden-options__trash', article).addEventListener('click', this._delete);
        getElemByClass('arrow-up', article).addEventListener('click', this._swapUp);
        getElemByClass('arrow-down', article).addEventListener('click', this._swapDown);
        getElemByClass('visited-flag', article).addEventListener('click', this._toggleVisited);
    }

    _checkMainType() {
        switch (this._type) {
            case 'location-insertion__button':
                this._button.addEventListener('click', list.add);
                getElemByClass('insertion-form').addEventListener('submit', list.add);
                break;
            case 'location-menu__delete-button':
                this._button.addEventListener('click', list.deleteAll);
                break;
            case 'location-menu__switch':
                this._button.addEventListener('click', list.hide);
                break;
            default:
                this._checkSecondaryType();
                break;
        }
    }

    _checkSecondaryType() {
        switch (this._type) {
            case 'hidden-options__pencil':
                this._button.addEventListener('click', this._rename);
                break;
            case 'hidden-options__trash':
                this._button.addEventListener('click', this._delete);
                break;
            case 'arrow-up':
                this._button.addEventListener('click', this._swapUp);
                break;
            case 'arrow-down':
                this._button.addEventListener('click', this._swapDown);
                break;
            case 'visited-flag':
                this._button.addEventListener('click', this._toggleVisited);
                break;
            default:
                break;
        }
    }

    _delete(event) {
        const node = event.target.parentElement.parentElement;
        const locationName = getElemByClass('location-name', node).textContent;
        node.parentElement.removeChild(node);
        correctArrows();
        fetchReq(`${baseUrl}?place=${locationName}`, 'DELETE').then();
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
                fetchReq(`${baseUrl}?place=${this.oldName}&param=name&value=${newName}`,
                    'PUT').then();
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

    _swapUp(event) {
        const article = event.target.parentElement.parentElement;
        const locationName = getElemByClass('location-name', article).textContent;
        const swapNode = article.previousElementSibling;
        swapNode.parentElement.insertBefore(article, swapNode);

        const secondName = getElemByClass('location-name', swapNode).textContent;
        correctArrows();
        fetchReq(`${baseUrl}?place1=${locationName}&place2=${secondName}`, 'PUT').then();
    }

    _swapDown(event) {
        const article = event.target.parentElement.parentElement;
        const locationName = getElemByClass('location-name', article).textContent;
        const swapNode = article.nextElementSibling;
        swapNode.parentElement.insertBefore(swapNode, article);

        const secondName = getElemByClass('location-name', swapNode).textContent;
        correctArrows();
        fetchReq(`${baseUrl}?place1=${locationName}&place2=${secondName}`, 'PUT').then();
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
        fetchReq(`${baseUrl}?place=${locationName}&param=visited&value=${value}`, 'PUT').then();
    }

}

class Article {
    constructor(name) {
        this._name = name;
    }

    create() {
        fetchReq(`${baseUrl}?place=${this._name}`, 'POST').then();
        const article = document.createElement('article');
        article.className = 'location horizontal-flex visible';
        article.appendChild(this._createHiddenOpsDiv());
        article.appendChild(this._createNameDiv());
        article.appendChild(this._createArrowDiv());
        article.appendChild(this._createNotVisitedDiv());
        this.article = article;

        return this.article;
    }

    _createNameDiv() {
        const locDiv = document.createElement('div');
        locDiv.className = 'location-name';
        locDiv.innerText = this._name;

        return locDiv;
    }

    _createSingleArrow(arrowType) {
        const visibility = arrowType === 'arrow-up' ? 'visible' : 'hidden';

        return new Button(arrowType, 'div',
            `${arrowType} location__button button arrow ${visibility}`).createButton();
    }

    _createArrowDiv() {
        const divArrows = document.createElement('div');
        divArrows.className = 'arrows horizontal-flex';
        divArrows.appendChild(this._createSingleArrow('arrow-up'));
        divArrows.appendChild(this._createSingleArrow('arrow-down'));

        return divArrows;
    }

    _createNotVisitedDiv() {

        return new Button('visited-flag',
            'div', 'not-visited-icon location__button visited-flag').createButton();
    }

    _createHiddenOpsDiv() {
        const container = document.createElement('div');
        container.className = 'hidden-options horizontal-flex';

        container.appendChild(new Button('hidden-options__pencil',
            'div', 'hidden-options__pencil location__button button').createButton());
        container.appendChild(new Button('hidden-options__trash',
            'div', 'hidden-options__trash location__button button').createButton());

        return container;
    }
}

function createArticle(name) {
    return new Article(name).create();
}

new Button('location-insertion__button', 'div',
    'location-insertion__button button').initialize();
new Button('location-menu__delete-button', 'div',
    'location-menu__delete-button button').initialize();
new Button('location-menu__switch', 'div',
    'location-menu__switch show-all-button button').initialize();
new Button('location-menu__switch', 'div',
    'location-menu__switch show-not-visited-button button').initialize();
new Button('location-menu__switch', 'div',
    'location-menu__switch show-visited-button button').initialize();

const refreshEventListeners = () => {
    const collection = parentElement.getElementsByClassName('location');
    for (const elem of collection) {
        new Button().refreshButtons(elem);
    }
    correctArrows();
};
document.addEventListener('DOMContentLoaded', () => refreshEventListeners());

