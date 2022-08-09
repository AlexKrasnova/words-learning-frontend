'use strict';

let path = require('path');

module.exports = {
    mode: 'development',
    entry: './js/router.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/js'
    },
    watch: true,

    devtool: "source-map",

    module: {
        rules: [{
            test: /\.(css)$/,
            use: ["style-loader", "css-loader"],
        }],
    }
};