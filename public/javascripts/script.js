'use strict';
const baseUrl = 'https://webdev-task-2-vufzqnzdnx.now.sh';
const sendReq = async (url, options) => {
    const response = await fetch(url, options);
    const body = await response.json();

    return body;
};
const getData = () => {
    sendReq(baseUrl, { method: 'GET' })
        .then(function (res) {
            console.info(res);
        });
};

// insert new place through form
var addForm = document.getElementsByClassName('insertion-form');
var onSubmitHandler = () => {
    var input = document.getElementsByClassName('insertion-form__input');
    fetch(`${baseUrl}?place=${input[0].value}`, { method: 'POST' });
    console.info(fetch(baseUrl));
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
    getData();

};
for (let elem of visited) {
    elem.addEventListener('click', onClickHandler);
}

// display for all, not visited, visited
var display = document.getElementsByClassName('location-menu__nav');
var onClickHandlerDisplay = event => {
    const displayParam = event.target.textContent;
    var cc = document.getElementsByClassName('locations-list');
    const children = Array.from(cc[0].children); // коллекция?
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
