//This removes the only instance of the object
var Object = require('./object');
var world = module.exports = new Object();
world.connections = {};

//Temporarily Broadcasting.
world.send = function(message) {
    message = JSON.stringify(message);
    for(var i in this.connections) {
        this.connections[i].send(message);
    }
}

world.children['users'] = new Object('users', world);
world.on('test', function(message, world, user) { console.log('works');});
world.on('connect', function(message, world, user) {
   console.log('hit'); 
});


