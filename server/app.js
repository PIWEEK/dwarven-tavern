"use strict";

var _ = require("underscore"),
    InputServer = require("./client-input/input-server"),
    SimulationTurn = require('./simulation/SimulationTurn');

var inputServer = new InputServer({port: 9000});

inputServer.get("emitter").on("turn-received", function(jsonContent, sourceClient) {
    var simulationTurn = new SimulationTurn({jsonContent: jsonContent});
    if (simulationTurn.valid()) {
        console.log('  ++ Turno válido ++');
    } else {
        console.log('  -- Turno inválido --');
    }
});

inputServer.get("emitter").on('turn-malformed', function(client) {
    // Send client malformed input message
});

inputServer.start();
