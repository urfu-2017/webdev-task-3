'use strict';

const searchButton = document.getElementsByClassName('search_button')[0];
const searchInput = document.getElementsByClassName('search_input')[0];

searchButton.onclick = async function () {
    const data = 'desc=' + searchInput.value;
    const options = {
        method: 'get',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    };
    const req = await fetch('http://localhost:8080/places', options);
    const places = await req.json();
};
