export default ({ id, description, visited, index }) => `
<article class="item item-id-${id} item-index-${index}">
    <div class="item__controls">
        <div class="item__delete-button" title="Удалить">🗑️</div>
        <label class="item__edit-button" for="item-${id}-edit" title="Изменить">✏️</label>
    </div>
    <div class="item__info">
        <input class="item__edit-checkbox" id="item-${id}-edit" type="checkbox">️
        <p class="item__description ${visited && 'item__description_visited'}">${description}</p>
        <input class="item__update-description" type="text" value="${description}">
    </div>
    <div class="item__move">
        <div class="item__move-up" title="Переместить выше">⬆️️</div>
        <div class="item__move-down" title="Переместить ниже">⬇️</div>
    </div>
    
    <input class="item__checkbox" type="checkbox" ${visited &&
        'checked title="Отметить как непосещённое"' || 'title="Отметить как посещённое"'} >
</article>
`;
