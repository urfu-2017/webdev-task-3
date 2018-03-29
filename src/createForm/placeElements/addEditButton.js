import { processTravelOnMouseOver, processTravelOnMouseOut } from './mouseEvents';


export function addEditButton(travel) {
    const editButton = document.createElement('img');
    editButton.src = 'pictures/pencil.ico';
    editButton.className = 'travel__change-button travel__icon travel__button';
    editButton.addEventListener('click', () => showEditMenu(travel));
    travel.appendChild(editButton);
}

function showEditMenu(travel) {
    const cancelButton = travel.querySelector('.travel__cancel-button');
    cancelButton.style.display = 'block';
    const okButton = travel.querySelector('.travel__ok-button');
    okButton.style.display = 'block';
    const title = travel.querySelector('.travel__title');
    title.disabled = false;
    title.style.border = 'solid 1px #000';
    travel.addEventListener('mouseover', processTravelOnMouseOver);
    travel.addEventListener('mouseout', processTravelOnMouseOut);
}
