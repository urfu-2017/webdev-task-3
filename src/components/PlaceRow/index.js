import './PlaceRow.css';

import Loader from '../Loader';
import Component from '../Component';
import PlaceManager from '../../models/place-manager';
import htmlToElement from '../../utils/html-to-element';

const rejectChangesButton = htmlToElement(`
  <button class="place-control-toggler place-row__reject" type="button"></button>
`);
const approveChangesButton = htmlToElement(`
  <button class="place-control-toggler place-row__approve" type="button"></button>
`);
const editButton = htmlToElement(`
  <button class="place-control-toggler place-row__edit" type="button"></button>
`);
const deleteButton = htmlToElement(`
  <button class="place-row__delete" type="button"></button>
`);

class PlaceRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const description = htmlToElement(`
            <div class="place-row__description">${this.props.place.description}</div>
        `);
        const reorder = htmlToElement(`
            <div class="place-row__reorder"></div>
        `);
        const status = htmlToElement(`
            <input class="place-row__status" type="checkbox">
        `);

        if (this.props.place.isVisited) {
            status.checked = true;
        }

        const row = htmlToElement(`
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

PlaceRow.switchControlsHandler = e => {
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

PlaceRow.editRejectHandler = e => {
    if (!e.target.classList.contains('place-row__reject')) {
        return;
    }

    const row = e.target.parentNode;
    const descriptionElem = row.querySelector('.place-row__description');
    descriptionElem.innerHTML = descriptionElem.dataset.originalText;
};

PlaceRow.editApproveHandler = async e => {
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
            PlaceRow.editRejectHandler(e);
        }

        loader.replaceWith(approveButton);
        PlaceRow.switchControlsHandler(e);
    }
};

export default PlaceRow;
