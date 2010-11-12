var map = [];
for(var x = 0; x < 10; x++) {
    map[x] = [];
    for(var y = 0; y < 10; y++) {
        map[x][y] = {'color':'green', 'pos':{'x':x,'y':y}};
    }
}
module.exports = {
    'map': map,
    'publicMap': function() {
        return this.map;
    }
};
