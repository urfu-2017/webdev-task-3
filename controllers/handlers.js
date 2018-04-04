'use strict';
// заполнен сразу для удобства тестирования
// const SERVER = 'https://webdev-task-2-ehhlckxzzz.now.sh/';

// пустой, заполняется руками для удобства использования
const SERVER = 'https://webdev-task-2-cmkclfwkjm.now.sh/';

// const SERVER = 'http://localhost:3000/';

/* eslint-disable no-use-before-define */
// использую function expression, не критичная ошибка

/* eslint-disable no-invalid-this */
// в debounce возвращается функция, в контексте вызова debounce this будет определен

/* ----------------------------- DESCRIBE GENERAL METHODS ---------------------------- */

// шаблон для fetch
const fetchPlacesDB = async ({ method, headers, body }, relativePath) => {
    return await fetch(SERVER + relativePath, {
        method: method || 'GET',
        headers: headers || { 'Content-Type': 'application/json' },
        body: body || {}
    });
};

// найстрока отображения "все / посетить / посещенные"
const setViewHandler = () => {
    document.querySelectorAll('.control-panel__view-filter_input').forEach(radioButton => {
        radioButton.addEventListener('click', () => {
            let places = document.getElementsByClassName('place');
            const typeOfView = radioButton.id;
            Array.prototype.forEach.call(places, place => {
                place.classList.remove('place_hidden');
                let checkbox = place.getElementsByClassName('place__visited_checkbox')[0];
                switch (typeOfView) {
                    case 'listWish':
                        if (checkbox.checked) {
                            place.classList.add('place_hidden');
                        } else {
                            place.classList.remove('place_hidden');
                        }
                        break;
                    case 'listDone':
                        if (checkbox.checked) {
                            place.classList.remove('place_hidden');
                        } else {
                            place.classList.add('place_hidden');
                        }
                        break;
                    default:
                }
            });
        });
    });
};

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

// настройка поиска без общения с сервером
const setSearchHandler = () => {
    const field = document.getElementsByClassName('search__field')[0];
    const find = debounce(() => {
        let currentString = document.getElementsByClassName('search__field')[0].value;
        currentString = currentString.toLowerCase();

        let places = document.getElementsByClassName('place');
        places = Array.prototype.slice.call(places, 0);

        let searchType = document.getElementsByClassName('js-radiobuttons-for-search');
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
            .innerHTML.toLowerCase();
        const description = place.getElementsByClassName('place__description')[0]
            .innerHTML.toLowerCase();

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

        if (!(props.some(prop => prop.indexOf(currentString) + 1))) {
            place.classList.add('place_hidden');
        } else {
            place.classList.remove('place_hidden');
        }
    });
};

// настройка сортировки по алфавиту и по дате
const setSortListHandler = (sortType) => {
    Array.prototype.forEach.call(sortType, radioButton => {
        radioButton.addEventListener('click', async () => {
            const fetchParams = {
                method: 'GET'
            };
            const sortList = await fetchPlacesDB(fetchParams, 'places?sortType=' + radioButton.id)
                .then(response => response.json());

            document.getElementsByClassName('list')[0].innerHTML = '';

            Array.prototype.forEach.call(sortList, place => {
                appendPlace(place);
            });
        });
    });
};

