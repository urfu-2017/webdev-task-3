'use strict';

let places = [];

createButton.onclick = async function () {
    placeApi.create(createInput.value);
    places.push(new Place({ desc: createInput.value, id: places.length + 1, isVisited: false }));
};

allPlaces.onclick = async function () {
    for (let place of places) {
        place.tag.style.display = 'list-item';
    }
};

toVisitPlaces.onclick = async function () {
    for (let place of places) {
        place.tag.style.display = 'list-item';
        if (place.isVisited === true) {
            place.tag.style.display = 'none';
        }
    }
};

visitedPlaces.onclick = async function () {
    for (let place of places) {
        place.tag.style.display = 'list-item';
        if (place.isVisited === false) {
            place.tag.style.display = 'none';
        }
    }
};

searchPlaces.onclick = function () {
    for (let place of places) {
        if (place.desc !== searchInput.value) {
            place.tag.style.display = 'none';
        }
    }
};

deleteAllPlaces.onclick = async function () {
    await placeApi.clear();
    while (placesListItems.length > 0) {
        placesListItems[0].remove();
    }
    places = [];
};
