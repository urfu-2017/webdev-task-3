export function getIndexTravel(travel) {
    return Array.from(travel.parentNode.children).indexOf(travel);
}
