const path = require('path');

const express = require('express');
const { port, root } = require('../../config');

const app = express();

const publicDir = path.join(`${root}/app/`, 'public');
const entryPoint = path.join(`${root}/app/views`, 'index.html');

app.use(express.static(publicDir));

app.get('/*', (req, res) => res.sendFile(entryPoint));

app.listen(port, () => {
  console.info(`Server started on ${port}`);
  console.info(`Open http://localhost:${port}/`);
});

module.exports = app;
