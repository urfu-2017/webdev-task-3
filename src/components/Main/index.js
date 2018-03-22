import './main.css';

import Component from '../Component';
import SearchBox from '../SearchBox';
import PlaceCreateForm from '../PlaceCreateForm';
import htmlToElement from '../../utils/html-to-element';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    searchQueryChangeHandler(e) {
        e.preventDefault();
        console.log(e);
    }

    placeSubmitHanlder(e) {
        e.preventDefault();
        console.log(e);
    }

    render() {
        const { elemClass = '' } = this.props;

        const searchBox = new SearchBox({
            elemClass: 'main__search',
            searchQueryChangeHandler: this.searchQueryChangeHandler
        }).render();
        const placeCreateForm = new PlaceCreateForm({
            elemClass: 'main__place-form',
            placeSubmitHanlder: this.placeSubmitHanlder
        }).render();

        const main = htmlToElement(`<main class="main ${elemClass}"></main>`);
        main.appendChild(searchBox);
        main.appendChild(placeCreateForm);

        return main;
    }
}

export default Main;
