import Input from '../common/input';
import Button from '../common/button';
import Checkbox from '../common/checkbox';
import Control from '../control';
import Title from '../common/title';
import api from '../api';

export default class Place extends Control {
    constructor(place, loader) {
        super('place');
        this.place = place;
        this.loader = loader;

        this.editButton = new Button({
            className: 'place__btn btn btn_edit',
            clickHandler: () => this.edit()
        });
        this.deleteButton = new Button({
            className: 'place__btn btn btn_delete',
            clickHandler: async () => await this.delete()
        });

        this.saveButton = new Button({
            className: 'place__btn btn btn_save',
            clickHandler: async () => await this.save()
        });
        this.undoButton = new Button({
            className: 'place__btn btn btn_undo',
            clickHandler: () => this.undo()
        });
        this.titleInput = new Input({
            className: 'place__input',
            enterHandler: async () => await this.save(),
            maxLength: 22
        });

        this.title = new Title({
            className: 'place__titleText',
            value: this.place.title
        });
        this.visitedCheckbox = new Checkbox({
            className: 'place__checkbox',
            clickHandler: async () => await this.toggleVisited(),
            checked: this.place.visited
        });
    }

    normal() {
        this.hideAll();
        this.title.show();
        this.visitedCheckbox.show();
    }

    hover() {
        this.normal();
        this.editButton.show();
        this.deleteButton.show();
    }

    edit() {
        this.hideAll();
        this.titleInput.setValue(this.title.getValue());
        this.titleInput.show();
        this.titleInput.elem.focus();
        this.saveButton.show();
        this.undoButton.show();
    }

    async delete() {
        this.loader.show();
        await api.deletePlace(this.place);
        this.elem.outerHTML = '';
        if (this.ondelete) {
            this.ondelete();
        }
        this.loader.hide();
    }

    async save() {
        this.loader.show();
        const newTitle = this.titleInput.getValue();
        this.place.title = newTitle;
        await api.updatePlace(this.place);
        this.title.setValue(newTitle);
        this.hover();
        this.loader.hide();
    }

    undo() {
        this.hover();
    }

    async toggleVisited() {
        this.loader.show();
        this.place.visited = this.visitedCheckbox.checked;
        await api.updatePlace(this.place);
        this.loader.hide();
    }

    hideAll() {
        this.editButton.hide();
        this.deleteButton.hide();
        this.saveButton.hide();
        this.undoButton.hide();
        this.titleInput.hide();
        this.title.hide();
        this.visitedCheckbox.hide();
    }

    createControls() {
        const controls = document.createElement('div');
        controls.classList = 'place__controls';
        controls.appendChild(this.editButton.render());
        controls.appendChild(this.deleteButton.render());

        controls.appendChild(this.saveButton.render());
        controls.appendChild(this.undoButton.render());

        return controls;
    }

    createTitle() {
        const title = document.createElement('div');
        title.className = 'place__title';
        title.appendChild(this.titleInput.render());
        title.appendChild(this.title.render());

        return title;
    }

    createVisit() {
        const visit = document.createElement('div');
        visit.className = 'place__visit';
        visit.appendChild(this.visitedCheckbox.render());

        return visit;
    }

    createElement() {
        const controls = this.createControls();
        const title = this.createTitle();
        const visit = this.createVisit();

        const placeElement = document.createElement('div');
        placeElement.appendChild(controls);
        placeElement.appendChild(title);
        placeElement.appendChild(visit);
        placeElement.onmouseenter = () => this.hover();
        placeElement.onmouseleave = () => this.normal();

        this.normal();

        return placeElement;
    }
}
