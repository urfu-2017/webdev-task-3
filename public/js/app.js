import { PlacesAPI } from './api';
import { UI } from './ui';
import { Config } from './config';

function app() {
    const config = new Config();
    config.getConfig()
        .then(response => response.json())
        .then((configData) => {
            const api = new PlacesAPI(configData.apiUrl);
            const ui = new UI(api);
            ui.run();
        });
}

app();
