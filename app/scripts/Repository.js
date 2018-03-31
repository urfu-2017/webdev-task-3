import LocationAPI from './LocationAPI'
import Storage from './Storage'


export default class Repository {
    static async fetch() {
        const locations = await LocationAPI.getLocations()
        Storage.transaction(() => locations)
    }

    static createItem(model) {
        const requestId = Storage.newLocation(model)

        LocationAPI.saveLocation(model)
            .then(location => Storage.acceptCreation(requestId, location))
            .catch(() => Storage.rollback(requestId))
    }

    static update(id, changes) {
        const target = Storage.updateTarget(id, changes)

        LocationAPI.updateLocation(id, changes)
            .then(location => Storage.updateTarget(id, location))
            .catch(() => Storage.updateTarget(id, target))
    }

    static swap(orderA, orderB) {
        [orderA, orderB] = [orderA, orderB].map(Number)

        Storage.swapOrder(orderA, orderB)

        LocationAPI.swapLocations(orderA, orderB)
            .catch(() => Storage.swapOrder(orderA, orderB))
    }

    static removeItem(id) {
        const removed = Storage.removeItem(id)

        LocationAPI.removeLocation(id)
            .catch(() => Storage.insertItem(removed))
    }

    static clear() {
        const data = Storage.clear()

        LocationAPI.clearAll()
            .catch(() => Storage.transaction(() => data))
    }
}
