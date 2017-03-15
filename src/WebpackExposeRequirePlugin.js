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

function compilationHook(compilation) {
    let __this = this;
    compilation.mainTemplate.plugin("local-vars", function(source, chunk) {
        return localVarHook(source, chunk, this, compilation);
    });
}

function localVarHook(source, chunk, context, compilation) {
    let result = source;
    if (isEcmaScript(chunk)) {
        let bundleName = chunkName(chunk);
        result = context.asString([
            source,
            ...codeTemplate(bundleName, webpackModuleMap(compilation))
        ]);
    }
    return result;
}

class WebpackExposeRequirePlugin {

    apply(compiler) {
        compiler.plugin("compilation", compilationHook);
    };

}

export default WebpackExposeRequirePlugin;
