const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // entry => source code
    entry: './src/client/js/main.js',
    mode: 'development',
    watch: true,
    plugins: [new MiniCssExtractPlugin({
        filename: 'css/styles.css'
    })],
    output: {
        filename: 'js/main.js',
        path: path.resolve(__dirname, 'assets'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { targets: 'defaults' }]],
                    }
                }
            },
            {
                test: /\.scss$/,
                // 역순으로 실행됨. stack인듯
                // sass-loader: scss -> css
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    }
}