async function deletePlace(li) {
    await placeApi.delete(li.id);
    placesList.removeChild(li);
}

async function editPlace() {

}

async function shiftPlace(li, indexTo) {
    await placeApi.insert(li.id, indexTo);
}

async function switchVisit(switchVisitButton, li) {
    if (switchVisitButton.className === 'places_list_item_novisit') {
        switchVisitButton.className = 'places_list_item_visit';
        await placeApi.edit(li.id, li.desc, true);
        li.isVisited = true;
    } else {
        switchVisitButton.className = 'places_list_item_novisit';
        await placeApi.edit(li.id, li.desc, false);
        li.isVisited = false;
    }
}
