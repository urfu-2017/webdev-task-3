const generateReqId = () => Math.random() * (1000000 - 1) + 1

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

    newLocation(model) {
        const requestId = generateReqId()

        this.transaction(data => {
            data.push({ ...model, requestId })

            return data
        })

        return requestId
    }

    acceptCreation(requestId, location) {
        this.transaction(data => {
            const index = data.findIndex(x => x.requestId === requestId)
            data[index] = location

            return data
        })
    }

    rollback(requestId, item) {
        this.transaction(data => {
            const index = data.findIndex(x => x.requestId === requestId)

            if (item) {
                data[index] = item
            } else {
                data.splice(index, 1)
            }

            return data
        })
    }

    updateTarget(id, changes) {
        const index = this.data.findIndex(x => x.id === Number(id))
        const target = this.data[index]

        this.transaction(data => {
            data[index] = { ...target, ...changes }

            return data
        })

        return target
    }

    swapOrder(orderA, orderB) {
        this.transaction(data => {
            const [indexA, indexB] = [
                data.findIndex(x => x.order === orderA),
                data.findIndex(x => x.order === orderB)
            ]

            data[indexA] = { ...data[indexA], order: orderB }
            data[indexB] = { ...data[indexB], order: orderA }

            return data
        })
    }

    removeItem(id) {
        const index = this.data.findIndex(x => x.id === Number(id))
        const target = this.data[index]

        this.transaction(data => {
            data.splice(index, 1)

            return data
        })

        return target
    }

    insertItem(item) {
        this.transaction(data => {
            data.push(item)

            return data
        })
    }

    clear() {
        const data = [...this.data]
        this.transaction(() => [])

        return data
    }

    addOnDataChangeListener(listener) {
        this.listeners.push(listener)
    }

    notifyChange() {
        this.listeners.forEach(listener => listener(this.data))
    }
}

export default new Storage()
