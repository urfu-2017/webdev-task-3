import './PlaceRow.css';
import Component from '../Component';
import htmlToElement from '../../utils/html-to-element';

class PlaceRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const editButton = htmlToElement(`
            <button type="button" class="place-row__edit"></button>
        `);
        const deleteButton = htmlToElement(`
            <button type="button" class="place-row__delete"></button>
        `);
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
          </div>`
        );

        [editButton, deleteButton, description, reorder, status].forEach(elem => {
            row.appendChild(elem);
        });

        return row;
    }


}

export default PlaceRow;
