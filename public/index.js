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
    spots.forEach(spot => spotList.appendChild(createSpotListItem(spot)));

    spotListContainer.appendChild(spotList);
}

const createSpotList = () => createElement({ name: 'ul', cls: 'spot-list' });

const createSpotListItem = ({id, desc, visited}) => {
    // TODO
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
    checkbox.onchange = () => {
        const visited = checkbox.checked;
        jetch(`/api/spots/${id}`, 'PATCH', { visited }).then(x => { 
                renderedSpots.find(spot => spot.id === id).visited = visited;
                reRender();
            }, console.error);
    }
    accept.onclick = () => {
        const description = input.value;
        jetch(`/api/spots/${id}`, 'PATCH', { description }).then(x => {
            renderedSpots.find(spot => spot.id === id).desc = description;
            setReadonly(); 
        }, console.error);
    }
    decline.onclick = () => {
        setReadonly();
        input.value = beforeValue;
    }
    input.onclick = onInputClick;
    editButton.onclick = () => {
        onInputClick();
        input.focus();
    }
    removeButton.onclick = () => {
        jetch(`/api/spots/${id}`, 'DELETE')
            .then(y => {
                renderedSpots = renderedSpots.filter(x => x.id !== id);
                reRender();
            }, console.error)
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
newSpotButton.onclick = () => {
    const description = newSpotInput.value;
    jetch('/api/spots', 'POST', { description }).then(x => x.json())
        .then(json => {
            renderedSpots.push({ id: json.id, desc: description, visited: false });
            renderSpots(renderedSpots);
        }, console.error);
}

setSubmitButton(newSpotInput, newSpotButton);

const [spotList] = ofClass('spot-list');
const [spotListContainer] = ofClass('spot-list-container');
ofClass('pill').forEach(pill => pill.onclick = onPillClick(pill));
ofClass('spots-clear-button')[0].onclick = () => {
    if (!confirm('Вы действительно хотите очистить весь список?'))
        return;
    jetch('/api/spots/all', 'DELETE')
        .then(x => { 
            renderedSpots = [];
            renderSpots([])
        }, console.error);
} 

let renderedSpots = [];

jetch('/api/spots').then(x => x.json()).then(json => {
        renderedSpots = json.map(({id, description, visited}) => ({id, desc: description, visited: visited || false}));
        renderSpots(renderedSpots);
}, console.error);
