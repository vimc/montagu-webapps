var nodeExternals = require('webpack-node-externals');
 
module.exports = {
    target: 'node', // in order to ignore built-in modules like path, fs, etc. 
    externals: [ nodeExternals() ], // in order to ignore all modules in node_modules folder 

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["*", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/, 
                loaders: [ "babel-loader", "awesome-typescript-loader" ]
            }
        ]
    }
};