import { directionToNameMethod } from '../../state';
import { swapTravels } from './buttonHandlers/swap';


export function addArrows(travel) {
    const arrowUp = document.createElement('img');
    arrowUp.src = 'pictures/arrow_up.ico';
    arrowUp.alt = 'Передвинуть вверх';
    arrowUp.className = 'travel__arrow-up travel__icon travel__button';
    arrowUp.addEventListener('click', () => moveInDirection(travel, 'up'));
    travel.appendChild(arrowUp);

    const arrowDown = document.createElement('img');
    arrowDown.src = 'pictures/arrow_down.ico';
    arrowDown.alt = 'Передвинуть вниз';
    arrowDown.className = 'travel__arrow-down travel__icon travel__button';
    arrowDown.addEventListener('click', () => moveInDirection(travel, 'down'));
    travel.appendChild(arrowDown);
}


/**
 * @param {Object} travel - вершина dom дерева
 * @param {String} direction - направление (up/down)
 */
function moveInDirection(travel, direction) {
    let otherTravel = travel[directionToNameMethod[direction]];
    while (otherTravel) {
        if (otherTravel.style.display !== 'none') {
            swapTravels(travel, otherTravel);

            return;
        }
        otherTravel = otherTravel[directionToNameMethod[direction]];
    }
}
