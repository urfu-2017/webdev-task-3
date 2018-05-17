'use strict';

const path = require('path');
const express = require('express');
const { PORT, PUBLIC_DIR } = require('./config');
const app = express();

app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.use(express.static(PUBLIC_DIR));
app.listen(PORT, () => console.info(`Server listening on port ${PORT}.`));
