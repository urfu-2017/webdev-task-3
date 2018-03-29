'use sctrict';

/* eslint no-undef: 0 */

const creations = function () {
    const createBtn = document.querySelector('.create-form__btn');
    createBtn.addEventListener('click', onClickCreateBtn, false);

    const searchInput = document.querySelector('.search__input');
    searchInput.addEventListener('keyup', onSearchChange, false);

    const tumbs = document.querySelector('.filter-box__tumbs').children;
    for (let i = 0; i < tumbs.length; i++) {
        tumbs[i].addEventListener('click', onSearchChange, false);
    }
};

const deletes = function () {
    const deleteItemBtns = document.querySelectorAll('.place__delete-btn');
    for (let i = 0; i < deleteItemBtns.length; i++) {
        deleteItemBtns[i].addEventListener('click', onClickDeleteItem, false);
    }

    const deleteAllBtn = document.querySelector('.filter-box__delete-all');
    deleteAllBtn.addEventListener('click', onClickDeleteAll, false);
};

const changes = function () {
    const checkboxs = document.querySelectorAll('.place__checkbox');
    for (let i = 0; i < checkboxs.length; i++) {
        checkboxs[i].addEventListener('change', onChangeCheckbox, false);
    }

    const confirms = document.querySelectorAll('.place__confirm-btn');
    for (let i = 0; i < confirms.length; i++) {
        confirms[i].addEventListener('click', onClickChangeItem, false);
    }

    const changeItemBtns = document.querySelectorAll('.place__change-btn');
    for (let i = 0; i < changeItemBtns.length; i++) {
        changeItemBtns[i].addEventListener('click', onClickItemChange, false);
    }

    const hideChangeBtns = document.querySelectorAll('.place__cancel-btn');
    for (let i = 0; i < hideChangeBtns.length; i++) {
        hideChangeBtns[i].addEventListener('click', onClickHideItemChange, false);
    }
};

window.onload = function () {
    // Разделил на подгруппы для удобства
    creations();
    deletes();
    changes();

    // Получение изначальных
    fetch('https://webdev-task-2-cgybyopdlr.now.sh/places', {
        method: 'GET'
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                createElement(data[i].id, data[i].description, data[i].visited);
            }
        });
};
