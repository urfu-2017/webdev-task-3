import { MainController } from './controllers/main';

module.exports = app => {
    app.get('/', MainController.index);
    app.get('/config.json', MainController.config);
};
