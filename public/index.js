'use strict';

const url = 'https://webdev-task-2-cgybyopdlr.now.sh/places';

function checkFilter() {
    let filter;
    const radiobtnAll = document.getElementsByClassName('main-page__radiobtn-all')[0];
    const radiobtnVisit = document.getElementsByClassName('main-page__radiobtn-visit')[0];

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

    let searchValue = document.getElementsByClassName('main-page__search-input')[0].value;
    let notes = document.getElementsByClassName('notes')[0].children
        ? document.getElementsByClassName('notes')[0].children
        : null;
    searchValue = String(searchValue).toLowerCase();

    for (const note of notes) {
        let status = 0;
        if (note.dataset.status === 'false') {
            status = 0;
        } else {
            status = 1;
        }
        const noteName = String(note.getElementsByClassName('note__name')[0].innerHTML)
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
    const addInput = document.getElementsByClassName('main-page__add-input')[0];
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
            newNote.dataStatus = data.visited;
            newNote.dataId = data.id;
            newNote.innerHTML = `<div class="note__default">
                    <div class="note__start">
                    <img class="note__change-img" src="images/red.png" alt="Редактировать">
                    <img class="note__delete-img" src="images/close.png" alt="Удалить">
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
                <img class="note__cancel-img" src="images/close.png" alt="Удалить">
                <img class="note__ok-img" src="images/ok.png" alt="Ok">
            </div>`;
            document.getElementsByClassName('notes')[0].appendChild(newNote);
            newNote.getElementsByClassName('note__name')[0].addEventListener('click',
                showRedactor, false);
            newNote.getElementsByClassName('note__cancel-img')[0].addEventListener('click',
                closeRedactor, false);
            newNote.getElementsByClassName('note__ok-img')[0].addEventListener('click',
                changeNote, false);
            newNote.getElementsByClassName('note__delete-img')[0].addEventListener('click',
                deleteOne, false);
            newNote.getElementsByClassName('note__checkbox')[0].addEventListener('change',
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
                const notes = document.getElementsByClassName('notes')[0];
                const notesArray = notes.children;
                for (const el of notesArray) {
                    notes.removeChild(el);
                }
            }
        });
}

function deleteOne(e) {
    const selectEl = e.target.closest('.note');
    const notes = document.getElementsByClassName('notes')[0];
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
    const def = selectedEl.getElementsByClassName('note__default')[0];
    const redactor = selectedEl.getElementsByClassName('note__redactor')[0];

    def.style.display = 'none';
    redactor.style.display = 'flex';
}

function closeRedactor(e) {
    const selectedEl = e.target.closest('.note');
    const def = selectedEl.getElementsByClassName('note__default')[0];
    const redactor = selectedEl.getElementsByClassName('note__redactor')[0];

    def.style.display = 'flex';
    redactor.style.display = 'none';
}

function changeNote(e) {
    const selectEl = e.target.closest('.note');
    let newName = selectEl.getElementsByClassName('note__input')[0].value;
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
            selectEl.getElementsByClassName('note__name')[0].innerHTML = data.description;
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
    const noteNames = document.getElementsByClassName('note__name');
    for (const name of noteNames) {
        name.addEventListener('click', showRedactor, false);
    }

    const redactorCansel = document.getElementsByClassName('note__cancel');
    for (const btn of redactorCansel) {
        btn.addEventListener('click', closeRedactor, false);
    }

    const redactorOk = document.getElementsByClassName('note__ok');
    for (const btn of redactorOk) {
        btn.addEventListener('click', changeNote, false);
    }

    const noteDelete = document.getElementsByClassName('note__delete');
    for (const btn of noteDelete) {
        btn.addEventListener('click', deleteOne, false);
    }

    const noteStatus = document.getElementsByClassName('note__checkbox');
    for (const btn of noteStatus) {
        btn.addEventListener('click', changeStatus, false);
    }
};

window.onload = async () => {
    const filters = document.getElementsByClassName('main-page__status-filter')[0].children;
    for (const filter of filters) {
        filter.addEventListener('click', search, false);
    }

    const searchInput = document.getElementsByClassName('main-page__search-input')[0];
    searchInput.addEventListener('keyup', search, false);

    const addButton = document.getElementsByClassName('main-page__add-button')[0];
    addButton.addEventListener('click', add, false);

    const deleteButton = document.getElementsByClassName('main-page__delete-all')[0];
    deleteButton.addEventListener('click', deleteAll, false);

    const notePen = document.getElementsByClassName('note__change');
    for (const btn of notePen) {
        btn.addEventListener('click', showRedactor, false);
    }

    noteListeners();
};
