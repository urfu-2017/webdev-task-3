/* eslint-disable no-unused-vars */
'use strict';

class request {
    static async get(url) {
        const resp = await fetch(url);
        const data = await resp.json();

        return data;
    }

    static async post(url, body) {
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await resp.json();

        return data;
    }

    static async patch(url, body) {
        const resp = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await resp.json();

        return data;
    }

    static async put(url, body) {
        const resp = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await resp.json();

        return data;
    }

    static async delete(url) {
        const resp = await fetch(url, { method: 'DELETE' });
        const data = await resp.json();

        return data;
    }
}
