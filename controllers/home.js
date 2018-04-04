'use strict';

exports.home = (req, res) => {
    res.sendFile('public/index.html');
};
