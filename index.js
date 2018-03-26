'use strict';

const path = require('path');


const express = require('express');
const hbs = require('hbs');

const app = express();

const viewsDir = path.join(__dirname, 'views');
const partialsDir = path.join(viewsDir, 'components');
const publicDir = path.join(__dirname, 'public');


app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.use(express.static(publicDir));

app.get('/', (req, res) => {
    res.render('index');
});

hbs.registerPartials(partialsDir, () => {
    app.listen(3030, () => {
        console.info('Open http://localhost:3030/');
    });
});

module.exports = app;
