import './Header.css';

import Component from '../Component';

class Header extends Component {
    render() {
        const { elemClass = '' } = this.props;

        return Component.htmlToElement(`
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
