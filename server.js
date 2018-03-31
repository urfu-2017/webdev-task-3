'use strict';
const path = require('path');

const express = require('express');

const app = express();
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.info(`Server started on ${PORT}`);
    console.info(`Open http://localhost:${PORT}/`);
});

module.exports = app;
