// This is the Login Process Container, has two children... Login and Create Account
var obj = require('../../object');
obj.prototype = {
    'type': 'form',
    'form': {
        'name': {
            'type': 'textfield'
        },
        'password': {
            'type': 'password'
        },
        'submit': {
            'type': 'button',
            'action': 'submit'
        }
    }
}
obj.on('submit', function(name, message, world, user) {
    console.log('hit');
});

