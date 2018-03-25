import './Main.css';

import Loader from '../Loader';
import Component from '../Component';
import SearchBox from '../SearchBox';
import PlacesList from '../PlacesList';
import PlacesHeader from '../PlacesHeader';
import PlaceCreateForm from '../PlaceCreateForm';
import PlaceManager from '../../models/place-manager';

import debounce from '../../utils/debounce';
import htmlToElement from '../../utils/html-to-element';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    updatePlacesList(newPlaces) {
        const newPlacesList = new PlacesList({
            elemClass: 'places-table__list',
            placeObjects: newPlaces
        }).render();

        document.querySelector('.places-table__list').replaceWith(newPlacesList);
    }

    render() {
        const { elemClass = '' } = this.props;

        const searchBox = new SearchBox({
            elemClass: 'main__search',
            updateCallback: this.updatePlacesList,
            searchQueryChangeHandler: PlaceManager.filter
        }).render();

        const placeCreateForm = new PlaceCreateForm({
            elemClass: 'main__place-form',
            updateCallback: this.updatePlacesList,
            placeSubmitHandler: PlaceManager.create
        }).render();

        const placesHeader = new PlacesHeader({
            elemClass: 'places-table__header',
            updateCallback: this.updatePlacesList,
            placesClearHandler: PlaceManager.clear,
            filterChangeHandler: PlaceManager.filter
        }).render();

        const placesList = new Loader({ elemClass: 'places-table__loader', size: 30 }).render();

        PlaceManager.load()
            .then(places => {
                placesList.replaceWith(new PlacesList({
                    elemClass: 'places-table__list',
                    placeObjects: places
                }).render());
            })
            .catch(err => placesList.replaceWith(htmlToElement(`${err}`)));

        const places = htmlToElement('<div class="places-table main__places"></div>');
        places.appendChild(placesHeader);
        places.appendChild(placesList);

        const main = htmlToElement(`<main class="main ${elemClass}"></main>`);
        main.appendChild(placeCreateForm);
        main.appendChild(searchBox);
        main.appendChild(places);

        return main;
    }
}

export default Main;
