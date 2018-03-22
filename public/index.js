const URL = 'https://webdev-task-2-cnpxjyulfz.now.sh/places';

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
                var items = json;
                _this.updatePlacesList(items);
            });
    }

    getPlacesFromServer() {
        return fetch(URL)
            .then(response => response.json())
            .then(json => this.updatePlacesList(json));
    }

    updatePlacesList(newPlaces) {
        this.places = newPlaces;
        var list = this.getListHtmlElement();
        list.innerHTML = '';
        this.places.forEach(place => {
            list.innerHTML += this.getPlaceInHtml(place);
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
            <div>${place.name} ${place.id}</div>
            <input id="checkBox" type="checkbox">
        </div>`;
    }
}

var placesList;

window.onload = async function () {
    placesList = new PlacesList();

    await placesList.getPlacesFromServer();

    var createPlaceBtn = document.querySelector('.create-place__button');
    createPlaceBtn.onclick = create;

    var clearBtn = document.querySelector('.places__delete-all');
    clearBtn.onclick = deleteAll;
};

function create() {
    placesList.createPlace();
}

function deleteAll() {
    placesList.deleteAll();
}
