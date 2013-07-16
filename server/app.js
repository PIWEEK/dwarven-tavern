"use strict";

var _ = require("underscore"),
    InputServer = require("./client-input/input-server"),
    SimulationTurn = require('./simulation/SimulationTurn');

var inputServer = new InputServer({port: 9000});

inputServer.get("emitter").on("turn-received", function(jsonContent, sourceClient) {
    var simulationTurn = new SimulationTurn({jsonContent: jsonContent});
    if (simulationTurn.valid()) {
        console.log('++ Turno válido');
        var response = '{"message": "Valid turn"}\n';
        sourceClient.get("socket").write(response);
    } else {
        console.log('-- Turno inválido');
        inputServer.get("emitter").emit('turn-malformed', sourceClient);
    }
});

inputServer.get("emitter").on('turn-malformed', function(client) {
    var response = '{"message": "Invalid turn"}\n';

    client.get("socket").write(response);
});

inputServer.start();
