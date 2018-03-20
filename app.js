'use strict';

const path = require('path');

const express = require('express');

const app = express();

const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

const port = 8080;
app.listen(port, () => {
    console.info(`Server started on http://localhost:${port}/`);
});
