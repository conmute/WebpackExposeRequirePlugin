WebPack expose `require` outside of bundle
==========================================

This is usefull for testing any module by using selenium and keeping tests and source code aside.
In other words there is no global variables (expect exposed require function), 
but if needed we can access any module functionality.

Wepack setup instuction:

```javascript
// original code is in ES6, its bundles to vanilla js with webpack libraryTarget.
let ExposeRequirePlugin = require("webpack-expose-require-plugin").default;

module.exports = {
    // ...
    plugins: [
        new ExposeRequirePlugin(),
    ],
    // ...
}
```

As result you can in browser after bundle script injection use such code

```html
<script type="text/javascript">
    require.main("src/main").bootstrap();
</script>
```

The `require` will be assigned as property to window. Each available bundle will assign his inner `__webpack_require__`.

In example described above, there is bundle with name `main` - see entry names, defauls is `main` name -, 
we are getting our main script that will bootstrap react application in given page.

ToDO:

* Add option to allow require outside only application/libraries/library-depenendency level.
* Add option to expose all posible require strings.
* Develop moment for production use when one webpack bundle can require module from another bundle, but without exposing to 
* Write tests.
