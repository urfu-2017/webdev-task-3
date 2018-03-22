'use strict';

const path = require('path');

const express = require('express');

const publicDir = path.join(__dirname, 'public');

const app = express();
app.use(express.static(publicDir));

app.listen(8080, () => {
    console.info('http://localhost:8080/');
});
