import { api } from '../../api';
import { updateState } from '../../state';


export function addDeleteButton(travel) {
    const deleteButton = document.createElement('img');
    deleteButton.src = 'pictures/can.ico';
    deleteButton.className = 'travel__delete-button travel__icon travel__button';
    deleteButton.addEventListener('click', () => removeTravel(travel));
    travel.appendChild(deleteButton);
}

function removeTravel(travel) {
    api.deletePlace(travel)
        .then(() => updateState(false, { deleteTravel: travel }))
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
