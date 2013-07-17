var net = require('net');

var socket = new net.Socket();

var sended = 0;

socket.connect('9000', 'localhost', function() {
    socket.on('data', function(data) {
        console.log('\n---> ' + data);
        var dataJSON = JSON.parse(data);

        if (dataJSON["type"] == "turn" && sended < 2) {
            sended ++;
            socket.write(JSON.stringify(require("./send-turn-p2")));
        }
    });
    
    socket.write(JSON.stringify(require("./join-simulation-p2")));
});
