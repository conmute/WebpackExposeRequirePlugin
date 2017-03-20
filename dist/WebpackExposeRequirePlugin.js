"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function levelProcessorFactory(pathPrefix) {
    return {
        "application": {
            check: function check(x) {
                return !isNodeModule(x.userRequest);
            },
            formatQuery: function formatQuery(x) {
                return removeExtension(_path2.default.relative(process.cwd(), x.userRequest)).replace(pathPrefix, ".");
            }
        },
        "dependency": {
            check: function check(x) {
                return isNodeModule(x.userRequest) && isRootModule(x.rawRequest);
            },
            formatQuery: function formatQuery(x) {
                return x.rawRequest;
            }
        },
        "all": {
            check: function check(x) {
                return true;
            },
            formatQuery: function formatQuery(x) {
                return removeExtension(_path2.default.relative(process.cwd(), x.userRequest)).replace("node_modules/", "");
            }
        }
    };
}

var priorities = {
    "all": 3,
    "dependency": 2,
    "application": 1
};

var WebpackExposeRequirePlugin = function () {
    function WebpackExposeRequirePlugin(_ref) {
        var _ref$level = _ref.level,
            level = _ref$level === undefined ? "application" : _ref$level,
            _ref$pathPrefix = _ref.pathPrefix,
            pathPrefix = _ref$pathPrefix === undefined ? "" : _ref$pathPrefix;

        _classCallCheck(this, WebpackExposeRequirePlugin);

        if (["application", "dependency", "all"].indexOf(level) !== -1) {
            this.level = level;
        }
        this.pathPrefix = pathPrefix;
    }

    _createClass(WebpackExposeRequirePlugin, [{
        key: "apply",
        value: function apply(compiler) {
            compiler.plugin("compilation", compilationHook({
                level: this.level,
                pathPrefix: this.pathPrefix
            }));
        }
    }]);

    return WebpackExposeRequirePlugin;
}();

exports.default = WebpackExposeRequirePlugin;


function compilationHook(_ref2) {
    var level = _ref2.level,
        pathPrefix = _ref2.pathPrefix;

    return function (compilation) {
        compilation.mainTemplate.plugin("local-vars", function (source, chunk) {
            return localVarHook({ source: source, chunk: chunk, context: this, compilation: compilation, level: level, pathPrefix: pathPrefix });
        });
    };
}

function localVarHook(_ref3) {
    var source = _ref3.source,
        chunk = _ref3.chunk,
        context = _ref3.context,
        compilation = _ref3.compilation,
        level = _ref3.level,
        pathPrefix = _ref3.pathPrefix;

    var result = source;
    if (isEcmaScript(chunk)) {
        var bundleName = chunkName(chunk);
        result = context.asString([source].concat(_toConsumableArray(codeTemplate({
            bundleName: bundleName,
            map: webpackModuleMap(compilation, level, pathPrefix)
        }))));
    }
    return result;
}

function isEcmaScript(chunk) {
    return !!chunk.entryModule.resource.match(/\.[j|t]sx?$/g);
}

function chunkName(chunk) {
    return chunk.entrypoints[0].name;
}

function codeTemplate(_ref4) {
    var bundleName = _ref4.bundleName,
        map = _ref4.map;

    return ["", "// Expose require for testing purpose!!!", "let REQUIRE_LIST = " + JSON.stringify(map), wRequrie, expose, "expose(\"" + bundleName + "\")"];
}

function webpackModuleMap(compilation, level, pathPrefix) {
    var levelProcessor = levelProcessorFactory(pathPrefix);
    return compilation.modules.reduce(function (result, item, index) {
        assignLevel({ result: result, item: item, level: level, index: index, levelProcessor: levelProcessor });
        return result;
    }, {});
}

function assignLevel(_ref5) {
    var result = _ref5.result,
        item = _ref5.item,
        level = _ref5.level,
        index = _ref5.index,
        levelProcessor = _ref5.levelProcessor;

    Object.keys(levelProcessor).some(function (processorName) {
        var processor = levelProcessor[processorName];
        var processed = false;
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
    var obj = {};
    obj[bundleName] = wRequrie;
    obj[bundleName].map = REQUIRE_LIST;
    window.require = Object.assign(window.require || {}, obj);
}

function wRequrie(modulePath) {
    return __webpack_require__(REQUIRE_LIST[modulePath]);
};
module.exports = exports["default"];