"use strict";

var _ = require("underscore");

var InputServer = require("./client-input/input-server");

var inputServer = new InputServer(9000);

inputServer.get("emitter").on("input-received", function(action, sourceClient) {
    console.log('Evento input-received');
    var clients = inputServer.get("clients");
    _.each(clients, function(targetClient){
        if(sourceClient !== targetClient) {
            targetClient.get("socket").write(action);
        }
    });
});

inputServer.get("emitter").emit("input-received");

inputServer.start();
