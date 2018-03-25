import './Header.css';

import Component from '../Component';
import htmlToElement from '../../utils/html-to-element';

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { elemClass = '' } = this.props;

        return htmlToElement(`
          <header class="header ${elemClass}">
            <h1 class="header__title">
              <span class="header__brand">Pavel</span>
              <span class="header__project">Travel</span>
            </h1>
          </header>
        `);
    }
}

export default Header;
