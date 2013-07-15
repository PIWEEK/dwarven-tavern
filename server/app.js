"use strict";

var _ = require("underscore"),
    InputServer = require("./client-input/input-server"),
    SimulationTurn = require('./simulation/SimulationTurn');

var inputServer = new InputServer({port: 9000});

inputServer.get("emitter").on("input-received", function(jsonContent, sourceClient) {
    var simulationTurn = new SimulationTurn({jsonContent: jsonContent});
});

inputServer.get("emitter").on('malformed-input', function(client) {
    // Send client malformed input message
});

inputServer.start();
