import './PlaceList.css';

import PlaceRow from '../PlaceRow';
import Component from '../Component';
import htmlToElement from '../../utils/html-to-element';

class PlacesList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            elemClass = '',
            placeObjects
        } = this.props;

        const list = htmlToElement(`<div class="places-list ${elemClass}"></div>`);

        placeObjects.forEach(place => {
            list.appendChild(new PlaceRow({ place: place }).render());
        });

        return list;
    }
}

export default PlacesList;
