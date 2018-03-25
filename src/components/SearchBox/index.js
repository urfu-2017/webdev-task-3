import './SearchBox.css';

import Component from '../Component';
import htmlToElement from '../../utils/html-to-element';

class SearchBox extends Component {
    constructor(props) {
        super(props);
    }

    _renderInput(handler, updateCallback) {
        const elem = htmlToElement(`
            <input class="search-box__input text" type="text" placeholder="Поиск" size="30">
        `);
        elem.addEventListener('input', (e) => {
            updateCallback(handler({ query: e.target.value }));
        });

        return elem;
    }

    render() {
        const {
            elemClass = '',
            updateCallback,
            searchQueryChangeHandler
        } = this.props;

        const searchBox = htmlToElement(`<div class="search-box ${elemClass}"></div>`);
        searchBox.appendChild(this._renderInput(searchQueryChangeHandler, updateCallback));

        return searchBox;
    }
}

export default SearchBox;
