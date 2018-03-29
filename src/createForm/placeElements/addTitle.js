export function addTitle(travel, place) {
    const title = document.createElement('input');
    title.type = 'text';
    title.value = place.name;
    title.disabled = true;
    title.className = 'travel__title';
    travel.appendChild(title);
}
