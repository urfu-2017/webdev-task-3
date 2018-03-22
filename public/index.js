'use strict';

const onPillClick = pill => () => {
    ofClass('pill-active').forEach(pillActive => {
        pillActive.classList.replace('pill-active', 'pill');
        pillActive.onclick = onPillClick(pillActive);
    })
    pill.classList.replace('pill', 'pill-active');
    pill.onclick = nop;
    reRender();
}

const onSearchInputChange = searchInput => () => {
    reRender();
}

const createEmptyListNode = () => createElement({ name: 'p', cls: 'spot-list-empty', text: 'Список пуст' });

const renderSpots = spots => {
    clearChildren(spotListContainer);
    if (!spots.length) {
        spotListContainer.appendChild(createEmptyListNode());
        return;
    }
    const spotList = createSpotList();
    if (spots.length === 1) {
        spotList.appendChild(createSpotListItem(spots[0]))
    } else {
        spotList.appendChild(createSpotListItem(spots[0], null, spots[1]))
        for(let i = 1; i < (spots.length - 1); i++) {
            spotList.appendChild(createSpotListItem(spots[i], spots[i - 1], spots[i + 1]));
        }
        spotList.appendChild(createSpotListItem(spots[spots.length - 1], spots[spots.length - 2], null));
    }

    spotListContainer.appendChild(spotList);
}

const createSpotList = () => createElement({ name: 'ul', cls: 'spot-list' });

const indexOfSpot = spot => renderedSpots.findIndex(x => x.id === spot.id);

const swapSpots = async (current, next) => {
    const [i, j] = [indexOfSpot(next), indexOfSpot(current)];
    await jetch(`/api/spots/${current.id}/swap-with?id=${next.id}`, 'POST');
    const tmp = renderedSpots[i];
    renderedSpots[i] = renderedSpots[j];
    renderedSpots[j] = tmp;
    reRender();
}

const setVisited = async (id, visited) =>  {
    await jetch(`/api/spots/${id}`, 'PATCH', { visited });
    renderedSpots.find(spot => spot.id === id).visited = visited;
    reRender();
}

const setDesc = async (id, description) =>  {
    await jetch(`/api/spots/${id}`, 'PATCH', { description });
    renderedSpots.find(spot => spot.id === id).desc = description;
    reRender();
}

const createSpotListItem = ({id, desc, visited}, prev = null, next = null) => {
    const editButton = createElement({ name: 'button', classes: ['spot-edit', 'edit-button'], title: 'Изменить описание'  });
    const removeButton = createElement({ name: 'button', classes: ['spot-remove', 'remove-button'], title: 'Удалить место' });
    const input = createElement({ name: 'input', cls: 'spot-desc-input', text: desc, attrs: { readonly: true } });
    if (visited)
        input.classList.add('line-thru');
    const accept = createElement({ name: 'button', classes: ['spot-accept', 'accept-button', 'hidden'], title: 'Сохранить изменения' });
    const decline = createElement({ name: 'button', classes: ['spot-decline', 'decline-button', 'hidden'], title: 'Отменить изменения' });
    const up = createElement({ name: 'button', classes: ['spot-up', 'up-button'] });
    
    const down = createElement({ name: 'button', classes: ['spot-down', 'down-button'] });
    if (prev === null)
        up.classList.add('hidden');
    if (next === null)
        down.classList.add('hidden');
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
        setSubmitButton(input, accept, decline);
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
    up.onclick = () => swapSpots({id}, prev);
    down.onclick = () => swapSpots({id}, next);
    checkbox.onchange = () => setVisited(id, checkbox.checked);
    accept.onclick = () => setDesc(id, input.value);
    decline.onclick = () => {
        setReadonly();
        input.value = beforeValue;
    }
    input.onclick = onInputClick;
    editButton.onclick = () => {
        onInputClick();
        input.focus();
    }
    removeButton.onclick = async () => {
        await jetch(`/api/spots/${id}`, 'DELETE');
        renderedSpots = renderedSpots.filter(x => x.id !== id);
        reRender();
    }

    return createElement({ name: 'li', cls: 'spot-list-item', children: [
        editButton, removeButton, input, accept, decline,
        createElement({ name: 'div', cls: 'spot-list-item-right', children: [up, down, checkbox] })
    ]});
}

const getVisitedFilter = () => {
    const [pill] = ofClass('pill-active');
    return pill.classList.contains('pill-all') ? null :
        pill.classList.contains('pill-visited'); 
}

const filter = (searchQuery, visitedFilter) => 
    renderedSpots.filter(({ desc, visited }) => 
        desc.includes(searchQuery) && [null, visited].includes(visitedFilter));

const reRender = () => renderSpots(filter(searchInput.value, getVisitedFilter()));

const [newSpotInput] = ofClass('new-spot-input'); 

const [searchInput] = ofClass('search-input');
searchInput.oninput = onSearchInputChange(searchInput);
searchInput.onpropertychange = onSearchInputChange(searchInput);

const [newSpotButton] = ofClass('new-spot-input-button');
newSpotButton.onclick = async () => {
    const description = newSpotInput.value;
    const json = await jetch('/api/spots', 'POST', { description }).then(x => x.json());
    renderedSpots.push({ id: json.id, desc: description, visited: false });
    renderSpots(renderedSpots);
}

setSubmitButton(newSpotInput, newSpotButton);

const [spotList] = ofClass('spot-list');
const [spotListContainer] = ofClass('spot-list-container');
ofClass('pill').forEach(pill => pill.onclick = onPillClick(pill));
ofClass('spots-clear-button')[0].onclick = async () => {
    if (!confirm('Вы действительно хотите очистить весь список?'))
        return;
    await jetch('/api/spots/all', 'DELETE');
    jetch('/api/spots/all', 'DELETE');
    renderedSpots = [];
    renderSpots([]);
} 

let renderedSpots = [];

jetch('/api/spots').then(x => x.json()).then(json => {
        renderedSpots = json.map(({id, description, visited}) => ({id, desc: description, visited: visited || false}));
        renderSpots(renderedSpots);
}, console.error);
