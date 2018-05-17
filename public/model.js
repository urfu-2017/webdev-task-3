'use strict';

const apiUrl = 'https://webdev-task-2-qtummrsjii.now.sh/places/';

let places = [];

async function createPlace() {
    const input = document.querySelector('.creater__input');
    const description = input.value;
    input.value = '';
    await fetch(apiUrl + 'add/', {
        body: 'description=' + description,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post'
    });
    await updatePlaceList();
}

async function updatePlaceList() {
    await loadPlaces();
    filterPlaces();
}

function createButton(content, func, className = null) {
    const button = document.createElement('button');
    button.innerHTML = content;
    button.onclick = func;
    if (className) {
        button.className = className;
    }

    return button;
}

function createVisitCheckbox(place) {
    const checkbox = document.createElement('input', { 'type': 'checkbox' });
    checkbox.type = 'checkbox';
    checkbox.checked = place.visit;
    checkbox.onclick = visit(place);

    return checkbox;
}

function createLabel(place) {
    const label = document.createElement('label');
    const textNode = document.createTextNode(place.description);
    const visitMark = document.createElement('i');
    visitMark.className = 'visitmark ';
    label.className += 'place__name';
    if (place.visit) {
        visitMark.className += 'far fa-check-circle';
    } else {
        visitMark.className += 'far fa-circle';
    }
    const checkbox = createVisitCheckbox(place);
    checkbox.className += 'hidden';
    label.appendChild(checkbox);
    label.appendChild(textNode);
    label.appendChild(visitMark);

    return label;
}

function createLINode(place, site, minSite, maxSite) {
    const node = document.createElement('div');
    const label = createLabel(place);
    if (site !== maxSite) {
        const downButton =
        createButton('<i class="fas fa-arrow-down"></i>',
            () => rearrange(site, true), 'down-btn');
        node.appendChild(downButton);
    }
    if (site !== minSite) {
        const upButton =
        createButton('<i class="fas fa-arrow-up"></i>',
            () => rearrange(site, false), 'up-btn');
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
    if (direction) {
        places.sort((first, second) => {
            return first.site - second.site;
        });
        places.forEach(place => {
            if (place.site === site) {
                firstId = place._id;
            } else if (place.site > site && flag) {
                secondId = place._id;
                flag = !flag;
            }
        });
    } else {
        places.sort((first, second) => {
            return first.site - second.site;
        });
        places.reverse();
        places.forEach(place => {
            if (place.site === site) {
                firstId = place._id;
            } else if (place.site < site && flag) {
                secondId = place._id;
                flag = !flag;
            }
        });
        places.reverse();
    }

    await fetch(apiUrl + 'site/update?first=' + firstId + '&second=' + secondId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    updatePlaceList();
}

async function deletePlace(id) {
    await fetch(apiUrl + 'delete/' + id, { method: 'DELETE' }).then(() => {
        places = places.filter(p => p._id !== id);
        setPlacesList(places);
    })
        .catch(() => {
            throw new Error(`fail to delete place: id=${id}`);
        });
}

function editPlaceMode(place) {
    const node = document.querySelector(`.place${place._id}`);
    node.innerHTML = '';
    const input = document.createElement('input');
    input.value = place.description;
    var ok = createButton('<i class="fas fa-check"></i>',
        async () => await editDescription(place), 'ok');
    var cancel = createButton('<i class="fas fa-times"></i>', filterPlaces, 'cancel');
    input.className = 'edit__text';
    node.appendChild(input);
    node.appendChild(ok);
    node.appendChild(cancel);
}

async function editDescription(place) {
    const input = document.querySelector(`.place${place._id} input`);
    const description = input.value;
    if (description) {
        await fetch(apiUrl + 'update/' + place._id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'description=' + description
        });
    }

    await updatePlaceList();
}

function setPlacesList(newPlaces) {
    const placesList = document.querySelector('.places__list');
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
        const node = createLINode(place, place.site, minSite, maxSite);
        placesList.appendChild(node);
    });
    if (placesList.innerHTML === '') {
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

    await fetch(apiUrl + 'update/' + id + `?visit=${visited}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    await updatePlaceList();
}

function filterPlaces() {
    const description = document.querySelector('.search').value;

    let res = places.filter(place => place.description.includes(description));

    res.sort((first, second) => {
        return first.site - second.site;
    });

    document.querySelectorAll('.places__filter input').forEach(input => {
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
    const description = document.querySelector('.search').value;

    places = await fetch(`${apiUrl}description?description=${description}`)
        .then(res => res.json());
}

async function clearList() {
    places = [];
    setPlacesList(places);
    await fetch(apiUrl + 'deleteall', { method: 'DELETE' });
}

window.onload = async function () {
    await updatePlaceList();

    document.querySelector('.search')
        .addEventListener('keypress', async e => {
            if (e.keyCode === 13) {
                await updatePlaceList();
            }
        });

    document.querySelector('.creater__button').onclick = createPlace;

    document.querySelectorAll('.places__filter input').forEach(input => {
        input.onclick = updatePlaceList;
    });

    document.querySelector('.place__remover__button').onclick = clearList;
};
