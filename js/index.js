'use strict';

import api from './api';
import Main from './controls/main';

window.onload = async () => {
    const places = await api.getAllPlaces();
    var main = new Main(places);
    var root = document.getElementById('root');
    root.appendChild(main.render());
};
