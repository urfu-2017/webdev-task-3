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
    clearChildren(spotListContainer);
    if (!spots.length) {
        spotListContainer.appendChild(createEmptyListNode());
        return;
    }
    const spotList = createSpotList();
    spots.forEach(spot => spotList.appendChild(createSpotListItem(spot)));

    spotListContainer.appendChild(spotList);
}

const createElement = ({ name, classes = [], title = null, text = null, cls = null, attrs = {}, children = [] }) => {
    const result = document.createElement(name);
    if (cls !== null)
        result.classList.add(cls);
    else
        classes.forEach(cls => result.classList.add(cls));
    if (title !== null) 
        result.setAttribute('title', title);
    if (text !== null)
        if (name === 'input')
            result.value = text;
        else
            result.innerText = text;
    for (let [attrName, attrValue] of Object.entries(attrs))
        if (attrValue !== false)
            result.setAttribute(attrName, attrValue);
    children.forEach(child => result.appendChild(child));

    return result;
}

const setSubmitButton = (node, btn) => {
    node.onkeydown = e => {
        if (e.keyCode === 13)
            btn.click();
    }
}

const createSpotList = () => createElement({ name: 'ul', cls: 'spot-list' });

const createSpotListItem = ({id, desc, visited}) => {
    const editButton = createElement({ name: 'button', classes: ['spot-edit', 'edit-button'], title: 'Изменить описание'  });
    const removeButton = createElement({ name: 'button', classes: ['spot-remove', 'remove-button'], title: 'Удалить место' });
    const input = createElement({ name: 'input', cls: 'spot-desc-input', text: desc, attrs: { readonly: true } });
    if (visited)
        input.classList.add('line-thru');
    const accept = createElement({ name: 'button', classes: ['spot-accept', 'accept-button', 'hidden'], title: 'Сохранить изменения' });
    const decline = createElement({ name: 'button', classes: ['spot-decline', 'decline-button', 'hidden'], title: 'Отменить изменения' });
    const up = createElement({ name: 'button', classes: ['spot-up', 'up-button'] });
    const down = createElement({ name: 'button', classes: ['spot-down', 'down-button'] });
    const checkbox = createElement({ name: 'input', title: 'Пометить посещенным', attrs: { type: 'checkbox', checked: visited } });
    let beforeValue = input.value;
    const onInputClick = () => {
        beforeValue = input.value;
        input.onclick = nop;
        input.classList.replace('spot-desc-input', 'spot-desc-input-active');
        input.removeAttribute('readonly');
        accept.classList.remove('hidden');
        decline.classList.remove('hidden');
        editButton.classList.add('hidden');
        setSubmitButton(input, accept);
    }
    const setReadonly = () => {
        input.onclick = onInputClick;
        input.classList.replace('spot-desc-input-active', 'spot-desc-input');
        input.setAttribute('readonly', true);
        accept.classList.add('hidden');
        decline.classList.add('hidden');
        editButton.classList.remove('hidden')
        input.onkeydown = nop;
    }
    checkbox.onchange = () => {
        input.classList.toggle('line-thru');
    }
    accept.onclick = () => {
        setReadonly();
    }
    decline.onclick = () => {
        setReadonly();
        input.value = beforeValue;
    }
    input.onclick = onInputClick;
    editButton.onclick = onInputClick;

    return createElement({ name: 'li', cls: 'spot-list-item', children: [
        editButton, removeButton, input, accept, decline,
        createElement({ name: 'div', cls: 'spot-list-item-right', children: [up, down, checkbox] })
    ] });
}

const clearChildren = node => {
    while (node.firstChild) 
        node.removeChild(node.firstChild)
}

const [newSpotInput] = ofClass('new-spot-input'); 

const [searchInput] = ofClass('search-input');
searchInput.oninput = onSearchInputChange(searchInput);
searchInput.onpropertychange = onSearchInputChange(searchInput);

const [newSpotButton] = ofClass('new-spot-input-button');
newSpotButton.onclick = () => {
    renderSpots([{ id: 'asdasdasd', desc: newSpotInput.value, visited: false }])
    //alert(newSpotInput.value);
}

setSubmitButton(newSpotInput, newSpotButton);

const [spotList] = ofClass('spot-list');
const [spotListContainer] = ofClass('spot-list-container');
ofClass('pill').forEach(pill => pill.onclick = onPillClick(pill));
ofClass('spots-clear-button')[0].onclick = () => {
    renderSpots([]);
    alert('clear all');
} 

renderSpots([
    { id: 'asdasda', desc: 'adesccccc', visited: true }, 
    { id: 'asdasda', desc: 'adesccccc', visited: false }, 
])
