export default ({ id, title, type, date, visited, order, requestId }) => (requestId) ? `
    <div class="stubLocation">
        <input type="checkbox" disabled>
        <div class="location__body">
           <p class="location__body_title">${title}</p>    
        </div>
    </div>
` : `
    <div draggable="true" class="location" itemId="${id}" order="${order}">
        <input type="checkbox" class="location__body_visited" ${visited && 'checked'}>
         <div class="location__controls" style="display: none">
            <button class="location__controls_edit">изменить</button>
            <button class="location__controls_delete">удалить</button>
        </div>
        <div class="location__body">
           <p class="location__body_title">${title}</p>    
           <p class="location__body_type">${type}</p>
           <p class="location__body_date">${new Date(date).toLocaleDateString()}</p>    
        </div>
        <div class="location__edit" style="display: none">
            <input type="text" class="location__edit_title" value="${title}">
            <button class="location__edit_save">сохранить</button>
            <button class="location__edit_cancel">отменить</button>
        </div>
    </div>
`
