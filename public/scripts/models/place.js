'use strict';

function createPlace({ desc, id, isVisited }) {
    const li = createTag('places_list_item', 'li');
    placesList.appendChild(li);
    li.id = id;
    li.desc = desc;
    li.isVisited = isVisited;
    const childs = createPlaceChilds(desc, isVisited);
    appendChilds(li, childs);
    appendEvents(li, childs);
}

function appendEvents(li, childs) {
    childs.delButton.onclick = async function () {
        await placeApi.delete(li.id);
        placesList.removeChild(li);
    };
    childs.editButton.onclick = async function () {

    };
    childs.shiftButton.onclick = async function () {
        await placeApi.insert(li.id, indexTo);
    };
    childs.switchVisitButton.onclick = async function () {
        if (childs.switchVisitButton.className === 'places_list_item_novisit') {
            childs.switchVisitButton.className = 'places_list_item_visit';
            await placeApi.edit(li.id, li.desc, true);
            li.isVisited = true;
        } else {
            childs.switchVisitButton.className = 'places_list_item_novisit';
            await placeApi.edit(li.id, li.desc, false);
            li.isVisited = false;
        }
    };
}

function appendChilds(parent, childs) {
    for (let child of Object.keys(childs)) {
        parent.appendChild(childs[child]);
    }
}

function createPlaceChilds(desc, isVisited) {
    const delButton = createTag('places_list_item_delete', 'button');
    const editButton = createTag('places_list_item_edit', 'button');
    const p = createTag('places_list_item_name', 'p');
    p.innerHTML = desc;
    const shiftButton = createTag('places_list_item_shift', 'button');
    const switchVisitButton = createTag('places_list_item_novisit', 'button');
    if (isVisited) {
        switchVisitButton.className = 'places_list_item_visit';
    }

    return { delButton, editButton, p, shiftButton, switchVisitButton };
}

function createTag(htmlClass, htmlTag) {
    const tag = document.createElement(htmlTag);
    tag.className = htmlClass;

    return tag;
}
