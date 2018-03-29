'use strict';

class PlaceView {
    constructor(place) {
        this.place = place;
    }

    get htmlElement() {
        return this.article;
    }

    createArticle(name, description, checked) {
        description = description || name;
        checked = checked ? 'checked' : '';
        const article = document.createElement('article');
        article.setAttribute('class', 'places__item');
        article.innerHTML = `<div class="places__control control">
                <div class="control__imgs">
                    <img src="imgs/editing.png" 
                        alt="Изображение карандаша" 
                            class="places__editing-control editing-control"> 
                    <img src="imgs/basket.png" 
                        alt="Изображение корзины" class="places__deleting-control deleting-control">
                </div>
                <p class="control__text text">${ name }</p>
            </div>
            <div class=" places__control places__changes-control changes-control hidden">
                <input type="text" value=${ description } class="control__text text">
                <span class="save"> &#10004; </span>
                <span class="close"> &#10008; </span>
            </div>
            <div class="places__control">
                <p class="places__moving-control">
                    <span class="place__arow_bottom place__arow bottom"> &#11015; </span>
                    <span class="place__arow_top place__arow top"> &#11014; </span>
                </p>
                <input type="checkbox" class="places__checked-control" ${ checked }>
            </div>
        `;
        this.article = article;
    }

    getDeletedControl() {
        return this.article.getElementsByClassName('deleting-control')[0];
    }

    getVisitedControl() {
        return this.article.lastElementChild.lastElementChild;
    }

    createEditingControl() {
        const editingControl = this.article.getElementsByClassName('editing-control')[0];
        editingControl.addEventListener('click', () => {
            const control = this.article.getElementsByClassName('control')[0];
            addControlClass(control, 'hidden');
            let changesControl = this.getChangesControl();
            deleteControlClass(changesControl, 'hidden');
            addRevokingChangesControl(changesControl);
        });
    }

    getChangesControl() {
        return this.article.getElementsByClassName('changes-control')[0];
    }

    getBottomControl() {
        return this.article.getElementsByClassName('bottom')[0];
    }

    getTopControl() {
        return this.article.getElementsByClassName('top')[0];
    }

    getSaveControl() {
        return this.article.getElementsByClassName('save')[0];
    }

    getDescription() {
        return this.article.getElementsByClassName('text')[1].value;
    }

    showElement(element) {
        addControlClass(element, 'hidden');
    }

    hideElement(element) {
        deleteControlClass(element, 'hidden');
    }

    setTextStyle(isDecoration) {
        const text = this.article.getElementsByClassName('text')[0];
        text.style.textDecoration = isDecoration ? 'line-through' : 'none';
    }
}

function addRevokingChangesControl(changesControl) {
    let control = changesControl.getElementsByClassName('close')[0];
    control.addEventListener('click', () => {
        deleteControlClass(changesControl.previousElementSibling, 'hidden');
        addControlClass(changesControl, 'hidden');
    });
}

function addControlClass(control, className) {
    control.classList.add(className);
}

function deleteControlClass(control, className) {
    control.classList.remove(className);
}

module.exports = PlaceView;
