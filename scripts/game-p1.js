var net = require('net');

var socket = new net.Socket();
var sended = 0;

socket.connect('9000', 'localhost', function() {
    socket.on('data', function(data) {
        console.log('\n---> ' + data);
        var dataJSON = JSON.parse(data);
        if (dataJSON["type"] == "ready") {
            var uid = dataJSON["simulationId"];
            var joinObj = require("./join-simulation-p1");
            joinObj["simulationId"] = uid;
            socket.write(JSON.stringify(require("./join-simulation-p1")));
        }
        if (dataJSON["type"] == "turn" && sended < 2) {
            sended ++;
            socket.write(JSON.stringify(require("./send-turn-p1")));
        }
    });
    socket.write(JSON.stringify(require("./create-simulation")));
});
