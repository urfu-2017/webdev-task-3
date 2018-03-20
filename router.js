'use strict';

const express = require('express');

const { main } = require('./controllers/main');

const router = new express.Router();

router.get('/', main);

module.exports = router;
