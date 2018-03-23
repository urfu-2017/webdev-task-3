'use strict';

const path = require('path');

const app = require('express')();

const serveStatic = require('serve-static');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/main.html')));
app.use('/static', serveStatic(path.join(__dirname, '/public')));
app.get('*', (req, res) => res.redirect('/'));

app.listen(3000, () => console.info('App Listen 3000'));
