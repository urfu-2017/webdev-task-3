'use strict';

const path = require('path');
const express = require('express');
const app = express();
const port = 8080;
const publicDir = path.join(__dirname, 'public');

app.get('/', (req, res) => res.sendFile(path.join(publicDir, 'index.html')));
app.use(express.static(publicDir));
app.listen(port, () => console.info(`Server listening on port ${port}.`));
