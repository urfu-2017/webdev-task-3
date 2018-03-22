import config from '../config';

export class MainController {
    static async index(req, res) {
        return res.render('index');
    }

    static async config(req, res) {
        return res.send({
            apiUrl: config.apiUrl
        });
    }
}
