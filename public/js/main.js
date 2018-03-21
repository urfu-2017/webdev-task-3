const BACK_URL = 'https://webdev-task-2-mubmkeuyfk.now.sh';

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

class Place {
    constructor(place) {
        this.place = place;
    }

    createRenameImage() {
        return createElement('img', 'place__rename-image', '', { src: '/static/img/pen.png' });
    }

    createDeleteImage() {
        const deleteImage = createElement('img', 'place__delete-image', '',
            { src: '/static/img/trash.jpg' });
        deleteImage.onclick = () => {
            log('delete-id', deleteImage.parentElement.id);
            Place.remove(deleteImage.parentElement);
        };

        return deleteImage;
    }

    createPlaceName() {
        return createElement('div', 'place__name', this.place.description);
    }

    createSwapImage(src, up = true) {
        return createElement('img', `place__swap-${up ? 'up' : 'down'}`, '', { src });
    }

    createVisitedRadio() {
        return createElement('input', 'place__visited', '', { type: 'radio' });
    }

    toHtmlElement() {
        const div = createElement('div', 'place', '', { id: this.place.id });
        div.appendChild(this.createRenameImage());
        div.appendChild(this.createDeleteImage());
        div.appendChild(this.createPlaceName());
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

    static remove(placeElement) {
        log(placeElement);
        if (placeElement.id) {
            placesListNode.removeChild(placeElement);
            requests.delete(`${BACK_URL}/places/${placeElement.id}`, {});
        }
    }

    static removeAll() {
        placesListNode.innerHTML = '';
    }
}

const renderPlaces = places => {
    Place.removeAll();
    places.forEach(place => Place.add(place));
};

const searchPlaces = async (description = '') => {
    log('search places', description, `${BACK_URL}/places?description=${description}`);
    const jsonData = await requests.get(`${BACK_URL}/places?description=${description}`);
    renderPlaces(jsonData);
};

const createPlaceButtonOnClick = elem => async () => {
    const placeObj = { description: elem.value };
    const placeElement = Place.add(placeObj);
    const res = await requests.post(`${BACK_URL}/places`, placeObj);
    placeElement.id = res.id;
};

const searchPlaceInputOnInput = elem => () => searchPlaces(elem.value);

const deleteAllPlacesOnClick = () => {
    Place.removeAll();
    requests.delete(`${BACK_URL}/places`, {});
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
};


