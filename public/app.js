
const searchBtn = document.getElementById('search');
const allPlaces = 'https://webdev-task-2-bfflqxwpwl.now.sh/api/places/';
const deleteAllPlaces = 'https://webdev-task-2-bfflqxwpwl.now.sh/api/places/deleting/';
const deleteBtn = document.getElementById('delete');
const createBtn = document.getElementById('create');
const allPlacesBtn = document.getElementById('all');
const visitedPlacesBtn = document.getElementById('visited');
const plannedPlaceBtn = document.getElementById('planned');
let placesList = document.getElementById('places');

document.addEventListener('DOMContentLoaded', showAllPlaces);

function showAllPlaces() {
    fetch(allPlaces)
        .then(response => response.json())
        .then(data => data.places.forEach((element, index, array) =>
            createNewPlace(element, index, array.length)))
        .catch(e => console.error(e));
}

function createNewPlace(place, index, arrayLength) {
    let newElement = document.createElement('div');

    let newPlace = document.createElement('input');
    let isVisited = document.createElement('input');
    let saveChanges = document.createElement('input');
    let deleteChanges = document.createElement('input');
    let btnUp = document.createElement('input');
    let btnDown = document.createElement('input');
    let deletePlace = document.createElement('input');
    let editDescription = document.createElement('input');
    let editDiv = document.createElement('div');
    let editNameDiv = document.createElement('div');

    saveChanges.type = 'button';
    saveChanges.id = 'saveChanges';
    deleteChanges.type = 'button';
    deleteChanges.id = 'deleteChanges';

    deletePlace.type = 'button';
    deletePlace.id = 'deletePlaceBtn';
    deletePlace.className = 'deletePlaceBtn';

    editDescription.type = 'button';
    editDescription.id = 'editDescriptionBtn';
    editDescription.className = 'editDescriptionBtn';

    isVisited.type = 'checkbox';
    isVisited.id = 'tick';
    isVisited.checked = place.visited;

    // поле с 2 кнопками - изменение описания места и отмена изменений
    editNameDiv.style.display = 'none';
    editNameDiv.id = 'editNameField';
    editNameDiv.className = 'editNameField';
    editNameDiv.appendChild(saveChanges);
    editNameDiv.appendChild(deleteChanges);

    editDiv.style.display = 'none'; // поле с 2 кнопками - удалить место и отмена изменения
    editDiv.id = 'editField';
    editDiv.className = 'editField';
    editDiv.appendChild(deletePlace);
    editDiv.appendChild(editDescription);

    btnUp.type = 'button';
    btnUp.id = 'btnUp';

    btnDown.type = 'button';
    btnDown.id = 'btnDown';

    newPlace.readOnly = true;
    newPlace.type = 'text';
    newPlace.id = 'nameField';
    newPlace.value = place.description;

    newElement.className = 'place';
    newElement.value = place.description;
    newElement.dataset.index = index;

    newElement.appendChild(newPlace);
    newElement.appendChild(isVisited);
    newElement.appendChild(btnUp);
    newElement.appendChild(btnDown);
    newElement.appendChild(editDiv);
    newElement.appendChild(editNameDiv);
    placesList.appendChild(newElement);
    moveUp(btnUp, arrayLength);
    moveDown(btnDown, arrayLength);
    changeVisitedState(isVisited);
}

function changeVisitedState(checkbox) {
    let parent = checkbox.parentNode;
    checkbox.addEventListener('click', function () {
        fetch(allPlaces + 'modification/visiting/' +
        parent.value + '/' + checkbox.checked, { method: 'PUT' })
            .then(() => {
                deleteAll();
                showAllPlaces();
            })
            .catch (e => console.error(e));
    });
}

function deleteAll() {
    while (placesList.firstChild) {
        placesList.removeChild(placesList.firstChild);
    }
}

function moveUp(arrow, arrayLength) {
    let parent = arrow.parentNode;
    arrow.addEventListener('click', function () {
        fetch(allPlaces + 'modification/index/' +
        parent.value + '/' + (parent.dataset.index - 1 +
        arrayLength) % arrayLength, { method: 'PUT' })
            .then(() => {
                deleteAll();
                showAllPlaces();
            })
            .catch (e => console.error(e));
    });
}

