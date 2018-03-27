import './PlaceHeader.css';
import trashIcon from './trash.svg';

import Loader from '../Loader';
import Component from '../Component';

class PlacesHeader extends Component {
    _renderClearButton(handler, updateCallback) {
        const elem = Component.htmlToElement(`
          <button class="places-header__clear">
            <img class="places-header__clear-icon" src="${trashIcon}">
          </button>
        `);

        const loader = new Loader({ elemClass: 'places-header__clear-loader' }).render();

        elem.addEventListener('click', async e => {
            elem.replaceWith(loader);
            updateCallback(await handler(e));
            loader.replaceWith(elem);
        });

        return elem;
    }

    _renderFilters(handler, updateCallback) {
        const elem = Component.htmlToElement(`
          <div class="place-header__filters">
            <button class="filter-button text text_ellipsis" 
                    title="Показать все места" type="button"
                    data-value="all" role="radio" aria-checked="true">
              Все
            </button>
            
            <button class="filter-button text text_ellipsis"
                    title="Показать непосещённые места"
                    data-value="not-visited"
                    type="button" 
                    role="radio">
              Посетить
            </button>
            
            <button class="filter-button text text_ellipsis" 
                    title="Показать посещённые места"
                    data-value="visited"
                    type="button"
                    role="radio">
              Посещённые
            </button>
          </div>
        `);

        elem.addEventListener('click', e => {
            e.preventDefault();

            const filterButtons = e.target.parentNode.children;
            for (let i = 0; i < filterButtons.length; i++) {
                filterButtons[i].removeAttribute('aria-checked');
            }

            e.target.setAttribute('aria-checked', true);
            updateCallback(handler({ status: e.target.dataset.value }));
        });

        return elem;
    }

    render() {
        const { elemClass = '', updateCallback, onPlacesClear, onFilterChange } = this.props;

        const placesHeader = Component.htmlToElement(
            `<div class="places-header ${elemClass}"></div>`
        );
        placesHeader.appendChild(
            Component.htmlToElement('<h2 class="places-header__title">Места</h2>')
        );
        placesHeader.appendChild(this._renderClearButton(onPlacesClear, updateCallback));
        placesHeader.appendChild(this._renderFilters(onFilterChange, updateCallback));

        return placesHeader;
    }
}

export default PlacesHeader;
