var baseUrl = 'https://webdev-task-2-mezpktevsh.now.sh/api/';

var recordsToDisplay = [];
var records = [];

var filter = 'all';

var filters = {
    visited: (a) => a.isVisited === true,
    notVisited: (a) => a.isVisited === false
};

var recordTemplate = '<div class="record"><form' +
  ' class="record__controllers record__element">' +
  '<span class="record__arrow record__up-arrow record__element">' +
  '&uarr;</span><span class="record__element record__arrow' +
  ' record__down-arrow">&darr;</span><input' +
  ' class="record__visited record__element" type="checkbox"' +
  ' name="visited"></form></div>';

var titleWrapperTemplate = '<div class="record__element record__title-wrapper"><span' +
  ' class="record__title' +
  ' record__element"></span><span class="record__edit record__editor hidden"></span><span' +
  ' class="record__delete record__editor hidden"></span></div>';

var editInputBlockTemplate = '<div class="record__edit-wrapper">' +
  '<input type="text" autofocus class="record__edit-input">' +
  '<span class="record__cancel-edit"></span><span' +
  ' class="record__accept-edit"></span></div>';

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;

    return template.content.firstChild;
}

function loadRecords() {
    return fetch(`${baseUrl}record`)
        .then(res => res.json())
        .then((value) => {
            records = value;
        });
}

function toggleVisited() {
    var number = this.getAttribute('number');
    var record = document.getElementsByClassName(`record-number-${number}`)[0];
    var title = record.getElementsByClassName('record__title')[0];
    if (title.classList.contains('crossed')) {
        recordsToDisplay[number].isVisited = false;
        title.classList.remove('crossed');
    } else {
        recordsToDisplay[number].isVisited = true;
        title.classList.add('crossed');
    }
}

function createTitleWrapper(i) {
    var titleWrapper = htmlToElement(titleWrapperTemplate);
    titleWrapper.addEventListener('mouseover', displayControllers);
    titleWrapper.addEventListener('mouseleave', hideControllers);
    titleWrapper.setAttribute('number', i);

    var title = titleWrapper.getElementsByClassName('record__title')[0];
    title.textContent = recordsToDisplay[i].place;
    title.setAttribute('number', i);

    var edit = titleWrapper.getElementsByClassName('record__edit')[0];
    edit.addEventListener('click', editTitle);

    var remove = titleWrapper.getElementsByClassName('record__delete')[0];
    remove.addEventListener('click', deleteRecord);

    if (recordsToDisplay[i].isVisited) {
        title.classList.add('crossed');
    }

    return titleWrapper;
}

function createEditInputBlock(i) {
    var editInputBlock = htmlToElement(editInputBlockTemplate);
    editInputBlock.firstChild.setAttribute('value', recordsToDisplay[i].place);
    editInputBlock.classList.add('hidden');
    editInputBlock.setAttribute('number', i);

    var editAccept = editInputBlock.getElementsByClassName('record__accept-edit')[0];
    editAccept.addEventListener('click', acceptEdit);

    var editCancel = editInputBlock.getElementsByClassName('record__cancel-edit')[0];
    editCancel.addEventListener('click', cancelEdit);

    return editInputBlock;
}

function initArrowControllers(record, i) {
    var arrows = record.getElementsByClassName('record__arrow');
    arrows[0].addEventListener('click', moveRecord);
    arrows[1].addEventListener('click', moveRecord);
    arrows[0].setAttribute('number', i);
    arrows[1].setAttribute('number', i);

    if (i === 0) {
        record.getElementsByClassName('record__up-arrow')[0].classList.add('hidden');
    }

    if (i === recordsToDisplay.length - 1) {
        record.getElementsByClassName('record__down-arrow')[0].classList.add('hidden');
    }
}

function initVisited(record, i) {
    var visited = record.getElementsByClassName('record__visited')[0];
    visited.setAttribute('number', i);
    visited.addEventListener('click', toggleVisited);

    if (recordsToDisplay[i].isVisited) {
        visited.setAttribute('checked', '');
    }
}

function buildRecord(i) {
    var record = htmlToElement(recordTemplate);
    record.classList.add(`record-number-${i}`);

    var titleWrapper = createTitleWrapper(i);
    var editInputBlock = createEditInputBlock();

    initVisited(record, i);
    initArrowControllers(record, i);
    record.insertBefore(titleWrapper, record.firstChild);
    record.insertBefore(editInputBlock, record.firstChild);

    return record;
}

