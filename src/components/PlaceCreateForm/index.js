import './place-create-form.css';

import Component from '../Component';
import htmlToElement from '../../utils/html-to-element';

class PlaceCreateForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            elemClass = '',
            placeSubmitHanlder
        } = this.props;

        const form = htmlToElement(`
          <form class="place-create ${elemClass}">
            <input class="place-create__description text"
                   placeholder="Название места" 
                   type="text" size="30">
            <input type="submit" value="Создать">
          </form>
        `);

        form.addEventListener('submit', placeSubmitHanlder);

        return form;
    }
}

export default PlaceCreateForm;
