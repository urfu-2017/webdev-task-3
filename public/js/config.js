export class Config {
    getConfig() {
        return fetch('/config.json', {
            method: 'GET'
        });
    }
}
