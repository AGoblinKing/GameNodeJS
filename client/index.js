var fs = require('fs');

var client = [];
var files = fs.readdirSync('./client');
for(var i in files) {
    var file = files[i].split('.');
    if(file.length > 1) {
        switch(file[file.length-1].toLowerCase()) {
            case 'css':
                client.push('<link rel="stylesheet" href="/client/'+files[i]+'" type="text/css" media="all"/>');
                break;
            case 'js':
				if(files[i] != 'index.js') 
					client.push('<script type="text/javascript" src="/client/'+files[i]+'"></script>');
                break;
        }
    }
}
			

module.exports = client.join('\r\n');