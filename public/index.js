const URL = 'https://webdev-task-2-rmcovhtbdk.now.sh/places';

let allPlaces = true;
let onlyVisited = true;
let textForFilter = '';
let placesList;

class PlaceWrapper {
    constructor(place, index) {
        this.place = place;
        this.index = index;
    }

    setOnclick() {
        let name = document.querySelector(`.places_place-name-${this.place.id}`);
        let elementCheck = document.querySelector(`.places_placeId-${this.place.id}`);

        elementCheck.onclick = () => {
            if (elementCheck.checked) {
                if (!this.place.isVisited) {
                    this.updateOnServer({ isVisited: true });
                }
                name.style.textDecoration = 'line-through';
            } else {
                if (this.place.isVisited) {
                    this.updateOnServer({ isVisited: false });
                }
                name.style.textDecoration = 'none';
            }
        };

        let elementDelete = document.querySelector(`.places__delete-one-${this.place.id}`);
        elementDelete.onclick = () => this.deletePlaceOnServer();

        let elementPlaceName = document.querySelector(`.places_place-name-${this.place.id}`);
        let elementEditFileds = document.querySelector(`.places__edit-${this.place.id}`);
        let elementEdit = document.querySelector(`.places__edit-one-${this.place.id}`);
        elementEdit.onclick = () => {
            document.querySelector(`.places__new-name-${this.place.id}`).value = this.place.name;
            elementPlaceName.style.display = 'none';
            elementEditFileds.style.display = 'block';
        };

        let btnClose = document.querySelector(`.places__close-${this.place.id}`);
        btnClose.onclick = () => {
            elementPlaceName.style.display = 'block';
            elementEditFileds.style.display = 'none';
        };

        let btnSave = document.querySelector(`.places__save-${this.place.id}`);
        btnSave.onclick = () => {
            let newName = document.querySelector(`.places__new-name-${this.place.id}`).value;
            this.updateOnServer({ name: newName });
        };

        document.querySelector(`.places__button-down-${this.place.id}`).onclick = () => {
            let secondId = this.getOtherId(1);
            this.shuffleOnServer(this.place.id, secondId);
        };

        document.querySelector(`.places__button-up-${this.place.id}`).onclick = () => {
            let secondId = this.getOtherId(-1);
            this.shuffleOnServer(this.place.id, secondId);
        };
    }

    updateOnServer(body) {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(body)
        };

        fetch(`${URL}/place/${this.place.id}`, options)
            .then(() => fetch(URL))
            .then(data => data.json())
            .then(json => {
                placesList.updatePlacesList(json);
            });
    }

    deletePlaceOnServer() {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        };

        fetch(`${URL}/?id=${this.place.id}`, options)
            .then(() => fetch(URL))
            .then(data => data.json())
            .then(json => {
                placesList.updatePlacesList(json);
            });
    }

    getOtherId(offset) {
        let otherIndex = this.index + offset;
        if (otherIndex >= placesList.places.length) {
            otherIndex = 0;
        }
        if (otherIndex < 0) {
            otherIndex = placesList.places.length - 1;
        }

        return placesList.places[otherIndex].place.id;
    }

    shuffleOnServer(firstId, secondId) {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PATCH'
        };

        fetch(`${URL}/shuffle/?firstId=${firstId}&secondId=${secondId}`, options)
            .then(() => fetch(URL))
            .then(data => data.json())
            .then(json => {
                placesList.updatePlacesList(json);
            });
    }
}

class PlacesList {
    constructor() {
        this.places = [];
    }

    createPlace() {
        const name = document.querySelector('.create-place__name').value;
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ name })
        };
        let _this = this;

        return fetch(URL, options)
            .then(() => fetch(URL))
            .then(data => data.json())
            .then(json => {
                let items = json;
                _this.updatePlacesList(items);
            });
    }

    getPlacesFromServer() {
        return fetch(URL)
            .then(response => response.json())
            .then(json => this.updatePlacesList(json));
    }

    updatePlacesList(newPlaces) {
        this.places = newPlaces
            .filter(place => place !== null)
            .map((place, currentIndex) => new PlaceWrapper(place, currentIndex));
        let list = this.getListHtmlElement();
        list.innerHTML = '';
        this.places
            .filter(this.placeFilter)
            .filter(this.textFilter)
            .forEach(placeWrapper => {
                list.innerHTML += this.getPlaceInHtml(placeWrapper.place);
            });

        this.places.forEach(wrapper => {
            wrapper.setOnclick();
        });
    }

    deleteAll() {
        this.places = [];
        document.querySelector('.places__list').innerHTML = '';
    }

    getListHtmlElement() {
        return document.querySelector('.places__list');
    }

    getPlaceInHtml(place) {
        return `<div class="places__list-one-place">
            <button class="places__delete-one-${place.id}">
            <img class="places__delete-one-img" src="images/deleteAll.png" alt="корзина">
            </button>
            <button class="places__edit-one-${place.id}">
            <img class="places__edit-one-img" src="images/pencil.png" alt="карандаш ">
            </button>

                <div class="places_place-name-${place.id}" 
                style=text-decoration:${place.isVisited ? 'line-through' : 'none'}>
                ${place.name} ${place.id} ${place.isVisited}</div>

            <div class="places__edit-${place.id}" style=display:none>
                <input class="places__new-name-${place.id}">
                <button class="places__save-${place.id}">
                <img class="places__save-img" src="images/green_galka.png" alt="галка">
                </button>
                <button class="places__close-${place.id}">
                <img class="places__close-img" src="images/red_krest.png" alt="крест">
                </button>
            </div>

            <button class="places__button-up-${place.id}" data-filter-state="all">вверх
            </button>
            <button class="places__button-down-${place.id}" data-filter-state="all">вниз
            </button>
            <input class="places_placeId-${place.id}" ${place.isVisited ? 'checked' : ''} 
            id="checkBox" type="checkbox">
        </div>`;
    }

    placeFilter(placeWrapper) {
        if (allPlaces) {
            return true;
        }
        if (onlyVisited) {
            return placeWrapper.place.isVisited;
        }

        return !placeWrapper.place.isVisited;
    }

    textFilter(placeWrapper) {
        return placeWrapper.place.name.includes(textForFilter);
    }
}

window.onload = async function () {
    placesList = new PlacesList();

    await placesList.getPlacesFromServer();

    let createPlaceBtn = document.querySelector('.create-place__button');
    createPlaceBtn.onclick = create;

    let clearBtn = document.querySelector('.places__delete-all');
    clearBtn.onclick = deleteAll;

    let allBtn = this.document.querySelector('.places__button-all');
    allBtn.onclick = showAll;

    let visitedBtn = this.document.querySelector('.places__button-visited');
    visitedBtn.onclick = showVisited;

    let notVisitedBtn = this.document.querySelector('.places__button-not-visited');
    notVisitedBtn.onclick = showNotVisited;

    let searchInput = this.document.querySelector('.search__input');
    searchInput.onkeydown = (e) => filterByText(e);
};

function create() {
    placesList.createPlace();
}

function deleteAll() {
    placesList.deleteAll();
}

function showAll() {
    allPlaces = true;
    updatePlaces();
}

function showVisited() {
    allPlaces = false;
    onlyVisited = true;
    updatePlaces();
}

function showNotVisited() {
    allPlaces = false;
    onlyVisited = false;
    updatePlaces();
}

function filterByText(e) {
    textForFilter = e.target.value;
    updatePlaces();
}

function updatePlaces() {
    placesList.updatePlacesList(placesList.places.map(x => x.place));
}
