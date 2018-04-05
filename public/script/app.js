const URL = 'https://webdev-task-2-qqjqrfpmqs.now.sh/places';
/* eslint-disable no-use-before-define */
/* eslint-disable max-statements */

function getHeaders(method) {
    return {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
}

const tickFetch = async (name, isTicked) => {
    return await fetch (`${URL}/name/${name}/?isVisited=${isTicked}`,
        getHeaders('PATCH'));
};

const abcSortFetch = async () => {
    return await fetch (`${URL}/sort/abc`,
        getHeaders('PUT'));
};

const dateSortFetch = async () => {
    return await fetch (`${URL}/sort/date`,
        getHeaders('PUT'));
};

const editFetch = async (name, newDescription) => {
    return await fetch (`${URL}/name/${name}/?description=${newDescription}`,
        getHeaders('PUT'))
        .then(response => response.json());
};


const createFetch = async (name, description) => {
    return await fetch(`${URL}/?name=${name}&description=${description}`,
        getHeaders('POST'))
        .then(response => response.json());
};

const deleteAllFetch = async () => {
    return await fetch(`${URL}/`,
        getHeaders('DELETE'));
};

const getPlaceFetch = async (date) => {
    return await fetch(`https://webdev-task-2-qqjqrfpmqs.now.sh/${date}`,
        getHeaders('GET'));
};

const deleteFetch = async (name) => {
    return await fetch(`${URL}/name/${name}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
};

const moveFetch = async (firstName, secondName) => {
    return await fetch(`${URL}/order/?firstName=${firstName}&secondName=${secondName}`,
        getHeaders('PUT')
    );
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
        newItem = await createFetch(name, description);
    } else {
        newItem = { name, description, createTime, tick };
    }

    let listItem = document.importNode(document
        .querySelector('template').content, true).firstElementChild;
    listItem.querySelector('.list__item_name').textContent = newItem.name;
    listItem.querySelector('.list__item_date').value = newItem.createTime;
    listItem.querySelector('.list__item_description-input').value = newItem.description;
    listItem.querySelector('.list__item_description-div').value = newItem.description;
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
    const name = document.querySelector('.create__place').value;
    document.querySelector('.create__place').value = '';
    let description = 'Билли, здесь должно быть описание';
    create({ name, description });
});

const deleteAll = async () => {
    const deleteButton = document.querySelector('.list__delete-button');
    deleteButton.addEventListener('click', async () => {
        await deleteAllFetch()
            .then(response => response.status);
        let items = document.querySelector('.list__items');
        while (items.firstChild) {
            items.removeChild(items.firstElementChild);
        }
    });
};

const moveUp = (listItem) => {
    const moveUpButton = listItem.querySelector('.list__item_moveup');
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
    const sortAbcBtn = document.querySelector('.list__abc-button');
    sortAbcBtn.addEventListener('click', async () => {
        sortedPlaces = await abcSortFetch()
            .then(response => response.json());
        let items = document.querySelector('.list__items');
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
    const sortDateBtn = document.querySelector('.list__date-button');
    sortDateBtn.addEventListener('click', async () => {
        sortedPlaces = await dateSortFetch()
            .then(response => response.json());
        let items = document.querySelector('.list__items');
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

        listItem.getElementsByClassName('list__item_description-div')[0]
            .classList.add('none');
        listItem.querySelector('.list__item_description-input')
            .classList.add('list__item_description-input_block');
        let controlSaveButton = listItem.querySelector('.list__item-save-button');
        let controlCancelButton = listItem.querySelector('.list__item-cancel-button');
        listItem.getElementsByClassName('list__control-place')[0]
            .classList.add('list__control-place_edit');
        controlSaveButton.classList.add('list__item-save-button_block');
        controlCancelButton.classList.add('list__item-cancel-button_block');
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
        listItem.getElementsByClassName('list__item_description-input')[0]
            .classList.remove('list__item_description-input_block');
        divDescription.classList.remove('none');
        divDescription.classList.add('list__item_description-div');
        saveButton.classList.remove('list__item-save-button_block');
        cancelButton.classList.remove('list__item-cancel-button_block');
        listItem.getElementsByClassName('list__control-place')[0].classList
            .add('list__control-place');
        listItem.getElementsByClassName('list__control-place')[0]
            .classList.remove('list__control-place_edit');
    });
};

const cancel = (listItem) => {
    const saveButton = listItem.getElementsByClassName('list__item-save-button')[0];
    const cancelButton = listItem.getElementsByClassName('list__item-cancel-button')[0];
    cancelButton.addEventListener('click', async () => {
        listItem.getElementsByClassName('list__item_description-input')[0]
            .classList.remove('list__item_description-input_block');
        listItem.getElementsByClassName('list__item_description-div')[0]
            .classList.add('list__item_description-div');
        saveButton.classList.remove('list__item-save-button_block');
        cancelButton.classList.remove('list__item-cancel-button_block');
        listItem.getElementsByClassName('list__control-place')[0].classList
            .add('list__control-place');
        listItem.getElementsByClassName('list__control-place')[0]
            .classList.remove('list__control-place_edit');
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
                .classList.add('list__item_name_line');
            listItem.getElementsByClassName('list__item_name')[0]
                .classList.remove('list__item_name_none');
        } else {
            listItem.getElementsByClassName('list__item_name')[0]
                .classList.add('list__item_name_none');
            listItem.getElementsByClassName('list__item_name')[0]
                .classList.remove('list__item_name_line');
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
            alltems[i].classList.remove('none');
            alltems[i].classList.add('list__item_block')
        } else {
            alltems[i].classList.add('none');
            alltems[i].classList.remove('list__item_block')
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
