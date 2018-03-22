import './search-box.css';

import Component from '../Component';
import htmlToElement from '../../utils/html-to-element';

class SearchBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { elemClass = '' } = this.props;

        return htmlToElement(`
            <div class="search-box ${elemClass}">
              <input class="search-box__input text" type="text" placeholder="Поиск" size="30">
            </div>
        `);
    }
}

export default SearchBox;