function repaintRecords(customRecords = false) {
    var recordList = document.getElementsByClassName('records-list')[0];
    recordList.innerHTML = '';
    if (filter === 'all') {
        recordsToDisplay = records;
    } else {
        recordsToDisplay = records.filter(filters[filter]);
    }
    if (customRecords) {
        recordsToDisplay = customRecords;
    }
    for (var i = 0; i < recordsToDisplay.length; i++) {
        recordList.appendChild(buildRecord(i));
    }
}

function moveRecord() {
    var index = parseInt(this.getAttribute('number'));
    if (this.classList.contains('record__up-arrow')) {
        var upRecord = recordsToDisplay[index - 1];
        recordsToDisplay[index - 1] = recordsToDisplay[index];
        recordsToDisplay[index] = upRecord;
    } else {
        var downRecord = recordsToDisplay[index + 1];
        recordsToDisplay[index + 1] = recordsToDisplay[index];
        recordsToDisplay[index] = downRecord;

    }
    repaintRecords();
}

function displayControllers() {
    var number = this.getAttribute('number');
    var record = document.getElementsByClassName(`record-number-${number}`)[0];
    var editors = record.getElementsByClassName('record__editor');
    editors[0].classList.remove('hidden');
    editors[1].classList.remove('hidden');
}

function hideControllers() {
    var number = this.getAttribute('number');
    var record = document.getElementsByClassName(`record-number-${number}`)[0];
    var editors = record.getElementsByClassName('record__editor');
    editors[0].classList.add('hidden');
    editors[1].classList.add('hidden');
}

function deleteRecord() {
    var index = parseInt(this.parentNode.getAttribute('number'));
    recordsToDisplay.splice(index, 1);
    this.parentNode.parentNode.remove();
    repaintRecords();
}

function deleteAllRecords() {
    if (filter === 'all') {
        recordsToDisplay.length = 0;

        fetch(`${baseUrl}record/?all=1`, {
            method: 'DELETE'
        });
    } else {
        recordsToDisplay.forEach((record) => {
            records.splice(records.indexOf(record), 1);
        });
    }
    repaintRecords();
}

function editTitle() {
    this.parentNode.parentNode.firstChild.classList.remove('hidden');
    this.parentNode.classList.add('hidden');
}

function acceptEdit() {
    var index = this.parentNode.getAttribute('number');
    recordsToDisplay[index].place = this.parentNode.firstChild.value;
    repaintRecords();
}

function cancelEdit() {
    this.parentNode.classList.add('hidden');
    this.parentNode.nextElementSibling.classList.remove('hidden');
}

function filterVisited() {
    filter = 'visited';
    repaintRecords();
}

function filterNotVisited() {
    filter = 'notVisited';
    repaintRecords();
}

function defaultFilter() {
    filter = 'all';
    repaintRecords();
}

function createRecord() {
    var value = this.previousElementSibling.value;
    if (value) {
        records.push({
            place: value,
            isVisited: filter === 'visited'
        });

        this.previousElementSibling.value = '';
        this.previousElementSibling.setAttribute('placeholder', 'Название места');

        fetch(`${baseUrl}record`, {
            body: JSON.stringify({
                place: value,
                isVisited: filter === 'visited' ? 'true' : 'false'
            }),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        }).then(res => res.json())
            .then((record) => {
                records.pop();
                records.push(record);
                repaintRecords();
            });

        repaintRecords();
    }
}

function searchRecords() {
    if (this.value) {
        repaintRecords(recordsToDisplay.filter(record => record.place.indexOf(this.value) !== -1));
    } else {
        repaintRecords();
    }
}

function initListeners() {
    var deleteAll = document.getElementsByClassName('records-list-panel__delete-all')[0];
    deleteAll.addEventListener('click', deleteAllRecords);

    var all = document.getElementsByClassName('first')[0];
    all.addEventListener('click', defaultFilter);

    var visited = document.getElementsByClassName('last')[0];
    visited.addEventListener('click', filterVisited);

    var notVisited = document.getElementsByClassName('middle')[0];
    notVisited.addEventListener('click', filterNotVisited);

    var create = document.getElementsByClassName('create-record-panel__create')[0];
    create.addEventListener('click', createRecord);

    var search = document.getElementsByClassName('search-panel__search-input')[0];
    search.addEventListener('input', searchRecords);
}


var loaded = loadRecords();

window.onload = () => {
    loaded.then(() => {
        repaintRecords();
        initListeners();
    });
};
