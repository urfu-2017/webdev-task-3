import {
    contentItems,
    createInput,
    createButton,
    deleteAllButton,
    getFilterValue,
    filterRadio,
    searchInput,
    getItemVisitedCheckbox,
    getDeleteItemButton,
    getItemDownButton,
    getItemUpButton,
    getItemDescriptionInput
} from './selectors';
import Item from './item';
import DataStorage from './dataStorage';


const filters = {
    all: () => true,
    visited: item => item.visited,
    notVisited: item => !item.visited,

    search: (regexp, item) => regexp.test(item.description)
};


const state = {
    filter: 'all',
    searchText: ''
};


const itemSetup = (storage, item) => {
    const { id, previous, next, index } = item;
    const visitedCheckbox = getItemVisitedCheckbox(id);
    visitedCheckbox.onchange = () => {
        storage.setVisitedValue(id, visitedCheckbox.checked);
    };

    const deleteButton = getDeleteItemButton(id);
    deleteButton.onclick = () => {
        storage.deleteItem(id);
    };

    if (previous !== undefined) {
        const moveUp = getItemUpButton(id);
        moveUp.onclick = () => {
            storage.changeItemIndex(index, previous);
        };
    }
    if (next) {
        const moveDown = getItemDownButton(id);
        moveDown.onclick = () => {
            storage.changeItemIndex(index, next);
        };
    }

    const descriptionInput = getItemDescriptionInput(id);
    descriptionInput.onkeydown = event => {
        if (event.key !== 'Enter') {
            return;
        }
        storage.updateItemDescription(id, descriptionInput.value);
    };
};


const filterItems = items => {
    const searchRegexp = new RegExp(state.searchText, 'i');

    items = items.map((it, index) => ({ ...it, index }))
        .filter(filters[state.filter])
        .filter(filters.search.bind(null, searchRegexp));
    items.forEach((item, filteredIndex) => {
        if (filteredIndex > 0) {
            item.previous = items[filteredIndex - 1].index;
        }
        if (filteredIndex < items.length - 1) {
            item.next = items[filteredIndex + 1].index;
        }
    });

    return items;
};


const render = (storage, items) => {
    items = filterItems(items);
    contentItems.innerHTML = items.map(Item)
        .join('');
    items.forEach(it => itemSetup(storage, it));
};


const storage = new DataStorage(render);


const main = () => {
    filterRadio.onchange = () => {
        state.filter = getFilterValue();
        render(storage, storage.data);
    };

    searchInput.onkeyup = () => {
        state.searchText = searchInput.value;
        render(storage, storage.data);
    };

    const createItem = () => {
        const description = createInput.value;
        if (!description || !description.length) {
            return;
        }
        storage.createItem({ description });
        createInput.value = '';
    };

    createButton.onclick = createItem;

    createInput.onkeydown = (event) => {
        if (event && event.key !== 'Enter') {
            return;
        }
        createItem();
    };

    deleteAllButton.onclick = () => {
        storage.deleteAll();
    };
};


window.onload = main;
