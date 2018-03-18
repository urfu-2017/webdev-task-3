'use strict';

const path = require('path');
const { readdirSync } = require('fs');

const express = require('express');
const hbs = require('hbs');
const hbsutils = require('hbs-utils')(hbs);
const layoutData = require('./layoutData');

const app = express();

const viewsDir = path.join(__dirname, 'views');
const componentsDir = path.join(viewsDir, 'components');
const publicDir = path.join(__dirname, 'public');

app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.use(express.static(publicDir));

app.get('/', (req, res) => {
    res.render('index', layoutData);
});

registerAllPartials(componentsDir).then(() => app.listen(8080));

async function registerAllPartials(directory) {
    const directoryItems = readdirSync(directory);

    for (const partial of directoryItems) {
        if (partial !== 'index.styl') {
            await registerPartial(path.join(directory, partial));
        }
    }
}

function registerPartial(directory) {
    return new Promise(resolve => {
        hbsutils.registerWatchedPartials(directory, resolve);
    });
}


