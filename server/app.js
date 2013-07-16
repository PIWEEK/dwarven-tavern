"use strict";

var _ = require("underscore"),
    InputServer = require("./client_input/InputServer"),
    SimulationManager = require("./simulation/SimulationManager"),
    SimulationTurn = require('./simulation/SimulationTurn'),
    config = require('./config');

var inputServer = new InputServer(config);
var simulationManager = new SimulationManager(config);

inputServer.get("emitter").on("turn-received", function(jsonContent, sourceClient) {
    var simulationTurn = new SimulationTurn({jsonContent: jsonContent});
    if (simulationTurn.valid()) {
        console.log('++ Turno válido');
        var response = '{"type": "ok", "message": "Valid turn"}\n';
        sourceClient.get("socket").write(response);
    } else {
        console.log('-- Turno inválido');
        inputServer.get("emitter").emit('turn-malformed', sourceClient);
    }
});

inputServer.get("emitter").on('turn-malformed', function(client) {
    var response = '{"type": "error", "message": "Invalid turn"}\n';

    client.get("socket").write(response);
});

inputServer.start();
