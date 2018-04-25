'use strict';

import Control from '../control';
import Place from './place';
import api from '../api';

export default class PlaceContainer extends Control {
    constructor(places, loader) {
        super('place-container');
        this.loader = loader;
        this.places = places.map(p => new Place(p, loader));
        this.draggedId = '';
    }

    filter(predicate) {
        this.places.forEach(p => {
            p.show();
            if (!predicate(p.place)) {
                p.hide();
            }
        });
    }

    async addPlace(title) {
        this.loader.show();
        const place = await api.createPlace(title);
        const placeControl = new Place({
            title: title,
            visited: false
        }, this.loader);
        this.renderToElement(placeControl, this.elem);
        this.places.push(placeControl);
        placeControl.place.id = place.id;
        this.loader.hide();
    }

    renderToElement(placeControl, elem) {
        elem.appendChild(placeControl.render());
        this.setupDragAndDrop(placeControl);
        placeControl.ondelete = () => {
            this.places = this.places.filter(p => p !== placeControl);
        };

        return placeControl;
    }
    setupDragAndDrop(placeControl) {
        placeControl.elem.draggable = true;
        placeControl.elem.ondragstart = () => {
            this.draggedId = placeControl.place.id;
        };
        placeControl.elem.ondragover = ev => {
            ev.preventDefault();
        };
        placeControl.elem.ondragenter = () => {
            this.droppedId = placeControl.place.id;
            placeControl.elem.style.background = '#eee';
        };
        placeControl.elem.ondragleave = () => {
            placeControl.elem.style.background = '#fff';
        };
        placeControl.elem.ondrop = async () => {
            this.loader.show();
            await api.reorder(this.draggedId, this.droppedId);
            placeControl.elem.style.background = '#fff';
            this.updateOrder(this.draggedId, this.droppedId);
            this.elem.innerHTML = '';
            this.places.forEach(p => this.elem.appendChild(p.elem));
            this.loader.hide();
        };
    }

    updateOrder(draggedId, droppedId) {
        const oldIndex = this.places.findIndex(p => p.place.id === draggedId);
        const newIndex = this.places.findIndex(p => p.place.id === droppedId);

        const item = this.places[oldIndex];
        if (newIndex > oldIndex) {
            this.places.splice(
                oldIndex,
                newIndex - oldIndex,
                ...this.places.slice(oldIndex + 1, newIndex + 1));
        } else if (newIndex < oldIndex) {
            this.places.splice(
                newIndex + 1,
                oldIndex - newIndex,
                ...this.places.slice(newIndex, oldIndex)
            );
        }
        this.places[newIndex] = item;
    }

    createElement() {
        var placeContainer = document.createElement('div');
        this.places.forEach(p => {
            this.renderToElement(p, placeContainer);
        });

        return placeContainer;
    }

}
