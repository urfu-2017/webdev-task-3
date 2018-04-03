'use strict';

const url = 'https://webdev-task-2-cgybyopdlr.now.sh/places';

function checkFilter() {
    let filter;
    const radiobtnAll = document.querySelector('.main-page__radiobtn-all');
    const radiobtnVisit = document.querySelector('.main-page__radiobtn-visit');

    if (radiobtnAll.checked) {
        filter = 2;
    } else if (radiobtnVisit.checked) {
        filter = 1;
    } else {
        filter = 0;
    }

    return filter;
}

function search() {

    const filter = checkFilter();

    let searchValue = document.querySelector('.main-page__search-input').value;
    let notes = document.querySelectorAll('.notes > .note')
        ? document.querySelectorAll('.notes > .note')
        : null;
    searchValue = String(searchValue).toLowerCase();

    for (const note of notes) {
        let status = 0;
        if (note.dataset.status === 'false') {
            status = 0;
        } else {
            status = 1;
        }
        const noteName = String(note.querySelector('.note__name').innerHTML)
            .toLowerCase();
        if (noteName.indexOf(searchValue) !== -1 &&
            (filter === 2 || status === 1 - filter)) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    }
}

function add() {
    const addInput = document.querySelector('.main-page__add-input');
    const addInputValue = addInput.value;
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: addInputValue
        })
    })
        .then(res => {
            if (res.status === 201) {
                return res.json();
            }
        })
        .then(data => {
            let newNote = document.createElement('div');
            newNote.className = 'note';
            newNote.setAttribute('data-status', data.visited);
            newNote.setAttribute('data-id', data.id);
            newNote.innerHTML = `<div class="note__default">
                    <div class="note__start">
                    <div class="note__change">
                        <img class="note__change-img" src="images/red.png" alt="Редактировать">
                    </div>
                    <div class="note__delete">
                        <img class="note__delete-img" src="images/close.png" alt="Удалить">
                    </div>
                    <span 
                        class="note__name">
                        ${ data.description }
                    </span>
                </div>
                <div class="note__end">
                    <input class="note__checkbox" type="checkbox" />
                </div>
            </div>
            <div class="note__redactor">
                <input class="note__input" value="${ data.description }" type="text"/>
                <div class="note__cancel">
                    <img class="note__cancel-img" src="images/close.png" alt="Удалить">
                </div>
                <div class="note__ok">
                    <img class="note__ok-img" src="images/ok.png" alt="Ok">
                </div>
            </div>`;
            document.querySelector('.notes').appendChild(newNote);
            newNote.querySelector('.note__change').addEventListener('click',
                showRedactor, false);
            newNote.querySelector('.note__name').addEventListener('click',
                showRedactor, false);
            newNote.querySelector('.note__cancel').addEventListener('click',
                closeRedactor, false);
            newNote.querySelector('.note__ok').addEventListener('click',
                changeNote, false);
            newNote.querySelector('.note__delete').addEventListener('click',
                deleteOne, false);
            newNote.querySelector('.note__checkbox').addEventListener('change',
                changeStatus, false);
        });
    addInput.value = '';
}

function deleteAll() {
    fetch(url, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.status === 200) {
                const notes = document.querySelector('.notes');
                const notesArray = document.querySelectorAll('.notes > .note');
                for (const el of notesArray) {
                    notes.removeChild(el);
                }
            }
        });
}

function deleteOne(e) {
    const selectEl = e.target.closest('.note');
    const notes = document.querySelector('.notes');
    const id = selectEl.dataset.id;
    fetch(url + `/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.status === 200) {
                notes.removeChild(selectEl);
            }
        });
}

function showRedactor(e) {
    const selectedEl = e.target.closest('.note');
    const def = selectedEl.querySelector('.note__default');
    const redactor = selectedEl.querySelector('.note__redactor');

    def.className = 'note__default display_none';
    redactor.className = 'note__redactor display_flex';
}

function closeRedactor(e) {
    const selectedEl = e.target.closest('.note');
    const def = selectedEl.querySelector('.note__default');
    const redactor = selectedEl.querySelector('.note__redactor');

    def.className = 'note__default display_flex';
    redactor.className = 'note__redactor display_none';
}

function changeNote(e) {
    const selectEl = e.target.closest('.note');
    let newName = selectEl.querySelector('.note__input').value;
    const id = selectEl.dataset.id;
    fetch(url + `/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: newName
        })
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(data => {
            selectEl.querySelector('.note__name').innerHTML = data.description;
            newName = '';
            closeRedactor(e);
        });
}

function changeStatus(e) {
    const selectEl = e.target.closest('.note');
    const id = selectEl.dataset.id;
    const curStatus = e.target.checked;
    e.target.checked = !curStatus;
    fetch(url + `/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            visited: String(curStatus)
        })
    }).then((res) => {
        if (res.status === 200) {
            e.target.checked = curStatus;
            selectEl.dataset.status = curStatus;
        }
    });
}

const noteListeners = function () {
    const noteNames = document.querySelectorAll('.note__name');
    for (const name of noteNames) {
        name.addEventListener('click', showRedactor, false);
    }

    const redactorCansel = document.querySelectorAll('.note__cancel');
    for (const btn of redactorCansel) {
        btn.addEventListener('click', closeRedactor, false);
    }

    const redactorOk = document.querySelectorAll('.note__ok');
    for (const btn of redactorOk) {
        btn.addEventListener('click', changeNote, false);
    }

    const noteDelete = document.querySelectorAll('.note__delete');
    for (const btn of noteDelete) {
        btn.addEventListener('click', deleteOne, false);
    }

    const noteStatus = document.querySelectorAll('.note__checkbox');
    for (const btn of noteStatus) {
        btn.addEventListener('change', changeStatus, false);
    }
};

window.onload = async () => {
    const filters = document.querySelectorAll('.main-page__status-filter');
    for (const filter of filters) {
        filter.addEventListener('click', search, false);
    }

    const searchInput = document.querySelector('.main-page__search-input');
    searchInput.addEventListener('keyup', search, false);

    const addButton = document.querySelector('.main-page__add-button');
    addButton.addEventListener('click', add, false);

    const deleteButton = document.querySelector('.main-page__delete-all');
    deleteButton.addEventListener('click', deleteAll, false);

    const notePen = document.querySelectorAll('.note__change');
    for (const btn of notePen) {
        btn.addEventListener('click', showRedactor, false);
    }

    noteListeners();
};
