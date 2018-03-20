import LocationAPI from './LocationAPI'
import Storage from './Storage'

export default class Repository {
    static async fetch() {
        const locations = await LocationAPI.getLocations()
        Storage.transaction(() => locations)
    }

    static async createItem(model) {
        const item = await LocationAPI.saveLocation(model)
        Storage.transaction(data => {
            data.push(item)

            return data
        })
    }

    static async update(id, changes) {
        const location = await LocationAPI.updateLocation(id, changes)
        Storage.transaction(data => {
            const index = data.findIndex(x => x.id === location.id)
            data[index] = location

            return data
        })
    }

    static async swap(orderA, orderB) {
        const swapped = await LocationAPI.swapLocations(orderA, orderB)
        swapped.forEach(item => Storage.transaction(data => {
            const index = data.findIndex(x => x.id === item.id)
            data[index] = item

            return data
        }))
    }

    static async removeItem(id) {
        await LocationAPI.removeLocation(id)
        Storage.transaction(data => {
            const index = data.findIndex(x => x.id === Number(id))
            data.splice(index, 1)

            return data
        })
    }

    static async clear() {
        await LocationAPI.clearAll()
        Storage.transaction(() => [])
    }
}
