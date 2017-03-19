import path from "path";

function levelProcessorFactory(pathPrefix) {
    return {
        "application": {
            check: (x) => !isNodeModule(x.userRequest),
            formatQuery: (x) => removeExtension(
                path.relative(process.cwd(), x.userRequest)
            ).replace(pathPrefix, "."),
        },
        "dependency": {
            check: (x) => isNodeModule(x.userRequest) && isRootModule(x.rawRequest),
            formatQuery: (x) => x.rawRequest,
        },
        "all": {
            check: (x) => true,
            formatQuery: (x) => removeExtension(
                path.relative(process.cwd(), x.userRequest)
            ).replace("node_modules/", ""),
        },
    };
}

let priorities = {
    "all": 3,
    "dependency": 2,
    "application": 1,
};

export default class WebpackExposeRequirePlugin {

    constructor({ level = "application", pathPrefix = "" }) {
        if (["application", "dependency", "all"].indexOf(level) !== -1) {
            this.level = level;
        }
        this.pathPrefix = pathPrefix;
    }

    apply(compiler) {
        compiler.plugin("compilation", compilationHook({
            level: this.level, 
            pathPrefix: this.pathPrefix,
        }));
    };

}

function compilationHook({ level, pathPrefix }) {
    return function(compilation) {
        compilation.mainTemplate.plugin("local-vars", function(source, chunk) {
            return localVarHook({ source, chunk, context: this, compilation, level, pathPrefix });
        });
    }
}

function localVarHook({ source, chunk, context, compilation, level, pathPrefix }) {
    let result = source;
    if (isEcmaScript(chunk)) {
        let bundleName = chunkName(chunk);
        result = context.asString([
            source,
            ...codeTemplate({
                bundleName, 
                map: webpackModuleMap(compilation, level, pathPrefix),
            }),
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

function codeTemplate({ bundleName, map }) {
    return [
        "",
        `// Expose require for testing purpose!!!`,
        `let REQUIRE_LIST = ` + JSON.stringify(map),
        wRequrie,
        expose,
        `expose("${bundleName}")`,
    ];
}

function webpackModuleMap(compilation, level, pathPrefix) {
    let levelProcessor = levelProcessorFactory(pathPrefix);
    return compilation.modules.reduce((result, item, index) => {
        assignLevel({ result, item, level, index, levelProcessor });
        return result;
    }, {});
}

function assignLevel({result, item, level, index, levelProcessor }) {
    Object.keys(levelProcessor).some((processorName) => {
        let processor = levelProcessor[processorName];
        let processed = false;
        if (processor.check(item) && priorities[level] >= priorities[processorName]) {
            result[processor.formatQuery(item)] = index;
            processed = true;
        }
        return processed;
    });
}

function removeExtension(path) {
    return path.replace(/.[j|t]sx?$/g, "");
}

function isNodeModule(path) {
    return path.indexOf("node_modules") !== -1;
}

function isRootModule(rawRequest) {
    return rawRequest.indexOf("/") === -1;
}

function expose(bundleName) {
    let obj = {};
    obj[bundleName] = wRequrie;
    obj[bundleName].map = REQUIRE_LIST;
    window.require = Object.assign(window.require || {}, obj);
}

function wRequrie(modulePath) {
    return __webpack_require__(REQUIRE_LIST[modulePath]);
};
