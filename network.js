var http = require('http'), 
    url = require('url'),
    fs = require('fs'),
    net = require('net'),
    io = require('./socket-io'),
    sys = require('sys'),
    conf = require('./conf');
                
// HTTP Server and WebSocket Server
var server = http.createServer(function(req, res){
    // your normal server code
    var reqSplit = req.url.substr(1).split('/');
    var path = url.parse(req.url).pathname;
    switch (reqSplit[0]){
        case 'client':
            if(reqSplit.length > 1){
                var type = path.split('.')[1].toLowerCase();
                fs.readFile(__dirname + path, function(err, data) {
                    if (err) return send404(res);
                    switch(type) {
                        case 'js':
                            res.writeHead(200, {'Content-Type':'text/javascript'});
                            break;
                        case 'png':
                            res.writeHead(200, {'Content-Type':'image/png'});
                            break;
                        case 'jpeg':
                        case 'jpg':
                            res.writeHead(200, {'Content-Type':'image/jpeg'});
                            break;
                        default:
                            res.writeHead(200, {'Content-Type':'text/html'});
                    }
                    
                    res.write(data, 'utf8');
                    res.end();
                });
            } else {
               send404(res); 
            }
            break;
        case '':
            path = '/index.html';  
        case 'index.html':
            fs.readFile(__dirname + path, function(err, data){
                if (err) return send404(res);
                res.writeHead(200, {'Content-Type':'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
            break;
                
        default: send404(res);
    }
}),

send404 = function(res){
    res.writeHead(404);
    res.write('404');
    res.end();
};

server.listen(conf.net.port);
		
var io = io.listen(server),
users = {};
io.on('connection', function(client) {
    users[client.sessionId] = client;
    client.on('message', function(data){
        var message = JSON.parse(data);
        if(!message) {
            console.log('bad data' + data);
            return;
        }
        message['sessionId'] = client.sessionId;
        game.send(JSON.stringify(message));
    });
    client.on('disconnect', function(){
        delete users[client.sessionId];
    });
});

// Game Server Connection
var game = net.createConnection(conf.game.port);
game.setEncoding('utf-8');
game.data = '';
game.on('connect', function() {
    console.log('Established connection to game server');
});
game.send = function(message) {
    game.write('\u0000'+message+'\ufffd');
}
game.on('data', function (message) {
    var chunk, chunks, chunk_count;
    game.data += message;
    chunks = this.data.split('\ufffd');
    chunk_count = chunks.length - 1;
    for (var i = 0; i < chunk_count; i++){
      chunk = chunks[i];
      if (chunk[0] !== '\u0000'){
        fs.writeFile('logs/netserver.log', sys.inspect(chunk));
        console.log('Got a bad packet, closing');
        return false;
      }
      game.emit('message',chunk.slice(1));
    }
    game.data = chunks[chunks.length - 1];
});
game.on('message', function(data){
   try {
        message = JSON.parse(data);
        switch(message.sessionId) {
             case 'network': //internal
                 io.broadcast(JSON.stringify(message));
                 break;
             case 'broadcast':
                 io.broadcast(JSON.stringify(message));
                 break;
            
             default:
                 if(users[message.sessionId] != undefined) {
                     users[message.sessionId].send(JSON.stringify(message));
                     console.log(JSON.stringify(message));
                 } else {
                    console.log(JSON.stringify(message));
                    console.log('Got an unknown sessionid')
                 }
        }
   } catch (e) {
        fs.writeFile('logs/netserver.log', data);
        console.log('Shit went down', JSON.stringify(e));
   }
});
game.on('end', function() {
   console.log('Lost connection to game server'); 
});

