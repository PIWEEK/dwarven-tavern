"use strict";

var config = {
    port: 9000,
    
    width: 21,
    height: 21,
    botsPerPlayer: 5,
    
    positions: {
        team1: {
            barrel: {x: 8, y: 9},
            bots: [{ x: 4, y: 18 },{ x: 7, y: 18 },{ x: 10, y: 18 },{ x: 13, y: 18 },{ x: 16, y: 18 }]
        },
        team2: {
            barrel: {x: 11, y: 9},
            bots: [{ x: 4, y: 2 },{ x: 7, y: 2 },{ x: 10, y: 2 },{ x: 13, y: 2 },{ x: 16, y: 2 }]
        },
    }
};

var _ = require("underscore"),
    InputServer = require("./client-input/input-server"),
    SimulationManager = require("./simulation/SimulationManager"),
    SimulationTurn = require('./simulation/SimulationTurn');

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
