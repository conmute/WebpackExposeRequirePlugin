let ExposeRequirePlugin = require("./dist/main").WebpackExposeRequirePlugin.default;

module.exports = {
    entry: "./example/simple/src/index.jsx",
    output: {
        filename: "./example/simple/dist/[name].js",
        sourceMapFilename: "./example/simple/dist/[name].map",
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
        new ExposeRequirePlugin({ level: "all", pathPrefix: "example/simple/src" }),
    ],
};
