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

const waitUntilElementHasId = (element, func) => {
    if (element.id) {
        func();
    } else {
        log('wait');
        setTimeout(() => waitUntilElementHasId(element, func), 250);
    }
};

let placesListNode;

let places = [];

const FILTERS = {
    ALL: () => true,
    VISITED: i => i.visited,
    NOT_VISITED: i => !i.visited
};

let placesFilter = FILTERS.ALL;

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

    static add(place) {
        const child = new Place(place).toHtmlElement();
        placesListNode.appendChild(child);

        return child;
    }

    static clearAll() {
        placesListNode.innerHTML = '';
    }

    static remove(placeElement) {
        log('removing', placeElement);
        placesListNode.removeChild(placeElement);
        waitUntilElementHasId(placeElement, () => {
            requests.delete(`${BACK_URL}/places/${placeElement.id}`, {});
        });
    }

    static visit(placeElement) {
        log('visiting', placeElement);
        if (placesFilter === FILTERS.NOT_VISITED) {
            placesListNode.removeChild(placeElement);
        }
        waitUntilElementHasId(placeElement, () => {
            places.find(i => i.id === Number(placeElement.id)).visited = true;
            requests.post(`${BACK_URL}/places/visited`, { id: Number(placeElement.id) });
        });
    }

    static rename(placeElement, description) {
        log('renaming', placeElement);
        waitUntilElementHasId(placeElement, () => {
            places.find(i => i.id === Number(placeElement.id)).description = description;
            const body = { description, id: Number(placeElement.id) };
            requests.put(`${BACK_URL}/places`, body);
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
        waitUntilElementHasId(neighbor, () => {
            waitUntilElementHasId(element, () => {
                const id1 = Number(element.id);
                const id2 = Number(neighbor.id);
                const place1 = places.find(i => i.id === id1);
                const place2 = places.find(i => i.id === id2);
                place1.id = id2;
                place2.id = id1;
                element.id = id2;
                neighbor.id = id1;
                requests.put(`${BACK_URL}/places/${id1}`, { id: id2 });
            });
        });
    }
}

const renderPlaces = () => {
    Place.clearAll();
    places.filter(placesFilter).sort((i, j) => Number(i.id) - Number(j.id))
        .forEach(place => Place.add(place));
};

const setFilter = (filter, button, buttons) => () => {
    log('change filter', button);
    buttons.forEach(i => {
        i.className = 'places-list__filter';
    });
    button.className += ' places-list__filter__checked';
    placesFilter = filter;
    renderPlaces();
};

const searchPlaces = async (description = '') => {
    places = await requests.get(`${BACK_URL}/places?description=${description}&sort=id`);
    renderPlaces();
};

const createPlaceButtonOnClick = elem => async () => {
    if (elem.value) {
        const placeObj = { description: elem.value, visited: false };
        places.push(placeObj);
        const placeElement = Place.add(placeObj);
        const { id } = await requests.post(`${BACK_URL}/places`, placeObj);
        placeElement.id = id;
        placeObj.id = id;
    }
};

const searchPlaceInputOnInput = elem => () => searchPlaces(elem.value);

const deleteAllPlacesOnClick = () => {
    Place.clearAll();
    requests.delete(`${BACK_URL}/places`, {});
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
    await searchPlaces();

    const placeButton = getById('create-place__button');
    const createPlaceInput = getById('create-place__input');
    placeButton.onclick = createPlaceButtonOnClick(createPlaceInput);

    const searchInput = getById('search-place__input');
    searchInput.oninput = searchPlaceInputOnInput(searchInput); // сюда debounce нужен

    const deleteAllPlaces = getById('places-list__trash-image');
    deleteAllPlaces.onclick = deleteAllPlacesOnClick;

    initFilterButtons();
};


