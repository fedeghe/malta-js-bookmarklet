//load dependencies and whatever needed
var path = require('path')
    fs = require('fs');

function bookmarklet(obj, options) {
    
    /**
     * The context of the call is the malta instance,
     * so from here you can get all information about
     * the original template path, all plugins involved
     * all options, the output folder, an on..
     * @type Object
     */
    var self = this,
        
        // just to show some stats on the console
        // about the time required by the plugin
        start = new Date(),
        
        // a message the plugin can send to the console
        msg,
        pluginName = path.basename(path.dirname(__filename));

    options = options || {};
    
    /**
     * The plugin can do his job on the current content (maybe modified by
     * the previous plugin) using o.content  
     */
    obj.content = 'javascript:void%20function(){' + encodeURIComponent(obj.content) + '}();';
    
    // the next plugin will be invoked with an updated obj
    // only when the solve function is called passing the updated obj
    return function (solve, reject) {
        // free to be async
        fs.writeFile(obj.name, obj.content, function (err) {
            if (err == null) {
                msg = 'plugin ' + pluginName.white() + ' wrote ' + obj.name +' (' + self.getSize(obj.name) + ')';
            } else {
                console.log('[ERROR] ' + pluginName + ' says:');
                console.dir(err);

                // something wrong, stop malta
                self.stop();
            }
            
            // allright, solve, notify and let malta proceed
            solve(obj);
            self.notifyAndUnlock(start, msg);
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