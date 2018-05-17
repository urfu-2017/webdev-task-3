import config from './config';


class _RequestOptions {
    constructor() {
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    setContentType(type = 'text/plain') {
        this.headers['Content-Type'] = type;

        return this;
    }

    setBody(body) {
        this.body = body;

        return this;
    }

    setMethod(method) {
        this.method = method;

        return this;
    }
}


export const getAllSights = async () => {
    const options = new _RequestOptions();
    const response = await fetch(`${config.apiBaseUrl}`, options);

    return await response.json();
};


export const createSight = async (sight) => {
    const options = new _RequestOptions()
        .setMethod('POST')
        .setBody(JSON.stringify(sight));
    const response = await fetch(`${config.apiBaseUrl}`, options);

    return await response;
};


export const deleteAllSights = async () => {
    const options = new _RequestOptions()
        .setMethod('DELETE');

    return await fetch(`${config.apiBaseUrl}`, options);
};


export const deleteSightById = async (id) => {
    const options = new _RequestOptions()
        .setMethod('DELETE');

    return await fetch(`${config.apiBaseUrl}/${id}`, options);
};


export const updateSightById = async (id, description) => {
    const options = new _RequestOptions()
        .setMethod('PATCH')
        .setBody(JSON.stringify({ description }));

    return await fetch(`${config.apiBaseUrl}/${id}`, options);
};


const _setSightVisitedValue = (method) => async (id) => {
    const options = new _RequestOptions()
        .setMethod(method);

    return await fetch(`${config.apiBaseUrl}/${id}/visited`, options);
};

export const setSightNotVisited = _setSightVisitedValue('DELETE');

export const setSightVisited = _setSightVisitedValue('PUT');


export const changeSightIndex = async (oldIndex, newIndex) => {
    const options = new _RequestOptions()
        .setMethod('PUT');

    return await fetch(`${config.apiBaseUrl}/${oldIndex}/change-index/${newIndex}`, options);
};
