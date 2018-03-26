'use strict';

const placesAll = document.getElementsByClassName('places_all')[0];

placesAll.onclick = async function () {
    const options = {
        method: 'GET'
    };
    fetch('http://localhost:8080/', options)
        .then(req => req.json())
        .then(req => console.info(req));
};

const placesClear = document.getElementsByClassName('places_clear')[0];

function removeAllChild(parent) {
    while (parent.length > 0) {
        parent[0].remove();
    }
}

placesClear.onclick = async function () {
    const placesListItems = document.getElementsByClassName('places_list_item');
    const options = {
        method: 'DELETE'
    };
    fetch('http://localhost:8080/', options)
        .then(req => req);
    removeAllChild(placesListItems);
};

const visitButtons = document.getElementsByClassName('places_list_item_visit');

visitButtons.onclick = async function () {
    const data = 'isVisited=' + true;
    const options = {
        method: 'put',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        mode: 'no-cors',
        body: data
    };
    fetch('http://localhost:8080/places', options)
        .then(req => req);
};

