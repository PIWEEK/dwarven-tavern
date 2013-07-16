var net = require('net');

var socket = new net.Socket();

var dataToSend = '{"playerId": 1, "actions": [{ "botId": 23, "type": "MOVE", "direction": "NORTH" }, { "botId": 23, "type": "MOVE", "direction": "NORTH" }]}';

socket.connect('9000', 'localhost', function() {
    socket.write(dataToSend.toString(), 'utf8', function() {
        console.log('<--- %j', dataToSend.toString());
    });
    socket.end();
});
