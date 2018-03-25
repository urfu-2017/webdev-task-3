'use strict';
// заполнен сразу для удобства тестирования
const SERVER = 'https://webdev-task-2-fnkwdvsmqy.now.sh/';

// пустой, заполняется руками для удобства использования
// const SERVER = 'https://webdev-task-2-uiqodnlgqn.now.sh/';

/* eslint-disable no-use-before-define */
// использую function expression, не критичная ошибка

/* eslint-disable no-invalid-this */
// в debounce возвращается функция, в контексте вызова debounce this будет определен

/* ----------------------------- DESCRIBE GENERAL METHODS ---------------------------- */

// найстрока отображения "все / посетить / посещенные"
const setViewHandler = () => {
    let radioPlace = document.getElementsByClassName('control-panel__view-filter_input');
    radioPlace = Array.prototype.slice.call(radioPlace, 0);
    Array.prototype.forEach.call(radioPlace, radioButton => {
        radioButton.addEventListener('click', async () => {
            let places = document.getElementsByClassName('place');
            places = Array.prototype.slice.call(places, 0);
            const whichPlaceToView = radioButton.id;

            Array.prototype.forEach.call(places, place => {
                place.style.display = 'grid';
                let isVisit = place.getElementsByClassName('place__visited_checkbox')[0].checked;
                if (whichPlaceToView === 'listWish') {
                    isVisit = !isVisit;
                } else if (whichPlaceToView === 'listAll') {
                    isVisit = true;
                }
                if (isVisit) {
                    place.style.display = 'grid';
                } else {
                    place.style.display = 'none';
                }
            });
        });
    });
};

// настройка поиска без общения с сервером
const debounce = (func, delay) => {
    let timer = null;

    return function (...args) {
        const onComplete = () => {
            func.apply(this, args);
            timer = null;
        };
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(onComplete, delay);
    };
};

const setSearchHandler = () => {
    const field = document.getElementsByClassName('search__field')[0];
    const find = debounce(() => {
        let currentString = document.getElementsByClassName('search__field')[0].value;
        currentString = currentString.toLowerCase();

        let places = document.getElementsByClassName('place');
        places = Array.prototype.slice.call(places, 0);

        let searchType = document.getElementsByClassName('blue-radio');
        searchType = Array.prototype.slice.call(searchType, 0);
        searchType = searchType.filter(elem => elem.checked);
        searchType = searchType[0].value;

        viewAppropriatePlaces(places, searchType, currentString);
    }, 300);
    field.addEventListener('keypress', find);
};

const viewAppropriatePlaces = (places, searchType, currentString) => {
    Array.prototype.forEach.call(places, place => {
        const name = place.getElementsByClassName('place__name')[0]
            .childNodes[0].data.toLowerCase();
        const description = place.getElementsByClassName('place__description')[0]
            .childNodes[0].data.toLowerCase();

        let props = [];
        switch (searchType) {
            case 'descrOnly':
                props.push(description);
                break;
            case 'nameOnly':
                props.push(name);
                break;
            default:
                props.push(description);
                props.push(name);
        }

        if (!(Array.prototype.some.call(props, prop => prop.indexOf(currentString) + 1))) {
            place.style.display = 'none';
        } else {
            place.style.display = 'grid';
        }
    });
};

// настройка сортировки по алфавиту и по дате
const setSortListHandler = (sortType) => {
    Array.prototype.forEach.call(sortType, radioButton => {
        radioButton.addEventListener('click', async () => {
            let sortList = await fetch(SERVER + 'places?sortType=' + radioButton.id, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json());

            let places = document.getElementsByClassName('place');
            places = Array.prototype.slice.call(places, 0);
            Array.prototype.forEach.call(places, place => place.remove());

            Array.prototype.forEach.call(sortList, place => {
                generatePlace(place);
            });
        });
    });
};

