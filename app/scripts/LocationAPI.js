import { CREATED, OK } from 'http-status-codes'
import config from './config'

const BASE_URL = config.API_BASE_URL
const BASE_HEADER = {
    'Authorization': config.AUTH_TOKEN,
    'Content-Type': 'application/json'
}

class LocationAPI {
    static async getLocations() {
        const response = await fetch(`${BASE_URL}/locations?sortBy=order`, { headers: BASE_HEADER })

        return await response.json()
    }

    static async saveLocation(location) {
        const response = await fetch(`${BASE_URL}/locations`, {
            method: 'PUT',
            body: JSON.stringify(location),
            headers: BASE_HEADER
        })

        if (response.status !== CREATED) {
            throw new Error()
        }

        return await response.json()
    }

    static async removeLocation(id) {
        const response = await fetch(`${BASE_URL}/locations/${id}`, {
            method: 'DELETE',
            headers: BASE_HEADER
        })

        if (response.status !== OK) {
            throw new Error()
        }
    }

    static async updateLocation(id, data) {
        const response = await fetch(`${BASE_URL}/locations/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: BASE_HEADER
        })

        if (response.status !== OK) {
            throw new Error()
        }

        return await response.json()
    }

    static async swapLocations(orderA, orderB) {
        const response = await fetch(`${BASE_URL}/locations?swap=${orderA},${orderB}`, {
            method: 'PATCH',
            headers: BASE_HEADER
        })

        if (response.status !== OK) {
            throw new Error()
        }

        return await response.json()
    }

    static async clearAll() {
        const response = await fetch(`${BASE_URL}/locations`, {
            method: 'DELETE',
            headers: BASE_HEADER
        })

        if (response.status !== OK) {
            throw new Error()
        }
    }
}

export default LocationAPI
