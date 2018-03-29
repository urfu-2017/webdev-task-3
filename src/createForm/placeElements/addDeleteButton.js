import { api } from '../../api';


export function addDeleteButton(travel) {
    const deleteButton = document.createElement('img');
    deleteButton.src = 'pictures/can.ico';
    deleteButton.className = 'travel__delete-button travel__icon travel__button';
    deleteButton.addEventListener('click', () => removeTravel(travel));
    travel.appendChild(deleteButton);
}

function removeTravel(travel) {
    api.deletePlace(travel)
        .then(() => travel.parentNode.removeChild(travel))
        .catch(error => alert(`Произошла ошибка:\n${error.message}`));
}
