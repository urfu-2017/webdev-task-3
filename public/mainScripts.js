/* eslint-disable no-unused-vars,no-undef,max-statements,max-len */
const url = 'https://cors-anywhere.herokuapp.com/https://webdev-task-2-fbhqywymzl.now.sh/notes/';

async function setCheckboxStatus(n, id, nameOfPlace) {

    let x = n.checked;
    let body = '';
    if (x !== false) {
        body = 'mark=' + encodeURIComponent(x) + '&place=' + nameOfPlace;
    } else {
        body = 'place=' + nameOfPlace;
    }
    await fetch(url + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });
}

filterSelection('all');

function filterSelection(c) {
    window.state = c;

    let x = document.getElementsByClassName('filterDiv');
    if (c === 'all') {
        c = '';
    }
    console.info(c);
    // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
    for (let i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], 'show');
        if (x[i].className.indexOf(c) > -1) {
            w3AddClass(x[i], 'show');
        }
    }

    return c;
}

// Show filtered elements
function w3AddClass(element, name) {
    let arr1 = element.className.split(' ');
    let arr2 = name.split(' ');
    for (let i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) === -1) {
            element.className += ' ' + arr2[i];
        }
    }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
    let arr1 = element.className.split(' ');
    let arr2 = name.split(' ');
    for (let i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(' ');
}

// Add active class to the current control button (highlight it)
const btnContainer = document.getElementById('btnContainer');
const btns = btnContainer.getElementsByClassName('btn');
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function () {
        let current = document.getElementsByClassName('active');
        current[0].className = current[0].className.replace(' active', '');
        this.className += ' active';
    });
}

async function deleteAll() {
    await fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    let mainDivNode = document.getElementById('mainDiv');
    while (mainDivNode.firstChild) {
        mainDivNode.removeChild(mainDivNode.firstChild);
    }

}

async function editElement(n, id) {
    let span = n.parentNode.parentNode.childNodes[3].getElementsByTagName('span')[0];

    if (span) {
        span.style.display = 'none';

        let text = span.innerHTML;

        // Create an input
        let input = document.createElement('input');
        input.type = 'text';
        input.value = text;
        input.size = Math.max(text.length / 4 * 3, 4);
        span.parentNode.insertBefore(input, span);

        // Focus it, hook blur to undo
        input.focus();
        input.onblur = function () {
            // Remove the input
            span.parentNode.removeChild(input);

            // Update the span
            span.innerHTML = input.value === '' ? '&nbsp;' : input.value;

            // Show the span again
            span.style.display = '';
        };

        input.onchange = () => upload(input.value, id);

    }
}

async function upload(text, id) {
    const body = 'place=' + encodeURIComponent(text);
    const data = await fetch(url + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });
}


async function loadDoc() {
    const place = document.getElementById('post').value;

    const body = 'place=' + encodeURIComponent(place);
    const data = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });

    const res = await data.json();
    await createPlaceHTML(res, place);
}

function createPlaceHTML(result, place) {
    console.info(window.state);
    // get id of element
    const id = result.insertedIds[0];

    // create buttons for delete and edit
    const buttons = document.createElement('p');
    buttons.className = 'icons';
    const deleteButton = document.createElement('img');
    deleteButton.setAttribute('src', 'https://findicons.com/files/icons/1580/devine_icons_part_2/128/trash_recyclebin_empty_closed.png');
    deleteButton.setAttribute('onclick', `deleteElement("${id}",this)`);
    buttons.appendChild(deleteButton);
    const editButton = document.createElement('img');
    editButton.setAttribute('src', 'https://cdn.iconscout.com/public/images/icon/free/png-512/pencil-art-draw-design-sketch-stationary-tool-3b225aa02dd4e31d-512x512.png');
    editButton.setAttribute('onclick', `edit(this,"${id}")`);
    buttons.appendChild(editButton);

    // create element places and mark
    const node = document.createElement('p');
    node.className = 'places';
    const mark = document.createElement('p');
    mark.className = 'mark';
    const textnode = document.createTextNode(place.toString());
    node.appendChild(textnode);

    // create checkbox for visited or not places
    const markCheckbox = document.createElement('input');
    markCheckbox.setAttribute('type', 'checkbox');
    markCheckbox.setAttribute('class', 'markInput');
    markCheckbox.setAttribute('onclick', `setCheckboxStatus(this,"${id}","${place}")`);
    mark.appendChild(markCheckbox);

    // get it all in one scope
    const element = document.createElement('div');
    if (window.state !== 'true') {
        console.info(window.state);
        element.className = 'filterDiv false show';
    } else {
        element.className = 'filterDiv false ';
    }
    element.setAttribute('id', 'filtered');
    element.appendChild(buttons);
    element.appendChild(node);
    element.appendChild(mark);
    document.getElementById('mainDiv').appendChild(element);
}

async function liveSearch() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const ul = document.getElementById('mainDiv');
    const li = ul.getElementsByClassName('filterDiv');

    // Loop through all list items, and hide those who don't match the search query
    for (let i = 0; i < li.length; i++) {
        const a = li[i].getElementsByTagName('p')[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = '';
        } else {
            li[i].style.display = 'none';
        }
    }

}

async function deleteElement(id, n) {
    n.parentNode.parentNode.remove(n);

    await fetch(url + id, {
        method: 'DELETE'
    });
}