// настройка кнопки "удалить все"
const setDeleteAllHandler = () => {
    const deleteAllButton = document.getElementsByClassName('control-panel__delete')[0];
    deleteAllButton.addEventListener('click', async () => {
        deleteAllButton.blur();
        const isClear = await fetch(SERVER + 'places', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.status);
        if (isClear === 200) {
            let allChild = document.getElementsByClassName('list')[0].children;
            allChild = Array.prototype.slice.call(allChild, 0);
            Array.prototype.forEach.call(allChild, place => {
                place.remove();
            });
        }
    });
};

// настройка создания места
const setCreatePlaceHandler = () => {
    const createButton = document.getElementsByClassName('new-place__create-button')[0];
    createButton.addEventListener('click', async () => {
        const description = document.getElementsByClassName('new-place__description')[0].value;
        const name = document.getElementsByClassName('new-place__name')[0].value;
        document.getElementsByClassName('new-place__name')[0].value = '';
        document.getElementsByClassName('new-place__description')[0].value = '';
        const newPlace = await fetch(SERVER + 'places', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                description
            })
        })
            .then(response => response.json());
        generatePlace(newPlace);
    });
};

/* ----------------------- DESCRIBE METHODS FOR PLACE'S BUTTONS ----------------------- */

// посещение
const setVisitCheckboxHandler = async (place, id) => {
    const visitButton = place.getElementsByClassName('place__visited_checkbox')[0];
    visitButton.addEventListener('click', async () => {
        let method;
        if (visitButton.checked) {
            method = 'PUT';
        } else {
            method = 'DELETE';
        }

        await fetch(SERVER + 'places/' + id + '/visited', {
            method,
            headers: { 'Content-Type': 'application/json' }
        });
    });
};

// редактирование
const setEditViewHandler = (place) =>{
    const editButton = place.getElementsByClassName('place__edit')[0];
    editButton.addEventListener('click', async () => {
        const descriptionEdit = place.getElementsByClassName('place__description-edit')[0];
        const nameEdit = place.getElementsByClassName('place__name-edit')[0];

        const description = place.getElementsByClassName('place__description')[0];
        const name = place.getElementsByClassName('place__name')[0];

        descriptionEdit.value = description.childNodes[0].data;
        let nameField = nameEdit.getElementsByClassName('place__name-edit_field')[0];
        nameField.value = name.childNodes[0].data;

        description.style.display = 'none';
        name.style.display = 'none';
        descriptionEdit.style.display = 'block';
        nameEdit.style.display = 'flex';
    });
};

const setEditAcceptHandler = async (place, id) => {
    const acceptButton = place.getElementsByClassName('place__name-edit_accept')[0];
    acceptButton.addEventListener('click', async () => {
        const descriptionEdit = place.getElementsByClassName('place__description-edit')[0];
        const nameEdit = place.getElementsByClassName('place__name-edit')[0];
        const newPlace = await fetch(SERVER + 'edit/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nameEdit.getElementsByClassName('place__name-edit_field')[0].value,
                description: descriptionEdit.value
            })
        })
            .then(response => response.json());
        generatePlace(newPlace, place);
    });
};

const setEditCancelHandler = (place) => {
    const cancelButton = place.getElementsByClassName('place__name-edit_cancel')[0];
    cancelButton.addEventListener('click', () => {
        const descriptionEdit = place.getElementsByClassName('place__description-edit')[0];
        const nameEdit = place.getElementsByClassName('place__name-edit')[0];

        const description = place.getElementsByClassName('place__description')[0];
        const name = place.getElementsByClassName('place__name')[0];

        description.style.display = 'block';
        name.style.display = 'block';
        descriptionEdit.style.display = 'none';
        nameEdit.style.display = 'none';
    });
};

// удаление
const setDeletePlaceHandler = (place, id) => {
    const deleteButton = place.getElementsByClassName('place__delete')[0];
    deleteButton.addEventListener('click', async () => {
        const isDelete = await fetch(SERVER + 'places/' + id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.status);
        if (isDelete === 202) {
            place.remove();
        }
    });
};

