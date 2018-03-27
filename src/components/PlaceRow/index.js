import './PlaceRow.css';

import Loader from '../Loader';
import Component from '../Component';
import PlaceManager from '../../models/place-manager';

const rejectChangesButton = Component.htmlToElement(`
  <button class="place-control-toggler place-row__reject" type="button"></button>
`);
const approveChangesButton = Component.htmlToElement(`
  <button class="place-control-toggler place-row__approve" type="button"></button>
`);
const editButton = Component.htmlToElement(`
  <button class="place-control-toggler place-row__edit" type="button"></button>
`);
const deleteButton = Component.htmlToElement(`
  <button class="place-row__delete" type="button"></button>
`);

class PlaceRow extends Component {
    render() {
        const description = Component.htmlToElement(`
            <div class="place-row__description">${this.props.place.description}</div>
        `);
        const reorder = Component.htmlToElement(`
            <div class="place-row__reorder"></div>
        `);
        const status = Component.htmlToElement(`
            <input class="place-row__status" type="checkbox">
        `);

        if (this.props.place.isVisited) {
            status.checked = true;
        }

        const row = Component.htmlToElement(`
          <div class="place-row" 
               draggable="true"
               data-place-id="${this.props.place.id}">     
          </div>`);

        [editButton.cloneNode(), deleteButton.cloneNode(), description, reorder, status].forEach(
            elem => {
                row.appendChild(elem);
            }
        );

        return row;
    }
}

PlaceRow.onSwitchControls = e => {
    if (!e.target.classList.contains('place-control-toggler')) {
        return;
    }

    const row = e.target.parentNode;
    if (!row || !row.classList.contains('place-row')) {
        return;
    }

    const descriptionElem = row.querySelector('.place-row__description');

    if (descriptionElem.contentEditable === 'true') {
        row.querySelector('.place-row__reject').replaceWith(editButton.cloneNode());
        row.querySelector('.place-row__approve').replaceWith(deleteButton.cloneNode());
    } else {
        row.querySelector('.place-row__edit').replaceWith(rejectChangesButton.cloneNode());
        row.querySelector('.place-row__delete').replaceWith(approveChangesButton.cloneNode());

        descriptionElem.dataset.originalText = descriptionElem.innerHTML;
        descriptionElem.focus();
    }

    descriptionElem.contentEditable = descriptionElem.contentEditable === 'true' ? 'false' : 'true';
};

PlaceRow.onEditReject = e => {
    if (!e.target.classList.contains('place-row__reject')) {
        return;
    }

    const row = e.target.parentNode;
    const descriptionElem = row.querySelector('.place-row__description');
    descriptionElem.innerHTML = descriptionElem.dataset.originalText;
};

PlaceRow.onEditApprove = async e => {
    if (!e.target.classList.contains('place-row__approve')) {
        return;
    }

    const loader = new Loader({ elemClass: 'place-row__approve-loader' }).render();

    const approveButton = e.target;
    const row = approveButton.parentNode;
    row.querySelector('.place-row__reject').style.visibility = 'hidden';
    const descriptionElem = row.querySelector('.place-row__description');

    if (descriptionElem.innerHTML !== descriptionElem.dataset.originalText) {
        approveButton.replaceWith(loader);

        try {
            const editedPlace = await PlaceManager.edit(row.dataset.placeId, {
                description: descriptionElem.innerHTML.trim()
            });
            descriptionElem.innerHTML = editedPlace.description;
        } catch (err) {
            PlaceRow.onEditReject(e);
        }

        loader.replaceWith(approveButton);
        PlaceRow.onSwitchControls(e);
    }
};

export default PlaceRow;
