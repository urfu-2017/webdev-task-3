const { root } = require('../../config');

exports.index = (req, res) => {
  res.sendFile('app/views/index.html', { root });
};
