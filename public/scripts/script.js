'use strict';

const BASE_API_URL = 'http://localhost:8000'; // 'https://tonyfresher-webdev-task-2.now.sh';
const FONT_AWESOME_TIMEOUT = 700;

// DOM
const searchBox = {
    wrapper: document.querySelector('.search-box'),
    input: document.querySelector('.search-box__input')
};
const createBox = {
    input: document.querySelector('.create-box__input'),
    button: document.querySelector('.create-box__button')
};
const list = {
    wrapper: document.querySelector('.list'),
    getClearIcon: () => document.querySelector('.list__clear'),
    tabs: document.querySelector('.list__tabs'),
    getAllItems: () => document.querySelectorAll('.list-item'),
    getVisibleItems: () => {
        return Array.from(document.querySelectorAll('.list-item'))
            .filter(element => element.style.display !== 'none');
    }
};
const getListItem = (wrapper) => {
    return {
        id: wrapper.getAttribute('id'),
        wrapper,
        getEditIcon: () => wrapper.querySelector('.list-item__edit'),
        getDeleteIcon: () => wrapper.querySelector('.list-item__delete'),
        input: wrapper.querySelector('.list-item__name')
    };
}

// Main

document.addEventListener('DOMContentLoaded', main);

function main() {
    requestFetch()
        .then(response => {
            return response.json();
        })
        .then(places => {
            fillList(places);
            bindListControls();
        });

    searchBox.input.addEventListener('input', onSearch);
    createBox.button.addEventListener('click', onCreateElement);
}

// Binding

function bindListControls() {
    setTimeout(
        () => list.getClearIcon().addEventListener('click', onListClear),
        FONT_AWESOME_TIMEOUT
    );
    list.tabs.addEventListener('change', onListModeChange);

    list.getAllItems().forEach(bindListItemControls);

    refreshArrows();
}

function bindListItemControls(wrapper) {
    const item = getListItem(wrapper);
    setTimeout(() => {
        // item.getEditIcon().addEventListener('click', onEditItem(item));
        item.getDeleteIcon().addEventListener('click', onDeleteItem(item));
    }, FONT_AWESOME_TIMEOUT);
}

// Event Listeners

function onSearch() {
    filterList(searchBox.input.value);

    refreshArrows();
}

async function onCreateElement() {
    const name = createBox.input.value;
    if (name === '') {
        return;
    }

    createBox.input.value = '';

    const response = await requestCreate(name);
    const place = await response.json();

    const newItem = makeListItemElement(place);
    list.wrapper.appendChild(newItem);

    bindListItemControls(newItem);

    onSearch();
}

async function onListClear() {
    await requestDeleteAll();

    list.getAllItems().forEach(item => {
        item.remove();
    });
}

function onListModeChange() {
    filterList();
    refreshArrows();
}

function onDeleteItem(item) {
    return async () => {
        await requestDelete(item.id);

        item.wrapper.remove();
    };
}

// Elements

function makeListItemElement({ id, name, visited }) {
    const element = document.createElement('div');
    element.className = 'list-item';
    element.setAttribute('id', id);
    element.innerHTML = `
        <i class="fas fa-edit fa-2x list-item__icon list-item__edit"></i>
        <i class="fas fa-trash-alt fa-2x list-item__icon list-item__delete"></i>
        <input type="text" class="list-item__name" value="${name}" disabled>
        <i class="fas fa-check fa-2x list-item__icon list-item__confirm-edit"></i>
        <i class="fas fa-times fa-2x list-item__icon list-item__cancel-edit"></i>
        <i class="fas fa-arrow-down fa-2x list-item__icon list-item__arrow-down"></i>
        <i class="fas fa-arrow-up fa-2x list-item__icon list-item__arrow-up"></i>
        <input type="checkbox" class="list-item__checkbox" ${visited ? 'checked' : ''}>
    `;

    return element;
}

// Scripts

function fillList(places) {
    places.forEach(place => {
        list.wrapper.appendChild(makeListItemElement(place));
    });
}

function refreshArrows() {
    const listItems = list.getVisibleItems();

    for (let i = 0; i < listItems.length; i++) {
        listItems[i].querySelector('.fa-arrow-up').style.display = i === 0
            ? 'none'
            : 'block';
        listItems[i].querySelector('.fa-arrow-down').style.display = i === listItems.length - 1
            ? 'none'
            : 'block';
    }
}

function filterList(query = '') {
    const lowerQuery = query.toLowerCase();

    const mode = document.querySelector('.list__radio[name="list-mode"]:checked').value;

    list.getAllItems().forEach(item => {
        const name = item.querySelector('.list-item__name');
        const visited = item.querySelector('.list-item__checkbox');

        item.style.display =
            name.value.toLowerCase().includes(lowerQuery) &&
            (mode === 'all' ||
            (mode === 'visited' && visited.checked) ||
            (mode === 'unvisited' && !visited.checked))
                ? 'flex'
                : 'none';
    });
}

// Requests

async function requestFetch() {
    return await fetch(`${BASE_API_URL}/`, {
        mode: 'cors',
        method: 'GET'
    });
}

async function requestCreate(name) {
    return await fetch(`${BASE_API_URL}/`, {
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
}

async function requestDelete(id) {
    return await fetch(`${BASE_API_URL}/?id=${id}`, {
        mode: 'cors',
        method: 'DELETE'
    });
}

async function requestDeleteAll() {
    return await fetch(`${BASE_API_URL}/`, {
        mode: 'cors',
        method: 'DELETE'
    });
}

async function requestSwap(id1, id2) {
    return await fetch(`${BASE_API_URL}/?id1=${id1}&id2=${id2}`, {
        mode: 'cors',
        method: 'PATCH'
    });
}

async function requestEdit({ id, name, description, visited }) {
    return await fetch(`${BASE_API_URL}/id=${id}`, {
        mode: 'cors',
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, visited })
    });
}
