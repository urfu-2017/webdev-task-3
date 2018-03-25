'use strict';

const apiUrl = 'https://webdev-task-2-hgobxmdvbg.now.sh/places/';

let places = [];

async function createPlace() {
    const input = document.querySelector('.builder__input');
    const description = input.value;
    input.value = '';
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
    });

    await updatePlaceList();
}

async function updatePlaceList() {
    await loadPlaces();
    search();
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
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = place.visited;
    checkbox.onclick = visit(place);

    return checkbox;
}

function createLabel(place) {
    const label = document.createElement('label');
    const textNode = document.createTextNode(place.description);
    const visitMark = document.createElement('i');
    visitMark.className = 'visit-mark ';
    if (place.visited) {
        visitMark.className += 'fas fa-lemon';
        label.className += 'strikeout';
    } else {
        visitMark.className += 'far fa-lemon';
    }
    const checkbox = createVisitCheckbox(place);
    checkbox.className += 'hidden';
    label.appendChild(checkbox);
    label.appendChild(textNode);
    label.appendChild(visitMark);

    return label;
}

function createLINode(place, index, colSize) {
    const node = document.createElement('div');
    const label = createLabel(place);
    const downButton =
        createButton('<i class="fas fa-arrow-down"></i>',
            () => rearrange(index, index + 1), 'down-btn');
    const upButton =
        createButton('<i class="fas fa-arrow-up"></i>',
            () => rearrange(index, index - 1), 'up-btn');
    const deleteButton =
        createButton('<i class="fas fa-trash-alt"></i>',
            () => deletePlace(place.id), 'delete-btn');
    const editButton =
        createButton('<i class="fas fa-pencil-alt"></i>',
            () => editPlaceMode(place), 'edit-btn');
    if (index !== colSize - 1) {
        node.appendChild(downButton);
    }
    if (index !== 0) {
        node.appendChild(upButton);
    }
    node.appendChild(deleteButton);
    node.appendChild(editButton);
    node.appendChild(label);
    node.className = `place${place.id} place`;

    return node;
}

async function rearrange(oldIndex, newIndex) {
    const temp = places[oldIndex];
    places[oldIndex] = places[newIndex];
    places[newIndex] = temp;
    search();
    await fetch(apiUrl + places[newIndex].id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index: newIndex })
    });
}

async function deletePlace(id) {
    places = places.filter(p => p.id !== id);
    setPlacesList(places);
    await fetch(apiUrl + id, { method: 'DELETE' });
}

function editPlaceMode(place) {
    const node = document.querySelector(`.place${place.id}`);
    node.innerHTML = '';
    const input = document.createElement('input');
    input.addEventListener('keydown', async e => {
        if (e.keyCode === 13) {
            await editDescription(place);
        }
    });
    input.value = place.description;
    var ok = createButton('<i class="fas fa-check"></i>', async () => await editDescription(place));
    var cancel = createButton('<i class="fas fa-times"></i>', search);
    node.appendChild(input);
    node.appendChild(ok);
    node.appendChild(cancel);
}

async function editDescription(place) {
    const input = document.querySelector(`.place${place.id} input`);
    const description = input.value;
    if (description) {
        await fetch(apiUrl + place.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description })
        });
    }

    await updatePlaceList();
}

function setPlacesList(newPlaces) {
    const placesList = document.querySelector('.places__list');
    placesList.innerHTML = '';
    newPlaces.forEach((place, index) => {
        const node = createLINode(place, index, newPlaces.length);
        placesList.appendChild(node);
    });
    if (placesList.innerHTML === '') {
        placesList.innerHTML = 'мест нет';
    }
}

function visit(place) {
    return () => setVisitValue(place.id, !place.visited);
}

async function setVisitValue(id, visited) {
    const targetPlace = places.find(p => p.id === id);
    if (targetPlace) {
        targetPlace.visited = visited;
    }
    search();

    await fetch(apiUrl + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ visited })
    });

    await updatePlaceList();
}

function search() {
    const description = document.querySelector('.search__input').value;

    let res = places.filter(place => place.description.includes(description));

    document.querySelectorAll('.places__filter input').forEach(input => {
        if (input.checked) {
            if (input.value === 'visit') {
                res = res.filter(place => !place.visited);
            }
            if (input.value === 'visited') {
                res = res.filter(place => place.visited);
            }
        }
    });

    setPlacesList(res);
}

async function loadPlaces() {
    const description = document.querySelector('.search__input').value;

    places = await fetch(`${apiUrl}?description=${description}`)
        .then(res => res.json());
}

async function clearList() {
    places = [];
    setPlacesList(places);
    await fetch(apiUrl, { method: 'DELETE' });
}

window.onload = async function () {
    await updatePlaceList();

    document.querySelector('.search__input')
        .addEventListener('keypress', async e => {
            if (e.keyCode === 13) {
                await search();
            }
        });

    document.querySelector('.builder__submit').onclick = createPlace;

    document.querySelector('.builder__input')
        .addEventListener('keydown', async e => {
            if (e.keyCode === 13) {
                await createPlace();
            }
        });

    document.querySelectorAll('.places__filter input').forEach(input => {
        input.onclick = search;
    });

    document.querySelector('.place__remover-submit').onclick = clearList;
};

