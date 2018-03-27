import './Loader.css';

import Component from '../Component';

class Loader extends Component {
    constructor(props) {
        super(props, {
            color: '#f00',
            modifier: 'loader_block'
        });
    }

    render() {
        return Component.htmlToElement(`
          <div class="loader ${this.props.modifier} ${this.props.elemClass}">
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
