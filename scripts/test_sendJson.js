var net = require('net');

var socket = new net.Socket();

var dataToSend = '{"playerId": 1, "actions": [{ "botId": 23, "type": "MOVE", "direction": "NORTH" }, { "botId": 23, "type": "MOVE", "direction": "NORTH" }]}';

socket.connect('9000', 'localhost', function() {
    socket.on('data', function(data) {
        console.log('\n---> ' + data);
        socket.end();
    });

    socket.write(dataToSend.toString(), 'utf8', function() {
        console.log('<--- ' + dataToSend.toString());
    });
});
