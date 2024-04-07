const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const currentDate = new Date();
const timestamp = currentDate.getTime();
module.exports = env => ({
    mode: "development",
    devServer: {
        port: 4200,
        hot: true,
        historyApiFallback: true,
    },
    entry: path.join(__dirname, "src", "index.tsx"),
    module: {
        rules: [
            {
                test: [/\.?js$/, /\.jsx?$/, /\.tsx?$/],
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {

                test: /\.s?[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(ico|jpg|jpeg|png|gif|svg)(\?.*)?$/,
                exclude:/icons/,
                use:[
                    'file-loader'
                ]
            },
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "/", "index.html"),
            favicon: "./public/favicon.ico"
        }),
        new MiniCssExtractPlugin({
            filename: `[name].${timestamp}.css`,
        }),
    ]
})