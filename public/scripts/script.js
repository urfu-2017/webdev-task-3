'use strict';

const BASE_API_URL = 'https://tonyfresher-webdev-task-2.now.sh';
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
const getListItem = wrapper => {
    return {
        id: wrapper.getAttribute('id'),
        wrapper,
        getEditIcon: () => wrapper.querySelector('.list-item__edit'),
        getDeleteIcon: () => wrapper.querySelector('.list-item__delete'),
        input: wrapper.querySelector('.list-item__name'),
        getConfirmEdit: () => wrapper.querySelector('.list-item__confirm-edit'),
        getCancelEdit: () => wrapper.querySelector('.list-item__cancel-edit'),
        getArrowDownIcon: () => wrapper.querySelector('.list-item__arrow-down'),
        getArrowUpIcon: () => wrapper.querySelector('.list-item__arrow-up'),
        checkbox: wrapper.querySelector('.list-item__checkbox')
    };
};

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
        item.getEditIcon().addEventListener('click', onEditItem(item));
        item.getDeleteIcon().addEventListener('click', onDeleteItem(item));
        item.getConfirmEdit().addEventListener('click', onConfirmEdit(item));
        item.getCancelEdit().addEventListener('click', onCancelEdit(item));
        item.getArrowDownIcon().addEventListener('click', onMoveDownItem(item));
        item.getArrowUpIcon().addEventListener('click', onMoveUpItem(item));
        item.checkbox.addEventListener('change', onChangeVisited(item));
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

    const response = await requestCreate({ name });
    const place = await response.json();

    const newItem = makeListItemElement(place);
    list.wrapper.appendChild(newItem);

    bindListItemControls(newItem);

    onSearch();
}

async function onListClear() {
    list.getAllItems().forEach(item => {
        item.remove();
    });

    await requestDeleteAll();
}

function onListModeChange() {
    filterList();
    refreshArrows();
}

function onEditItem(item) {
    return () => {
        enterEditMode({ item });
    };
}

function onDeleteItem({ wrapper, id }) {
    return async () => {
        wrapper.remove();

        await requestDelete({ id });
    };
}

function onConfirmEdit(item) {
    return async () => {
        exitEditMode({ item, edited: true });
        await requestEdit({ id: item.id, name: item.input.value });
    };
}

function onCancelEdit(item) {
    return () => {
        exitEditMode({ item, edited: false });
    };
}

function onMoveUpItem({ wrapper, id }) {
    return async () => {
        const neigbour = getListItem(wrapper.previousElementSibling);
        wrapper.parentNode.insertBefore(wrapper, neigbour.wrapper);

        refreshArrows();

        await requestSwap({ id1: id, id2: neigbour.id });
    };
}

function onMoveDownItem({ wrapper, id }) {
    return async () => {
        const neigbour = getListItem(wrapper.nextElementSibling);
        wrapper.parentNode.insertBefore(neigbour.wrapper, wrapper);

        refreshArrows();

        await requestSwap({ id1: id, id2: neigbour.id });
    };
}

function onChangeVisited({ id, input, checkbox }) {
    return async () => {
        input.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
        filterList();

        await requestEdit({ id, visited: checkbox.checked });
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
        <input type="text" class="list-item__name" value="${name}"
            style="text-decoration: ${visited ? 'line-through' : 'none'}" disabled>
        <i class="fas fa-check fa-2x list-item__icon list-item__confirm-edit"></i>
        <i class="fas fa-times fa-2x list-item__icon list-item__cancel-edit"></i>
        <i class="fas fa-arrow-up fa-2x list-item__icon list-item__arrow-up"></i>
        <i class="fas fa-arrow-down fa-2x list-item__icon list-item__arrow-down"></i>
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
        listItems[i].querySelector('.fa-arrow-up').style.visibility = i === 0
            ? 'hidden'
            : 'visible';
        listItems[i].querySelector('.fa-arrow-down').style.visibility = i === listItems.length - 1
            ? 'hidden'
            : 'visible';
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

const previousValues = {};

function enterEditMode({ item }) {
    previousValues[item.id] = item.input.value;

    item.input.disabled = false;
    item.input.style.border = '1px solid #aaa';
    item.getConfirmEdit().style.display = 'block';
    item.getCancelEdit().style.display = 'block';
}

function exitEditMode({ item, edited }) {
    item.input.disabled = true;
    item.input.style.border = '1px solid #ffffff00';
    item.getConfirmEdit().style.display = 'none';
    item.getCancelEdit().style.display = 'none';

    if (!edited) {
        item.input.value = previousValues[item.id];
    }
}

// Requests

async function requestFetch() {
    return await fetch(`${BASE_API_URL}/`, {
        mode: 'cors',
        method: 'GET'
    });
}

async function requestCreate({ name }) {
    return await fetch(`${BASE_API_URL}/`, {
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
}

async function requestDelete({ id }) {
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

async function requestSwap({ id1, id2 }) {
    return await fetch(`${BASE_API_URL}/swapped?id1=${id1}&id2=${id2}`, {
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
