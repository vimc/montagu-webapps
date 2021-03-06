const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const helper = require("./webpack.common");
const nodeExternals = require('webpack-node-externals');

module.exports = Object.assign({
    target: 'node', // in order to ignore built-in modules like path, fs, etc. 
    externals: [ nodeExternals() ], // in order to ignore all modules in node_modules folder

    plugins: [
        new HardSourceWebpackPlugin()
    ]

}, helper.commonConfig("test", "/"));