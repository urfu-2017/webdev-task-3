const encodeQuery = (queryArgs) => {
    return Object.keys(queryArgs)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryArgs[key])}`)
        .join('&');
};

const defaultSettings = {
    headers: {
        Accept: 'application/json'
    },
    mode: 'cors'
};

const jsonRequest = async (url, requestSettings) => {
    let response;
    try {
        response = await fetch(url, requestSettings);
    } catch (err) {
        response = { status: 0, statusText: 'Server doesn\'t respond' };
    }

    let responseBody;
    try {
        responseBody = response.json ? await response.json() : null;
    } catch (err) {
        responseBody = null;
    }

    return { status: response.status, message: response.statusText, body: responseBody };
};

const jsonBodylessRequest = (httpMethod, url, queryArgs = undefined) => {
    if (queryArgs !== undefined) {
        url = `${url}?${encodeQuery(queryArgs)}`;
    }

    const requestSettings = {
        ...defaultSettings,
        method: httpMethod,
        qs: queryArgs
    };

    return jsonRequest(url, requestSettings);
};

const jsonBodyRequest = (httpMethod, url, queryArgs = undefined, data = undefined) => {
    const postSettings = {
        ...defaultSettings,
        method: httpMethod,
        qs: queryArgs,
        body: JSON.stringify(data),
        headers: {
            ...defaultSettings.headers,
            'Content-Type': 'application/json'
        }
    };

    return jsonRequest(url, postSettings);
};

const jsonGet = jsonBodylessRequest.bind(undefined, 'GET');

const jsonHead = jsonBodylessRequest.bind(undefined, 'HEAD');

const jsonDelete = jsonBodylessRequest.bind(undefined, 'DELETE');

const jsonPost = jsonBodyRequest.bind(undefined, 'POST');

const jsonPut = jsonBodyRequest.bind(undefined, 'PUT');

const jsonPatch = jsonBodyRequest.bind(undefined, 'PATCH');

export { jsonRequest, jsonGet, jsonHead, jsonDelete, jsonPost, jsonPut, jsonPatch };
