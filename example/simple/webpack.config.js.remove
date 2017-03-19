let ExposeRequirePlugin = require("webpack-expose-require-plugin").default;

module.exports = {
    entry: "./src/main.jsx",
    output: {
        filename: "./dist/[name].js",
        sourceMapFilename: "./dist/index.map",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: "babel-loader",
            },
        ],
    },
    resolve: {
        extensions: [
            ".js",
            ".jsx",
        ],
    },
    plugins: [
        new ExposeRequirePlugin(),
    ],
};
