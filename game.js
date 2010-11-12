var net = require('net'),
    fs = require('fs'),
    sys = require('sys'),
    conf = require('./conf'),
    data = require('./data'),
    actions = require('./actions');
 

// need to get this out into its own file  
console.l = function(data) {
    switch(conf.logging.type) {
        case 'file':
            fs.writeFile('logs/gameserver.log', data);
        case 'console':
            sys.log(data);
        default:
            return;
    }
}
var connections = {};
var users = {}; //Volatile users, junk that doesn't get saved 
var server = net.createServer(function(stream) {
    stream.setEncoding('utf-8');
    stream.data = '';
    stream.send = function(message) {
        stream.write('\u0000'+message+'\ufffd');
    }
    stream.on('connect', function () {
        stream.sessionId = stream.remoteAddress+stream.remotePort;
        connections[stream.sessionId] = stream;
        console.l('Network Server Connected - '+stream.remoteAddress+' - '+stream.sessionId);
    });
    
    stream.on('data', function (message) {  
        var chunk, chunks, chunk_count;
        stream.data += message;
        chunks = stream.data.split('\ufffd');
        chunk_count = chunks.length - 1;
        for (var i = 0; i < chunk_count; i++){
          chunk = chunks[i];
          if (chunk[0] !== '\u0000'){
            console.log('Got a bad packet, closing');
            return false;
          }
          stream.emit('message',chunk.slice(1));
        }
        stream.data = chunks[chunks.length - 1];
    });

    stream.on('message', function(message) {
        if(conf.logging.packets) console.l(stream.sessionId + '-' + message);
        result = actions.message(data, users, stream, message);
        if(result) stream.send(JSON.stringify(result));
        
    });
    stream.on('end', function () {
        console.log('Lost connection to network server.')
        delete connections[stream.sessionId];
    });
});
server.listen(conf.game.port);
process.on('exit', function () {
    data.save();    
});

process.nextTick(tick);
function tick() {
    actions.tick(data, users, connections);
    process.nextTick(tick);
}
setInterval(timeout, 10);
function timeout() {
    actions.timeout(data, users, connections);
}
console.log('Server up and listening on '+conf.game.port);
