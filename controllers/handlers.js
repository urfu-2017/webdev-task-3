'use strict';
// заполнен сразу для удобства тестирования
const SERVER = 'https://webdev-task-2-ehhlckxzzz.now.sh/';

// пустой, заполняется руками для удобства использования
// const SERVER = 'https://webdev-task-2-cmkclfwkjm.now.sh/';

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
            let places = document.querySelectorAll('.place');
            const typeOfView = radioButton.id;
            places.forEach(place => {
                place.classList.remove('place_hidden');
                let checkbox = place.querySelectorAll('.place__visited_checkbox')[0];
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

// настройка поиска без общения с сервером
const debounceSearch = (func, field, searchType, delay) => {
    let timer = null;

    return function () {
        const onComplete = () => {
            func.apply(this, [field, searchType]);
            timer = null;
        };
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(onComplete, delay);
    };
};

const setSearchHandler = () => {
    const field = document.querySelectorAll('.search__field')[0];
    const searchType = document.querySelectorAll('.js-radiobuttons-for-search');
    const find = debounceSearch(() => {
        let currentString = document.querySelectorAll('.search__field')[0].value;
        currentString = currentString.toLowerCase();

        let places = document.querySelectorAll('.place');
        places = Array.prototype.slice.call(places, 0);

        let searchTypeValue = Array.prototype.slice.call(searchType, 0);
        searchTypeValue = searchTypeValue.filter(elem => elem.checked);
        searchTypeValue = searchTypeValue[0].value;

        viewAppropriatePlaces(places, searchTypeValue, currentString);
    }, field, searchType, 300);
    field.addEventListener('input', find);
    searchType.forEach(btn => btn.addEventListener('click', find));
};

const viewAppropriatePlaces = (places, searchType, currentString) => {
    places.forEach(place => {
        const name = place.querySelectorAll('.place__name')[0]
            .innerHTML.toLowerCase();
        const description = place.querySelectorAll('.place__description')[0]
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
    sortType.addEventListener('click', () => {
        const sortList = Array.from(document.querySelectorAll('.place'));
        if (sortType.id === 'date') {
            sortList.sort((a, b) => {
                const timeA = a.querySelectorAll('.place__time')[0].value;
                const timeB = b.querySelectorAll('.place__time')[0].value;

                return timeA > timeB;
            });
        } else if (sortType.id === 'name') {
            sortList.sort((a, b) => {
                const nameA = a.querySelectorAll('.place__name')[0].innerHTML.toLowerCase();
                const nameB = b.querySelectorAll('.place__name')[0].innerHTML.toLowerCase();

                return nameA > nameB;
            });
        }
        // console.log(sortList)
        document.querySelectorAll('.list')[0].innerHTML = '';
        sortList.forEach(place => {
            const placeIn = {
                id: place.querySelectorAll('.place__id')[0].value,
                name: place.querySelectorAll('.place__name')[0].innerHTML,
                description: place.querySelectorAll('.place__description')[0].innerHTML,
                created: place.querySelectorAll('.place__create-date-value')[0].innerHTML,
                isVisited: place.querySelectorAll('.place__visited_checkbox')[0].checked,
                unixTimeStamp: place.querySelectorAll('.place__time')[0].value
            };
            appendPlace(placeIn);
        });
    });
};

// настройка кнопки "удалить все"
const setDeleteAllHandler = () => {
    const deleteAllButton = document.querySelectorAll('.control-panel__delete')[0];
    deleteAllButton.addEventListener('click', async () => {
        deleteAllButton.blur();
        const fetchParams = {
            method: 'DELETE'
        };
        const isClear = await fetchPlacesDB(fetchParams, 'places')
            .then(response => response.status);
        if (isClear === 200) {
            document.querySelectorAll('.list')[0].innerHTML = '';
        }
    });
};

// настройка создания места
const setCreatePlaceHandler = () => {
    const createButton = document.querySelectorAll('.new-place__create-button')[0];
    const descriptionField = document.querySelectorAll('.new-place__description')[0];
    const nameField = document.querySelectorAll('.new-place__name')[0];
    createButton.addEventListener('click', async () => {
        const description = descriptionField.value;
        const name = nameField.value;
        nameField.value = '';
        descriptionField.value = '';
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
    const visitButton = place.querySelectorAll('.place__visited_checkbox')[0];
    visitButton.addEventListener('click', async () => {
        const method = visitButton.checked ? 'PUT' : 'DELETE';
        const fetchParams = { method };
        await fetchPlacesDB(fetchParams, 'places/' + id + '/visited');
    });
};

// редактирование
const setEditViewHandler = place => {
    const editButton = place.querySelectorAll('.place__edit')[0];
    editButton.addEventListener('click', async () => {
        const descriptionEdit = place.querySelectorAll('.place__description-edit')[0];
        const nameEdit = place.querySelectorAll('.place__name-edit')[0];

        const description = place.querySelectorAll('.place__description')[0];
        const name = place.querySelectorAll('.place__name')[0];

        descriptionEdit.value = description.innerHTML;
        let nameField = nameEdit.querySelectorAll('.place__name_edit')[0];
        nameField.value = name.innerHTML;

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
    const acceptButton = place.querySelectorAll('.place__accept')[0];
    acceptButton.addEventListener('click', async () => {
        const descriptionEdit = place.querySelectorAll('.place__description-edit')[0];
        const nameEdit = place.querySelectorAll('.place__name-edit')[0];
        const fetchParams = {
            method: 'PATCH',
            body: JSON.stringify({
                name: nameEdit.querySelectorAll('.place__name_edit')[0].value,
                description: descriptionEdit.value
            })
        };
        const newPlace = await fetchPlacesDB(fetchParams, 'edit/' + id)
            .then(response => response.json());
        updatePlace(newPlace, place);
    });
};

const setEditCancelHandler = (place) => {
    const cancelButton = place.querySelectorAll('.place__cancel')[0];
    cancelButton.addEventListener('click', () => {
        const descriptionEdit = place.querySelectorAll('.place__description-edit')[0];
        const nameEdit = place.querySelectorAll('.place__name-edit')[0];

        const description = place.querySelectorAll('.place__description')[0];
        const name = place.querySelectorAll('.place__name')[0];

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
    const deleteButton = place.querySelectorAll('.place__delete')[0];
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
const dragging = (e) => {
    const place = document.getElementById(`visit_checkbox_${dragElementId}`).parentElement;
    place.style.visibility = 'visible';
    const draggableElement = place.cloneNode(true);
    place.style.visibility = 'hidden';
    document.body.appendChild(draggableElement);
    draggableElement.style.position = 'fixed';
    draggableElement.style.top = `${e.clientY - 70}px`;
    draggableElement.style.left = `${e.clientX - 335}px`;
    draggableElement.style.width = '415px';
    draggableElement.style['z-index'] = '30';
    setTimeout(() => {
        draggableElement.remove();
    }, 1);
};

const callbackMouseUp = async (e) => {
    let targetPlace = e.target.closest('.place');
    dropElementId = targetPlace.querySelectorAll('.place__id')[0].value;
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
    document.removeEventListener('mousemove', dragging);
    document.removeEventListener('mouseup', callbackMouseUp);
};

const setChangeOrderHandler = (place, id) => {
    const dragButton = place.querySelectorAll('.place__change-order')[0];

    let dragObject = {};
    dragButton.addEventListener('mousedown', (e) => {
        dragElementId = id;
        e.preventDefault();
        dragObject.downX = e.pageX;
        dragObject.downY = e.pageY;
        dragObject.avatar = place;
        document.addEventListener('mousemove', dragging);
        document.addEventListener('mouseup', callbackMouseUp);
    });
};

/* ----------------------------------ONLOAD(CALL ALL)---------------------------------- */

document.addEventListener('DOMContentLoaded', async () => {
    const sortByAbc = document.querySelectorAll('.control-panel__sorting-input_abc')[0];
    const sortByDate = document.querySelectorAll('.control-panel__sorting-input_date')[0];
    const sortType = [sortByAbc, sortByDate];
    setSortListHandler(sortByAbc);
    setSortListHandler(sortByDate);
    const sortTypeRes = sortType.filter(elem => elem.checked)[0].id;
    const fetchParams = {
        method: 'GET'
    };
    let newList = await fetchPlacesDB(fetchParams, 'places?sortType=' + sortTypeRes)
        .then(response => response.json());
    // console.log(newList)
    newList.forEach(place => appendPlace(place));
    setViewHandler();
    setSearchHandler();
    setDeleteAllHandler();
    setCreatePlaceHandler();
});

function generatePlace({ id, name, description, created, unixTimeStamp }) {
    let newPlace = document.createElement('section');
    newPlace.className = 'place';
    newPlace.innerHTML = `
    <input type="hidden" value="${id}" class="place__id">
    <input type="hidden" value="${unixTimeStamp}" class="place__time">
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
        <div class="place__create-date-value">${created}</div>
    </div>
    <input type="checkbox" name="isVisit" tabindex=-1
    id="visit_checkbox_${id}" class="place__visited_checkbox">
    <label for="visit_checkbox_${id}" class="place__visited">`;

    return newPlace;
}

const appendPlace = ({ id, name, description, created, isVisited, unixTimeStamp }) => {
    let list = document.querySelectorAll('.list')[0];
    const newPlace = generatePlace({ id, name, description, created, unixTimeStamp });

    list.appendChild(newPlace);

    if (isVisited) {
        const inputIdStr = `visit_checkbox_${id}`;
        document.getElementById(inputIdStr).checked = true;
    }

    setAllPlaceHandlers(newPlace, id);
};

const updatePlace = ({ id, name, description, created, isVisited, unixTimeStamp }, Instead) => {
    let list = document.querySelectorAll('.list')[0];
    const newPlace = generatePlace({ id, name, description, created, unixTimeStamp });

    list.replaceChild(newPlace, Instead);

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

