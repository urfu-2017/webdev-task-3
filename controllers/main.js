import config from '../config';

export class MainController {
    static async index(req, res) {
        return res.render("index", {
            apiUrl: config.apiUrl
        });
    }
}