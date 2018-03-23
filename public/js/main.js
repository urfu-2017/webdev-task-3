const BACK_URL = 'https://webdev-task-2-cgqldxeayf.now.sh';

const getById = id => document.getElementById(id);

const log = console.info;

const createElement = (tag, className = '', innerHTML = '', options = {}) => {
    const element = document.createElement(tag);
    element.className = className;
    element.innerHTML = innerHTML;
    Object.keys(options).forEach(key => {
        if (options[key] !== undefined) {
            element[key] = options[key];
        }
    });

    return element;
};

const fetchRequest = method => (url, data) => {
    log(method, url, data);

    const options = {
        body: JSON.stringify(data), // Почему это должен писать я???
        method,
        headers: { 'Content-Type': 'application/json' } // Почему это должен писать я???
    };

    return fetch(url, options).then(res => res.json());
};

const requests = {
    get: url => fetch(url).then(data => data.json()),
    post: fetchRequest('POST'),
    delete: fetchRequest('DELETE'),
    put: fetchRequest('PUT')
};

let placesListNode;

let places = [];

let requestQueue = new Promise(resolve => resolve());

const addRequestToQueue = func => {
    requestQueue = requestQueue.then(func);
};

const FILTERS = {
    ALL: 0,
    VISITED: 1,
    NOT_VISITED: 2
};

let placesFilter = FILTERS.ALL;

let placesDescription = '';

class Place {
    constructor(place) {
        this.place = place;
    }

    createCheckbox() {
        const checkbox = createElement('input', 'place__rename-checkbox', '', {
            type: 'checkbox', style: 'display:none'
        });

        return checkbox;
    }

    createRenameImage(nameElement) {
        const renameImage = createElement('img', 'place__rename-image', '',
            { src: '/static/img/pen.png' });
        renameImage.onclick = () => {
            if (nameElement.hasAttribute('disabled')) {
                nameElement.removeAttribute('disabled');
            } else {
                nameElement.setAttribute('disabled', true);
                Place.rename(nameElement.parentElement, nameElement.value);
            }
            log('rename clicked', nameElement.value, nameElement.hasAttribute('disabled'));
        };

        return renameImage;
    }

    createDeleteImage() {
        const deleteImage = createElement('img', 'place__delete-image', '',
            { src: '/static/img/trash.jpg' });
        deleteImage.onclick = () => Place.remove(deleteImage.parentElement);

        return deleteImage;
    }

    createPlaceName() {
        return createElement('input', 'place__name', '', {
            disabled: true, value: this.place.description
        });
    }

    createSwapImage(src, up = true) {
        const image = createElement('img', `place__swap-${up ? 'up' : 'down'}`, '', { src });
        image.onclick = () => Place.swap(image.parentElement, up);

        return image;
    }

    createVisitedRadio() {
        const radio = createElement('input', 'place__visited', '',
            { type: 'radio', checked: this.place.visited });
        radio.onchange = () => {
            log('change', radio.parentElement.id);
            Place.visit(radio.parentElement);
        };

        return radio;
    }

    toHtmlElement() {
        const div = createElement('div', 'place', '', { id: this.place.id });
        const name = this.createPlaceName();
        div.appendChild(this.createRenameImage(name));
        div.appendChild(this.createDeleteImage());
        div.appendChild(name);
        div.appendChild(this.createSwapImage('/static/img/swap-up.png'));
        div.appendChild(this.createSwapImage('/static/img/swap-down.png', false));
        div.appendChild(this.createVisitedRadio());

        return div;
    }

    static visit(placeElement) {
        log('visiting', placeElement);
        Place.filter();
        addRequestToQueue(() => {
            log('visiting 2', placeElement);
            places.find(i => i.id === Number(placeElement.id)).visited = true;

            return requests.post(`${BACK_URL}/places/visited`, { id: Number(placeElement.id) });
        });
    }

    static rename(placeElement, description) {
        log('renaming', placeElement);
        addRequestToQueue(() => {
            places.find(i => i.id === Number(placeElement.id)).description = description;

            return requests.put(`${BACK_URL}/places`, { description, id: Number(placeElement.id) });
        });
    }

