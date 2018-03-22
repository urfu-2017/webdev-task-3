import './footer.css';

import Component from '../Component';
import htmlToElement from '../../utils/html-to-element';

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { elemClass = '' } = this.props;

        return htmlToElement(`
          <footer class="footer ${elemClass}">
            <div class="copyright footer__copyright">
              © <span class="copyright__name">evgenymarkov</span> 2018
            </div>
          </footer>
        `);
    }
}

export default Footer;
