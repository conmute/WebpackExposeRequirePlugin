import path from "path";

function convertToQuery(request) {
    return path.relative(process.cwd(), request)
               .replace(/.[j|t]sx?$/g, "")
               .replace("src/ts", ".");
}

function webpackModuleMap(compilation) {
    return compilation.modules.reduce((result, item, index) => {
        result[convertToQuery(item.userRequest)] = index;
        return result;
    }, {});
}

function chunkName(chunk) {
    return chunk.entrypoints[0].name;
}

function wRequrie(modulePath) {
    return __webpack_require__(REQUIRE_LIST[modulePath]);
};

function isEcmaScript(chunk) {
    return !!chunk.entryModule.resource.match(/\.[j|t]sx?$/g);
}

function codeTemplate(bundleName, webpackRequireList) {
    return [
        "",
        `// Expose require for testing purpose!!!`,
        `let REQUIRE_LIST = ` + JSON.stringify(webpackRequireList),
        wRequrie,
        `if (true) {`,
        `    window.require = Object.assign(window.require || {}, {`,
        `        ${bundleName}: wRequrie`,
        `    });`,
        `}`,
    ];
}

function WebpackExposeRequirePlugin() {}

WebpackExposeRequirePlugin.prototype.apply = function(compiler) {
    compiler.plugin("compilation", function(compilation) {
        compilation.mainTemplate.plugin("local-vars", function(source, chunk) {
            let result = source;
            if (isEcmaScript(chunk)) {
                let bundleName = chunkName(chunk);
                result = this.asString([
                    source,
                    ...codeTemplate(bundleName, webpackModuleMap(compilation))
                ]);
            }
            return result;
        });
    });
};

export default WebpackExposeRequirePlugin;
