'use strict';

const REST_API_URL = 'https://webdev-task-2-myfatnaaaq.now.sh/';

const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
app.use('/public', express.static('public'));
app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname });
});
app.use('/api', proxy(REST_API_URL));
app.listen(8080, () => console.info('Listening on http://localhost:8080/'));
