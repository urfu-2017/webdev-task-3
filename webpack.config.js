const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: ['babel-polyfill', './app/scripts/index.js'],

    output: {
        filename: 'bundle.js',
        path: `${__dirname}/build/public`
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [require('babel-preset-env')],
                        plugins: [require('babel-plugin-transform-object-rest-spread')]
                    }
                }
            }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: './app/public' }
        ])
    ]
}
