'use strict';

const htmlCreateInput = document.getElementsByClassName('create_input')[0];
const htmlCreateButton = document.getElementsByClassName('create_button')[0];
const htmlPlacesAll = document.getElementsByClassName('places_all')[0];
const htmlSearchButton = document.getElementsByClassName('search_button')[0];
const htmlSearchInput = document.getElementsByClassName('search_input')[0];
const htmlPlacesListItems = document.getElementsByClassName('places_list_item');
const htmlPlacesClear = document.getElementsByClassName('places_clear')[0];
const htmlToVisitButton = document.getElementsByClassName('places_novisit')[0];
const htmlVisitedButton = document.getElementsByClassName('places_visit')[0];
const htmlPlacesList = document.getElementsByClassName('places_list')[0];

function createPlace({ desc, id, isVisited }) {
    const p = createTag('places_list_item_name', 'p');
    const li = createTag('places_list_item', 'li');
    const delButton = createTag('places_list_item_delete', 'button');
    const editButton = createTag('places_list_item_edit', 'button');
    const shiftButton = createTag('places_list_item_shift', 'button');
    const novisitButton = createTag('places_list_item_novisit', 'button');
    p.innerHTML = desc;
    li.id = id;
    li.desc = desc;
    li.isVisited = isVisited;
    li.appendChild(delButton);
    li.appendChild(editButton);
    li.appendChild(p);
    li.appendChild(shiftButton);
    li.appendChild(novisitButton);
    htmlPlacesList.appendChild(li);
    delButton.onclick = async function () {
        await placeApi.delete(li.id);
        htmlPlacesList.removeChild(li);
    };
    editButton.onclick = async function () {

    };
    shiftButton.onclick = async function () {

    };
    novisitButton.onclick = async function () {

    };
}

function createTag(htmlClass, htmlTag) {
    const tag = document.createElement(htmlTag);
    tag.className = htmlClass;

    return tag;
}
