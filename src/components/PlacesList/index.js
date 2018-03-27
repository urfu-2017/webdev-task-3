import Loader from '../Loader';
import PlaceRow from '../PlaceRow';
import Component from '../Component';
import PlaceManager from '../../models/place-manager';

class PlacesList extends Component {
    async removePlace(e) {
        if (!e.target.classList.contains('place-row__delete')) {
            return;
        }

        const placeRow = e.target.parentNode;
        e.target.replaceWith(
            new Loader({
                elemClass: 'place-row__delete-loader'
            }).render()
        );

        await PlaceManager.delete(placeRow.dataset.placeId);
        placeRow.remove();
    }

    async changePlaceStatus(e) {
        if (!e.target.classList.contains('place-row__status')) {
            return;
        }

        const placeStatusElem = e.target;
        const placeRow = e.target.parentNode;

        const loader = new Loader({ elemClass: 'place-row__status-loader' }).render();
        placeStatusElem.replaceWith(loader);

        await PlaceManager.edit(placeRow.dataset.placeId, { status: placeStatusElem.checked });

        loader.replaceWith(placeStatusElem);

        // Применение фильтров
        document
            .querySelector('.filter-button[aria-checked]')
            .dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
    }

    render() {
        const { elemClass = '', placeObjects } = this.props;

        const list = Component.htmlToElement(`<div class="places-list ${elemClass}"></div>`);

        placeObjects.forEach(place => {
            list.appendChild(new PlaceRow({ place: place }).render());
        });

        list.addEventListener('click', this.removePlace);
        list.addEventListener('click', PlaceRow.onEditReject);
        list.addEventListener('click', PlaceRow.onEditApprove);
        list.addEventListener('click', PlaceRow.onSwitchControls);
        list.addEventListener('change', this.changePlaceStatus);

        return list;
    }
}

export default PlacesList;
