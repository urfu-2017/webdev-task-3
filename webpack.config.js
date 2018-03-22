const path = require('path');
const STATIC_PATH = './public/';

module.exports = {
    entry: {
        app: `${STATIC_PATH}/js/app.js`
    },
    output: {
        path: path.resolve(__dirname, `${STATIC_PATH}/build/`),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'es2016']
                }
            }
        ]
    }
};
