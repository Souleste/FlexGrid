const path = require('path');

module.exports = {
    target: ['web', 'es5'],
    entry: "./src/flexgrid.ts",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "flexgrid.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            }
        ]
    }
};
