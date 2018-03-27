import './SearchBox.css';

import Component from '../Component';

class SearchBox extends Component {
    _renderInput(handler, updateCallback) {
        const elem = Component.htmlToElement(`
            <input class="search-box__input text" type="text" placeholder="Поиск" size="30">
        `);
        elem.addEventListener('input', e => {
            updateCallback(handler({ query: e.target.value }));
        });

        return elem;
    }

    render() {
        const { elemClass = '', updateCallback, onSearchQueryChange } = this.props;

        const searchBox = Component.htmlToElement(`<div class="search-box ${elemClass}"></div>`);
        searchBox.appendChild(this._renderInput(onSearchQueryChange, updateCallback));

        return searchBox;
    }
}

export default SearchBox;
