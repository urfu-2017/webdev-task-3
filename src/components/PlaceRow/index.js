import './PlaceRow.css';
import Component from '../Component';
import htmlToElement from '../../utils/html-to-element';

class PlaceRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const row = htmlToElement('<div class="place-row" draggable="true"></div>');
        row.appendChild(htmlToElement(`
            <div class="place-row__description">${this.props.place.description}</div>
        `));

        const reorder = htmlToElement(`
            <div class="place-row__reorder"></div>
        `);

        const status = htmlToElement(`
            <input class="place-row__status" type="checkbox">
        `);

        if (this.props.place.isVisited) {
            status.checked = true;
        }

        row.appendChild(reorder);
        row.appendChild(status);

        return row;
    }
}

export default PlaceRow;
