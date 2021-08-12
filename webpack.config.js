const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {


    entry: './src/javascript/index.js',


    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },

    devServer: {
        open: true,
        contentBase: './dist'
    },

    plugins: [
        new HtmlWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "assets/images", to: "images" },
            ],
        }),
    ],

    mode: 'development'
};