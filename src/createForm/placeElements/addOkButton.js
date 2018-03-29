import { api } from '../../api';
import { resetTravelFocus } from './resetTravelFocus';

export function addOkButton(travel) {
    const okButton = document.createElement('img');
    okButton.src = 'pictures/check_mark.ico';
    okButton.className = 'travel__ok-button travel__icon travel__button';
    okButton.addEventListener('click', () => changeName(travel));
    travel.appendChild(okButton);
}

function changeName(travel) {
    const title = travel.querySelector('.travel__title');
    const newValue = title.value;
    resetTravelFocus(travel);
    api.patchName({ travel, newValue })
        .then(place => {
            title.value = place.name;
            travel.dataset.name = place.name;
        })
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
