const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bugtracker.js',
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
            },
        ],
    },
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';

    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            }
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
    ])
}
