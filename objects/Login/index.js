// This is the Login Process Container, has two children... Login and Create Account
var obj = require('../../object');
obj.prototype = {
    'type': 'container',
    'children': {
        'login form': new require('login_form')('login form', obj)
    }
}

