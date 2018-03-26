const parent = document.getElementsByClassName('main-places-list')[0];
const checkboxState = {};
const BASEURL = 'https://webdev-task-2-qejgtbwicx.now.sh';
// Добро пожаловать в ад
function createPlace() {

    var description = document.getElementsByClassName('main-create-place__input')[0].value;
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
                var div = document.createElement('div');
                div.className = 'place';
                div.setAttribute('id', data.id);
                div.innerHTML = `
            <img onclick="removePlace(${data.id})" class="place__img" 
            src="http://www.iconsearch.ru/uploads/icons/futurosoft_icons/16x16/trashcan_full.png" 
            alt="удалить">
            <img onclick="change(${data.id})" class="place__img" 
            src="http://s1.iconbird.com/ico/2013/10/464/w16h161380984696edit8.png" alt="изменить">
            <p class="place__p" >${data.description}</p>
            <input class="place__changeInput" type="text" value="${data.description}">
            <img class="place__image" onclick="move(${data.id},'down')" 
            src="http://s1.iconbird.com/ico/2013/10/464/w16h161380984675down8.png" alt="вниз">
            <img class="place__image" onclick="move(${data.id},'up')" 
            src="http://s1.iconbird.com/ico/2013/10/464/w16h161380984855up8.png" alt="вверх">
            <img onclick="acceptChange(${data.id})" class="place__changeImg" 
            src="http://s1.iconbird.com/ico/2013/12/517/w16h161386955471success7.png" alt="галочка">
            <img onclick="undoChange(${data.id})" class="place__undoImg" 
            src="http://s1.iconbird.com/ico/2013/9/448/w16h16138044427114Delete16x16.png" 
            alt="крест">
            <input class="place__checkbox" type="checkbox"  name=""  ${data.isVisited} disabled>`;
                parent.appendChild(div);

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
    if (type === 'toVisit') {
        document.getElementsByClassName('main-places-header__button')[1].style.backgroundColor =
         'red';
        document.getElementsByClassName('main-places-header__button')[0].style.backgroundColor =
         'rgb(81, 112, 214)';
        document.getElementsByClassName('main-places-header__button')[2].style.backgroundColor =
         'rgb(81, 112, 214)';
        for (let i = 0; i < allPlaces.length; i++) {
            if (allPlaces[i].checked) {
                allPlaces[i].parentElement.style.display = 'none';
            } else {
                allPlaces[i].parentElement.style.display = 'block';
            }
        }
    }
    if (type === 'all') {
        document.getElementsByClassName('main-places-header__button')[0].style.backgroundColor =
         'red';
        document.getElementsByClassName('main-places-header__button')[1].style.backgroundColor =
         'rgb(81, 112, 214)';
        document.getElementsByClassName('main-places-header__button')[2].style.backgroundColor =
         'rgb(81, 112, 214)';
        for (let i = 0; i < allPlaces.length; i++) {
            allPlaces[i].parentElement.style.display = 'block';
        }
    }
    if (type === 'visited') {
        document.getElementsByClassName('main-places-header__button')[2].style.backgroundColor =
         'red';
        document.getElementsByClassName('main-places-header__button')[1].style.backgroundColor =
         'rgb(81, 112, 214)';
        document.getElementsByClassName('main-places-header__button')[0].style.backgroundColor =
         'rgb(81, 112, 214)';
        for (let i = 0; i < allPlaces.length; i++) {
            if (!allPlaces[i].checked) {
                allPlaces[i].parentElement.style.display = 'none';
            } else {
                allPlaces[i].parentElement.style.display = 'block';
            }
        }
    }
}

function search() {
    var input = document.getElementsByClassName('main-header-search__input')[0].value;
    var places = document.getElementsByClassName('place');
    for (let i = 0; i < places.length; i++) {
        if (getComputedStyle(places[i]).display === 'block') {
            if (places[i].children[2].innerHTML.indexOf(input) < 0) {
                places[i].style.display = 'none';
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

    checkboxState.id = {
        check: place.getElementsByClassName('place__checkbox')[0].checked,
        description: place.getElementsByClassName('place__changeInput')[0].value
    };


    place.getElementsByClassName('place__p')[0].style.display = 'none';
    place.getElementsByClassName('place__changeInput')[0].style.display = 'inline-block';
    place.getElementsByClassName('place__checkbox')[0].disabled = false;
    place.getElementsByClassName('place__image')[0].style.display = 'none';
    place.getElementsByClassName('place__image')[1].style.display = 'none';
    place.getElementsByClassName('place__changeImg')[0].style.display = 'inline';
    place.getElementsByClassName('place__undoImg')[0].style.display = 'inline';
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
    place.getElementsByClassName('place__checkbox')[0].checked = checkboxState.id.check;
    place.getElementsByClassName('place__changeInput')[0].value = checkboxState.id.description;
}

function getNormalState(id) {
    var place = document.getElementById(id);
    place.getElementsByClassName('place__p')[0].style.display = 'inline';
    place.getElementsByClassName('place__changeInput')[0].style.display = 'none';
    place.getElementsByClassName('place__checkbox')[0].disabled = true;
    place.getElementsByClassName('place__image')[0].style.display = 'inline';
    place.getElementsByClassName('place__image')[1].style.display = 'inline';
    place.getElementsByClassName('place__changeImg')[0].style.display = 'none';
    place.getElementsByClassName('place__undoImg')[0].style.display = 'none';
}
