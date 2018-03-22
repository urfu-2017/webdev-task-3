const path = require('path');

const express = require('express');

const routes = require('./app/routes');
const config = require('./config');

const app = express();

const publicDir = path.join(__dirname, 'app/public');

console.log(publicDir);
app.use(express.static(publicDir));

routes(app);

const { port } = config;

app.listen(port, () => {
  console.info(`Server started on ${port}`);
  console.info(`Open http://localhost:${port}/`);
});


module.exports = app;
