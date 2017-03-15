import path from "path";

export default class WebpackExposeRequirePlugin {

    apply(compiler) {
        compiler.plugin("compilation", compilationHook);
    };

}

function compilationHook(compilation) {
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

function isEcmaScript(chunk) {
    return !!chunk.entryModule.resource.match(/\.[j|t]sx?$/g);
}

function chunkName(chunk) {
    return chunk.entrypoints[0].name;
}

function codeTemplate(bundleName, webpackRequireList) {
    return [
        "",
        `// Expose require for testing purpose!!!`,
        `let REQUIRE_LIST = ` + JSON.stringify(webpackRequireList),
        wRequrie,
        expose,
        `expose("${bundleName}")`,
    ];
}

function webpackModuleMap(compilation) {
    return compilation.modules.reduce((result, item, index) => {
        result[convertToQuery(item.userRequest)] = index;
        return result;
    }, {});
}

function convertToQuery(request) {
    return path.relative(process.cwd(), request)
               .replace(/.[j|t]sx?$/g, "")
               .replace("src/ts", ".");
}

function expose(bundleName) {
    let obj = {};
    obj[bundleName] = wRequrie;
    window.require = Object.assign(window.require || {}, obj);
}

function wRequrie(modulePath) {
    return __webpack_require__(REQUIRE_LIST[modulePath]);
};
