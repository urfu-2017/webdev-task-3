import './Footer.css';

import Component from '../Component';

class Footer extends Component {
    render() {
        const { elemClass = '' } = this.props;

        return Component.htmlToElement(`
          <footer class="footer ${elemClass}">
            <div class="copyright footer__copyright">
              © <span class="copyright__name">evgenymarkov</span> 2018
            </div>
          </footer>
        `);
    }
}

export default Footer;