// смена места
let id1;
let id2;
const callbackMouseUp = async (click) => {
    let targetPlace = click.target.closest('.place');
    id2 = targetPlace.getElementsByClassName('place__id')[0].value;
    const newList = await fetch(SERVER + `places/order/?id1=${id1}&id2=${id2}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json());
    let places = document.getElementsByClassName('place');
    places = Array.prototype.slice.call(places, 0);
    Array.prototype.forEach.call(places, place => place.remove());
    Array.prototype.forEach.call(newList, place => {
        generatePlace(place);
    });
    document.removeEventListener('mouseup', callbackMouseUp);
};

const setChangeOrderHandler = (place, id) => {
    const dragButton = place.getElementsByClassName('place__change-order')[0];

    let dragObject = {};
    dragButton.addEventListener('mousedown', (click) => {
        id1 = id;
        click.preventDefault();
        dragObject.downX = click.pageX;
        dragObject.downY = click.pageY;
        dragObject.avatar = place;
        document.addEventListener('mouseup', callbackMouseUp);
    });
};

/* ----------------------------------ONLOAD(CALL ALL)---------------------------------- */

const loadPage = document;
loadPage.addEventListener('DOMContentLoaded', async () => {
    let sortType = document.getElementsByClassName('control-panel__sorting_input');
    sortType = Array.prototype.slice.call(sortType, 0);
    setSortListHandler(sortType);
    sortType = sortType.filter(elem => elem.checked);
    sortType = sortType[0].id;

    let newList = await fetch(SERVER + 'places?sortType=' + sortType, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json());

    Array.prototype.forEach.call(newList, place => {
        generatePlace(place);
    });
    setViewHandler();
    setSearchHandler();
    setDeleteAllHandler();
    setCreatePlaceHandler();
});

function generatePlace({ id, name, description, created, isVisited }, insertInsteadOf) {
    // console.log(insertInsteadOf);
    let list = document.getElementsByClassName('list')[0];

    let newPlace = document.createElement('section');
    newPlace.className = 'place';
    newPlace.innerHTML = `
    <input type="hidden" value="${id}" class="place__id">
    <div class="place__title">
        <input type="image" src="/pics/edit.svg" alt="" class="place__edit">
        <input type="image" src="/pics/delete.svg" alt="" class="place__delete">
        <div class="place__name">${name}</div>
        <div class="place__name-edit">
            <input type="text" class="place__name-edit_field" name="nameEdit">
            <input type="image" src="/pics/cancel.svg" alt="" class="place__name-edit_cancel">
            <input type="image" src="/pics/accept.svg" alt="" class="place__name-edit_accept">
        </div>
    </div>
    <div class="place__description">${description}</div>
    <textarea class="place__description-edit"></textarea>
    <img src='pics/drag.png' class="place__change-order">
    <div class="place__create-date">
        <div>Добавлено</div>
        <div>${created}</div>
    </div>
    <input type="checkbox" name="isVisit"
    id="visit_checkbox_${id}" class="place__visited_checkbox">
    <label for="visit_checkbox_${id}" class="place__visited">`;

    if (insertInsteadOf) {
        list.replaceChild(newPlace, insertInsteadOf);
    } else {
        list.appendChild(newPlace);
    }

    if (isVisited) {
        const inputIdStr = `visit_checkbox_${id}`;
        document.getElementById(inputIdStr).checked = true;
    }

    setAllHandlers(newPlace, id);
}

const setAllHandlers = (newPlace, id) => {
    setVisitCheckboxHandler(newPlace, id);
    setEditViewHandler(newPlace);
    setEditAcceptHandler(newPlace, id);
    setEditCancelHandler(newPlace);
    setDeletePlaceHandler(newPlace, id);
    setChangeOrderHandler(newPlace, id);
};

