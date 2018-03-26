'use strict';

const placesList = document.getElementsByClassName('places_list')[0];
const createButton = document.getElementsByClassName('create_button')[0];
const createInput = document.getElementsByClassName('create_input')[0];

function createPlace(desc) {
    const li = document.createElement('li');
    li.className = 'places_list_item';
    li.innerHTML = desc;
    placesList.appendChild(li);
    li.appendChild(createButton1('places_list_item_shift'));
    li.appendChild(createButton1('places_list_item_visit'));

    return li;
}

function createButton1(htmlClass) {
    const button = document.createElement('button');
    button.className = htmlClass;

    return button;
}

createButton.onclick = async function () {
    const data = 'desc=' + createInput.value;
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        mode: 'no-cors',
        body: data
    };
    fetch('http://localhost:8080/', options)
        .then(req => {
            console.info(req);
            if (req.status !== 400) {
                createPlace(createInput.value);
            }
        });
};
