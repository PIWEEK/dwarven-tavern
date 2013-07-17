"use strict";

var _ = require("underscore"),
    InputServer = require("./client_input/InputServer"),
    SimulationManager = require("./simulation/SimulationManager"),
    PlayerData = require("./simulation/PlayerData"),
    WebSocketServer = require('./visor/WebSocketServer'),
    config = require('./config');

var inputServer = new InputServer(config);
var simulationManager = new SimulationManager(config);

simulationManager.get("emitter").on("simulation-ready", function(simulation){
    console.log(">> Simulation ready: " + simulation.get("id"));
    console.log("\n##################################################\n");
    console.log(simulation.toString());
    console.log("\n##################################################\n");

    var response = JSON.stringify({ type: "turn", state: simulation.getCurrentState()});
    simulation.get("player1").get("client").get("socket").write(response);
});

simulationManager.get("emitter").on("team1-turn", function(simulation){
    console.log(">> Player 1 has played");
    console.log("\n##################################################\n");
    console.log(simulation.toString());
    console.log("\n##################################################\n");

    var response = JSON.stringify({ type: "turn", state: simulation.getCurrentState()});
    simulation.get("player2").get("client").get("socket").write(response);
});

simulationManager.get("emitter").on("team2-turn", function(simulation){
    console.log(">> Player 2 has played");
    console.log("\n##################################################\n");
    console.log(simulation.toString());
    console.log("\n##################################################\n");

    var response = JSON.stringify({ type: "turn", state: simulation.getCurrentState()});
    simulation.get("player1").get("client").get("socket").write(response);
});

inputServer.get("emitter").on("create-simulation", function(jsonContent, client){
    console.log("++ Simulation create");
    var simulationID = simulationManager.createSimulation();
    var response = '{"type": "ready", "simulationId": "' + simulationID + '" }\n';
    client.get("socket").write(response);
    console.log("++ Simulation create OK");
});

inputServer.get("emitter").on("join-simulation", function(jsonContent, client){
    console.log("++ Player joined: " + jsonContent.simulationId);
    var playerData = new PlayerData({jsonContent: jsonContent});
    playerData.set("client", client);
    simulationManager.joinSimulation(jsonContent.simulationId, playerData);
    console.log("++ Player joined OK");
});

inputServer.get("emitter").on("player-turn", function(jsonContent, client) {
    console.log("++ Player turn");
    var simulationTurn = new SimulationTurn({jsonContent: jsonContent});
    if (simulationTurn.valid()) {
        simulationManager.sendTurn(client, simulationTurn);
    } else {
        console.log('-- Turno inválido');
        inputServer.get("emitter").emit('turn-malformed', client);
    }
});

inputServer.get("emitter").on('turn-malformed', function(client) {
    var response = '{"type": "error", "message": "Invalid turn"}\n';

    client.get("socket").write(response);
});

inputServer.start();

var webSocketServer = new WebSocketServer();

webSocketServer.start();