function moveDown(arrow, arrayLength) {
    let parent = arrow.parentNode;
    arrow.addEventListener('click', function () {
        fetch(allPlaces + 'modification/index/' +
        parent.value + '/' + (parent.dataset.index + 1 +
        arrayLength) % arrayLength, { method: 'PUT' })
            .then(() => {
                deleteAll();
                showAllPlaces();
            })
            .catch (e => console.error(e));
    });
}

placesList.addEventListener('mouseenter', function () {
    let fields = document.getElementsByClassName('editField');
    for (let i = 0; i < fields.length; i++) {
        fields[i].style.width = '100px';
        fields[i].style.height = '22px';
        fields[i].style.display = 'inline-block';
        fields[i].style.verticalAlign = 'top';
        fields[i].style.border = '1px solid #ff0080';
    }
    deleteOnePlace();
    editPlace();
});

function editPlace() {
    let editFields = document.getElementsByClassName('editDescriptionBtn');
    for (let i = 0; i < editFields.length; i++) {
        editFields[i].addEventListener('click', function () {
            let editNameFields = document.getElementsByClassName('editNameField');
            for (let j = 0; j < editFields.length; j++) {
                editNameFields[j].style.display = 'block';
                let oldDescription = getOldDescription();
                unfreeze();
                saveChangesInDescription(oldDescription);
                deleteChangesInDescription(oldDescription);
            }
        });
    }
}

function getOldDescription() {
    return document.getElementById('nameField').value;
}

function unfreeze() {
    document.getElementById('nameField').readOnly = false;
}

function closeField() {
    document.getElementById('editNameField').style.display = 'none';
}

function deleteChangesInDescription(oldDescription) {
    document.getElementById('deleteChanges').addEventListener('click', function () {
        document.getElementById('nameField').value = oldDescription;
    });
}

function saveChangesInDescription(oldDescription) {
    document.getElementById('saveChanges').addEventListener('click', function () {
        let newDescription = document.getElementById('nameField').value;
        document.getElementById('saveChanges').style.disabled = true;
        fetch(allPlaces + 'modification/description/' +
        oldDescription + '/' + newDescription, { method: 'PUT' })
            .then(() => {
                closeField();
                deleteAll();
                showAllPlaces();
            })
            .catch (e => console.error(e));
    });
}

function deleteOnePlace() {
    document.getElementById('deletePlaceBtn').addEventListener('click', function () {
        fetch(deleteAllPlaces + this.parentNode.parentNode.value, { method: 'DELETE' })
            .then(() => {
                deleteAll();
                showAllPlaces();
            })
            .catch (e => console.error(e));
    });
}

plannedPlaceBtn.addEventListener('click', function () {
    fetch(allPlaces)
        .then(response => response.json())
        .then(data => {
            deleteAll();
            data.places.forEach((element, index, array) => {
                if (!element.visited) {
                    createNewPlace(element, index, array.length);
                }
            });
        })
        .catch (e => console.error(e));
});

visitedPlacesBtn.addEventListener('click', function () {
    fetch(allPlaces)
        .then(response => response.json())
        .then(data => {
            deleteAll();
            data.places.forEach((element, index, array) => {
                if (element.visited) {
                    createNewPlace(element, index, array.length);
                }
            });
        })
        .catch(e => console.error(e));
});

allPlacesBtn.addEventListener('click', function () {
    deleteAll();
    showAllPlaces();
});

searchBtn.addEventListener('click', function () {
    const placeName = document.getElementById('search-input').value;
    fetch(allPlaces + placeName)
        .then(response => response.json())
        .then(data => {
            deleteAll();
            createNewPlace(data);
        })
        .catch(e => console.error(e));
});


deleteBtn.addEventListener('click', function () {
    fetch(deleteAllPlaces, { method: 'DELETE' })
        .then(deleteAll());
});

createBtn.addEventListener('click', function () {
    const newPlace = document.getElementById('create-input').value;
    fetch(allPlaces + newPlace, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            createNewPlace(data[data.length - 1], data.length - 1, data.length);
        })
        .catch(e => console.error(e));
});
