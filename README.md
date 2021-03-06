---
[![npm version](https://badge.fury.io/js/malta-js-bookmarklet.svg)](http://badge.fury.io/js/malta-js-bookmarklet)
[![npm downloads](https://img.shields.io/npm/dt/malta-js-bookmarklet.svg)](https://npmjs.org/package/malta-js-bookmarklet)
[![npm downloads](https://img.shields.io/npm/dm/malta-js-bookmarklet.svg)](https://npmjs.org/package/malta-js-bookmarklet)  
---  

This plugin can be used on: **.js** files and even on **.coffee** and **.ts** files after using the right plugin

### Purpose  
Allow to create bookmarklets from javascript code  

Options : 
    - **button** : if set tue `true` creates even a second bookmarklet which injects on the uper left corner of the page a "run me" button to run the code.

Sample usage:  
```
malta app/source/bm.js public/js -plugins=malta-js-bookmarklet
```
or in the .json build file :
```
"app/source/bm.js" : "public/js -plugins=malta-js-bookmarklet"
```
or in a script : 
``` js
var Malta = require('malta');
Malta.get().check([
    'app/source/bm.js',
    'public/js',
    '-plugins=malta-js-bookmarklet'
    ]).start(function (o) {
        var s = this;
        console.log('name : ' + o.name)
        console.log("content : \n" + o.content);
        'plugin' in o && console.log("plugin : " + o.plugin);
        console.log('=========');
    });
```