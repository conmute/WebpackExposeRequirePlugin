WebPack expose `require` outside of bundle
==========================================

This is usefull for testing any module by using selenium and keeping tests and source code aside.
In other words there is no global variables (expect exposed require function), 
but if needed we can access any module functionality.

ToDo:

* inject somehow this code into `bundle.[chunkhash].js` by using plugin resources.
* load require-ids.js into bundle also with the require options.
* write tests.
