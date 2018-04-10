const requestUrl = 'http://localhost:8080/places';

let catcher = err => console.error(err.message);
let placesContainer = document.getElementById('container');
let loadingPlaceholder = document.getElementById('loading');

let places = [];

initialLoad();
addDeleteAllListener();
addCreateListener();
addFilterListeners();

function addFilterListeners() {
    let placesSortOption = document.querySelector('.places__sort-options');
    let search = document.querySelector('.header__search');

    placesSortOption.addEventListener('click', function (event) {
        if (event.target.type === 'radio') {
            filter();
        }
    });

    search.addEventListener('input', filter);

    function filter() {
        if (this.type === 'radio' && !this.checked) {
            return;
        }

        let searchValue = new RegExp(search.value, 'i');
        let checkedOption = placesSortOption.querySelector('.places__sort-option:checked');

        let isAll = checkedOption.value === 'all';
        let isVisited = checkedOption.value === 'visited';

        let searchResult = places.filter(place => {
            return place.name.match(searchValue) && (isAll || place.isVisited === isVisited);
        });

        mountElementInContainer(makePlacesList(searchResult));
    }
}

function initialLoad() {
    fetch(requestUrl)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
            throw new Error('При загрузке мест произошла ошибка');
        })
        .then(body => {
            places = body;
            mountElementInContainer(makePlacesList(places));
        })
        .catch(err => console.error(err.message));
}

function addDeleteAllListener() {
    let deleteAllBtn = document.querySelector('.places__delete');
    deleteAllBtn.addEventListener('click', function () {
        addLoader(placesContainer);
        fetch(requestUrl, { method: 'DELETE' })
            .then(response => {
                removeLoader(placesContainer);
                if (response.status === 204) {
                    places = [];
                    mountElementInContainer(makePlacesList(places));

                    return;
                }
                throw new Error('Произошла ошибка при удалении');
            })
            .catch(catcher);
    });
}

function addCreateListener() {
    let createForm = document.querySelector('.create-form');
    createForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let placeName = this.firstElementChild.value;
        if (placeName) {
            this.firstElementChild.value = '';
            addLoader(placesContainer);

            fetch(requestUrl, {
                method: 'POST',
                body: JSON.stringify({ name: placeName }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    removeLoader(placesContainer);
                    if (response.status === 201) {
                        return response.json();
                    }
                    throw new Error('Произошла ошибка при добавлении');
                })
                .then(body => {
                    places.push(body);
                    mountElementInContainer(makePlacesList(places));
                })
                .catch(catcher);
        }
    });
}

function addLoader(toElement) {
    toElement.appendChild(loadingPlaceholder);
}

function removeLoader(fromElement) {
    try {
        fromElement.removeChild(loadingPlaceholder);
    } catch (e) {
        console.error(e.message);
    }
}

function makePlacesList(list) {
    if (!list.length) {
        return createElement('div', {
            innerHTML: 'Мест не найдено',
            className: 'not-found'
        });
    }

    let placesList = createElement('ul', {
        className: 'places__list'
    });
    list.map(makePlace).forEach(place => placesList.appendChild(place));

    return placesList;
}

function mountElementInContainer(element) {
    placesContainer.replaceChild(element, placesContainer.firstElementChild);
}

