class Storage {
    constructor() {
        this.data = []
        this.listeners = []
    }

    read(reader) {
        reader([...this.data])
    }

    transaction(mapper) {
        this.data = mapper(this.data)
        this.notifyChange()
    }

    addOnDataChangeListener(listener) {
        this.listeners.push(listener)
    }

    notifyChange() {
        this.listeners.forEach(listener => listener(this.data))
    }
}

export default new Storage()
