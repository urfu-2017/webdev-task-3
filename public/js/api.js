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

    list() {
        return this.makeRequest('places/', 'get').then(
            response => response.json(), console.error
        );
    }

    clear() {
        return this.makeRequest('places/', 'delete');
    }
}
