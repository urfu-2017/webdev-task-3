const URL = 'https://webdev-task-2-qqjqrfpmqs.now.sh/places';
/* eslint-disable no-use-before-define */

const tickFetch = async (name, isTicked) => {
    return await fetch (`${URL}/name/${name}/?isVisited=${isTicked}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    });
};

const abcSortFetch = async () => {
    return await fetch (`${URL}/sort/abc`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });
};

const dateSortFetch = async () => {
    return await fetch (`${URL}/sort/date`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });
};

const editFetch = async (name, newDescription) => {
    return await fetch (`${URL}/name/${name}/?description=${newDescription}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json());
};


const createFetch = async (name, description) => {
    return await fetch(`${URL}/?name=${name}&description=${description}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
};

const deleteAllFetch = async () => {
    return await fetch(`${URL}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
};

const getPlaceFetch = async (date) => {
    return await fetch(`https://webdev-task-2-qqjqrfpmqs.now.sh/${date}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
};

const deleteFetch = async (name) => {
    return await fetch(`${URL}/name/${name}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
};

const moveFetch = async (firstName, secondName) => {
    return await fetch(`${URL}/order/?firstName=${firstName}&secondName=${secondName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });
};

const disable = () => {
    let el = document.getElementsByClassName('list__items')[0];
    Array.prototype.forEach.call(el.children, (elem) => {
        let btn = elem.getElementsByClassName('list__control-place')[0];
        btn.getElementsByClassName('list__item_moveup')[0].removeAttribute('disabled');
        btn.getElementsByClassName('list__item_movedown')[0].removeAttribute('disabled');
    });
    el.getElementsByClassName('list__item')[0]
        .getElementsByClassName('list__control-place')[0]
        .getElementsByClassName('list__item_moveup')[0]
        .setAttribute('disabled', 'disabled');

    el.lastElementChild
        .getElementsByClassName('list__control-place')[0]
        .getElementsByClassName('list__item_movedown')[0]
        .setAttribute('disabled', 'disabled');
};

let newItem;
const create = async ({ name, description, createTime, tick }, indexToInsert) => {
    if (!createTime) {
        newItem = await createFetch(name, description)
            .then(response => response.json());
    } else {
        newItem = { name, description, createTime, tick };
    }
    const listItem = document.createElement('div');
    listItem.className = 'list__item';
    listItem.innerHTML = `<div class="list__control-place">
        <input type="image" src="/pic/edit.svg" class="list__item_edit" width = 25px>
        <input type="image" src="/pic/delete.png" class="list__item_delete" width = 25px>
        <div class="list__item_name">${newItem.name}</div>
        <input type="image" src="/pic/save.png" class="list__item-save-button" width = 25px>
        <input type="image" src="/pic/remove.png" class="list__item-cancel-button" width = 25px>
        <input type="image" src="/pic/up.png" class="list__item_moveup" width = 25px>
        <input type="image" src="/pic/down.png" class="list__item_movedown" width = 25px>
        <input type="checkbox" class="list__item_tick">
        <label for="checkbox"></label>
        <input type="hidden" class="list__item_date" value="${newItem.createTime}">
    </div>
    <input class="list__item_description-input" type="text" value="${newItem.description}">
    <div class="list__item_description-div" disabled>${newItem.description}</div>
    <hr class="list__place-line"/>`;
    if (indexToInsert) {
        document.getElementsByClassName('list__items')[0].insertBefore(listItem, indexToInsert);
    } else {
        document.getElementsByClassName('list__items')[0].appendChild(listItem);
    }
    moveUp(listItem);
    moveDown(listItem);
    deletePlace(listItem);
    editPlace(listItem);
    tickPlace(listItem);
    disable();
};

const createButton = document.getElementsByClassName('create__button')[0];
createButton.addEventListener('click', () => {
    const name = document.getElementsByClassName('create__place')[0].value;
    document.getElementsByClassName('create__place')[0].value = '';
    let description = 'Билли, здесь должно быть описание';
    create({ name, description });
});

const deleteAll = async () => {
    const deleteButton = document.getElementsByClassName('list__delete-button')[0];
    deleteButton.addEventListener('click', async () => {
        await deleteAllFetch()
            .then(response => response.status);
        let items = document.getElementsByClassName('list__items')[0];
        while (items.firstChild) {
            items.removeChild(items.firstElementChild);
        }
    });
};

const moveUp = (listItem) => {
    const moveUpButton = listItem.getElementsByClassName('list__item_moveup')[0];
    moveUpButton.addEventListener('click', async () => {
        const firstName = listItem.getElementsByClassName('list__item_name')[0].childNodes[0];
        const secondName = listItem.previousElementSibling
            .getElementsByClassName('list__item_name')[0]
            .childNodes[0];
        await moveFetch(firstName, secondName);
        const itemToInsert = await getPlaceFetch(listItem.previousElementSibling
            .getElementsByClassName('list__item_date')[0].value)
            .then(res => res.json());
        create(itemToInsert, listItem.nextElementSibling);
        listItem.previousElementSibling.remove();
        disable();
    });
};

const moveDown = (listItem) => {
    const moveUpButton = listItem.getElementsByClassName('list__item_movedown')[0];
    moveUpButton.addEventListener('click', async () => {
        const firstName = listItem.getElementsByClassName('list__item_name')[0].childNodes[0];
        const secondName = listItem.nextElementSibling.getElementsByClassName('list__item_name')[0]
            .childNodes[0];
        await moveFetch(firstName, secondName);
        const itemToInsert = await getPlaceFetch(listItem.nextElementSibling
            .getElementsByClassName('list__item_date')[0].value)
            .then(res => res.json());
        create(itemToInsert, listItem);
        listItem.nextElementSibling.remove();
        disable();
    });
};

const sortByAbc = () => {
    let sortedPlaces = [];
    const sortAbcBtn = document.getElementsByClassName('list__abc-button')[0];
    sortAbcBtn.addEventListener('click', async () => {
        sortedPlaces = await abcSortFetch()
            .then(response => response.json());
        let items = document.getElementsByClassName('list__items')[0];
        while (items.firstChild) {
            items.removeChild(items.firstElementChild);
        }
        Array.prototype.forEach.call(sortedPlaces, el => {
            create(el);
        });
        disable();
    });
};

const sortByDate = () => {
    let sortedPlaces = [];
    const sortDateBtn = document.getElementsByClassName('list__date-button')[0];
    sortDateBtn.addEventListener('click', async () => {
        sortedPlaces = await dateSortFetch()
            .then(response => response.json());
        let items = document.getElementsByClassName('list__items')[0];
        while (items.firstChild) {
            items.removeChild(items.firstElementChild);
        }
        Array.prototype.forEach.call(sortedPlaces, el => {
            create(el);
        });
        disable();
    });
};

const deletePlace = (listItem) => {
    const deleteButton = listItem.getElementsByClassName('list__item_delete')[0];
    deleteButton.addEventListener('click', async () => {
        const name = listItem.getElementsByClassName('list__item_name')[0].childNodes[0].data;
        await deleteFetch(name)
            .then(response => response.status);
        document.getElementsByClassName('list__items');
        listItem.parentNode.removeChild(listItem);
    });
};

const editPlace = (listItem) => {
    const editButton = listItem.getElementsByClassName('list__item_edit')[0];
    const name = listItem.getElementsByClassName('list__item_name')[0].childNodes[0].data;
    editButton.addEventListener('click', async () => {
        listItem.getElementsByClassName('list__item_description-input')[0].style.display = 'block';
        let controlSaveButton = listItem.getElementsByClassName('list__item-save-button')[0];
        let controlCancelButton = listItem.getElementsByClassName('list__item-cancel-button')[0];
        listItem.getElementsByClassName('list__item_description-div')[0].style.display = 'none';
        listItem.getElementsByClassName('list__control-place')[0]
            .style['grid-template-columns'] = '40px 40px auto 40px 40px 20px 30px 30px';
        controlSaveButton.style.display = 'block';
        controlCancelButton.style.display = 'block';
        savePlace(listItem, name);
        cancel(listItem);
    });
};

const savePlace = (listItem, name) => {
    const saveButton = listItem.getElementsByClassName('list__item-save-button')[0];
    const cancelButton = listItem.getElementsByClassName('list__item-cancel-button')[0];
    saveButton.addEventListener('click', async () => {
        const newDescription = listItem
            .getElementsByClassName('list__item_description-input')[0].value;
        await editFetch(name, newDescription);
        let divDescription = listItem.getElementsByClassName('list__item_description-div')[0];
        divDescription.innerHTML = newDescription;
        listItem.getElementsByClassName('list__item_description-input')[0].style.display = 'none';
        divDescription.style.display = 'block';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        listItem.getElementsByClassName('list__control-place')[0]
            .style['grid-template-columns'] = '40px 40px auto 20px 30px 30px';
    });
};

const cancel = (listItem) => {
    const saveButton = listItem.getElementsByClassName('list__item-save-button')[0];
    const cancelButton = listItem.getElementsByClassName('list__item-cancel-button')[0];
    cancelButton.addEventListener('click', async () => {
        listItem.getElementsByClassName('list__item_description-input')[0].style.display = 'none';
        listItem.getElementsByClassName('list__item_description-div')[0].style.display = 'block';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        listItem.getElementsByClassName('list__control-place')[0]
            .style['grid-template-columns'] = '40px 40px auto 20px 30px 30px';
    });
};

const tickPlace = async (listItem) => {
    const checkButton = listItem.getElementsByClassName('list__item_tick')[0];
    checkButton.addEventListener('click', async () => {
        let name = listItem.getElementsByClassName('list__item_name')[0].childNodes[0].data;
        await tickFetch(name, checkButton.checked)
            .then(response => response.json());
        if (checkButton.checked === true) {
            listItem.getElementsByClassName('list__item_name')[0]
                .style['text-decoration'] = 'line-through';
        } else {
            listItem.getElementsByClassName('list__item_name')[0]
                .style['text-decoration'] = 'none';
        }
    });
};

const controlVisit = async () => {
    const btns = document.getElementsByClassName('list__filter-buttons')[0].children;
    Array.prototype.forEach.call(btns, el => {
        el.addEventListener('click', () => {
            const alltems = document.getElementsByClassName('list__item');
            helpToControl(alltems, el);
        });
    });
};

const helpToControl = (alltems, el) => {
    for (let i = 0; i < alltems.length; i++) {
        const tick = alltems[i].getElementsByClassName('list__item_tick')[0];
        if (!tick.checked && el.className === 'list__filter-buttons_visit' ||
        el.className === 'list__filter-buttons_all' ||
        tick.checked && el.className === 'list__filter-buttons_visited') {
            alltems[i].style.display = 'block';
        } else {
            alltems[i].style.display = 'none';
        }
    }
};


const searchPlace = () => {
    const serchButton = document.getElementsByClassName('search__button')[0];
    let placeToFind = '';
    serchButton.addEventListener('click', () => {
        placeToFind = document.getElementsByClassName('search__place')[0].value;
        const places = document.getElementsByClassName('list__items')[0].children;
        Array.prototype.forEach.call(places, el => {
            if ((placeToFind !== el.getElementsByClassName('list__item_name')[0]
                .childNodes[0].data) && placeToFind) {
                el.style.display = 'none';
            } else {
                el.style.display = 'block';
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    controlVisit();
    deleteAll();
    searchPlace();
    sortByAbc();
    sortByDate();
});
