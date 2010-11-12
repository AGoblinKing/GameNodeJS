wrap = require('./wrappers');

module.exports = {
    "login": {
        'callback': function (data, users, stream, message, user) {
            if(!wrap.validateMessage(['name','password'], message)){
                return wrap.Result(0, 'baddata');
            }
            if(message.name.length < 4 || message.password.length < 4) {
                return wrap.Result(0, 'baddata');
            }
            if(message.name in data.dynamic.users) {
                if(data.dynamic.users[message.name].password == message.password) {
                    users[message.sessionId] = wrap.User(data.dynamic.users[message.name], stream, message.sessionId);
                    return wrap.Result(1, 'goodlogin');
                } else {
                    return wrap.Result(0, 'badpass');
                }
            } else {
                data.dynamic.users[message.name] = {'name':message.name, 'password':message.password};
                users[message.sessionId] = wrap.User(data.dynamic.users[message.name], stream, message.sessionId);
                return wrap.Result(1, 'createuser');
            }
        },
        'flags': ['anonymous']
    },
    'logout': {
        'callback': function(data, users, stream, message, user) {
            delete users[message.sessionId];
            return false;
        },
        '!flags': ['anonymous']
    },
    'save': {
        'callback': function(data, users, connections) {
            console.log('Saving Data');
            data.save();
        },
        'timeout': 1000*60*30
    }
};


