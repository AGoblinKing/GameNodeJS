var fs = require('fs');

module.exports = {
    'dynamic':require('./dynamic'),
    'static':require('./static'),
    'save': function() {
            // eventually going to have to this call .save on each object
            for(var dyn in this.dynamic) {
                fs.writeFileSync('data/dynamic/'+dyn+'.js', 'module.exports='+JSON.stringify(this.dynamic[dyn])+';');
            }
        }
    };
