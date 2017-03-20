let ExposeRequirePlugin = require("./dist/index");

console.log(ExposeRequirePlugin);

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
        new ExposeRequirePlugin({ level: "dependency", pathPrefix: "example/simple/src" }),
    ],
};
