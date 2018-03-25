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

    hide() {

    }

    deleteAll() {
        fetchReq(baseUrl, 'DELETE').then();
        while (parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
        }
    }

    _filterByVisited() {

    }

    _filterBySearch() {

    }
}

const list = new ArticleList();

class ArticleMethods {
    delete() {
        const node = event.target.parentElement.parentElement;
        const locationName = getElemByClass('location-name', node).textContent;
        node.parentElement.removeChild(node);
        correctArrows();
        fetchReq(`${baseUrl}?place=${locationName}`, 'DELETE').then();
    }

    rename() {
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

    swapUp() {
        const article = event.target.parentElement.parentElement;
        const locationName = getElemByClass('location-name', article).textContent;
        const swapNode = article.previousElementSibling;
        swapNode.parentElement.insertBefore(article, swapNode);

        const secondName = getElemByClass('location-name', swapNode).textContent;
        correctArrows();
        fetchReq(`${baseUrl}?place1=${locationName}&place2=${secondName}`, 'PUT').then();
    }

    swapDown() {
        const article = event.target.parentElement.parentElement;
        const locationName = getElemByClass('location-name', article).textContent;
        const swapNode = article.nextElementSibling;
        swapNode.parentElement.insertBefore(swapNode, article);

        const secondName = getElemByClass('location-name', swapNode).textContent;
        correctArrows();
        fetchReq(`${baseUrl}?place1=${locationName}&place2=${secondName}`, 'PUT').then();
    }

    toggleVisited() {
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

class Button extends ArticleMethods {
    constructor(type, div, fullName) {
        super();
        this._type = type;
        this._button = document.createElement(div);
        this._className = fullName;
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

    _checkMainType() {
        switch (this._type) {
            case 'location-insertion__button':
                this._button.addEventListener('click', list.add);
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
                this._button.addEventListener('click', this.rename);
                break;
            case 'hidden-options__trash':
                this._button.addEventListener('click', this.delete);
                break;
            case 'arrow-up':
                this._button.addEventListener('click', this.swapUp);
                break;
            case 'arrow-down':
                this._button.addEventListener('click', this.swapDown);
                break;
            case 'visited-flag':
                this._button.addEventListener('click', this.toggleVisited);
                break;
            default:
                break;
        }
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

        return new Button('location__button', 'div',
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

        return new Button('location__button',
            'div', 'not-visited-icon location__button visited-flag').createButton();
    }

    _createHiddenOpsDiv() {
        const container = document.createElement('div');
        container.className = 'hidden-options horizontal-flex';

        container.appendChild(new Button('location__button',
            'div', 'hidden-options__pencil location__button button').createButton());
        container.appendChild(new Button('location__button',
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

