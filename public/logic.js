'use sctrict';

/* eslint no-undef: false */

const creations = function () {
    var createBtn = document.getElementsByClassName('create-form_btn')[0];
    createBtn.addEventListener('click', onClickCreateBtn, false);

    var searchInput = document.getElementsByClassName('search_input')[0];
    searchInput.addEventListener('keyup', onSearchChange, false);

    var tumbs = document.getElementsByClassName('filter-box_tumbs')[0].children;
    for (let i = 0; i < tumbs.length; i++) {
        tumbs[i].addEventListener('click', onSearchChange, false);
    }
};

const deletes = function () {
    var deleteItemBtns = document.getElementsByClassName('place_delete-btn');
    for (let i = 0; i < deleteItemBtns.length; i++) {
        deleteItemBtns[i].addEventListener('click', onClickDeleteItem, false);
    }

    var deleteAllBtn = document.getElementsByClassName('filter-box_delete-all')[0];
    deleteAllBtn.addEventListener('click', onClickDeleteAll, false);
};

const changes = function () {
    var checkboxs = document.getElementsByClassName('place_checkbox');
    for (let i = 0; i < checkboxs.length; i++) {
        checkboxs[i].addEventListener('change', onChangeCheckbox, false);
    }

    var confirms = document.getElementsByClassName('place_confirm-btn');
    for (let i = 0; i < confirms.length; i++) {
        confirms[i].addEventListener('click', onClickChangeItem, false);
    }

    var changeItemBtns = document.getElementsByClassName('place_change-btn');
    for (let i = 0; i < changeItemBtns.length; i++) {
        changeItemBtns[i].addEventListener('click', onClickItemChange, false);
    }

    var hideChangeBtns = document.getElementsByClassName('place_cancel-btn');
    for (let i = 0; i < hideChangeBtns.length; i++) {
        hideChangeBtns[i].addEventListener('click', onClickHideItemChange, false);
    }
};

window.onload = async function () {
    // Разделил на подгруппы для удобства
    creations();
    deletes();
    changes();
};
