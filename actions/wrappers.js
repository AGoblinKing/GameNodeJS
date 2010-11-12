exports.validateMessage = function(variables, message) {
    for(var y in variables) {
        if(message[variables[y]] == undefined) {
            return false;
        }
    }
    return true;
}
exports.Result = function (status, code) {
    return {'code':status, 'data':code};
}
exports.FinalResult = function(status, code, message) {
    return {'code':status, 'data':code, 'category':message.category, 'action':message.action, 'sessionId':message.sessionId};
}
exports.User =  function(savedUser, stream, sessionId) {
    return {
        'user': savedUser,
        'stream': stream,
        'sessionId': sessionId,
        'flags': {'authenticated':''}
    };
}