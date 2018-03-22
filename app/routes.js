const { index } = require('./controllers/index');
const { error404 } = require('./controllers/errors');

module.exports = (app) => {
  app.get('/', index);
  app.all('*', error404);
};
