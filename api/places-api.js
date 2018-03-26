'use strict';

const fetch = require('node-fetch');
const { NOT_FOUND, CREATED } = require('http-status-codes');

const { API } = require('../config/default.json');

exports.getAll = async () => {
    const places = await fetch(API.url).then(res => res.json);

    return places;
};

exports.find = async description => {
    const res = await fetch(`${API.url}/find`, { body: { description } });

    return res.status === NOT_FOUND ? undefined : await res.json();
};

exports.create = async description => {
    const res = await fetch(API.url, { method: 'POST', body: { description } });

    return res.status === CREATED;
};

exports.update = async (id, description) => {
    const reqUrl = `${API.url}/${id}`;

    await fetch(reqUrl, { method: 'PATCH', body: { description } });
};

exports.setVisitState = async (id, state) => {
    const reqUrl = `${API.url}/${id}/${state ? 'visited' : 'unvisited'}`;

    await fetch(reqUrl, { method: 'PUT' });
};

exports.swap = async (id1, id2) => {
    const reqUrl = `${API.url}/${id1}/swap/${id2}`;

    await fetch(reqUrl, { method: 'PUT' });
};

exports.removeAll = async () => {
    await fetch(API.url, { method: 'DELETE' });
};

exports.remove = async id => {
    const reqUrl = `${API.url}/${id}`;

    await fetch(reqUrl, { method: 'DELETE' });
};
