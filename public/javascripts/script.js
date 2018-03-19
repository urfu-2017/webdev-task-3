'use strict';
const baseUrl = 'https://webdev-task-2-gguhuxcnsd.now.sh';
const sendReq = async (url, options) => {
    const response = await fetch(url, options);
    const body = await response.json();

    return body;
};
// const getLocationList = () => {
//     sendReq(baseUrl, { method: 'GET' })
//         .then(res => res);
// };

// insert new place through form
// тут тоже надо отобразить новые данные
var addForm = document.getElementsByClassName('insertion-form');
var onSubmitHandler = () => {
    var input = document.getElementsByClassName('insertion-form__input');
    console.info(`${baseUrl}?place=${input[0].value}`);
    sendReq(`${baseUrl}?place=${input[0].value}`, { method: 'POST' });
};
addForm[0].addEventListener('submit', onSubmitHandler);

// toggling buttons for visited - not visited
var visited = document.getElementsByClassName('visited-flag');
var onClickHandler = event => {
    const locationName = event.target.parentElement.firstChild.textContent;
    let value = false;
    event.target.classList.toggle('visited-icon');
    event.target.classList.toggle('not-visited-icon');
    if (event.target.classList.value.indexOf('not') === -1) {
        value = true;
    }
    const url = `${baseUrl}?place=${locationName}&param=visited&value=${value}`;
    sendReq(url, { method: 'PUT' });
};
for (let elem of visited) {
    elem.addEventListener('click', onClickHandler);
}

// display for all, not visited, visited
var display = document.getElementsByClassName('location-menu__nav');
var onClickHandlerDisplay = event => {
    const displayParam = event.target.textContent;
    var cc = document.getElementsByClassName('locations-list');
    const children = Array.from(cc[0].children);
    if (displayParam === 'All') {
        children.forEach(element => {
            element.style.display = 'flex';
        });
    } else if (displayParam === 'Not visited') {
        children.forEach(element => {
            if (element.lastElementChild.classList.value.indexOf('not') === -1) {
                element.style.display = 'none';
            } else {
                element.style.display = 'flex';
            }
        });
    } else {
        children.forEach(element => {
            if (element.lastElementChild.classList.value.indexOf('not') === -1) {
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        });
    }
};
for (let elem of display) {
    elem.addEventListener('click', onClickHandlerDisplay);
}

// delete everything
// тут надо рефреш сделать у данных
var trashEverything = document.getElementsByClassName('location-menu__delete-button');
var onDeleteHandler = () => {
    fetch(baseUrl, { method: 'DELETE' });
    const node = document.getElementsByClassName('locations-list')[0];
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};
trashEverything[0].addEventListener('click', onDeleteHandler);

var arrows = document.getElementsByClassName('arrow');
var onArrowClick = event => {
    // check what kind of arrow is it
    // swap in the required direction
    const locationName = event.target.parentElement.parentElement.firstChild.textContent;
    let swapLocationName;
    if (event.target.classList.value.indexOf('down') !== -1) {
        swapLocationName =
            event.target.parentElement.parentElement.nextElementSibling.firstChild.textContent;
    } else {
        swapLocationName =
            event.target.parentElement.parentElement.previousElementSibling.firstChild.textContent;
    }
    fetch(`${baseUrl}?place1=${locationName}&place2=${swapLocationName}`,
        { method: 'PUT', crossDomain: true });
};
for (let elem of arrows) {
    elem.addEventListener('click', onArrowClick);
}

