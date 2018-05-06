'use strict';

let places = [];

htmlCreateButton.onclick = async function () {
    if (places.length === 0) {
        await placeApi.getAll();
    }
    placeApi.create(htmlCreateInput.value);
    places.push({ desc: htmlCreateInput.value, id: places.length + 1, isVisited: false });
};

htmlPlacesAll.onclick = async function () {
    const _places = await placeApi.getAll();
    places = [];
    for (let _place of _places) {
        places.push({ desc: _place.desc, id: _place.id, isVisited: _place.isVisited });
    }
    removeAllChild(htmlPlacesListItems);
    for (let place of places) {
        createPlace(place);
    }
};

htmlToVisitButton.onclick = async function () {
    const _places = await placeApi.getAll();
    places = [];
    for (let _place of _places) {
        places.push({ desc: _place.desc, id: _place.id, isVisited: _place.isVisited });
    }
    removeAllChild(htmlPlacesListItems);
    for (let place of places.filter(place => place.isVisited === false)) {
        createPlace(place);
    }
};

htmlVisitedButton.onclick = async function () {
    const _places = await placeApi.getAll();
    places = [];
    for (let _place of _places) {
        places.push({ desc: _place.desc, id: _place.id, isVisited: _place.isVisited });
    }
    removeAllChild(htmlPlacesListItems);
    for (let place of places.filter(place => place.isVisited === true)) {
        createPlace(place);
    }
};

htmlSearchButton.onclick = function () {
    removeAllChild(htmlPlacesListItems);
    for (let place of places.filter(place => place.desc === htmlSearchInput.value)) {
        createPlace(place);
    }
};

htmlPlacesClear.onclick = async function () {
    await placeApi.clear();
    removeAllChild(htmlPlacesListItems);
    places = [];
};

function removeAllChild(parent) {
    while (parent.length > 0) {
        parent[0].remove();
    }
}