    static add(place) {
        const child = new Place(place).toHtmlElement();
        placesListNode.appendChild(child);
        Place.filter();

        return child;
    }

    static remove(placeElement) {
        log('removing', placeElement);
        placesListNode.removeChild(placeElement);
        addRequestToQueue(() => {
            log('removing 2', placeElement);
            places = places.filter(i => i.id !== Number(placeElement.id));

            return requests.delete(`${BACK_URL}/places/${placeElement.id}`, {});
        });
    }

    static swap(element, up) {
        log('swapping');
        if (up) {
            element.parentElement.insertBefore(element, element.previousSibling);
        } else {
            element.parentElement.insertBefore(element.nextSibling, element);
        }
        const neighbor = element[up ? 'nextSibling' : 'previousSibling'];
        addRequestToQueue(() => {
            const id1 = Number(element.id);
            const id2 = Number(neighbor.id);
            const place1 = places.find(i => i.id === id1);
            const place2 = places.find(i => i.id === id2);
            place1.id = id2;
            place2.id = id1;
            element.id = id2;
            neighbor.id = id1;

            return requests.put(`${BACK_URL}/places/${id1}`, { id: id2 });
        });
    }

    static hide(element, condition) {
        if (condition) {
            element.style.display = 'none';
        }
    }

    static filter() {
        const childrens = placesListNode.children;
        for (let i = 0; i < childrens.length; i++) {
            childrens[i].style.display = 'grid';
        }
        for (let i = 0; i < childrens.length; i++) {
            const visited = childrens[i].children[5].checked;
            const description = childrens[i].children[2].value;
            Place.hide(childrens[i], !visited && placesFilter === FILTERS.VISITED);
            Place.hide(childrens[i], visited && placesFilter === FILTERS.NOT_VISITED);
            Place.hide(childrens[i], !description.includes(placesDescription));
        }
    }
}

const setFilter = (filter, button, buttons) => () => {
    log('change filter', button);
    buttons.forEach(i => {
        i.className = 'places-list__filter';
    });
    button.className += ' places-list__filter__checked';
    placesFilter = filter;
    Place.filter();
};

const createPlaceButtonOnClick = elem => async () => {
    if (elem.value) {
        const placeObj = { description: elem.value, visited: false };
        places.push(placeObj);
        const placeElement = Place.add(placeObj);

        addRequestToQueue(() => {
            return requests.post(`${BACK_URL}/places`, placeObj).then(data => {
                placeElement.setAttribute('id', data.id);
                placeObj.id = data.id;
            });
        });
    }
};

const searchPlaceInputOnInput = elem => () => {
    placesDescription = elem.value;
    Place.filter();
};

const deleteAllPlacesOnClick = () => {
    places = [];
    placesListNode.innerHTML = '';
    addRequestToQueue(() => requests.delete(`${BACK_URL}/places`, {}));
};

const initFilterButtons = () => {
    const allButton = getById('places-list__filter-all');
    const visitedButton = getById('places-list__filter-visited');
    const notVisitedButton = getById('places-list__filter-not-visited');

    const filterButtons = [allButton, visitedButton, notVisitedButton];

    allButton.onclick = setFilter(FILTERS.ALL, allButton, filterButtons);
    visitedButton.onclick = setFilter(FILTERS.VISITED, visitedButton, filterButtons);
    notVisitedButton.onclick = setFilter(FILTERS.NOT_VISITED, notVisitedButton, filterButtons);
};

window.onload = async () => {
    placesListNode = getById('places-list__list');

    places = await requests.get(`${BACK_URL}/places?sort=id`);
    placesListNode.innerHTML = '';
    places.sort((i, j) => Number(i.id) - Number(j.id))
        .forEach(place => Place.add(place));

    const placeButton = getById('create-place__button');
    const createPlaceInput = getById('create-place__input');
    placeButton.onclick = createPlaceButtonOnClick(createPlaceInput);

    const searchInput = getById('search-place__input');
    searchInput.oninput = searchPlaceInputOnInput(searchInput);

    const deleteAllPlaces = getById('places-list__trash-image');
    deleteAllPlaces.onclick = deleteAllPlacesOnClick;

    initFilterButtons();
};


