'use strict';

const apiUrl = 'https://webdev-task-2-qtummrsjii.now.sh/places/';

const createrInput = document.querySelector('.creater__input');
const searchBar = document.querySelector('.search');
const placesList = document.querySelector('.places__list');
const filterInputs = document.querySelectorAll('.places__filter input');
let places = [];

async function createPlace() {
    const description = createrInput.value;
    createrInput.value = '';
    fetch(apiUrl + 'add/', {
        body: 'description=' + description,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post'
    });
    updatePlaceList();
}

async function updatePlaceList() {
    await loadPlaces();
    filterPlaces();
}

function createButton(content, func, className = null) {
    const button = document.createElement('button');
    button.innerHTML = content;
    button.addEventListener('click', func);
    if (className) {
        button.classList.add(className);
    }

    return button;
}

function createVisitCheckbox(place) {
    const checkbox = document.createElement('input', { 'type': 'checkbox' });
    checkbox.type = 'checkbox';
    checkbox.checked = place.visit;
    checkbox.addEventListener('click', visit(place));

    return checkbox;
}

function createLabel(place) {
    const label = document.createElement('label');
    const textNode = document.createTextNode(place.description);
    const visitMark = document.createElement('i');
    visitMark.classList.add('visitmark');
    label.classList.add('place__name');
    if (place.visit) {
        visitMark.className = 'far fa-check-circle';
    } else {
        visitMark.className = 'far fa-circle';
    }
    const checkbox = createVisitCheckbox(place);
    checkbox.classList.add('hidden');
    label.appendChild(checkbox);
    label.appendChild(textNode);
    label.appendChild(visitMark);

    return label;
}

function createDivNode(place, site, minSite, maxSite) {
    const node = document.createElement('div');
    const label = createLabel(place);
    if (site !== maxSite) {
        const downButton =
        createButton('<i class="fas fa-arrow-down"></i>',
            () => rearrange(site, 1), 'down-btn');
        node.appendChild(downButton);
    }
    if (site !== minSite) {
        const upButton =
        createButton('<i class="fas fa-arrow-up"></i>',
            () => rearrange(site, -1), 'up-btn');
        node.appendChild(upButton);
    }
    const deleteButton =
    createButton('<i class="fas fa-trash-alt"></i>',
        () => deletePlace(place._id), 'delete-btn');
    const editButton =
    createButton('<i class="fas fa-pencil-alt"></i>',
        () => editPlaceMode(place), 'edit-btn');
    node.appendChild(deleteButton);
    node.appendChild(editButton);
    node.appendChild(label);
    node.className = `place${place._id} place`;

    return node;
}

async function rearrange(site, direction) {
    let secondId;
    let firstId;
    let flag = true;
    places.sort((first, second) => {
        return direction * (first.site - second.site);
    });
    places.forEach(place => {
        if (place.site === site) {
            firstId = place._id;
        } else if (((direction > 0 && place.site > site) ||
            (direction < 0 && place.site < site)) && flag) {
            secondId = place._id;
            flag = !flag;
        }
    });

    fetch(apiUrl + 'site/update?first=' + firstId + '&second=' + secondId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const temp = places.find(p => p._id === firstId).site;
    places.find(p => p._id === firstId).site = places.find(p => p._id === secondId).site;
    places.find(p => p._id === secondId).site = temp;

    places.sort((first, second) => {
        return first.site - second.site;
    });
    setPlacesList(places);
}

async function deletePlace(id) {
    fetch(apiUrl + 'delete/' + id, { method: 'DELETE' })
        .catch(() => {
            throw new Error(`fail to delete place: id=${id}`);
        });

    places = places.filter(p => p._id !== id);
    setPlacesList(places);
}

function editPlaceMode(place) {
    const node = document.querySelector(`.place${place._id}`);
    node.innerHTML = '';
    const input = document.createElement('input');
    input.value = place.description;
    var ok = createButton('<i class="fas fa-check"></i>',
        async () => editDescription(place), 'ok');
    var cancel = createButton('<i class="fas fa-times"></i>', filterPlaces, 'cancel');
    input.classList.add('edit__text');
    node.appendChild(input);
    node.appendChild(ok);
    node.appendChild(cancel);
}

async function editDescription(place) {
    const input = document.querySelector(`.place${place._id} input`);
    const description = input.value;
    if (description) {
        fetch(apiUrl + 'update/' + place._id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'description=' + description
        });
    }

    places.find(p => p._id === place._id).description = description;

    setPlacesList(places);
}

function setPlacesList(newPlaces) {
    placesList.innerHTML = '';
    let maxSite = 0;
    let minSite = 0;
    newPlaces.forEach((place) => {
        if (place.site > maxSite) {
            maxSite = place.site;
        } else if (place.site < minSite) {
            minSite = place.site;
        }
    });
    newPlaces.forEach((place) => {
        const node = createDivNode(place, place.site, minSite, maxSite);
        placesList.appendChild(node);
    });
    if (!newPlaces.length) {
        placesList.innerHTML = 'мест нет';
    }
}

function visit(place) {
    return () => setVisitValue(place._id, !place.visit);
}

async function setVisitValue(id, visited) {
    const targetPlace = places.find(p => p._id === id);
    if (targetPlace) {
        targetPlace.visit = visited;
    }

    fetch(apiUrl + 'update/' + id + `?visit=${visited}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    setPlacesList(places);
}

function filterPlaces() {
    let res = places.filter(place => place.description.includes(searchBar.value));

    res.sort((first, second) => {
        return first.site - second.site;
    });

    filterInputs.forEach(input => {
        if (input.checked) {
            if (input.value === 'visit') {
                res = res.filter(place => !place.visit);
            }
            if (input.value === 'visited') {
                res = res.filter(place => place.visit);
            }
        }
    });

    setPlacesList(res);
}

async function loadPlaces() {
    const description = searchBar.value;

    places = await fetch(`${apiUrl}description?description=${description}`)
        .then(res => res.json());
}

async function clearList() {
    places = [];
    setPlacesList(places);
    fetch(apiUrl + 'deleteall', { method: 'DELETE' });
}

window.onload = async function () {
    await updatePlaceList();

    searchBar.addEventListener('keypress', async e => {
        if (e.keyCode === 13) {
            await updatePlaceList();
        }
    });

    document.querySelector('.creater__button').addEventListener('click', createPlace);

    filterInputs.forEach(input => {
        input.addEventListener('click', updatePlaceList);
    });

    document.querySelector('.place__remover__button').addEventListener('click', clearList);
};