function makePlace(place) {
    let placeContainer = createElement('li', {
        className: 'place places__place'
    });
    placeContainer.style.opacity = place.isVisited ? '0.5' : '1';

    let placeName = createElement('input', {
        className: 'place__name',
        value: place.name,
        disabled: true
    });
    let placeCheck = createElement('input', {
        type: 'checkbox',
        checked: place.isVisited,
        className: 'place__check',
        id: place.createdAt
    });
    let placeLabel = createElement('label', {
        htmlFor: place.createdAt,
        className: 'place__label'
    });
    let checkHolder = createElement('div', {
        className: 'place__check-holder'
    });
    let buttonGroup = createElement('div', {
        className: 'place__button-group'
    });
    let { changeButton, deleteButton, confirmButton, cancelButton } = createButtonsForPlace();

    addListeners();

    appendAll();

    return placeContainer;

    function changeState() {
        placeName.disabled = !placeName.disabled;
        switchDisplayBlock(confirmButton);
        switchDisplayBlock(cancelButton);
        switchDisplayBlock(changeButton);
        switchDisplayBlock(deleteButton);
    }

    function appendAll() {
        appendChildren(checkHolder, placeCheck, placeLabel);
        appendChildren(buttonGroup, changeButton, deleteButton, confirmButton, cancelButton);
        appendChildren(placeContainer, buttonGroup, placeName, checkHolder);
    }

    function addListeners() {
        addDragHandlers();

        changeButton.addEventListener('click', function () {
            changeState();
            placeName.focus();
        });

        confirmButton.addEventListener('click', function () {
            changeState();
            addLoader(placesContainer);
            fetch(`${requestUrl}/${place.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: placeName.value })
            })
                .then(response => {
                    removeLoader(placesContainer);
                    if (response.status === 204) {
                        place.name = placeName.value;

                        return;
                    }
                    placeName.value = place.name;
                    throw new Error('Произошла ошибка при переименовании');
                })
                .catch(catcher);
        });

        deleteButton.addEventListener('click', function () {
            addLoader(placesContainer);
            fetch(`${requestUrl}/${place.id}`, { method: 'DELETE' })
                .then(response => {
                    removeLoader(placesContainer);
                    if (response.status === 204) {
                        let indexToDelete = places.findIndex(({ id }) => id === place.id);
                        places.splice(indexToDelete, 1);
                        mountElementInContainer(makePlacesList(places));

                        return;
                    }
                    throw new Error('Произошла ошибка при удалении');
                })
                .catch(catcher);
        });

        cancelButton.addEventListener('click', changeState);

        placeCheck.addEventListener('change', function () {
            addLoader(placesContainer);
            fetch(`${requestUrl}/${place.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isVisited: placeCheck.checked })
            })
                .then(response => {
                    removeLoader(placesContainer);
                    if (response.status === 204) {
                        place.isVisited = placeCheck.checked;
                        placeContainer.style.opacity = placeCheck.checked ? '0.5' : '1';

                        return;
                    }
                    placeCheck.checked = place.isVisited;
                    throw new Error('Произошла ошибка при переименовании');
                })
                .catch(catcher);
        });
    }

    function addDragHandlers() {
        placeContainer.draggable = true;

        placeContainer.addEventListener('dragstart', function (event) {
            this.style.opacity = '0.3';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData(
                'text/plain',
                `${place.id}/${places.findIndex(p => p === place)}`
            );
        }, false);

        placeContainer.addEventListener('dragover', function (event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            this.classList.add('over');

            return false;
        }, false);

        placeContainer.addEventListener('dragleave', function (event) {
            event.preventDefault();

            this.classList.remove('over');
        }, false);

        placeContainer.addEventListener('dragend', function (event) {
            event.preventDefault();

            this.style.opacity = '';
            [...placesContainer.querySelectorAll('.over')]
                .forEach(p => p.classList.remove('over'));
        }, false);

        placeContainer.addEventListener('drop', function (event) {
            event.preventDefault();

            let indexTo = places.findIndex(p => p === place);
            let [id, indexFrom] = event.dataTransfer.getData('text').split('/');

            if (indexTo === Number(indexFrom)) {
                return;
            }

            addLoader(placesContainer);
            fetch(`${requestUrl}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ moveTo: indexTo })
            })
                .then(response => {
                    removeLoader(placesContainer);
                    if (response.status === 204) {
                        places.splice(indexTo, 0, places.splice(Number(indexFrom), 1)[0]);
                        mountElementInContainer(makePlacesList(places));

                        return;
                    }
                    throw new Error('Произошла ошибка при позиционировании');
                })
                .catch(catcher);

            return false;
        }, false);
    }
}

function createButtonsForPlace() {
    return {
        changeButton: createElement('button', {
            className: 'place__change'
        }),
        deleteButton: createElement('button', {
            className: 'place__delete'
        }),
        confirmButton: createElement('button', {
            className: 'place__confirm'
        }),
        cancelButton: createElement('button', {
            className: 'place__cancel'
        })
    };
}

function createElement(tag, attributes) {
    let element = document.createElement(tag);
    Object.assign(element, attributes);

    return element;
}

function appendChildren(element, ...children) {
    children.forEach(child => element.appendChild(child));
}

function switchDisplayBlock(element) {
    if (getComputedStyle(element).display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}
