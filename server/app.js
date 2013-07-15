"use strict";

var _ = require("underscore");

var InputServer = require("./client-input/input-server");

var inputServer = new InputServer(9000);

inputServer.get("emitter").on("processed", function(action, sourceClient) {
    var clients = this.clients;
    _.each(this.clients, function(targetClient){
        if(sourceClient !== targetClient) {
            targetClient.write(action);
        }
    });
});

inputServer.get("emitter").emit("processed");

inputServer.start();
