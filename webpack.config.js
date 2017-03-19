let nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "dist/[name].js",
        library: "WebpackExposeRequirePlugin",
        libraryTarget: "commonjs2",
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: nodeExternals(),
};
