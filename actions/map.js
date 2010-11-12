wrap = require('./wrappers');

module.exports = {
    'update': {
        'callback': function(data, users, connections) {
            var map = {
                'data':data.static.map.publicMap(),
                'sessionId':'network',
                'action':'update'
            };
           
            for(var i in connections){
                connections[i].send(JSON.stringify(map));
            }
        },
        'timeout': 200
    }
}