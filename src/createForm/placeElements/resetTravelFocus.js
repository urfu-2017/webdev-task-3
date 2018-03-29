import { processTravelOnMouseOver, processTravelOnMouseOut } from './mouseEvents';


export function resetTravelFocus(travel) {
    travel.removeEventListener('mouseover', processTravelOnMouseOver);
    travel.removeEventListener('mouseout', processTravelOnMouseOut);
    const title = travel.querySelector('.travel__title');
    title.disabled = true;
    title.style.border = 'none';
    const cancelButton = travel.querySelector('.travel__cancel-button');
    cancelButton.style.display = 'none';
    const okButton = travel.querySelector('.travel__ok-button');
    okButton.style.display = 'none';
}
