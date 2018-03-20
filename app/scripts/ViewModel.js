import Storage from './Storage'

const STATUSES = {
    1: false,
    2: true
}

class ViewModel {
    constructor() {
        this.observers = []
        this.editForms = []
        this.renderData = []
        this.searchQuery = ''
        this.status = STATUSES[0]
        this.creationModel = {}

        Storage.addOnDataChangeListener(this.render.bind(this))
    }

    render(data) {
        this.renderData = data.filter(item => {
            return item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
                ((this.status !== undefined) ? item.visited === this.status : true)
        }).sort((a, b) => a.order > b.order ? 1 : -1)

        this.notifyObservers()
    }

    observe(observer) {
        this.observers.push(observer)
    }

    notifyObservers() {
        this.observers.forEach(observer => observer(this.renderData.reverse()))
    }

    changeStatus(status) {
        this.status = STATUSES[status]
        Storage.read(this.render.bind(this))
    }

    changeQuery(query) {
        this.searchQuery = query
        Storage.read(this.render.bind(this))
    }

    changeModel(changes) {
        this.creationModel = { ...this.creationModel, ...changes }
    }

    getCreationModel() {
        return this.creationModel
    }

    clearForms() {
        this.editForms = []
    }

    hideForms() {
        this.editForms.forEach(hideForm => hideForm())
    }

    observeForm(editForm) {
        this.editForms.push(editForm)
    }
}

export default new ViewModel()
