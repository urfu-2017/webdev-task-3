import './Loader.css';
import Component from '../Component';
import htmlToElement from '../../utils/html-to-element';

class Loader extends Component {
    constructor(props) {
        super(props);

        this.props.color = this.props.color
            ? this.props.color
            : 'red';
        this.props.modifierClass = this.props.modifier
            ? `loader_${this.props.modifier}`
            : 'loader_block';
    }

    render() {
        return htmlToElement(`
          <div class="loader ${this.props.modifierClass} ${this.props.elemClass}">
            <svg class="loader__image" viewBox="25 25 50 50">
              <circle class="loader__image__path"
                      r="20" cx="50" cy="50"
                      fill="none" stroke=${this.props.color}
                      stroke-width="3" stroke-miterlimit="10">
            </svg>
          </div>
        `);
    }
}

export default Loader;
