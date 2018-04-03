'use strict'

const createEmptyListNode = () => createElement({ name: 'p', cls: 'spot-list-empty', text: 'Список пуст' })
const createSpotList = () => createElement({ name: 'ul', cls: 'spot-list' })

const renderSpots = spots => {
    clearChildren(spotListContainer)
    if (!spots.length) {
        spotListContainer.appendChild(createEmptyListNode())
        return
    }
    const spotList = createSpotList()
    if (spots.length === 1) {
        spotList.appendChild(createSpotListItem(spots[0]))
    } else {
        spotList.appendChild(createSpotListItem(spots[0], null, spots[1]))
        for(let i = 1; i < (spots.length - 1); i++)
            spotList.appendChild(createSpotListItem(spots[i], spots[i - 1], spots[i + 1]))
        spotList.appendChild(createSpotListItem(spots[spots.length - 1], spots[spots.length - 2], null))
    }
    spotListContainer.appendChild(spotList)
}

const indexOfSpot = spot => renderedSpots.findIndex(x => x.id === spot.id)

class SpotListItemBuilder {
    constructor(current, prev = null, next = null) {
        this.current = current
        this.prev = prev
        this.next = next
        this.editButton = createElement({ name: 'button', classes: ['spot-edit', 'edit-button'], title: 'Изменить описание'  })
        this.removeButton = createElement({ name: 'button', classes: ['spot-remove', 'remove-button'], title: 'Удалить место' })
        this.input = createElement({ name: 'input', cls: 'spot-desc-input', text: this.current.desc, attrs: { readonly: true } })
        this.accept = createElement({ name: 'button', classes: ['spot-accept', 'accept-button', 'hidden'], title: 'Сохранить изменения' })
        this.decline = createElement({ name: 'button', classes: ['spot-decline', 'decline-button', 'hidden'], title: 'Отменить изменения' })
        this.up = createElement({ name: 'button', classes: ['spot-up', 'up-button'] })
        this.down = createElement({ name: 'button', classes: ['spot-down', 'down-button'] })
        this.checkbox = createElement({ name: 'input', title: 'Пометить посещенным', attrs: { type: 'checkbox', checked: this.current.visited } })
        this.beforeDesc = this.input.value
    }

    addInitialStyling() {
        if (this.current.visited) {
            this.input.classList.add('line-thru')
        }
        if (this.prev === null) {
            this.up.classList.add('hidden')
        }
        if (this.next === null) {
            this.down.classList.add('hidden')
        }

        return this
    }

    build() {
        return createElement({ name: 'li', cls: 'spot-list-item', children: [
            this.editButton, this.removeButton, this.input, this.accept, this.decline,
            createElement({ name: 'div', cls: 'spot-list-item-right', children: [this.up, this.down, this.checkbox] })
        ]})    
    }

    onInputClick() {
        this.beforeDesc = this.input.value
        this.input.onclick = nop
        this.input.classList.replace('spot-desc-input', 'spot-desc-input-active')
        this.input.removeAttribute('readonly')
        this.accept.classList.remove('hidden')
        this.decline.classList.remove('hidden')
        this.editButton.classList.add('hidden')
        setSubmitButton(this.input, this.accept, this.decline)
    }

    setReadonly() {
        this.input.onclick = () => this.onInputClick()
        this.input.classList.replace('spot-desc-input-active', 'spot-desc-input')
        this.input.setAttribute('readonly', true)
        this.accept.classList.add('hidden')
        this.decline.classList.add('hidden')
        this.editButton.classList.remove('hidden')
        this.input.onkeydown = nop
    }

    async swapWithCurrent(spot) {
        const [i, j] = [indexOfSpot(spot), indexOfSpot(this.current)]
        await jetch(`/api/spots/${this.current.id}/swap-with?id=${spot.id}`, 'POST')
        const tmp = renderedSpots[i]
        renderedSpots[i] = renderedSpots[j]
        renderedSpots[j] = tmp
        reRender()
    }

    async setVisited() {
        const visited = this.checkbox.checked
        await jetch(`/api/spots/${this.current.id}`, 'PATCH', { visited })
        renderedSpots.find(spot => spot.id === this.current.id).visited = visited
        reRender()
    }

    async setDesc() {
        const description = this.input.value
        await jetch(`/api/spots/${this.current.id}`, 'PATCH', { description })
        renderedSpots.find(spot => spot.id === this.current.id).desc = description
        reRender()
    }

    addHandlers() {
        this.up.onclick = () => this.swapWithCurrent(this.prev)
        this.down.onclick = () => this.swapWithCurrent(this.next)
        this.checkbox.onchange = () => this.setVisited()
        this.accept.onclick = () => this.setDesc()
        this.decline.onclick = () => {
            this.setReadonly()
            this.input.value = this.beforeDesc
        }
        this.input.onclick = () => this.onInputClick()
        this.editButton.onclick = () => {
            this.onInputClick()
            this.input.focus()
        }
        this.removeButton.onclick = async () => {
            await jetch(`/api/spots/${this.current.id}`, 'DELETE')
            renderedSpots = renderedSpots.filter(x => x.id !== this.current.id)
            reRender()
        }

        return this
    }
}

const onPillClick = pill => () => {
    ofClass('pill-active').forEach(pillActive => {
        pillActive.classList.replace('pill-active', 'pill')
        pillActive.onclick = onPillClick(pillActive)
    })
    pill.classList.replace('pill', 'pill-active')
    pill.onclick = nop
    reRender()
}

const createSpotListItem = (current, prev, next) => 
    new SpotListItemBuilder(current, prev, next).addInitialStyling().addHandlers().build()

const getVisitedFilter = () => {
    const [pill] = ofClass('pill-active')
    return pill.classList.contains('pill-all') ? null :
        pill.classList.contains('pill-visited') 
}

const filter = (searchQuery, visitedFilter) => 
    renderedSpots.filter(({ desc, visited }) => 
        desc.includes(searchQuery) && [null, visited].includes(visitedFilter))

const reRender = () => renderSpots(filter(searchInput.value, getVisitedFilter()))

const [newSpotInput] = ofClass('new-spot-input') 
const [searchInput] = ofClass('search-input')
const [newSpotButton] = ofClass('new-spot-input-button')
const [spotList] = ofClass('spot-list')
const [spotListContainer] = ofClass('spot-list-container')
let renderedSpots = []

searchInput.oninput = () => reRender()
searchInput.onpropertychange = () => reRender()
newSpotButton.onclick = async () => {
    const description = newSpotInput.value
    const json = await jetch('/api/spots', 'POST', { description }).then(x => x.json())
    renderedSpots.push({ id: json.id, desc: description, visited: false })
    renderSpots(renderedSpots)
}
setSubmitButton(newSpotInput, newSpotButton)
ofClass('pill').forEach(pill => pill.onclick = onPillClick(pill))
ofClass('spots-clear-button')[0].onclick = async () => {
    if (!confirm('Вы действительно хотите очистить весь список?')) {
        return
    }
    await jetch('/api/spots/all', 'DELETE')
    jetch('/api/spots/all', 'DELETE')
    renderedSpots = []
    renderSpots([])
} 

jetch('/api/spots').then(x => x.json()).then(json => {
        renderedSpots = json.map(({id, description, visited}) => ({id, desc: description, visited: visited || false}))
        renderSpots(renderedSpots)
}, console.error)
