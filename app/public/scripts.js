// Глобальные переменные
const baseUrl = 'https://webdev-task-2-dowwqxitcb.now.sh/api/';

const state = {
    recordsToDisplay: [],
    records: [],
    filter: 'all',
    input: ''
};

const api = {
    getRecords: () => {
        return fetch(`${baseUrl}record`)
            .then(res => res.json());
    },
    deleteAllRecords: () => fetch(`${baseUrl}record/?all=1`, {
        method: 'DELETE'
    }),
    deleteRecords: (ids) => fetch(`${baseUrl}record`, {
        method: 'DELETE',
        body: JSON.stringify({
            ids: ids
        }),
        headers: {
            'content-type': 'application/json'
        }
    }),
    moveRecord: (id, direction) => fetch(`${baseUrl}record/move/?id=${id}&direction=${direction}`, {
        method: 'PUT'
    }),
    updateRecord: (id, props) => fetch(`${baseUrl}record?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(props),
        headers: {
            'content-type': 'application/json'
        }
    }),
    createRecord: (value) => fetch(`${baseUrl}record`, {
        body: JSON.stringify({
            place: value,
            isVisited: state.filter === 'visited' ? 'true' : 'false'
        }),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    }).then(res => res.json())
};

const filters = {
    all: () => true,
    visited: (a) => a.isVisited === true,
    notVisited: (a) => a.isVisited === false
};


// Шаблоны для отрисовки динамичных частей страницы
const recordTemplate = `<div class="record">
<form class="record__controllers record__element">
<span class="record__arrow record__up-arrow record__element">&uarr;</span>
<span class="record__element record__arrow record__down-arrow">&darr;</span>
<input class="record__visited record__element" type="checkbox" name="visited">
</form>
</div>`;

const titleWrapperTemplate = `<div class="record__element record__title-wrapper">
<span class="record__title record__element"></span>
<span class="record__edit record__editor hidden"></span>
<span class="record__delete record__editor hidden"></span>
</div>`;

const editInputBlockTemplate = `<div class="record__edit-wrapper">
<input type="text" autofocus class="record__edit-input">
<span class="record__cancel-edit"></span>
<span class="record__accept-edit"></span>
</div>`;


// Инфраструктурные методы
function htmlToElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.replace(/(\r\n|\n|\r)/gm, '');

    return template.content.firstChild;
}

function updateState(updatedProps) {
    if (updatedProps) {
        Object.keys(updatedProps).forEach(prop => {
            state[prop] = updatedProps[prop];
        });
    }
    state.recordsToDisplay = state.records.filter(filters[state.filter]);
    if (state.input) {
        state.recordsToDisplay = state.recordsToDisplay.filter(
            record => record.place.indexOf(state.input) !== -1
        );
    }

    repaintRecords();
}

function repaintRecords() {
    const recordList = document.querySelector('.records-list');
    recordList.innerHTML = '';

    for (let i = 0; i < state.recordsToDisplay.length; i++) {
        recordList.appendChild(buildRecord(i));
    }
}

function loadRecords() {
    return api.getRecords()
        .then((value) => {
            state.records = value;
        });
}


// Методы-сборщики, методы-инициализаторы,
function buildRecord(i) {
    const record = htmlToElement(recordTemplate);
    record.classList.add(`record-number-${i}`);

    initArrowControllers(record, i);
    initVisited(record, i);
    record.insertBefore(createTitleWrapper(i), record.firstChild);
    record.insertBefore(createEditInputBlock(i), record.firstChild);

    return record;
}

function createTitleWrapper(i) {
    const titleWrapper = htmlToElement(titleWrapperTemplate);
    titleWrapper.addEventListener('mouseover', displayControllers);
    titleWrapper.addEventListener('mouseleave', hideControllers);
    titleWrapper.setAttribute('number', i);

    const title = titleWrapper.querySelector('.record__title');
    title.textContent = state.recordsToDisplay[i].place;
    title.setAttribute('number', i);

    const edit = titleWrapper.querySelector('.record__edit');
    edit.addEventListener('click', editTitle);

    const remove = titleWrapper.querySelector('.record__delete');
    remove.addEventListener('click', deleteRecord);

    if (state.recordsToDisplay[i].isVisited) {
        title.classList.add('crossed');
    }

    return titleWrapper;
}

function createEditInputBlock(i) {
    const editInputBlock = htmlToElement(editInputBlockTemplate);
    editInputBlock.firstChild.setAttribute('value', state.recordsToDisplay[i].place);
    editInputBlock.classList.add('hidden');
    editInputBlock.setAttribute('number', i);

    const editAccept = editInputBlock.querySelector('.record__accept-edit');
    editAccept.addEventListener('click', acceptEdit);

    const editCancel = editInputBlock.querySelector('.record__cancel-edit');
    editCancel.addEventListener('click', cancelEdit);

    return editInputBlock;
}

function initArrowControllers(record, i) {
    const arrows = record.querySelectorAll('.record__arrow');
    arrows[0].addEventListener('click', moveRecord);
    arrows[1].addEventListener('click', moveRecord);
    arrows[0].setAttribute('number', i);
    arrows[1].setAttribute('number', i);

    if (i === 0) {
        record.querySelector('.record__up-arrow').classList.add('hidden');
    }

    if (i === state.recordsToDisplay.length - 1) {
        record.querySelector('.record__down-arrow').classList.add('hidden');
    }

    if (state.filter !== 'all') {
        arrows[0].classList.add('hidden');
        arrows[1].classList.add('hidden');
    }
}

function initVisited(record, i) {
    const visited = record.querySelector('.record__visited');
    visited.setAttribute('number', i);
    visited.addEventListener('click', toggleVisited);

    if (state.recordsToDisplay[i].isVisited) {
        visited.setAttribute('checked', '');
    }
}

/**
 * Инициализирует все кнопки на странице, кроме кнопок записи.
 * Записи и их все их кнопки инициализируются самостоятельно при построении.
 */
function initListeners() {
    const deleteAll = document.querySelector('.records-list-panel__delete-all');
    deleteAll.addEventListener('click', deleteAllRecords);

    const all = document.querySelector('.first');
    all.addEventListener('click', changeActiveFilter.bind(this, 'all'));

    const visited = document.querySelector('.last');
    visited.addEventListener('click', changeActiveFilter.bind(this, 'visited'));

    const notVisited = document.querySelector('.middle');
    notVisited.addEventListener('click', changeActiveFilter.bind(this, 'notVisited'));

    const createButton = document.querySelector('.create-record-panel__create');
    createButton.addEventListener('click', createRecord);

    const searchInput = document.querySelector('.search-panel__search-input');
    searchInput.addEventListener('input', updateInput);
}


// Методы, входящие в логику работы кнопок записи
function toggleVisited() {
    const number = this.getAttribute('number');
    const record = document.querySelector(`.record-number-${number}`);
    const title = record.querySelector('.record__title');
    if (title.classList.contains('crossed')) {
        state.recordsToDisplay[number].isVisited = false;
        title.classList.remove('crossed');
        api.updateRecord(state.recordsToDisplay[number].id, { isVisited: 'false' });
    } else {
        state.recordsToDisplay[number].isVisited = true;
        title.classList.add('crossed');
        api.updateRecord(state.recordsToDisplay[number].id, { isVisited: 'true' });
    }
}

function moveRecord() {
    const index = parseInt(this.getAttribute('number'), 10);
    let newRecords = state.records;
    if (this.classList.contains('record__up-arrow')) {
        const upRecord = newRecords[index - 1];
        api.moveRecord(newRecords[index].id, 'up');
        newRecords[index - 1] = newRecords[index];
        newRecords[index] = upRecord;
    } else {
        const downRecord = newRecords[index + 1];
        api.moveRecord(newRecords[index].id, 'down');
        newRecords[index + 1] = newRecords[index];
        newRecords[index] = downRecord;
    }
    updateState({ records: newRecords });
}

function displayControllers() {
    const number = this.getAttribute('number');
    const record = document.querySelector(`.record-number-${number}`);
    const editors = record.querySelectorAll('.record__editor');
    editors[0].classList.remove('hidden');
    editors[1].classList.remove('hidden');
}

function hideControllers() {
    const number = this.getAttribute('number');
    const record = document.querySelector(`.record-number-${number}`);
    const editors = record.querySelectorAll('.record__editor');
    editors[0].classList.add('hidden');
    editors[1].classList.add('hidden');
}

function deleteRecord() {
    const index = parseInt(this.parentNode.getAttribute('number'), 10);
    const newRecords = state.records;
    const record = state.recordsToDisplay[index];

    this.parentNode.parentNode.remove();
    newRecords.splice(newRecords.findIndex(item => item.id === record.id), 1);

    api.deleteRecords([record.id]);
    updateState({ records: newRecords });
}

function editTitle() {
    this.parentNode.parentNode.firstChild.classList.remove('hidden');
    this.parentNode.classList.add('hidden');
}

function acceptEdit() {
    const index = this.parentNode.getAttribute('number');
    const record = state.recordsToDisplay[index];
    record.place = this.parentNode.firstChild.value;
    api.updateRecord(record.id, { place: record.place });

    updateState();
}

function cancelEdit() {
    this.parentNode.classList.add('hidden');
    this.parentNode.nextElementSibling.classList.remove('hidden');
}


// Методы для остальных кнопок страницы (все, кроме записей)
function deleteAllRecords() {
    if (state.filter === 'all') {
        updateState({ records: [] });
        api.deleteAllRecords();
    } else {
        const recordsToDelete = [];
        let newRecords = state.records;
        state.recordsToDisplay.forEach((record) => {
            recordsToDelete.push(record.id);
            newRecords.splice(newRecords.indexOf(record), 1);
        });

        updateState({ records: newRecords });
        api.deleteRecords(recordsToDelete);
    }
}

function changeActiveFilter(activeFilter) {
    updateState({ filter: activeFilter });
}

function createRecord() {
    const value = this.previousElementSibling.value;
    if (!value) {
        return;
    }
    this.previousElementSibling.value = '';
    this.previousElementSibling.setAttribute('placeholder', 'Название места');
    this.setAttribute('disabled', '');

    let newRecords = state.records;

    api.createRecord(value)
        .then((record) => {
            this.removeAttribute('disabled');
            newRecords.push(record);
            updateState({ records: newRecords });
        });
}

function updateInput() {
    if (this.value) {
        updateState({ input: this.value });
    }
}

// Ининциализация страницы, первичная отрисовка динамических записей
const loaded = loadRecords();

window.onload = () => {
    loaded.then(() => {
        updateState();
        initListeners();
    });
};
