import './styles.css';
import template from './template';
import Component from '../Component';

class PlacesList extends Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        return template({ greeter: this.props.greeter });
    }
}

export default PlacesList;
