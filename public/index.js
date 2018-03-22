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

function createButton(title, func) {
    const button = document.createElement('button');
    button.innerHTML = title;
    button.onclick = func;

    return button;
}

function createVisitCheckbox(place) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = place.visited;
    checkbox.onclick = visit(place);

    return checkbox;
}

function createLINode(place) {
    const node = document.createElement('div');
    const label = document.createElement('label');
    const textNode = document.createTextNode(place.description);
    const checkbox = createVisitCheckbox(place);
    label.appendChild(checkbox);
    label.appendChild(textNode);
    const deleteButton = createButton('удалить', () => deletePlace(place.id));
    const editButton = createButton('редактировать', () => editPlaceMode(place));
    node.appendChild(deleteButton);
    node.appendChild(editButton);
    node.appendChild(label);
    node.className = `place${place.id}`;

    return node;
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
    var ok = createButton('ок', async () => await editDescription(place));
    var cancel = createButton('отмена', search);
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
    const placesList = document.querySelector('.places_list');
    placesList.innerHTML = '';

    for (var place of newPlaces) {
        const node = createLINode(place);
        placesList.appendChild(node);
    }
}

function visit(place) {
    return () => setVisitValue(place.id, !place.visited);
}

async function setVisitValue(id, visited) {
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

