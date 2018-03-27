import './PlaceCreateForm.css';

import Loader from '../Loader';
import Component from '../Component';
import htmlToElement from '../../utils/html-to-element';

class PlaceCreateForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { elemClass = '', updateCallback, placeSubmitHandler } = this.props;

        const form = htmlToElement(`
          <form class="place-create ${elemClass}" name="new-place-form">
            <input class="place-create__description text"
                   placeholder="Название места" 
                   type="text" size="30"
                   name="description">
          </form>
        `);

        const submitButton = htmlToElement(
            '<input class="place-create__submit" type="submit" value="Создать">'
        );
        form.appendChild(submitButton);

        form.addEventListener('submit', async e => {
            e.preventDefault();

            const loader = new Loader({
                size: 30,
                elemClass: 'place-create__submit-loader'
            }).render();
            submitButton.replaceWith(loader);

            if (e.target.description.value) {
                updateCallback(await placeSubmitHandler(e.target.description.value));
            }

            loader.replaceWith(submitButton);
        });

        return form;
    }
}

export default PlaceCreateForm;
