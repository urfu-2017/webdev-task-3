const url = 'https://edheltur-webdev-task-2.now.sh/api/v31337';

function fetchWithBody(method, content, suffix) {
    const options = {
        method: method,
        body: JSON.stringify(content),
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${url}/places${suffix || ''}`, options);
}

class PlaceClient {

    /**
     * @param {Function} getId
     */
    constructor(getId) {
        this.getId = getId;
    }

    sendRemove() {
        return fetch(`${url}/places/${this.getId()}`, { method: 'DELETE' });
    }

    sendUpdate(place) {
        return fetchWithBody('PATCH', place, `/${this.getId()}`).then(res => res.json());
    }

    sendMove(offset) {
        return fetchWithBody('POST', { offset }, `/${this.getId()}/move`);
    }
}

class PlacesClient {
    static clear() {
        return fetch(`${url}/places`, { method: 'DELETE' });
    }

    static getAll() {
        return fetch(`${url}/places`, { method: 'GET' })
            .then(res => res.json());
    }


    static create(item) {
        return fetchWithBody('POST', item).then(res => res.json());
    }
}

export { PlaceClient, PlacesClient };
