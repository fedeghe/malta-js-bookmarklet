This plugin can be used on: **.js** files and even on **.coffee** and **.ts** files after using the right plugin

### Purpose  
Allow to create bookmarklets from javascript code  


Sample usage:  

    malta app/source/bm.js public/js -plugins=malta-js-bookmarklet

or in the .json build file :

    "app/source/bm.js" : "public/js -plugins=malta-js-bookmarklet"

or in a script : 

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
