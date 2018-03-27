import './PlaceCreateForm.css';

import Loader from '../Loader';
import Component from '../Component';

class PlaceCreateForm extends Component {
    render() {
        const { elemClass = '', updateCallback, onPlaceSubmit } = this.props;

        const form = Component.htmlToElement(`
          <form class="place-create ${elemClass}" name="new-place-form">
            <input class="place-create__description text"
                   placeholder="Название места" 
                   type="text" size="20"
                   name="description">
          </form>
        `);

        const submitButton = Component.htmlToElement(
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
                updateCallback(await onPlaceSubmit(e.target.description.value));
            }

            loader.replaceWith(submitButton);
        });

        return form;
    }
}

export default PlaceCreateForm;
