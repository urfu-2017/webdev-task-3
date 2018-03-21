'use strict';

/* eslint no-unused-vars: false */

const onSearchChange = function () {
    // Ищу индекс вкл. тумблера
    let index;
    const tumbs = document.getElementsByClassName('filter-box_tumb');
    for (let i = 0; i < tumbs.length; i++) {
        if (tumbs[i].checked === true) {
            index = 2 - i;
        }
    }

    const query = document.getElementsByClassName('search_input')[0].value.toLowerCase();
    const list = document.getElementsByClassName('place');
    const listCheckbox = document.getElementsByClassName('place_checkbox');
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
    const placesList = document.getElementsByClassName('place-view_places')[0];
    fetch(`https://webdev-task-2-dlcyypfzwd.now.sh/places/${id}`, {
        method: 'delete'
    }).then((res) => {
        if (res.status === 200) {
            placesList.removeChild(parent);
        }
    });
};

const onChangeCheckbox = function (e) {
    const parent = e.target.closest('.place');
    const textDiv = parent.getElementsByClassName('place_description')[0];
    const id = parent.getAttribute('id');
    const now = e.target.checked;
    e.target.checked = !now;
    fetch(`https://webdev-task-2-dlcyypfzwd.now.sh/places/${id}`, {
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
    fetch('https://webdev-task-2-dlcyypfzwd.now.sh/places', {
        method: 'DELETE'
    }).then((res) => {
        if (res.status === 200) {
            const placesList = document.getElementsByClassName('place-view_places')[0];
            let list = document.getElementsByClassName('place');
            const howManyTimes = list.length;
            for (let i = 0; i < howManyTimes; i++) {
                placesList.removeChild(list[0]);
            }
        }
    });
};

const onClickItemChange = function (e) {
    const parent = e.target.closest('.place');
    const main = parent.getElementsByClassName('place_main')[0];
    const controlls = parent.getElementsByClassName('place_controlls')[0];
    const inputChange = parent.getElementsByClassName('place_input-сhange')[0];

    main.style.display = 'none';
    controlls.style.display = 'none';
    inputChange.style.display = 'flex';
};

const onClickHideItemChange = function (e) {
    const parent = e.target.closest('.place');
    const main = parent.getElementsByClassName('place_main')[0];
    const controlls = parent.getElementsByClassName('place_controlls')[0];
    const inputChange = parent.getElementsByClassName('place_input-сhange')[0];

    main.style.display = 'flex';
    controlls.style.display = 'flex';
    inputChange.style.display = 'none';
};

const onClickChangeItem = function (e) {
    const parent = e.target.closest('.place');
    const textInput = parent.getElementsByClassName('place_input')[0];
    const id = parent.getAttribute('id');
    const description = textInput.value;
    fetch(`https://webdev-task-2-dlcyypfzwd.now.sh/places/${id}`, {
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
            parent.getElementsByClassName('place_description')[0].innerHTML = description;
            onClickHideItemChange(e);
        }
    });
};

const onClickCreateBtn = function () {
    const descriptionText = document.getElementsByClassName('create-form_input')[0].value;
    console.info(descriptionText);
    fetch('https://webdev-task-2-dlcyypfzwd.now.sh/places', {
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
            document.getElementsByClassName('create-form_input')[0].value = '';
            let el = document.createElement('div');
            el.className = 'place';
            el.setAttribute('id', data.id);
            el.innerHTML = '<div class="place_main">' +
                '<div class="place_change-btn">🖋</div><div class="place_delete-btn">❌</div>' +
                `<div class="place_description">${descriptionText}</div></div>` +
                '<div class="place_controlls"><div class="place_dragdrop">🔀</div>' +
                '<input class="place_checkbox" type="checkbox"/></div>' +
                '<div class="place_input-сhange">' +
                `<input class="place_input" type="text" value="${descriptionText}"/>` +
                '<div class="place_cancel-btn">❌</div>' +
                '<div class="place_confirm-btn">✅</div></div>';
            document.getElementsByClassName('place-view_places')[0].appendChild(el);
            el.getElementsByClassName('place_delete-btn')[0].addEventListener('click',
                onClickDeleteItem, false);
            el.getElementsByClassName('place_checkbox')[0].addEventListener('change',
                onChangeCheckbox, false);
            el.getElementsByClassName('place_change-btn')[0].addEventListener('click',
                onClickItemChange, false);
            el.getElementsByClassName('place_cancel-btn')[0].addEventListener('click',
                onClickHideItemChange, false);
            el.getElementsByClassName('place_confirm-btn')[0].addEventListener('click',
                onClickChangeItem, false);
        });
};
