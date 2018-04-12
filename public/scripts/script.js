'use strict';

const NOW_SCRIPT_ADDRESS = 'https://webdev21-vagkxpyjgp.now.sh';

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
        name: wrapper.getAttribute('id'),
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

    document.querySelector('.search-box__input').addEventListener('input', onSearch);
    document.querySelector('.create-box__button').addEventListener('click', onCreateElement);
}

function bindListControls() {

    list.getClearIcon().addEventListener('click', onListClear);

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
    }, 800);
}


function onSearch() {
    filterList(document.querySelector('.search-box__input').value);

    refreshArrows();
}

async function onCreateElement() {
    const name = document.querySelector('.create-box__input').value;
    if (name === '') {
        return;
    }

    document.querySelector('.create-box__input').value = '';
    const newItem = makeListItemElement({ name: name, visited: false });
    list.wrapper.appendChild(newItem);

    const response = await requestCreate({ name });
    const place = await response.json();
    if (!place) {
        return;
    }

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

function onDeleteItem({ wrapper, name }) {
    return async () => {
        wrapper.remove();

        await requestDelete({ name });
    };
}

function onConfirmEdit(item) {
    let visit = document.querySelector('.list-item__checkbox');

    return async () => {
        exitEditMode({ item, edited: true });
        await requestEditName({ nameStart: item.name, name: item.input.value, visited: visit });
    };
}

function onCancelEdit(item) {
    return () => {
        exitEditMode({ item, edited: false });
    };
}

function onMoveUpItem({ wrapper, name }) {
    return async () => {
        const neigbour = getListItem(wrapper.previousElementSibling);
        wrapper.parentNode.insertBefore(wrapper, neigbour.wrapper);

        refreshArrows();

        await requestSwap({ name1: name, name2: neigbour.name });
    };
}

function onMoveDownItem({ wrapper, name }) {
    return async () => {
        const neigbour = getListItem(wrapper.nextElementSibling);
        wrapper.parentNode.insertBefore(neigbour.wrapper, wrapper);

        refreshArrows();

        await requestSwap({ name1: name, name2: neigbour.name });
    };
}

function onChangeVisited({ name, input, checkbox }) {
    return async () => {
        input.style.textDecoration = checkbox.checked ? 'underline' : 'none';
        filterList();
        await requestEdit({ name, visited: checkbox.checked });
    };
}

function makeListItemElement({ name, visited }) {
    const element = document.createElement('div');
    element.className = 'list-item';
    element.setAttribute('id', name);
    element.innerHTML = `
        <i class="fas fa-edit fa-2x list-item__icon list-item__edit"></i>
        <i class="fas fa-trash fa-2x list-item__icon list-item__delete"></i>
        <input type="text" class="list-item__name" value="${name}"
            style="text-decoration: ${visited ? 'underline' : 'none'}" disabled>
        <i class="fas fa-check fa-2x list-item__icon list-item__confirm-edit"></i>
        <i class="fas fa-times fa-2x list-item__icon list-item__cancel-edit"></i>
        <i class="fas fa-arrow-up fa-2x list-item__icon list-item__arrow-up"></i>
        <i class="fas fa-arrow-down fa-2x list-item__icon list-item__arrow-down"></i>
        <input type="checkbox" class="list-item__checkbox" ${visited ? 'checked' : ''}>
    `;

    return element;
}


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
    previousValues[item.name] = item.input.value;
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
        item.input.value = previousValues[item.name];
    }
}

// Requests

async function requestFetch() {
    return await fetch(`${NOW_SCRIPT_ADDRESS}/places`, {
        mode: 'cors',
        method: 'GET'
    });
}

async function requestCreate({ name }) {
    return await fetch(`${NOW_SCRIPT_ADDRESS}/places`, {
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
}

async function requestDelete({ name }) {
    return await fetch(`${NOW_SCRIPT_ADDRESS}/places/?name=${name}`, {
        mode: 'cors',
        method: 'DELETE'
    });
}

async function requestDeleteAll() {
    return await fetch(`${NOW_SCRIPT_ADDRESS}/places/`, {
        mode: 'cors',
        method: 'DELETE'
    });
}

async function requestSwap({ name1, name2 }) {
    return await fetch(`${NOW_SCRIPT_ADDRESS}/places/swap/?name1=${name1}&name2=${name2}`, {
        mode: 'cors',
        method: 'PATCH'
    });
}

async function requestEdit({ name, visited }) {
    return await fetch(`${NOW_SCRIPT_ADDRESS}/places/?name=${name}`, {
        mode: 'cors',
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, visited })
    });
}

async function requestEditName({ nameStart, name, visited }) {
    return await fetch(`${NOW_SCRIPT_ADDRESS}/places/?name=${nameStart}`, {
        mode: 'cors',
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, visited: visited.checked })
    });
}
