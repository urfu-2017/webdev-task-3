import * as DOM from './DOM'
import ViewModel from './ViewModel'
import Repository from './Repository'
import DragController from './DragController'
import renderLocationComponent from './LocationComponent'

const setupVisitCheckbox = ({ targetID, visitCheckbox }) => {
    visitCheckbox.onclick = () => Repository.update(
        targetID, { visited: visitCheckbox.checked }
    )
}

const setupDraggable = (element, { targetOrder }) => {
    element.ondragstart = () => DragController.setStartDrag(targetOrder)
    element.ondragover = () => DragController.setEndDrag(targetOrder)
    element.ondragend = () => {
        if (DragController.isDifferent()) {
            Repository.swap(...DragController.getSwapedElements())
        }
    }
}

const setupHoverEditForm = (element, { controls, editForm }) => {
    element.onmouseover = () => {
        if (editForm.style.display === 'none') {
            controls.style.display = 'block'
        }
    }

    element.onmouseleave = () => (controls.style.display = 'none')
}

const setupControls = ({
    body,
    editForm,
    controls,
    targetID,
    editButton,
    deleteButton,
    editTitleInput
}) => {
    editButton.onclick = () => {
        ViewModel.hideForms()

        editForm.style.display = 'block'
        body.style.display = 'none'
        controls.style.display = 'none'

        editTitleInput.focus()
        editTitleInput.select()
    }

    deleteButton.onclick = () => Repository.removeItem(targetID)
}

const setupEditForm = ({
    body,
    editForm,
    controls,
    targetID,
    editTitleInput,
    editSubmitButton,
    editCancelButton
}) => {
    editSubmitButton.onclick = () => Repository.update(
        targetID, { title: editTitleInput.value }
    )

    editCancelButton.onclick = () => {
        editForm.style.display = 'none'
        body.style.display = 'block'
        controls.style.display = 'block'
    }

    ViewModel.observeForm(() => {
        editForm.style.display = 'none'
        body.style.display = 'block'
    })
}

const locationHierarchyOf = (element) => {
    const targetID = element.getAttribute('itemId')
    const targetOrder = element.getAttribute('order')
    const controls = element.querySelector('.location__controls')
    const editForm = element.querySelector('.location__edit')
    const body = element.querySelector('.location__body')

    const visitCheckbox = element.querySelector('.location__body_visited')

    const editButton = controls.querySelector('.location__controls_edit')
    const deleteButton = controls.querySelector('.location__controls_delete')

    const editSubmitButton = editForm.querySelector('.location__edit_save')
    const editCancelButton = editForm.querySelector('.location__edit_cancel')
    const editTitleInput = editForm.querySelector('.location__edit_title')

    return {
        body,
        controls,
        editForm,
        targetID,
        targetOrder,
        visitCheckbox,
        editButton,
        deleteButton,
        editSubmitButton,
        editCancelButton,
        editTitleInput
    }
}

/* Setup event handlers */
DOM.search.addEventListener('keyup', () => {
    ViewModel.changeQuery(DOM.search.value)
})

DOM.radioVisitButtons.forEach(radio => {
    radio.onclick = () => ViewModel.changeStatus(radio.value)
})

DOM.radioTypeButtons.forEach(radio => {
    radio.onclick = () => ViewModel.changeModel({ type: radio.value })
})

DOM.titleEditInputText.addEventListener('keyup', () => {
    ViewModel.changeModel({ title: DOM.titleEditInputText.value })
})

DOM.submitCreateButton.onclick = () => {
    Repository.createItem(ViewModel.getCreationModel())
}

DOM.submitDeleteButton.onclick = Repository.clear

ViewModel.observe((data) => {
    DOM.content.innerHTML = ''
    data.forEach(item => (DOM.content.innerHTML += renderLocationComponent(item)))

    ViewModel.clearForms()

    Object.entries(DOM.locationElements).forEach(([, element]) => {
        const hierarchy = locationHierarchyOf(element)

        setupDraggable(element, hierarchy)
        setupHoverEditForm(element, hierarchy)
        setupVisitCheckbox(hierarchy)
        setupControls(hierarchy)
        setupEditForm(hierarchy)
    })
})

Repository.fetch()
