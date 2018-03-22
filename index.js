'use strict';

const express = require('express');
const { home } = require('./controllers/home');

const app = express();

app.use(express.static('public'));
app.get('/', home);
app.get('*', (req, res) => res.sendStatus(404));
app.listen(5000);
