"use strict";

var InputServer = require("./client-input/input-server");

var inputServer = new InputServer(9000);

inputServer.get("emitter").on("processed", function(actions) {
    // Mandamos los datos al simulator
    console.log('tenemos evento!!!');
});

inputServer.get("emitter").emit("processed");

inputServer.start();
