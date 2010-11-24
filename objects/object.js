var sys = require('sys'),
    EventEmitter = require('events').EventEmitter;

/**
 *  Generic Object Class
 *  
 *  Each object is an event emitter and uses this to route messages, ticks, timing.
 *  
 *  @param id The identifier of the object
 *  @param parent The reference to the parent
 **/
var Object = module.exports = function(id, parent) {
    EventEmitter.call(this);
    this.id = id;
    this.parent = parent; //Circular Reference... !!!! wait.. we're using v8.
    this.children = {};
    this.c = this.children;
}
sys.inherits(Object, EventEmitter);

/**
 *  Routes messages to their appropriate object.
 *
 *  @param address  The address of the object to be sent the message.
 *      If set to "broadcast" it'll send the message for all children and itself.    
 *  @param message  The message to be sent.
 *  @param world    The current world state.
 *  @param user     The user who sent the message.
 **/
Object.prototype.route = function(address, message, world, user) {
    var child = address.shift();
    if(child == 'broadcast') {
        this.emit(message.name, message, world, user);
        for(var i in this.children) {
            this.children[i].route([child], message, world, user);
        } 
    } else {
        if(this.children.hasOwnProperty(child)) {
            child = this.children[child];
            if(address.length == 0) {
                child.emit(message.e, message, world, user);
            } else {
                child.route(address, message, world, user);
            }
        } else {
            this.emit('error', 'Did not have address %address'.replace('%address', child), message);
        }
    }
}