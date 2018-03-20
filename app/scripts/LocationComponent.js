export default ({ id, title, description, date, visited, order }) => `
    <div draggable="true" class="location" itemId="${id}" order="${order}">
        <input type="checkbox" class="location__body_visited" ${visited && 'checked'}>
         <div class="location__controls" style="display: none">
            <input class="location__controls_edit" type="button" value="изменить">
            <input class="location__controls_delete" type="button" value="удалить">
        </div>
        <div class="location__body">
           <p class="location__body_title">${title}</p>    
           ${description ? `<p class="location__body_description">${description}</p>` : ''} 
           <p class="location__body_date">${date}</p>    
        </div>
        <div class="location__edit" style="display: none">
            <input type="text" class="location__edit_title" value="${title}">
            <input class="location__edit_save" type="button" value="сохранить">
            <input class="location__edit_cancel" type="button" value="отменить">
        </div>
    </div>
`
