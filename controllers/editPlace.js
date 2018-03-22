'use strict';

const fetch = require('node-fetch');

// const generate = require('./listCreator');

let editNameButtons = document.getElementsByClassName('place__delete');
Array.prototype.slice.call(editNameButtons, 0);

const editPlace = async (values) => {
    return await fetch('https://webdev-task-2-dylksngchm.now.sh/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'plain/text' },
        body: values
    });
};

function forEachGenerate(newList) {
    Array.prototype.forEach.call(newList, place => {
        generate(place);
    });
}

Array.prototype.forEach.call(editNameButtons, (button, index) => {
    button.addEventListener('click', () => {
        const cancel = document.getElementsByClassName('place__edit_cancel')[index];
        const accept = document.getElementsByClassName('place__edit_accept')[index];
        cancel.style.visibility = 'hidden';
        accept.style.visibility = 'hidden';
        const name = document.getElementsByClassName('place__name')[index];
        const currentName = name.value;
        const editName = document.getElementsByClassName('place__name_edit')[index];
        name.style.display = 'none';
        editName.style.display = 'block';
        editName.value = currentName;

        accept.addEventListener('click', () => {
            const newName = editName.value;
            name.style.display = 'block';
            editName.value = '';
            editName.style.display = 'none';
            const newList = editPlace({
                name: name,
                newName: newName
            });
            forEachGenerate(newList);
            cancel.style.visibility = 'visible';
            accept.style.visibility = 'visible';
        });

        cancel.addEventListener('click', () => {
            name.style.display = 'block';
            editName.value = '';
            editName.style.display = 'none';
            cancel.style.visibility = 'visible';
            accept.style.visibility = 'visible';
        });
    });
});

function generate({ name, description, created, isVisited }) {
    let list = document.getElementsByClassName('list')[0];

    let hr = document.createElement('hr');
    hr.className = 'hr-small';
    list.appendChild(hr);

    const listLength = list.childElementCount;
    let newPLace = document.createElement('section');
    newPLace.className = 'place';
    newPLace.innerHTML = `<div class="place__title">
        <input type="image" src="/pics/edit.svg" alt="" class="place__edit">
        <input type="image" src="/pics/delete.svg" alt="" class="place__delete">
        <div class="place__name">${name}</div>
        <input type="text" class="place__name_edit" name="nameEdit">
        <input type="image" src="/pics/cancel.svg" alt="" class="place__edit_cancel">
        <input type="image" src="/pics/accept.svg" alt="" class="place__edit_accept">
    </div>
    <div class="place__description">${description}</div>
    <div class="place__create-date">
        <div>Добавлено</div>
        <div>${created}</div>
    </div>
    <input type="checkbox" name="isVisit"
    id="visit_checkbox_${listLength}" class="place__visited_checkbox">
    <label for="visit_checkbox_${listLength}" class="place__visited">`;
    list.appendChild(newPLace);

    if (isVisited) {
        const inputIdStr = 'visit_checkbox_' + listLength;
        document.getElementById(inputIdStr).checked = true;
    }
}
