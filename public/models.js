'use strict';

/* eslint no-unused-vars: 0 */

const onSearchChange = function () {
    // Ищу индекс вкл. тумблера
    const tumbs = document.querySelector('.filter-box__tumb:checked');
    const index = 3 - Number(tumbs.getAttribute('id').slice(1, 2));
    // for (let i = 0; i < tumbs.length; i++) {
    //     if (tumbs[i].checked === true) {
    //         index = 2 - i;
    //     }
    // }

    const query = document.querySelector('.search__input').value.toLowerCase();
    const list = document.querySelectorAll('.place');
    const listCheckbox = document.querySelectorAll('.place__checkbox');
    for (let i = 0; i < list.length; i++) {
        // Если элемент СОДЕРЖИТЬ запрос && Его состояние чекбокса true/false/безРазницы
        if (list[i].textContent.toLowerCase().indexOf(query) !== -1 &&
            (Number(listCheckbox[i].checked) === 1 - index || index === 2)) {
            list[i].style.display = 'flex';
        } else {
            list[i].style.display = 'none';
        }
    }
};

const onClickDeleteItem = function (e) {
    const parent = e.target.closest('.place');
    const id = parent.getAttribute('id');
    const placesList = document.querySelector('.place-view__places');
    fetch(`https://webdev-task-2-cgybyopdlr.now.sh/places/${id}`, {
        method: 'delete'
    }).then((res) => {
        if (res.status === 200) {
            placesList.removeChild(parent);
        }
    });
};

const onChangeCheckbox = function (e) {
    const parent = e.target.closest('.place');
    const textDiv = parent.querySelector('.place__description');
    const id = parent.getAttribute('id');
    const now = e.target.checked;
    e.target.checked = !now;
    fetch(`https://webdev-task-2-cgybyopdlr.now.sh/places/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            visited: String(now)
        })
    }).then((res) => {
        if (res.status === 200) {
            e.target.checked = now;
            if (textDiv.style.textDecoration === 'line-through') {
                textDiv.style.textDecoration = 'none';
            } else {
                textDiv.style.textDecoration = 'line-through';
            }
        }
    });
};

const onClickDeleteAll = function () {
    fetch('https://webdev-task-2-cgybyopdlr.now.sh/places', {
        method: 'DELETE'
    }).then((res) => {
        if (res.status === 200) {
            const placesList = document.querySelector('.place-view__places');
            placesList.innerHTML = '';
        }
    });
};

const onClickItemChange = function (e) {
    const parent = e.target.closest('.place');
    const main = parent.querySelector('.place__main');
    const controlls = parent.querySelector('.place__controlls');
    const inputChange = parent.querySelector('.place__input-сhange');

    main.style.display = 'none';
    controlls.style.display = 'none';
    inputChange.style.display = 'flex';
};

const onClickHideItemChange = function (e) {
    const parent = e.target.closest('.place');
    const main = parent.querySelector('.place__main');
    const controlls = parent.querySelector('.place__controlls');
    const inputChange = parent.querySelector('.place__input-сhange');

    main.style.display = 'flex';
    controlls.style.display = 'flex';
    inputChange.style.display = 'none';
};

const onClickChangeItem = function (e) {
    const parent = e.target.closest('.place');
    const textInput = parent.querySelector('.place__input');
    const id = parent.getAttribute('id');
    const description = textInput.value;
    fetch(`https://webdev-task-2-cgybyopdlr.now.sh/places/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description
        })
    }).then((res) => {
        if (res.status === 200) {
            parent.querySelector('.place__description').innerHTML = description;
            onClickHideItemChange(e);
        }
    });
};

const template = function (description) {
    return '<div class="place__main">' +
    '<div class="place__change-btn">🖋</div><div class="place__delete-btn">❌</div>' +
    `<div class="place__description">${description}</div></div>` +
    '<div class="place__controlls"><div class="place__dragdrop">🔀</div>' +
    '<input class="place__checkbox" type="checkbox"/></div>' +
    '<div class="place__input-сhange">' +
    `<input class="place__input" type="text" value="${description}"/>` +
    '<div class="place__cancel-btn">❌</div>' +
    '<div class="place__confirm-btn">✅</div></div>';
};

const createElement = function (id, description, visited) {
    document.querySelector('.create-form__input').value = '';
    let el = document.createElement('div');
    el.className = 'place';
    el.setAttribute('id', id);
    el.innerHTML = template(description);
    document.querySelector('.place-view__places').appendChild(el);
    el.querySelector('.place__delete-btn').addEventListener('click',
        onClickDeleteItem, false);
    el.querySelector('.place__checkbox').addEventListener('change',
        onChangeCheckbox, false);
    el.querySelector('.place__change-btn').addEventListener('click',
        onClickItemChange, false);
    el.querySelector('.place__cancel-btn').addEventListener('click',
        onClickHideItemChange, false);
    el.querySelector('.place__confirm-btn').addEventListener('click',
        onClickChangeItem, false);

    el.querySelector('.place__description').style.textDecoration =
    visited === true ? 'line-through' : 'none';
    el.querySelector('.place__checkbox').checked = visited;
};

const onClickCreateBtn = function () {
    const descriptionText = document.querySelector('.create-form__input').value;
    console.info(descriptionText);
    fetch('https://webdev-task-2-cgybyopdlr.now.sh/places', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: descriptionText
        })
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            createElement(data.id, descriptionText, false);
        });
};
