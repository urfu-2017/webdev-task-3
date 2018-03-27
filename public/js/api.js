export class PlacesAPI {
    makeURL(tail) {
        return `${this.apiURL}/${tail}`;
    }

    makeRequest(url, method, body, options) {
        url = this.makeURL(url);
        if (body) {
            body = JSON.stringify(body);
        }
        let fetchOptions = Object.assign({
            body: body,
            headers: {
                'Content-Type': 'application/json'
            },
            method: method,
            mode: 'cors'
        }, options);

        return fetch(url, fetchOptions);
    }

    constructor(apiURL) {
        this.apiURL = apiURL;
    }

    create(name) {
        return this.makeRequest('places/', 'post', { name: name });
    }

    edit(id, name) {
        return this.makeRequest(`places/${id}/edit/`, 'put', { name: name });
    }

    list() {
        return this.makeRequest('places/', 'get').then(
            response => response.json(), console.error
        );
    }

    delete(id) {
        return this.makeRequest(`places/${id}/`, 'delete');
    }

    clear() {
        return this.makeRequest('places/', 'delete');
    }

    changePriority(id, priority) {
        return this.makeRequest(`places/${id}/priority/`, 'put', { priority: priority });
    }

    setVisited(id, isVisited) {
        return this.makeRequest(`places/${id}/${isVisited ? 'visited' : 'unvisited'}/`, 'put');
    }
}
