'use strict';

const ofClass = classname => {
    const elements = document.getElementsByClassName(classname);
    const result = [];
    for (let i = 0; i < elements.length; i++)
        result.push(elements.item(i))
    return result;
}

const nop = () => {};

const onPillClick = pill => () => {
    ofClass('pill-active').forEach(pillActive => {
        pillActive.classList.replace('pill-active', 'pill');
        pillActive.onclick = onPillClick(pillActive);
    })
    pill.classList.replace('pill', 'pill-active');
    pill.onclick = nop;
    if (pill.classList.contains('pill-all')) {
        alert('all')
    } else if (pill.classList.contains('pill-visited')) {
        alert('visited')
    } else if (pill.classList.contains('pill-not-visited')) {
        alert('not visited')
    }
}

const onSearchInputChange = searchInput => () => {
    alert(searchInput.value);
}

const createEmptyListNode = () => createElement({ name: 'p', cls: 'spot-list-empty', text: 'Список пуст' });

const renderSpots = spots => {
    if (!spots.length) {
        clearChildren(spotListContainer);
        spotListContainer.appendChild(createEmptyListNode());
        return;
    }
    const spotList = createSpotList();
    spots.forEach(spot => spotList.appendChild(createSpotListItem(spot)));

    spotListContainer.appendChild(spotList);
}

const createElement = ({ name, classes = [], title = null, text = null, cls = null }) => {
    const result = document.createElement(name);
    if (cls !== null)
        result.classList.add(cls);
    else
        classes.forEach(cls => result.classList.add(cls));
    if (title !== null) 
        result.setAttribute('title', title);
    if (text !== null)
        result.innerText = text;

    return result;
}


const createSpotList = () => createElement({ name: 'ul', cls: 'spot-list' });

const createSpotListItem = ({id, desc, visited}) => {
    const li = document.createElement('li');
    li.classList.add('spot-list-item');

    li.appendChild(document.createElement(''))

    return li;
}

const clearChildren = node => {
    while (node.firstChild) 
        node.removeChild(node.firstChild)
}

const [newSpotInput] = ofClass('new-spot-input'); 
newSpotInput.onkeydown = e => {
    if (e.keyCode === 13)
        newSpotButton.click();
}

const [searchInput] = ofClass('search-input');
searchInput.oninput = onSearchInputChange(searchInput);
searchInput.onpropertychange = onSearchInputChange(searchInput);

const [newSpotButton] = ofClass('new-spot-input-button');
newSpotButton.onclick = () => {
    alert(newSpotInput.value);
} 
const [spotList] = ofClass('spot-list');
const [spotListContainer] = ofClass('spot-list-container');
ofClass('pill').forEach(pill => pill.onclick = onPillClick(pill));
ofClass('spots-clear-button')[0].onclick = () => {
    renderSpots([]);
    alert('clear all');
} 

