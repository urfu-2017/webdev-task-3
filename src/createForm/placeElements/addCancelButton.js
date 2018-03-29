import { resetTravelFocus } from './resetTravelFocus';


export function addCancelButton(travel) {
    const cancelButton = document.createElement('img');
    cancelButton.src = 'pictures/cross.ico';
    cancelButton.className = 'travel__cancel-button travel__icon travel__button';
    cancelButton.addEventListener('click', () => cancelRename(travel));
    travel.appendChild(cancelButton);
}

function cancelRename(travel) {
    resetTravelFocus(travel);
    const title = travel.querySelector('.travel__title');
    title.value = travel.dataset.name;
}
