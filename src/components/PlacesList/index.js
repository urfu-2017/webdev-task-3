import './styles.css';
import template from './template';

class PlacesList {
    constructor(props) {
        this.props = props;
    }

    render() {
        return template({ greeter: this.props.greeter });
    }
}

export default PlacesList;
