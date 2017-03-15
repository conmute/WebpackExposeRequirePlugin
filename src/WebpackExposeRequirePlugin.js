import path from "path";

function WebpackExposeRequirePlugin() {}

WebpackExposeRequirePlugin.prototype.apply = function(compiler) {
    compiler.plugin("emit", function(compilation, callback) {
        let filelist = {};
        compilation.modules.forEach((item, index) => {
            let query = path
                .relative(process.cwd(), item.userRequest)
                .replace(/.[j|t]sx?$/g, "")
                .replace("src/ts", ".");
            filelist[query] = index;
        });
        compilation.assets['js/require-ids.js'] = {
            source: function() {
                return "window.REQUIRE_LIST = " + JSON.stringify(filelist);
            },
            size: function() {
                return filelist.length;
            }
        };
        callback();
    });
    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("html-webpack-plugin-before-html-generation", function(
            htmlPluginData, callback
        ) {
            htmlPluginData.assets.js = [
                "../js/require-ids.js",
                ...htmlPluginData.assets.js
            ];
            callback(null, htmlPluginData);
        });
    });
};

export default WebpackExposeRequirePlugin;
