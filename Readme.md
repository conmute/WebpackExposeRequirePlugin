WebPack expose `require` outside of bundle
==========================================

This plugin may be usefull for high fidelity testing with selenium.
Module by using selenium and keeping test code and source code aside.

Bundle will define parameter to window object, this will be the only global variable.

Wepack setup instuction example:

```javascript
let ExposeRequirePlugin = require("webpack-expose-require-plugin");

/**
 * 
 */
module.exports = {
    // ...
    plugins: [
        new ExposeRequirePlugin({
            level: "dependency", // "all", "dependency", "application"
            pathPrefix: "example/simple/src", // in case if your source is not placed in root folder.
        }),
    ],
    // ...
}
```

As result you can use this code in browser:

```html
<script type="text/javascript">
    /**
     * In shown above example if we dont set `pathPrefix` options
     * the argument string would be "./example/simple/src/index".
     *
     * Dependencies will be without "./" path prefix. For example: "react" npm dependency vs "./index" source file.
     */
    require.main("./index").bootstrap();

    /**
     * List all possible modules.
     */
    console.log(require.main.map);
</script>
```

The `require` will be assigned as property to window. Each available bundle will assign his inner `__webpack_require__`.

In example described above, there is bundle with name `main` - see entry names, defauls is `main` name -, 
we are getting our main script that will bootstrap react application in given page.

To do:
------

* Develop moment for production use when one webpack bundle can require module from another bundle, but without exposing to 
* Write tests.
