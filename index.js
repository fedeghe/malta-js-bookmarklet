const path = require('path'),
    fs = require('fs');

function bookmarklet(obj, options) {
    
    /**
     * The context of the call is the malta instance,
     * so from here you can get all information about
     * the original template path, all plugins involved
     * all options, the output folder, an on..
     * @type Object
     */
    const self = this,
        // just to show some stats on the console
        // about the time required by the plugin
        start = new Date(),
        pluginName = path.basename(path.dirname(__filename)),
        out = {
           bm : obj.name.replace(/\.js$/, '.bookmark'),
           butt_bm : obj.name.replace(/\.js$/, '_button.bookmark')
        },
        bmWrap =  codeString => "javascript:void%20function(){" + encodeURIComponent(codeString) + "}();";
    
    let msg,
        butt = false;
    
    options = options || {};
    
    /**
     * The plugin can do his job on the current content (maybe modified by
     * the previous plugin) using o.content  
     */
    obj.content = bmWrap(obj.content);

    if ('button' in options && !!(options.button)) {
        /**
         * THIS IS THE BUTTON VERSION, to be saved in another file, if options ask for it
         */
        butt = bmWrap("(function () {" + 
            "var butt = document.createElement('span');" + 
            "butt.style.position = 'fixed';" + 
            "butt.style.fontFamily = 'verdana,sans';" + 
            "butt.style.cursor = 'pointer';" + 
            "butt.style.zIndex = 999999;" + 
            "butt.style.top = '10px';" + 
            "butt.style.left = '10px';" + 
            "butt.style.height = '20px';" + 
            "butt.style['line-height'] = '16px';" + 
            "butt.style.padding = '0px 4px';" + 
            "butt.style.border = 'solid 2px #000000';" +
            "butt.style['-moz-box-shadow']= '0px 0px 5px #ffffff';" +
            "butt.style['-webkit-box-shadow']= '0px 0px 5px #ffffff';" +
            "butt.style['box-shadow']= '0px 0px 5px #ffffff';" +
            "butt.style['-moz-border-radius'] = '5px';" +
            "butt.style['-webkit-border-radius'] = '5px';" +
            "butt.style['border-radius'] = '5px';" +
            "butt.style.color = '#000';" + 
            "butt.style.backgroundColor = '#fff';" + 
            "butt.innerHTML = 'run me';" + 
            "butt.onclick = function () {" + 
                "var bm = \"" + obj.content + "\";" + 
                "document.location.href = bm;" + 
                "document.body.removeChild(butt);" + 
            "};" + 
            "document.body.appendChild(butt);" + 
        "})();");
    }

    // the next plugin will be invoked with an updated obj
    // only when the solve function is called passing the updated obj
    return (solve, reject) => {
        // free to be async
        fs.writeFile(out.bm, obj.content, err => {
            if (err == null) {
                msg = 'plugin ' + pluginName.white() + ' wrote ' + out.bm +' (' + self.getSize(obj.name) + ')';

                if (butt){
                    fs.writeFile(out.butt_bm, butt, err => {
                        if (err == null) {
                            msg += "\n" + "\tand wrote " + out.butt_bm +' (' + self.getSize(out.butt_bm) + ')';
                        } else {
                            msg += "\n" + "\t but did not wrote " + out.butt_bm;
                        }
                        solve(obj);
                        self.notifyAndUnlock(start, msg);
                    });
                } else {
                    solve(obj);
                    self.notifyAndUnlock(start, msg);
                }
            } else {
                console.log('[ERROR] ' + pluginName + ' says:');
                console.dir(err);

                // something wrong, stop malta
                self.stop();
            }
            fs.unlink(obj.name, () => {});
        })
    }
}
/**
 * if the plugin shall be used only on some special file types
 * declare it (it can be an array too)  
 * if not specified the plugin will be called on any file
 */
bookmarklet.ext = ['js', 'coffee', 'ts'];

// export
module.exports = bookmarklet;