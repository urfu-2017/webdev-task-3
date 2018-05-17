export const createInput = document.querySelector('.create__input');
export const contentItems = document.querySelector('.content__items');
export const createButton = document.querySelector('.create__button');
export const deleteAllButton = document.querySelector('.content__delete-button');
export const getFilterValue = () => document.querySelector('input[name="filter"]:checked').value;
export const filterRadio = document.querySelector('.content__filter');
export const searchInput = document.querySelector('.header__search-field');

export const getDeleteItemButton = id => document
    .querySelector(`.item-id-${id} .item__delete-button`);
export const getItemVisitedCheckbox = id => document
    .querySelector(`.item-id-${id} .item__checkbox`);
export const getItemUpButton = id => document
    .querySelector(`.item-id-${id} .item__move-up`);
export const getItemDownButton = id => document
    .querySelector(`.item-id-${id} .item__move-down`);
export const getItemDescriptionInput = id => document
    .querySelector(`.item-id-${id} .item__update-description`);
