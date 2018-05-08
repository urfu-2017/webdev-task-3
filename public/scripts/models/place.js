'use strict';

class Place {
    constructor({ desc, id, isVisited }) {
        this.desc = desc;
        this.id = id;
        this.isVisited = isVisited;
        this.tag = createTag('places_list_item', 'li');
        placesList.appendChild(this.tag);
        const childs = this.createPlaceChilds();
        this.appendChilds(childs);
        this.appendEvents(childs);
    }

    appendEvents(childs) {
        const context = this;
        childs.delButton.onclick = this.del.bind(context);
        childs.editButton.onclick = this.edit.bind(context);
        childs.shiftButton.onclick = this.shift.bind(context);
        childs.switchVisitButton.onclick = this.switchVisitButton.bind(context, childs);
    }

    appendChilds(childs) {
        for (let child of Object.keys(childs)) {
            this.tag.appendChild(childs[child]);
        }
    }

    createPlaceChilds() {
        const delButton = createTag('places_list_item_delete', 'button');
        const editButton = createTag('places_list_item_edit', 'button');
        const p = createTag('places_list_item_name', 'p');
        p.innerHTML = this.desc;
        const shiftButton = createTag('places_list_item_shift', 'button');
        const switchVisitButton = createTag('places_list_item_novisit', 'button');
        if (this.isVisited) {
            switchVisitButton.className = 'places_list_item_visit';
        }

        return { delButton, editButton, p, shiftButton, switchVisitButton };
    }

    async del() {
        await placeApi.delete(this.id);
        placesList.removeChild(this.tag);
    }

    async switchVisitButton(childs) {
        if (childs.switchVisitButton.className === 'places_list_item_novisit') {
            childs.switchVisitButton.className = 'places_list_item_visit';
            await placeApi.edit(this.id, this.desc, true);
            this.isVisited = true;
        } else {
            childs.switchVisitButton.className = 'places_list_item_novisit';
            await placeApi.edit(this.id, this.desc, false);
            this.isVisited = false;
        }
    }

    async edit() {

    }

    async shift() {

    }
}

function createTag(htmlClass, htmlTag) {
    const tag = document.createElement(htmlTag);
    tag.className = htmlClass;

    return tag;
}