// настройка кнопки "удалить все"
const setDeleteAllHandler = () => {
    const deleteAllButton = document.getElementsByClassName('control-panel__delete')[0];
    deleteAllButton.addEventListener('click', async () => {
        deleteAllButton.blur();
        const fetchParams = {
            method: 'DELETE'
        };
        const isClear = await fetchPlacesDB(fetchParams, 'places')
            .then(response => response.status);
        if (isClear === 200) {
            document.getElementsByClassName('list')[0].innerHTML = '';
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
        const fetchParams = {
            method: 'POST',
            body: JSON.stringify({
                name,
                description
            })
        };
        const newPlace = await fetchPlacesDB(fetchParams, 'places')
            .then(response => response.json());
        appendPlace(newPlace);
    });
};

/* ----------------------- DESCRIBE METHODS FOR PLACE'S BUTTONS ----------------------- */

// посещение
const setVisitCheckboxHandler = async (place, id) => {
    const visitButton = place.getElementsByClassName('place__visited_checkbox')[0];
    visitButton.addEventListener('click', async () => {
        const method = visitButton.checked ? 'PUT' : 'DELETE';
        const fetchParams = { method };
        await fetchPlacesDB(fetchParams, 'places/' + id + '/visited');
    });
};

// редактирование
const setEditViewHandler = place => {
    const editButton = place.getElementsByClassName('place__edit')[0];
    editButton.addEventListener('click', async () => {
        const descriptionEdit = place.getElementsByClassName('place__description-edit')[0];
        const nameEdit = place.getElementsByClassName('place__name-edit')[0];

        const description = place.getElementsByClassName('place__description')[0];
        const name = place.getElementsByClassName('place__name')[0];

        descriptionEdit.value = description.childNodes[0].data;
        let nameField = nameEdit.getElementsByClassName('place__name_edit')[0];
        nameField.value = name.childNodes[0].data;

        descriptionEdit.classList.remove('place__text-hide');
        nameEdit.classList.remove('place__text-hide');
        description.classList.remove('place__text-block');
        name.classList.remove('place__text-block');
        description.classList.add('place__text-hide');
        name.classList.add('place__text-hide');
        descriptionEdit.classList.add('place__text-block');
        nameEdit.classList.add('place__text-flex');
    });
};

const setEditAcceptHandler = async (place, id) => {
    const acceptButton = place.getElementsByClassName('place__accept')[0];
    acceptButton.addEventListener('click', async () => {
        const descriptionEdit = place.getElementsByClassName('place__description-edit')[0];
        const nameEdit = place.getElementsByClassName('place__name-edit')[0];
        const fetchParams = {
            method: 'PATCH',
            body: JSON.stringify({
                name: nameEdit.getElementsByClassName('place__name_edit')[0].value,
                description: descriptionEdit.value
            })
        };
        const newPlace = await fetchPlacesDB(fetchParams, 'edit/' + id)
            .then(response => response.json());
        updatePlace(newPlace, place);
    });
};

const setEditCancelHandler = (place) => {
    const cancelButton = place.getElementsByClassName('place__cancel')[0];
    cancelButton.addEventListener('click', () => {
        const descriptionEdit = place.getElementsByClassName('place__description-edit')[0];
        const nameEdit = place.getElementsByClassName('place__name-edit')[0];

        const description = place.getElementsByClassName('place__description')[0];
        const name = place.getElementsByClassName('place__name')[0];

        description.classList.remove('place__text-hide');
        name.classList.remove('place__text-hide');
        descriptionEdit.classList.remove('place__text-block');
        nameEdit.classList.remove('place__text-flex');
        descriptionEdit.classList.add('place__text-hide');
        nameEdit.classList.add('place__text-hide');
        description.classList.add('place__text-block');
        name.classList.add('place__text-block');
    });
};

// удаление
const setDeletePlaceHandler = (place, id) => {
    const deleteButton = place.getElementsByClassName('place__delete')[0];
    deleteButton.addEventListener('click', async () => {
        const fetchParams = {
            method: 'DELETE'
        };
        const isDelete = await fetchPlacesDB(fetchParams, 'places/' + id)
            .then(response => response.status);
        if (isDelete === 202) {
            place.remove();
        }
    });
};

// смена места
let dragElementId;
let dropElementId;
const callbackMouseUp = async (e) => {
    let targetPlace = e.target.closest('.place');
    dropElementId = targetPlace.getElementsByClassName('place__id')[0].value;
    const fetchParams = {
        method: 'PATCH'
    };
    const newList = await fetchPlacesDB(fetchParams,
        `places/order/?id1=${dragElementId}&id2=${dropElementId}`)
        .then(response => response.json());
    if (newList) {
        const forDrag1 = document.getElementById(`visit_checkbox_${dragElementId}`).parentElement;
        const forDrag2 = document.getElementById(`visit_checkbox_${dropElementId}`).parentElement;
        updatePlace(newList[1], forDrag1);
        updatePlace(newList[0], forDrag2);
    }
    document.removeEventListener('mouseup', callbackMouseUp);
};

const setChangeOrderHandler = (place, id) => {
    const dragButton = place.getElementsByClassName('place__change-order')[0];

    let dragObject = {};
    dragButton.addEventListener('mousedown', (e) => {
        dragElementId = id;
        e.preventDefault();
        dragObject.downX = e.pageX;
        dragObject.downY = e.pageY;
        dragObject.avatar = place;
        document.addEventListener('mouseup', callbackMouseUp);
    });
};

/* ----------------------------------ONLOAD(CALL ALL)---------------------------------- */

document.addEventListener('DOMContentLoaded', async () => {
    let sortType = [];
    sortType.push(document.getElementsByClassName('control-panel__sorting-input_abc')[0]);
    sortType.push(document.getElementsByClassName('control-panel__sorting-input_date')[0]);
    sortType = Array.prototype.slice.call(sortType, 0);
    setSortListHandler(sortType);
    sortType = sortType.filter(elem => elem.checked);
    sortType = sortType[0].id;
    const fetchParams = {
        method: 'GET'
    };
    let newList = await fetchPlacesDB(fetchParams, 'places?sortType=' + sortType)
        .then(response => response.json());
    // console.log(newList)
    Array.prototype.forEach.call(newList, place => {
        appendPlace(place);
    });
    setViewHandler();
    setSearchHandler();
    setDeleteAllHandler();
    setCreatePlaceHandler();
});

function generatePlace({ id, name, description, created }) {
    let newPlace = document.createElement('section');
    newPlace.className = 'place';
    newPlace.innerHTML = `
    <input type="hidden" value="${id}" class="place__id">
    <div class="place__title">
        <input type="image" src="/pics/edit.svg" alt="" class="place__edit">
        <input type="image" src="/pics/delete.svg" alt="" class="place__delete">
        <div class="place__name">${name}</div>
        <div class="place__name-edit">
            <input type="text" class="place__name_edit" name="nameEdit">
            <input type="image" src="/pics/cancel.svg" alt="" class="place__cancel">
            <input type="image" src="/pics/accept.svg" alt="" class="place__accept">
        </div>
    </div>
    <div class="place__description">${description}</div>
    <textarea class="place__description-edit"></textarea>
    <img src='pics/drag.png' class="place__change-order">
    <div class="place__create-date">
        <div>Добавлено</div>
        <div>${created}</div>
    </div>
    <input type="checkbox" name="isVisit" tabindex=-1
    id="visit_checkbox_${id}" class="place__visited_checkbox">
    <label for="visit_checkbox_${id}" class="place__visited">`;

    return newPlace;
}

const appendPlace = ({ id, name, description, created, isVisited }) => {
    let list = document.getElementsByClassName('list')[0];
    const newPlace = generatePlace({ id, name, description, created });

    list.appendChild(newPlace);

    if (isVisited) {
        const inputIdStr = `visit_checkbox_${id}`;
        document.getElementById(inputIdStr).checked = true;
    }

    setAllPlaceHandlers(newPlace, id);
};

const updatePlace = ({ id, name, description, created, isVisited }, insertInsteadOf) => {
    let list = document.getElementsByClassName('list')[0];
    const newPlace = generatePlace({ id, name, description, created });

    list.replaceChild(newPlace, insertInsteadOf);

    if (isVisited) {
        const inputIdStr = `visit_checkbox_${id}`;
        document.getElementById(inputIdStr).checked = true;
    }

    setAllPlaceHandlers(newPlace, id);
};

const setAllPlaceHandlers = (newPlace, id) => {
    setVisitCheckboxHandler(newPlace, id);
    setEditViewHandler(newPlace);
    setEditAcceptHandler(newPlace, id);
    setEditCancelHandler(newPlace);
    setDeletePlaceHandler(newPlace, id);
    setChangeOrderHandler(newPlace, id);
};

