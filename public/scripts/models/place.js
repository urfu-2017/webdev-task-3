'use strict';
/* eslint-disable */

class Place {
    constructor({ desc, id, isVisited }) {
        this.tag = createTag('places_list_item', 'li');
        this.tag.desc = desc;
        this.tag.id = id;
        this.tag.isVisited = isVisited;
        placesList.appendChild(this.tag);
        const childs = this.createPlaceChilds();
        const editChilds = this.createEditChilds();
        this.appendChilds(this.tag, childs);
        this.appendChilds(this.tag, editChilds);
        this.appendEvents(childs, editChilds);
        this.appendEditEvents(childs, editChilds);
    }

    appendEvents(childs, editChilds) {
        const context = this;
        childs.delButton.onclick = this.del.bind(context);
        childs.editButton.onclick = this.edit.bind(context, childs, editChilds);
        childs.shiftButtonUp.onclick = this.shift.bind(context, true);
        childs.shiftButtonDown.onclick = this.shift.bind(context, false);
        childs.switchVisitButton.onclick = this.switchVisitButton.bind(context, childs);
    }

    appendEditEvents(childs, editChilds) {
        const context = this;
        editChilds.editCancel.onclick = this.cancel.bind(context, childs, editChilds);
        editChilds.editOk.onclick = this.editOk.bind(context, childs, editChilds);
    }

    appendChilds(parent, childs) {
        for (let child of Object.keys(childs)) {
            parent.appendChild(childs[child]);
        }
    }

    createPlaceChilds() {
        const delButton = createTag('places_list_item_delete', 'button');
        const editButton = createTag('places_list_item_edit', 'button');
        const input = createTag('places_list_item_name', 'input');
        input.value = this.tag.desc;
        input.setAttribute('disabled', true);
        const shiftButtonUp = createTag('places_list_item_shift_up', 'button');
        const shiftButtonDown = createTag('places_list_item_shift_down', 'button');
        const switchVisitButton = createTag('places_list_item_novisit', 'button');
        if (this.tag.isVisited) {
            switchVisitButton.className = 'places_list_item_visit';
        }

        return { delButton, editButton, input, shiftButtonUp, shiftButtonDown, switchVisitButton };
    }

    createEditChilds() {
        const editCancel = createTag('places_list_item_edit_cancel', 'button');
        editCancel.textContent = '✘';
        editCancel.style.display = 'none';
        const editOk = createTag('places_list_item_edit_ok', 'button');
        editOk.textContent = '✔';
        editOk.style.display = 'none';

        return { editCancel, editOk };
    }

    async del() {
        await placeApi.delete(this.tag.id);
        placesList.removeChild(this.tag);
    }

    async switchVisitButton(childs) {
        if (childs.switchVisitButton.className === 'places_list_item_novisit') {
            childs.switchVisitButton.className = 'places_list_item_visit';
            await placeApi.edit(this.tag.id, this.tag.desc, true);
            this.tag.isVisited = true;
        } else {
            childs.switchVisitButton.className = 'places_list_item_novisit';
            await placeApi.edit(this.tag.id, this.tag.desc, false);
            this.tag.isVisited = false;
        }
    }

    async edit(childs, editChilds) {
        childs.input.removeAttribute('disabled');
        editChilds.editCancel.style.display = 'inline-block';
        editChilds.editOk.style.display = 'inline-block';
        childs.shiftButtonUp.style.display = 'none';
        childs.shiftButtonDown.style.display = 'none';
        childs.switchVisitButton.style.display = 'none';
    }

    async editOk(childs, editChilds) {
        console.info(childs.input.value);
        await placeApi.edit(this.tag.id, childs.input.value, this.tag.isVisited);
        this.tag.desc = childs.input.value;
        this.cancel(childs, editChilds);
    }

    async cancel(childs, editChilds) {
        childs.input.value = this.tag.desc;
        childs.input.setAttribute('disabled', true);
        editChilds.editCancel.style.display = 'none';
        editChilds.editOk.style.display = 'none';
        childs.shiftButtonUp.style.display = 'inline-block';
        childs.shiftButtonDown.style.display = 'inline-block';
        childs.switchVisitButton.style.display = 'inline-block';
    }

    async shift(up) {
        const index = findPlaceIndexById(this.tag.id);
        if (this.tag.previousSibling !== null && up) {
            await placeApi.insert(this.tag.id, index - 1);
            this.tag.parentElement.insertBefore(this.tag, this.tag.previousSibling);
            places.splice(index - 1, 0, places[index]);
            places.splice(index + 1, 1);
        }
        if (this.tag.nextSibling !== null && !up) {
            await placeApi.insert(this.tag.id, index + 1);
            this.tag.parentElement.insertBefore(this.tag.nextSibling, this.tag);
            places.splice(index + 2, 0, places[index]);
            places.splice(index, 1);
        }
    }
}

function findPlaceIndexById(id) {
    for (let i = 0; i < places.length; i++) {
        if (Number(places[i].tag.id) === Number(id)) {

            return i;
        }
    }
}

function createTag(htmlClass, htmlTag) {
    const tag = document.createElement(htmlTag);
    tag.className = htmlClass;

    return tag;
}
