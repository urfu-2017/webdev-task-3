const parent = document.getElementsByClassName('main-places-list')[0];
const checkboxState = {};
const BASEURL = 'https://webdev-task-2-qejgtbwicx.now.sh';
// Добро пожаловать в ад
function createPlace() {

    var description = document.querySelector('.main-create-place__input').value.trim();
    if (description) {
        fetch(BASEURL + '/place', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description })
        }).then(response => {
            return response.json();
        })
            .then((data) => {

                if (data.isVisited === true) {
                    data.isVisited = 'checked';
                } else {
                    data.isVisited = '';
                }
                
                var hiddenPlace = document.getElementsByClassName("place_hidden")[0];
                var place = hiddenPlace.cloneNode(true);
                place.setAttribute('id', data.id);
                place.querySelector('.place_remove').addEventListener("click", removePlace.bind(null, data.id));
                place.querySelector('.place_change').addEventListener("click", change.bind(null, data.id));
                place.querySelector('.place__p').innerHTML = data.description;
                place.querySelector('.place__changeInput').value = data.description;
                place.querySelector('.place_move_down').addEventListener("click", move.bind(null, data.id,'down'));
                place.querySelector('.place_move_up').addEventListener("click", move.bind(null, data.id,'up'));
                place.querySelector('.place__changeImg').addEventListener("click", acceptChange.bind(null, data.id));
                place.querySelector('.place__undoImg').addEventListener("click", undoChange.bind(null, data.id));
                data.isVisited === 'checked'? place.querySelector('.place__checkbox').checked =true: "";
                place.className="place";
                parent.appendChild(place);
            });
            
    }
}

function removeAll() {
    fetch(BASEURL + '/place', {
        method: 'delete'
    });
    parent.innerHTML = '';

}

function removePlace(id) {
    fetch(BASEURL + '/place/' + id, {
        method: 'delete'
    });
    var son = document.getElementById(id);
    parent.removeChild(son);
}

function show(type) {
    var allPlaces = document.getElementsByClassName('place__checkbox');
    var firstButton = document.querySelector('.button_first');
    var secondButton = document.querySelector('.button_second');
    var thirdButton = document.querySelector('.button_third');
    if (type === 'toVisit') {
        secondButton.classList.add('button_red');
        secondButton.classList.remove('button_blue');
        firstButton.classList.add('button_blue');
        firstButton.classList.remove('button_red');
        thirdButton.classList.add('button_blue');
        thirdButton.classList.remove('button_red');
        for (let i = 0; i < allPlaces.length; i++) {
            if (allPlaces[i].checked) {
                allPlaces[i].parentElement.classList.add('display_none');
                allPlaces[i].parentElement.classList.remove('display_block');
            } else {
                allPlaces[i].parentElement.classList.add('display_block');
                allPlaces[i].parentElement.classList.remove('display_none');
            }
        }
    }
    if (type === 'all') {
        firstButton.classList.add('button_red');
        firstButton.classList.remove('button_blue');
        secondButton.classList.add('button_blue');
        secondButton.classList.remove('button_red');
        thirdButton.classList.add('button_blue');
        thirdButton.classList.remove('button_red');
        for (let i = 0; i < allPlaces.length; i++) {
            allPlaces[i].parentElement.classList.add('display_block');
            allPlaces[i].parentElement.classList.remove('display_none');
        }
    }
    if (type === 'visited') {
         thirdButton.classList.add('button_red');
         thirdButton.classList.remove('button_blue');
         firstButton.classList.add('button_blue');
         firstButton.classList.remove('button_red');
         secondButton.classList.add('button_blue');
         secondButton.classList.remove('button_red');
        for (let i = 0; i < allPlaces.length; i++) {
            if (!allPlaces[i].checked) {
                allPlaces[i].parentElement.classList.add('display_none');
                allPlaces[i].parentElement.classList.remove('display_block');
            } else {
                allPlaces[i].parentElement.classList.add('display_block');
                allPlaces[i].parentElement.classList.remove('display_none');
            }
        }
    }
}

function search() {
    var input = document.getElementsByClassName('main-header-search__input')[0].value;
    var places = document.getElementsByClassName('place');
    for (let i = 0; i < places.length; i++) {
        if (getComputedStyle(places[i]).display === 'block') {
            if (places[i].querySelector('.place__p').innerHTML.indexOf(input) < 0) {
                places[i].classList.add('display_none');
            }
        }
    }
    document.getElementsByClassName('main-header-search__input')[0].value = '';
}

function move(id, type) {
    var temp;
    var element = document.getElementById(id);
    var elementToChange = type === 'up'
        ? document.getElementById(id).previousElementSibling
        : document.getElementById(id).nextElementSibling;
    var places = document.getElementsByClassName('place');

    var number;


    for (let i = 0; i < places.length; i++) {

        if (Number(places[i].id) === id) {
            number = i;
            break;
        }
    }
    if (elementToChange !== null) {
        if (type === 'down') {
            fetch(`${BASEURL}/swap?id1=${number}&id2=${number + 1}`, {
                method: 'get'
            });
            parent.insertBefore(elementToChange, element);
        }
        if (type === 'up') {
            fetch(`${BASEURL}/swap?id1=${number}&id2=${number - 1}`, {
                method: 'get'
            });
            parent.insertBefore(element, elementToChange);
        }
    }
}

function change(id) {
    var place = document.getElementById(id);

    checkboxState[id] = {
        check: place.getElementsByClassName('place__checkbox')[0].checked,
        description: place.getElementsByClassName('place__changeInput')[0].value
    };
    place.classList.add('place_mod_edit')
    place.getElementsByClassName('place__checkbox')[0].disabled = false;
}

function acceptChange(id) {
    var place = document.getElementById(id);
    place.getElementsByClassName('place__p')[0].innerHTML =
     place.getElementsByClassName('place__changeInput')[0].value;

    fetch(BASEURL + '/place/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: place.getElementsByClassName('place__changeInput')[0].value,
            isVisited: place.getElementsByClassName('place__checkbox')[0].checked
        })
    });
    getNormalState(id);
}

function undoChange(id) {
    getNormalState(id);
    var place = document.getElementById(id);
    place.getElementsByClassName('place__checkbox')[0].checked = checkboxState[id].check;
    place.getElementsByClassName('place__changeInput')[0].value = checkboxState[id].description;
}

function getNormalState(id) {
    var place = document.getElementById(id);
    place.classList.remove('place_mod_edit')
    place.getElementsByClassName('place__checkbox')[0].disabled = true;
}
