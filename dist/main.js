module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path__);


class WebpackExposeRequirePlugin {

    apply(compiler) {
        compiler.plugin("compilation", compilationHook);
    };

}
/* harmony export (immutable) */ __webpack_exports__["a"] = WebpackExposeRequirePlugin;


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
    return __WEBPACK_IMPORTED_MODULE_0_path___default.a.relative(process.cwd(), request)
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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__WebpackExposeRequirePlugin__ = __webpack_require__(0);

/* harmony default export */ __webpack_exports__["default"] = __WEBPACK_IMPORTED_MODULE_0__WebpackExposeRequirePlugin__["a" /* default */];


/***/ })
/******/ ]);