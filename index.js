'use strict';
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));
app.route('*', (req, res) => {
    res.sendStatus(404);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.info(`Server run on http://localhost:${port}`);
});
