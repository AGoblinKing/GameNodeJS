wrap = require('./wrappers');

module.exports = {
    'categories': {
        'account':require('./account'),
        'map': require('./map')
    },
    'ticks': 0,
    'tickers': {},
    'tick': function(data, users, connections) {
        this.ticks++;
        for(var i in this.tickers) {
            if(this.ticks % i == 0) {
                for(var y in this.tickers[i]) {
                    this.tickers[i][y](data, users, connections);
                }
            }
        }
    },
    'time':0,
    'timeouts': {},
    'timeout': function(data, users, connections){
        this.time+=10;
        for(var i in this.timeouts) {
            if(this.time % i == 0) {
                for(var y in this.timeouts[i]) {
                    this.timeouts[i][y](data, users, connections);
                }
            }
        }
    },
    'message': function(data, users, stream, message){
        try {
            message = JSON.parse(message);
            if(this.categories[message.category] != undefined && wrap.validateMessage(['sessionId'], message) && this.categories[message.category][message.action] != undefined && this.categories[message.category][message.action]['tick'] == undefined){
                var user;
                switch(users[message.sessionId]) {
                    case undefined:
                        user = wrap.User({}, stream, message.sessionId);
                        user.flags = {'anonymous':''};
                        break;
                    case 'network':
                        user = wrap.User({}, stream, 'network');
                        user.flags = {'network':''};
                        break;
                    default:
                        user = users[message.sessionId];
                }
                
                //Handle Access
                var access = false;
                if(this.categories[message.category][message.action]['flags'] != undefined) {
                    for(var i in this.categories[message.category][message.action].flags) {
                        if(this.categories[message.category][message.action].flags[i] in user.flags) {
                            access = true;
                            break;
                        }
                    }
                    if(!access) {
                        return wrap.FinalResult('error', 'accessdeniedflag', message);
                    }
                }
                //Handle Restrictions
                if(this.categories[message.category][message.action]['!flags'] != undefined) {
                    for(var i in this.categories[message.category][message.action]['!flags']) {
                        if(this.categories[message.category][message.action]['!flags'][i] in user.flags) {
                            return wrap.FinalResult('error', 'accessdeniednotflag', message);
                        }
                    }
                }
                var result = this.categories[message.category][message.action].callback(data, users, stream, message, user);
                if(result) {
                    var ret = wrap.FinalResult('success', result, message);
                    return ret;
                }
            } else {
                return wrap.FinalResult('error', 'noactionorsession', message);
            }
        } catch(err) {
            return wrap.Result('error', err);    
        }
        return false;
    }
}

//setup callbacks
for(var i in module.exports.categories) {
    for(var y in module.exports.categories[i]){
        if(module.exports.categories[i][y]['tick'] != undefined) {
            if(module.exports.tickers[module.exports.categories[i][y]['tick']] == undefined) {
                module.exports.tickers[module.exports.categories[i][y]['tick']] = [];
            }
            module.exports.tickers[module.exports.categories[i][y]['tick']][i+y] = module.exports.categories[i][y].callback;
        }
        if(module.exports.categories[i][y]['timeout'] != undefined) {
            if(module.exports.timeouts[module.exports.categories[i][y]['timeout']] == undefined) {
                module.exports.timeouts[module.exports.categories[i][y]['timeout']] = [];
            }
            module.exports.timeouts[module.exports.categories[i][y]['timeout']][i+y] = module.exports.categories[i][y].callback;
        }
    }
}
